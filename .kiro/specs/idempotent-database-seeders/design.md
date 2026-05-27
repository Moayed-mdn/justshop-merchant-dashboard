# Technical Design: Idempotent Database Seeders

## Overview

This document describes the low-level design for making every seeder in `laratenant-backend` fully idempotent. The goal is that `php artisan migrate:fresh --seed` can be run any number of times and always produces the exact same dataset — same rows, same IDs (where stable keys are used), same pivot entries, same timestamps.

The design covers five concerns:
1. Execution order and dependency graph in `DatabaseSeeder`
2. Upsert guards for every entity seeder
3. Deterministic data generation (Faker seeding, fixed timestamps, derived SKUs)
4. Safe many-to-many attachment
5. Factory changes to support reproducibility

---

## 1. Execution Order — `DatabaseSeeder`

### Dependency Graph

```
PermissionSeeder          (no deps)
StoreSeeder               (needs PermissionSeeder for role assignment)
CategorySeeder            (needs StoreSeeder → store slug)
BrandSeeder               (needs StoreSeeder → store slug)
ProductSeeder             (needs CategorySeeder, BrandSeeder, StoreSeeder)
FakeSalesSeeder           (needs ProductSeeder → variants, StoreSeeder → store)
ReviewSeeder              (needs ProductSeeder, FakeSalesSeeder → users)
HeroBannerSeeder          (needs StoreSeeder → store)
CmsBlogSeeder             (needs StoreSeeder → author user)
CmsDocumentationSeeder    (no store dep, platform-level)
CmsMarketingSeeder        (needs StoreSeeder → admin user)
```

### Final `DatabaseSeeder::run()`

```php
public function run(): void
{
    $this->call([
        // --- Platform: Permissions & Roles ---
        PermissionSeeder::class,

        // --- Tenant: Stores & Users ---
        StoreSeeder::class,

        // --- Catalog: Categories, Brands, Products ---
        CategorySeeder::class,
        BrandSeeder::class,
        ProductSeeder::class,

        // --- Sales: Orders & Reviews ---
        FakeSalesSeeder::class,
        ReviewSeeder::class,

        // --- CMS: Banners, Blog, Docs, Marketing ---
        HeroBannerSeeder::class,
        CmsBlogSeeder::class,
        CmsDocumentationSeeder::class,
        CmsMarketingSeeder::class,
    ]);
}
```

**Rule:** Every seeder resolves its store dependency by slug, never by `Store::first()` or a hard-coded ID:

```php
$store = Store::where('slug', 'merchant-store')->firstOrFail();
```

---

## 2. Upsert Guards — Entity Seeders

### 2.1 `PermissionSeeder`

Already uses `firstOrCreate` and `syncPermissions`. No changes needed.

```php
// Idempotency key: name
Permission::firstOrCreate(['name' => $permission]);
Role::firstOrCreate(['name' => $roleName]);
$role->syncPermissions([...]);   // sync is idempotent
```

### 2.2 `StoreSeeder`

Already uses `updateOrCreate` for users and stores. The pivot attachment already has an existence check. No changes needed.

```php
// Idempotency key: email (users), slug (stores)
User::updateOrCreate(['email' => $email], [...]);
Store::updateOrCreate(['slug' => $slug], [...]);
$store->users()->syncWithoutDetaching([$userId => ['role' => $role]]);
```

Replace the manual `if (!exists) attach()` pattern with `syncWithoutDetaching()` for cleanliness.

### 2.3 `CategorySeeder`

**Current problem:** Uses `Category::create()` — duplicates on every run. Also hard-codes `store_id => 1`.

**Fix:**

```php
// Idempotency key: slug + store_id (parent); slug + store_id + parent_id (child)
$store = Store::where('slug', 'merchant-store')->firstOrFail();

$parentCategory = Category::firstOrCreate(
    ['slug' => Str::slug($parentData['en']), 'store_id' => $store->id, 'parent_id' => null],
    ['store_id' => $store->id]
);

// Translations — use updateOrCreate to avoid duplicates
$parentCategory->translations()->updateOrCreate(
    ['locale' => 'en'],
    ['name' => $parentData['en'], 'slug' => Str::slug($parentData['en'])]
);
$parentCategory->translations()->updateOrCreate(
    ['locale' => 'ar'],
    ['name' => $parentData['ar'], 'slug' => Str::slug($parentData['ar'])]
);

// Child categories
$childCategory = Category::firstOrCreate(
    ['slug' => Str::slug($childData['en']), 'store_id' => $store->id, 'parent_id' => $parentCategory->id],
    ['store_id' => $store->id]
);
$childCategory->translations()->updateOrCreate(['locale' => 'en'], [...]);
$childCategory->translations()->updateOrCreate(['locale' => 'ar'], [...]);
```

### 2.4 `BrandSeeder`

**Current problem:** Hard-codes `store_id => 1`.

**Fix:**

```php
// Idempotency key: slug
$store = Store::where('slug', 'merchant-store')->firstOrFail();

Brand::firstOrCreate(
    ['slug' => Str::slug($brand['name'])],
    ['name' => $brand['name'], 'description' => $brand['description'], 'is_active' => true, 'store_id' => $store->id]
);
```

### 2.5 `ProductSeeder`

**Current problems:**
- `Product::create()` on re-run creates duplicates (the `whereHas` guard exists but `ProductOption` and `ProductOptionValue` still use `create()`)
- `rand()` in SKU, quantity, batch_number, dates
- `Store::first()` instead of slug lookup

**Fix — product creation:**

```php
// Idempotency key: English translation slug
$store = Store::where('slug', 'merchant-store')->firstOrFail();

$product = Product::whereHas('translations', fn($q) =>
    $q->where('slug', $productSlug)->where('locale', 'en')
)->first();

if (!$product) {
    $product = Product::create([
        'category_id' => $category->id,
        'brand_id'    => $brandId,
        'store_id'    => $store->id,
        'is_active'   => true,
    ]);
    $product->translations()->updateOrCreate(['locale' => 'en'], [...]);
    $product->translations()->updateOrCreate(['locale' => 'ar'], [...]);
}
```

**Fix — options and values:**

```php
// Idempotency key: product_id + name
$option = ProductOption::firstOrCreate(
    ['product_id' => $product->id, 'name' => $optionName],
    ['position' => $position]
);

// Idempotency key: option_id + value
$optionValue = ProductOptionValue::firstOrCreate(
    ['option_id' => $option->id, 'value' => $value]
);
```

**Fix — deterministic SKU (no `rand()`):**

```php
// Derived from product name + option values, no random suffix
$skuParts = array_merge([$productName], array_map(fn($v) => $v->value, $combination['values']));
$sku = strtoupper(Str::slug(implode('-', $skuParts)));
```

**Fix — variant creation:**

```php
// Idempotency key: sku
$REFERENCE_DATE = Carbon::parse('2024-01-01');

$variant = ProductVariant::firstOrCreate(
    ['sku' => $sku],
    [
        'product_id'       => $product->id,
        'price'            => round($finalPrice, 2),
        'quantity'         => 10 * ($index + 1),          // deterministic: 10, 20, 30 …
        'batch_number'     => 'BATCH-SEED-' . str_pad($index + 1, 3, '0', STR_PAD_LEFT),
        'manufacture_date' => $REFERENCE_DATE->copy(),
        'expiry_date'      => $REFERENCE_DATE->copy()->addDays(365),
        'is_active'        => true,
    ]
);
```

**Fix — pivot table `variant_option_values`:**

```php
// updateOrInsert prevents duplicate pivot rows
DB::table('variant_option_values')->updateOrInsert(
    ['variant_id' => $variant->id, 'option_value_id' => $value->id],
    ['option_id'  => $createdOptions[$optionName]['option']->id]
);
```

**Fix — tag attachment:**

```php
// sync() replaces the full set idempotently
$product->tags()->sync($tagIds);
```

---

## 3. Deterministic Data Generation

### 3.1 Fixed Faker Seed Pattern

Faker's seed must be set **before** any `fake()` call in the seeder's `run()` method:

```php
public function run(): void
{
    fake()->seed(12345);   // FakeSalesSeeder
    // ...
}
```

Each seeder that uses Faker gets its own unique seed constant:

| Seeder | Seed |
|---|---|
| `FakeSalesSeeder` | `12345` |
| `ReviewSeeder` | `54321` |

### 3.2 `UserFactory` — `seeded()` State

```php
// database/factories/UserFactory.php

public function seeded(int $seed): static
{
    $this->faker->seed($seed);
    return $this;
}

public function definition(): array
{
    return [
        'name'              => $this->faker->name(),
        'email'             => $this->faker->unique()->safeEmail(),
        'password'          => Hash::make('password'),
        'remember_token'    => $this->faker->regexify('[A-Za-z0-9]{10}'), // not Str::random()
        'email_verified_at' => now(),
    ];
}
```

Usage in `FakeSalesSeeder`:

```php
fake()->unique(true);  // reset unique generator
User::factory()->seeded(12345)->count(20)->create();
```

### 3.3 Fixed Timestamps

Replace all `now()` / `now()->subDays($n)` / `date('Ymd')` with Carbon constants:

```php
// Reference date used across all seeders
const SEED_DATE = '2024-01-01';

// Examples
'starts_at'      => Carbon::parse(self::SEED_DATE),
'ends_at'        => Carbon::parse(self::SEED_DATE)->addMonth(),
'published_at'   => Carbon::parse(self::SEED_DATE)->addDays($i),
'manufacture_date' => Carbon::parse(self::SEED_DATE),
'expiry_date'    => Carbon::parse(self::SEED_DATE)->addDays(365),
```

---

## 4. Safe Many-to-Many Relationships

Three pivot tables need idempotent handling:

| Pivot Table | Relationship | Safe Method |
|---|---|---|
| `store_user` | `Store::users()` | `syncWithoutDetaching([$userId => ['role' => $role]])` |
| `product_tag` (via `taggables`) | `Product::tags()` | `sync($tagIds)` |
| `variant_option_values` | raw DB | `DB::table()->updateOrInsert(['variant_id', 'option_value_id'], [...])` |
| `blog_post_tag` | `BlogPost::tags()` | `sync($tagIds)` |

**`sync()` vs `syncWithoutDetaching()`:**
- Use `sync()` when the seeder owns the full set (products→tags, posts→tags). It replaces the entire set, which is idempotent.
- Use `syncWithoutDetaching()` for `store_user` because other code paths may have added users to the store outside the seeder.

---

## 5. `FakeSalesSeeder` — Deterministic Selection

**Current problems:** `User::inRandomOrder()->first()`, `$variants->random()`, `rand()` everywhere.

**Fix — deterministic user and variant selection:**

```php
public function run(): void
{
    // Idempotency key: order_number
    fake()->seed(12345);
    fake()->unique(true);

    $store = Store::where('slug', 'merchant-store')->firstOrFail();

    // Create exactly 20 seeded users
    User::factory()->seeded(12345)->count(20)->create();

    $users    = User::whereNotIn('email', ['merchant@test.com', 'super@test.com', 'staff@test.com', 'customer@test.com'])->get();
    $variants = ProductVariant::with('product')->get();

    for ($i = 0; $i < 50; $i++) {
        $orderNumber = 'SEED-ORDER-' . str_pad($i + 1, 4, '0', STR_PAD_LEFT);

        $order = Order::firstOrCreate(
            ['order_number' => $orderNumber],
            [
                'user_id'    => $users[$i % $users->count()]->id,  // cycle, not random
                'store_id'   => $store->id,
                'status'     => OrderStatusEnum::DELIVERED,
                'payment_status' => PaymentStatusEnum::PAID,
                'subtotal'   => 0, 'tax_amount' => 0,
                'shipping_amount' => fake()->numberBetween(0, 20),  // seeded Faker
                'discount_amount' => 0, 'total' => 0,
            ]
        );

        // Only add items if this is a freshly created order
        if ($order->wasRecentlyCreated) {
            $itemCount = fake()->numberBetween(1, 4);
            $subtotal  = 0;

            for ($j = 0; $j < $itemCount; $j++) {
                $variant = $variants[($i * 4 + $j) % $variants->count()];  // cycle
                $qty     = fake()->numberBetween(1, 5);
                $price   = $variant->price;
                $subtotal += $price * $qty;

                OrderItem::create([
                    'order_id'           => $order->id,
                    'product_id'         => $variant->product_id,
                    'product_variant_id' => $variant->id,
                    'unit_price'         => $price,
                    'quantity'           => $qty,
                    'subtotal'           => $price * $qty,
                    'total'              => $price * $qty,
                    'product_name'       => $variant->product->translation('en')->name,
                    'sku'                => $variant->sku,
                    'unit_discount_percentage' => 0,
                ]);
            }

            $order->update([
                'subtotal'        => $subtotal,
                'tax_amount'      => round($subtotal * 0.15, 2),
                'total'           => round($subtotal * 1.15, 2) + $order->shipping_amount,
            ]);
        }
    }
}
```

---

## 6. `ReviewSeeder` — Deterministic Reviews

```php
public function run(): void
{
    // Idempotency key: user_id + product_id
    fake()->seed(54321);

    $users    = User::all();
    $products = Product::all();

    foreach ($products as $product) {
        $reviewCount = fake()->numberBetween(3, min(10, $users->count()));
        $reviewerIds = fake()->randomElements($users->pluck('id')->toArray(), $reviewCount);

        foreach ($reviewerIds as $userId) {
            $rating = $this->weightedRating();

            Review::firstOrCreate(
                ['user_id' => $userId, 'product_id' => $product->id],
                [
                    'rating'      => $rating,
                    'comment'     => $this->comments[$rating][fake()->numberBetween(0, count($this->comments[$rating]) - 1)],
                    'is_approved' => true,
                    'store_id'    => $product->store_id,
                ]
            );
        }
    }
}
```

---

## 7. `HeroBannerSeeder` — Fixed Dates and Upsert

```php
// Idempotency key: position
private const SEED_DATE = '2024-01-01';

public function run(): void
{
    $base = Carbon::parse(self::SEED_DATE);

    $banner = HeroBanner::updateOrCreate(
        ['position' => 0],
        [
            'cat_url'     => '#',
            'visual_type' => 'image',
            'image_path'  => 'hero/hero-banner.jpg',
            'is_active'   => true,
            'starts_at'   => $base,
            'ends_at'     => null,
        ]
    );

    $banner->translations()->updateOrCreate(['locale' => 'en'], ['title' => '...', 'subtitle' => '...', 'cta_text' => 'Shop Now']);
    $banner->translations()->updateOrCreate(['locale' => 'ar'], ['title' => '...', 'subtitle' => '...', 'cta_text' => 'تسوق الآن']);

    // Banner 2 (gradient, with end date)
    $banner2 = HeroBanner::updateOrCreate(
        ['position' => 2],
        [
            'visual_type'   => 'gradient',
            'gradient_from' => '#0F2027',
            'gradient_to'   => '#2C5364',
            'is_active'     => true,
            'starts_at'     => $base,
            'ends_at'       => $base->copy()->addMonth(),  // fixed, not now()->addMonth()
        ]
    );
    // ... translations via updateOrCreate
}
```

---

## 8. `CmsBlogSeeder` — Upsert Guards

```php
// Idempotency key: English slug (categories, tags, posts)
private const SEED_DATE = '2024-01-01';

public function run(): void
{
    $author = User::where('email', 'merchant@test.com')->firstOrFail();
    $base   = Carbon::parse(self::SEED_DATE);

    foreach ($categories as $names) {
        BlogCategory::firstOrCreate(
            ['slug->en' => Str::slug($names['en'])],
            ['name' => $names, 'slug' => [...], 'description' => [...]]
        );
    }

    foreach ($tags as $names) {
        BlogTag::firstOrCreate(
            ['slug->en' => Str::slug($names['en'])],
            ['name' => $names, 'slug' => [...]]
        );
    }

    $category = BlogCategory::whereJsonContains('slug->en', 'technology')->firstOrFail();
    $allTags  = BlogTag::all();

    for ($i = 1; $i <= 5; $i++) {
        $post = BlogPost::updateOrCreate(
            ['slug->en' => "stabilizing-cms-architecture-part-$i"],
            [
                'author_id'        => $author->id,
                'blog_category_id' => $category->id,
                'title'            => [...],
                'is_published'     => true,
                'published_at'     => $base->copy()->addDays($i - 1),  // fixed offset
                'reading_time'     => 5,
            ]
        );

        $post->tags()->sync($allTags->pluck('id')->toArray());  // idempotent
    }
}
```

---

## 9. `CmsDocumentationSeeder` — Upsert Guards

```php
// Idempotency key: English slug (sections and documents)
private const SEED_DATE = '2024-01-01';

public function run(): void
{
    $base = Carbon::parse(self::SEED_DATE);

    foreach ($sections as $index => $names) {
        $section = CmsDocumentSection::updateOrCreate(
            ['slug->en' => Str::slug($names['en'])],
            [
                'title'        => $names,
                'slug'         => [...],
                'sort_order'   => $index,
                'is_published' => true,
                'published_at' => $base,
            ]
        );

        for ($i = 1; $i <= 3; $i++) {
            CmsDocument::updateOrCreate(
                ['slug->en' => Str::slug("{$names['en']} Guide $i")],
                [
                    'section_id'   => $section->id,
                    'title'        => [...],
                    'sort_order'   => $i,
                    'is_published' => true,
                    'published_at' => $base,
                ]
            );
        }
    }
}
```

---

## 10. `CmsMarketingSeeder` — Already Idempotent (Partial Fix)

`MarketingPage::updateOrCreate(['type' => ...], [...])` is already used throughout. The only fix needed is replacing `now()` with a fixed `Carbon::parse('2024-01-01')` for `published_at` fields.

---

## 11. Structural Conventions

Every seeder `run()` method starts with a one-line comment declaring its idempotency key:

```php
public function run(): void
{
    // Idempotency key: slug + store_id
```

Seeders with no natural key (e.g., if any seeder still used raw `create()`):

```php
// Idempotency key: none — relies on migrate:fresh truncation
```

Missing dependency warnings follow this pattern:

```php
$category = Category::whereHas('translations', fn($q) => $q->where('name', $name))->first();
if (!$category) {
    $this->command->warn("⚠️  Category '{$name}' not found — skipping products in this group.");
    continue;
}
```

---

## Summary of Changes per File

| File | Changes |
|---|---|
| `DatabaseSeeder.php` | Add group comments; order already correct |
| `CategorySeeder.php` | `create()` → `firstOrCreate()`; `createMany()` → `updateOrCreate()`; `store_id=1` → slug lookup |
| `BrandSeeder.php` | `store_id=1` → slug lookup |
| `ProductSeeder.php` | `ProductOption::create()` → `firstOrCreate()`; `ProductOptionValue::create()` → `firstOrCreate()`; remove `rand()` from SKU/qty/batch/dates; `Store::first()` → slug lookup; `DB::table()->insert()` → `updateOrInsert()` |
| `FakeSalesSeeder.php` | `fake()->seed(12345)`; `User::factory()->seeded(12345)`; deterministic user/variant selection; `Order::firstOrCreate()`; remove `rand()` |
| `ReviewSeeder.php` | `fake()->seed(54321)`; `Review::firstOrCreate()`; `$users->random()` → `fake()->randomElements()`; remove `rand()` |
| `HeroBannerSeeder.php` | `create()` → `updateOrCreate()`; `createMany()` → `updateOrCreate()` per translation; `now()` → `Carbon::parse('2024-01-01')` |
| `CmsBlogSeeder.php` | `create()` → `firstOrCreate()`/`updateOrCreate()`; `attach()` → `sync()`; `now()->subDays()` → fixed Carbon |
| `CmsDocumentationSeeder.php` | `create()` → `updateOrCreate()`; `now()` → fixed Carbon |
| `CmsMarketingSeeder.php` | `now()` → `Carbon::parse('2024-01-01')` for `published_at` |
| `UserFactory.php` | Add `seeded(int $seed): static`; `Str::random()` → `$this->faker->regexify()` for `remember_token` |
