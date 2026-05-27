# Implementation Tasks: Idempotent Database Seeders

## Task List

- [ ] 1. Add group comments and finalize execution order in `DatabaseSeeder`
- [ ] 2. Fix `CategorySeeder` — upsert guards, store slug lookup, translation upserts
- [ ] 3. Fix `BrandSeeder` — replace hard-coded `store_id=1` with slug lookup
- [ ] 4. Fix `ProductSeeder` — upsert guards for options/values/variants, deterministic SKU/qty/dates, store slug lookup
- [ ] 5. Fix `FakeSalesSeeder` — fixed Faker seed, deterministic user/variant selection, `Order::firstOrCreate`
- [ ] 6. Fix `ReviewSeeder` — fixed Faker seed, `Review::firstOrCreate`, deterministic reviewer selection
- [ ] 7. Fix `HeroBannerSeeder` — `updateOrCreate` for banners and translations, fixed Carbon dates
- [ ] 8. Fix `CmsBlogSeeder` — `firstOrCreate`/`updateOrCreate` guards, `sync()` for tags, fixed `published_at`
- [ ] 9. Fix `CmsDocumentationSeeder` — `updateOrCreate` for sections and documents, fixed `published_at`
- [ ] 10. Fix `CmsMarketingSeeder` — replace `now()` with fixed `Carbon::parse('2024-01-01')` for `published_at`
- [ ] 11. Update `UserFactory` — add `seeded()` state, replace `Str::random()` with `$this->faker->regexify()`

---

## Task 1: Add group comments and finalize execution order in `DatabaseSeeder`

**File:** `database/seeders/DatabaseSeeder.php`

**What to do:**
- The call order is already correct. Add inline group comments to the `$this->call([...])` array to identify each logical group.

**Expected result:**

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

**Requirements addressed:** R1.1, R8.1

---

## Task 2: Fix `CategorySeeder` — upsert guards, store slug lookup, translation upserts

**File:** `database/seeders/CategorySeeder.php`

**What to do:**
1. Add `// Idempotency key: slug + store_id` comment at the top of `run()`.
2. Replace `Store::first()` / hard-coded `store_id => 1` with `Store::where('slug', 'merchant-store')->firstOrFail()`.
3. Replace `Category::create([...])` for parent categories with `Category::firstOrCreate(['slug' => ..., 'store_id' => $store->id, 'parent_id' => null], [...])`.
4. Replace `Category::create([...])` for child categories with `Category::firstOrCreate(['slug' => ..., 'store_id' => $store->id, 'parent_id' => $parentCategory->id], [...])`.
5. Replace `$category->translations()->createMany([...])` with two separate `$category->translations()->updateOrCreate(['locale' => 'en'], [...])` and `updateOrCreate(['locale' => 'ar'], [...])` calls for both parent and child categories.

**Requirements addressed:** R2.3, R2.5, R8.2, R8.3

---

## Task 3: Fix `BrandSeeder` — replace hard-coded `store_id=1` with slug lookup

**File:** `database/seeders/BrandSeeder.php`

**What to do:**
1. Add `// Idempotency key: slug` comment at the top of `run()`.
2. Add `use App\Models\Store;` import.
3. At the start of `run()`, resolve the store: `$store = Store::where('slug', 'merchant-store')->firstOrFail();`
4. In the `Brand::firstOrCreate()` call, replace `'store_id' => 1` with `'store_id' => $store->id`.

**Requirements addressed:** R2.4, R8.2, R8.4

---

## Task 4: Fix `ProductSeeder` — upsert guards, deterministic data, store slug lookup

**File:** `database/seeders/ProductSeeder.php`

**What to do:**
1. Add `// Idempotency key: English translation slug` comment at the top of `run()`.
2. Replace `Store::first()->id` with `Store::where('slug', 'merchant-store')->firstOrFail()->id`.
3. Add a `private const SEED_DATE = '2024-01-01';` constant to the class.
4. Replace `ProductOption::create([...])` with `ProductOption::firstOrCreate(['product_id' => $product->id, 'name' => $optionName], ['position' => count($createdOptions)])`.
5. Replace `ProductOptionValue::create([...])` with `ProductOptionValue::firstOrCreate(['option_id' => $option->id, 'value' => $value])`.
6. In the SKU generation, remove the `'-' . rand(1000, 9999)` suffix so the SKU is derived purely from product name and option values.
7. Replace `ProductVariant::create([...])` with `ProductVariant::firstOrCreate(['sku' => $sku], [...])`.
8. In the variant attributes, replace:
   - `'quantity' => rand(5, 100)` → `'quantity' => 10 * ($index + 1)`
   - `'batch_number' => 'BATCH-' . date('Ymd') . '-' . str_pad(...)` → `'batch_number' => 'BATCH-SEED-' . str_pad($index + 1, 3, '0', STR_PAD_LEFT)`
   - `'manufacture_date' => now()->subMonths(rand(1, 6))` → `'manufacture_date' => Carbon::parse(self::SEED_DATE)`
   - `'expiry_date' => now()->addMonths(rand(12, 36))` → `'expiry_date' => Carbon::parse(self::SEED_DATE)->addDays(365)`
9. Replace `DB::table('variant_option_values')->insert([...])` with `DB::table('variant_option_values')->updateOrInsert(['variant_id' => $variant->id, 'option_value_id' => $value->id], ['option_id' => ...])`.
10. Add `use Carbon\Carbon;` import.
11. Add a missing-dependency warning when a category is not found: `$this->command->warn("⚠️  Category '{$categoryName}' not found — skipping.");`

**Requirements addressed:** R3.1–R3.10, R8.2, R8.5

---

## Task 5: Fix `FakeSalesSeeder` — fixed Faker seed, deterministic selection, `Order::firstOrCreate`

**File:** `database/seeders/FakeSalesSeeder.php`

**What to do:**
1. Add `// Idempotency key: order_number` comment at the top of `run()`.
2. At the very start of `run()`, add `fake()->seed(12345);` and `fake()->unique(true);`.
3. Resolve the store by slug: `$store = Store::where('slug', 'merchant-store')->firstOrFail();`.
4. Replace `User::factory()->count($userCount)->create()` with `User::factory()->seeded(12345)->count(20)->create()`.
5. Replace `User::inRandomOrder()->first()` with deterministic cycling: `$users[$i % $users->count()]`.
6. Replace `Order::create([...])` with `Order::firstOrCreate(['order_number' => $orderNumber], [...])` where `$orderNumber = 'SEED-ORDER-' . str_pad($i + 1, 4, '0', STR_PAD_LEFT)`.
7. Replace `strtoupper(Str::random(10))` order number with the deterministic `$orderNumber`.
8. Replace `$variants->random()` with deterministic cycling: `$variants[($i * 4 + $j) % $variants->count()]`.
9. Replace `rand(1, 4)` items count with `fake()->numberBetween(1, 4)` (controlled by the seeded Faker).
10. Replace `rand(1, 5)` quantity with `fake()->numberBetween(1, 5)`.
11. Replace `rand(0, 20)` shipping amount with `fake()->numberBetween(0, 20)`.
12. Wrap `OrderItem::create()` and the totals update inside `if ($order->wasRecentlyCreated)` so re-runs don't add duplicate items.
13. Replace `'store_id' => 1` with `'store_id' => $store->id`.
14. Add `use App\Models\Store;` import.

**Requirements addressed:** R4.1–R4.6, R7.2, R8.2

---

## Task 6: Fix `ReviewSeeder` — fixed Faker seed, `Review::firstOrCreate`, deterministic selection

**File:** `database/seeders/ReviewSeeder.php`

**What to do:**
1. Add `// Idempotency key: user_id + product_id` comment at the top of `run()`.
2. At the start of `run()`, add `fake()->seed(54321);`.
3. Replace `$reviewCount = rand(3, min(10, $users->count()))` with `$reviewCount = fake()->numberBetween(3, min(10, $users->count()))`.
4. Replace `$reviewers = $users->random($reviewCount)` with `$reviewerIds = fake()->randomElements($users->pluck('id')->toArray(), $reviewCount)` and iterate over `$reviewerIds`.
5. Replace `Review::create([...])` with `Review::firstOrCreate(['user_id' => $userId, 'product_id' => $product->id], [...])`.
6. Replace `$comments[$rating][array_rand($comments[$rating])]` with `$comments[$rating][fake()->numberBetween(0, count($comments[$rating]) - 1)]`.
7. Add `'store_id' => $product->store_id` to the review attributes.

**Requirements addressed:** R5.1–R5.5

---

## Task 7: Fix `HeroBannerSeeder` — `updateOrCreate`, translation upserts, fixed Carbon dates

**File:** `database/seeders/HeroBannerSeeder.php`

**What to do:**
1. Add `// Idempotency key: position` comment at the top of `run()`.
2. Add `private const SEED_DATE = '2024-01-01';` to the class.
3. Replace `$now = Carbon::now()` with `$base = Carbon::parse(self::SEED_DATE)`.
4. Replace every `HeroBanner::create([...])` with `HeroBanner::updateOrCreate(['position' => $position], [...])`.
5. Replace every `$banner->translations()->createMany([...])` with individual `$banner->translations()->updateOrCreate(['locale' => 'en'], [...])` and `updateOrCreate(['locale' => 'ar'], [...])` calls.
6. Replace all `$now` references with `$base` (e.g., `'starts_at' => $base`, `'ends_at' => $base->copy()->addMonth()`).
7. Replace `$now->copy()->addWeek()` with `$base->copy()->addWeek()` and `$now->copy()->addMonths(2)` with `$base->copy()->addMonths(2)`.

**Requirements addressed:** R6.1–R6.3

---

## Task 8: Fix `CmsBlogSeeder` — upsert guards, `sync()` for tags, fixed `published_at`

**File:** `database/seeders/CmsBlogSeeder.php`

**What to do:**
1. Add `// Idempotency key: English slug` comment at the top of `run()`.
2. Add `private const SEED_DATE = '2024-01-01';` to the class.
3. Replace `User::first()` with `User::where('email', 'merchant@test.com')->firstOrFail()`.
4. Replace `BlogCategory::create([...])` with `BlogCategory::firstOrCreate(['slug->en' => Str::slug($names['en'])], [...])`.
5. Replace `BlogTag::create([...])` with `BlogTag::firstOrCreate(['slug->en' => Str::slug($names['en'])], [...])`.
6. Replace `BlogPost::create([...])` with `BlogPost::updateOrCreate(['slug->en' => "stabilizing-cms-architecture-part-$i"], [...])`.
7. Replace `'published_at' => now()->subDays(5 - $i)` with `'published_at' => Carbon::parse(self::SEED_DATE)->addDays($i - 1)`.
8. Replace `$post->tags()->attach($tags->pluck('id')->toArray())` with `$post->tags()->sync($tags->pluck('id')->toArray())`.
9. Add `use Carbon\Carbon;` import.

**Requirements addressed:** R6.4–R6.8

---

## Task 9: Fix `CmsDocumentationSeeder` — `updateOrCreate` guards, fixed `published_at`

**File:** `database/seeders/CmsDocumentationSeeder.php`

**What to do:**
1. Add `// Idempotency key: English slug` comment at the top of `run()`.
2. Add `private const SEED_DATE = '2024-01-01';` to the class.
3. Replace `$section = CmsDocumentSection::create([...])` with `CmsDocumentSection::updateOrCreate(['slug->en' => Str::slug($names['en'])], [...])`.
4. Replace `CmsDocument::create([...])` with `CmsDocument::updateOrCreate(['slug->en' => Str::slug("{$names['en']} Guide $i")], [...])`.
5. Replace all `now()` calls with `Carbon::parse(self::SEED_DATE)`.
6. Add `use Carbon\Carbon;` import.

**Requirements addressed:** R6.9–R6.10, R6.12

---

## Task 10: Fix `CmsMarketingSeeder` — replace `now()` with fixed Carbon date for `published_at`

**File:** `database/seeders/CmsMarketingSeeder.php`

**What to do:**
1. Add `// Idempotency key: type` comment at the top of `run()`.
2. Add `private const SEED_DATE = '2024-01-01';` to the class.
3. In every `MarketingPage::updateOrCreate(...)` call, replace `'published_at' => now()` with `'published_at' => Carbon::parse(self::SEED_DATE)`.
4. Ensure `use Carbon\Carbon;` is imported (it likely already is via other imports).

**Requirements addressed:** R6.11, R6.12

---

## Task 11: Update `UserFactory` — add `seeded()` state, fix `remember_token`

**File:** `database/factories/UserFactory.php`

**What to do:**
1. Add a `seeded(int $seed): static` method to the factory class:
   ```php
   public function seeded(int $seed): static
   {
       $this->faker->seed($seed);
       return $this;
   }
   ```
2. In the `definition()` method, replace `'remember_token' => Str::random(10)` with `'remember_token' => $this->faker->regexify('[A-Za-z0-9]{10}')`.
3. Remove the `use Illuminate\Support\Str;` import if it is only used for `remember_token` (check for other usages first).

**Requirements addressed:** R7.1, R7.3
