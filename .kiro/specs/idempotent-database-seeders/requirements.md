# Requirements Document

## Introduction

This feature reorganizes the Laravel database seeders in the `laratenant-backend` multi-tenant project so that running `php artisan migrate:fresh --seed` any number of times always produces the exact same dataset. Currently, seeders mix `create()` calls with no duplicate guards, use `rand()` and unseeded Faker instances for data generation, and rely on `now()` for timestamps — all of which break reproducibility. The goal is a fully idempotent seed pipeline that developers and CI pipelines can rely on for consistent, predictable test data.

## Glossary

- **DatabaseSeeder**: The root Laravel seeder class (`database/seeders/DatabaseSeeder.php`) that orchestrates all child seeders via `$this->call([...])`.
- **Seeder**: A PHP class in `database/seeders/` responsible for populating one logical group of database records.
- **Factory**: A Laravel model factory in `database/factories/` that generates model attribute arrays, optionally using Faker.
- **Faker**: The PHP Faker library used inside factories to generate realistic fake data.
- **Fixed Faker Seed**: An integer passed to `$this->faker->seed(N)` or `fake()->seed(N)` so that Faker produces the same sequence of values on every run.
- **Factory State**: A named method on a factory class that returns a modified attribute set, used to produce deterministic variants without random branching.
- **Idempotent Seeder**: A seeder whose `run()` method can be called multiple times and always leaves the database in the same final state.
- **Upsert Guard**: A pattern using `firstOrCreate`, `updateOrCreate`, or `DB::table()->upsert()` to prevent duplicate rows on repeated runs.
- **Pivot Table**: A many-to-many join table (e.g., `product_tag`, `store_user`, `blog_post_tag`) that can accumulate duplicate entries if not guarded.
- **`sync()`**: An Eloquent method that replaces all pivot entries for a relationship with the provided set, making many-to-many attachment idempotent.
- **Execution Order**: The sequence in which seeders are listed inside `DatabaseSeeder::run()`, which must respect foreign key dependencies.
- **Foreign Key Constraint**: A database-level rule that requires a referenced record to exist before a dependent record can be inserted.
- **Deterministic Timestamp**: A fixed or formula-derived timestamp (e.g., `Carbon::parse('2024-01-01')`) used instead of `now()` so that time-sensitive fields are reproducible.
- **Batch Number**: A string field on `ProductVariant` currently generated with `date('Ymd')`, which changes daily and breaks reproducibility.
- **SKU**: Stock-Keeping Unit; a unique product variant identifier currently generated with `rand()`, which is non-deterministic.

---

## Requirements

### Requirement 1: Deterministic Execution Order in DatabaseSeeder

**User Story:** As a developer, I want `DatabaseSeeder` to call all child seeders in a strict dependency-respecting order, so that no seeder ever fails due to a missing foreign key reference.

#### Acceptance Criteria

1. THE `DatabaseSeeder` SHALL call child seeders in the following order: `PermissionSeeder`, `StoreSeeder`, `CategorySeeder`, `BrandSeeder`, `ProductSeeder`, `FakeSalesSeeder`, `ReviewSeeder`, `HeroBannerSeeder`, `CmsBlogSeeder`, `CmsDocumentationSeeder`, `CmsMarketingSeeder`.
2. WHEN a seeder depends on records created by a prior seeder (e.g., `ProductSeeder` depends on `CategorySeeder` and `BrandSeeder`), THE `DatabaseSeeder` SHALL list the dependency seeder before the dependent seeder.
3. THE `DatabaseSeeder` SHALL NOT call any seeder more than once per `migrate:fresh --seed` invocation.
4. IF a required parent record does not exist when a child seeder runs, THEN THE child seeder SHALL log a descriptive error message and skip the affected records rather than throwing an unhandled exception.

---

### Requirement 2: Idempotent Core Entity Seeders

**User Story:** As a developer, I want every seeder that creates core entities (permissions, roles, stores, users, categories, brands, tags) to use upsert guards, so that running the seeder twice never produces duplicate rows.

#### Acceptance Criteria

1. THE `PermissionSeeder` SHALL use `Permission::firstOrCreate(['name' => $name])` and `Role::firstOrCreate(['name' => $name])` for every permission and role record.
2. THE `StoreSeeder` SHALL use `User::updateOrCreate(['email' => $email], [...])` for every user record and `Store::updateOrCreate(['slug' => $slug], [...])` for every store record.
3. THE `CategorySeeder` SHALL use `Category::firstOrCreate(['slug' => $slug, 'store_id' => $storeId], [...])` instead of `Category::create([...])` for every category record.
4. THE `BrandSeeder` SHALL use `Brand::firstOrCreate(['slug' => $slug], [...])` for every brand record.
5. WHEN a translation record is created for any entity, THE seeder SHALL use `updateOrCreate(['locale' => $locale, '<parent>_id' => $id], [...])` to prevent duplicate translation rows.
6. WHEN `StoreSeeder` attaches a user to a store via the `store_user` pivot table, THE `StoreSeeder` SHALL check for an existing pivot entry before calling `attach()`, or use `syncWithoutDetaching()` to prevent duplicate pivot rows.

---

### Requirement 3: Reproducible Product and Variant Data

**User Story:** As a developer, I want `ProductSeeder` to produce the exact same products, options, variants, and SKUs on every run, so that product IDs and SKUs are stable across environments.

#### Acceptance Criteria

1. THE `ProductSeeder` SHALL use `Product::firstOrCreate` or `updateOrCreate` keyed on the English translation slug to prevent duplicate product records.
2. THE `ProductSeeder` SHALL use `ProductOption::firstOrCreate(['product_id' => $id, 'name' => $name], [...])` to prevent duplicate option records.
3. THE `ProductSeeder` SHALL use `ProductOptionValue::firstOrCreate(['option_id' => $id, 'value' => $value], [...])` to prevent duplicate option value records.
4. WHEN generating a SKU for a `ProductVariant`, THE `ProductSeeder` SHALL derive the SKU deterministically from the product name and option value combination (e.g., `strtoupper(Str::slug(implode('-', $parts)))`), and SHALL NOT use `rand()` or any other non-deterministic function in the SKU.
5. WHEN creating a `ProductVariant`, THE `ProductSeeder` SHALL use `ProductVariant::firstOrCreate(['sku' => $sku], [...])` to prevent duplicate variant records.
6. WHEN setting `batch_number` on a `ProductVariant`, THE `ProductSeeder` SHALL use a fixed prefix and a zero-padded index (e.g., `'BATCH-SEED-001'`) instead of `date('Ymd')`.
7. WHEN setting `quantity` on a `ProductVariant`, THE `ProductSeeder` SHALL use a fixed value derived from the variant index rather than `rand()`.
8. WHEN setting `manufacture_date` and `expiry_date` on a `ProductVariant`, THE `ProductSeeder` SHALL use fixed `Carbon` offsets from a reference date (e.g., `Carbon::parse('2024-01-01')`) rather than `now()`.
9. WHEN attaching tags to a product, THE `ProductSeeder` SHALL use `$product->tags()->sync($tagIds)` to replace the tag set idempotently.
10. WHEN inserting rows into the `variant_option_values` pivot table, THE `ProductSeeder` SHALL use `DB::table('variant_option_values')->updateOrInsert(['variant_id' => $id, 'option_value_id' => $valueId], [...])` to prevent duplicate pivot entries.

---

### Requirement 4: Reproducible Fake Sales and User Data

**User Story:** As a developer, I want `FakeSalesSeeder` to create the same set of fake users and orders on every run, so that sales data is stable for dashboard and reporting tests.

#### Acceptance Criteria

1. THE `FakeSalesSeeder` SHALL initialize Faker with a fixed integer seed (e.g., `fake()->seed(12345)`) before generating any data.
2. THE `FakeSalesSeeder` SHALL create exactly the configured number of fake users (e.g., 20) using `User::factory()->count($n)->create()` only when that count of factory-generated users does not already exist, or SHALL use `firstOrCreate` keyed on a deterministic email derived from the Faker seed.
3. WHEN creating `Order` records, THE `FakeSalesSeeder` SHALL derive `order_number` deterministically (e.g., from a zero-padded loop index such as `'SEED-ORDER-' . str_pad($i + 1, 4, '0', STR_PAD_LEFT)`) and SHALL use `Order::firstOrCreate(['order_number' => $orderNumber], [...])` to prevent duplicate orders.
4. WHEN selecting a `User` for an order, THE `FakeSalesSeeder` SHALL use a deterministic selection strategy (e.g., cycling through users by index modulo user count) rather than `User::inRandomOrder()->first()`.
5. WHEN selecting a `ProductVariant` for an order item, THE `FakeSalesSeeder` SHALL use a deterministic selection strategy (e.g., cycling through variants by a seeded index) rather than `$variants->random()`.
6. WHEN setting `quantity` and `shipping_amount` on orders and order items, THE `FakeSalesSeeder` SHALL use values derived from the Faker seed rather than `rand()`.

---

### Requirement 5: Reproducible Review Data

**User Story:** As a developer, I want `ReviewSeeder` to create the same reviews for the same products and users on every run, so that rating aggregates are stable.

#### Acceptance Criteria

1. THE `ReviewSeeder` SHALL initialize Faker with a fixed integer seed (e.g., `fake()->seed(54321)`) before generating any data.
2. WHEN creating reviews, THE `ReviewSeeder` SHALL use `Review::firstOrCreate(['user_id' => $userId, 'product_id' => $productId], [...])` to prevent duplicate review records.
3. WHEN selecting the number of reviewers per product, THE `ReviewSeeder` SHALL use a fixed count per product derived from the Faker seed rather than `rand()`.
4. WHEN selecting which users review a product, THE `ReviewSeeder` SHALL use a deterministic selection (e.g., seeded Faker `randomElements`) rather than `$users->random($count)`.
5. WHEN assigning a rating, THE `ReviewSeeder` SHALL use a value derived from the Faker seed rather than `rand()`.

---

### Requirement 6: Reproducible CMS and Banner Data

**User Story:** As a developer, I want `HeroBannerSeeder`, `CmsBlogSeeder`, `CmsDocumentationSeeder`, and `CmsMarketingSeeder` to be fully idempotent, so that CMS content is stable across repeated seed runs.

#### Acceptance Criteria

1. THE `HeroBannerSeeder` SHALL use `HeroBanner::updateOrCreate(['position' => $position], [...])` for every banner record instead of `HeroBanner::create([...])`.
2. WHEN creating banner translations, THE `HeroBannerSeeder` SHALL use `updateOrCreate(['locale' => $locale], [...])` on the translations relationship.
3. WHEN setting `starts_at` and `ends_at` on banners, THE `HeroBannerSeeder` SHALL use fixed `Carbon` dates (e.g., `Carbon::parse('2024-01-01')`) rather than `now()` or `$now->copy()->addMonth()`.
4. THE `CmsBlogSeeder` SHALL use `BlogCategory::firstOrCreate` keyed on the English slug for every blog category.
5. THE `CmsBlogSeeder` SHALL use `BlogTag::firstOrCreate` keyed on the English slug for every blog tag.
6. THE `CmsBlogSeeder` SHALL use `BlogPost::updateOrCreate` keyed on the English slug for every blog post.
7. WHEN attaching tags to a blog post, THE `CmsBlogSeeder` SHALL use `$post->tags()->sync($tagIds)` to replace the tag set idempotently.
8. WHEN setting `published_at` on blog posts, THE `CmsBlogSeeder` SHALL use fixed `Carbon` dates derived from a reference date rather than `now()->subDays($n)`.
9. THE `CmsDocumentationSeeder` SHALL use `CmsDocumentSection::updateOrCreate` keyed on the English slug for every section.
10. THE `CmsDocumentationSeeder` SHALL use `CmsDocument::updateOrCreate` keyed on the English slug for every document.
11. THE `CmsMarketingSeeder` already uses `MarketingPage::updateOrCreate` keyed on `type`; THE `CmsMarketingSeeder` SHALL continue to use this pattern for all marketing page records.
12. WHEN setting `published_at` on any CMS record, THE seeder SHALL use a fixed `Carbon` date rather than `now()`.

---

### Requirement 7: Deterministic Factory Configuration

**User Story:** As a developer, I want all Laravel factories used by seeders to support a fixed Faker seed so that generated attribute values are reproducible.

#### Acceptance Criteria

1. THE `UserFactory` SHALL expose a `seeded(int $seed)` factory state that calls `$this->faker->seed($seed)` and returns the factory instance, allowing callers to opt into deterministic generation.
2. WHEN `FakeSalesSeeder` calls `User::factory()->count($n)->create()`, THE `FakeSalesSeeder` SHALL apply the `seeded()` state (e.g., `User::factory()->seeded(12345)->count($n)->create()`).
3. THE `UserFactory` definition SHALL NOT call `Str::random()` for `remember_token` when operating under a fixed seed; it SHALL use `$this->faker->regexify('[A-Za-z0-9]{10}')` instead, so the token is also deterministic.
4. WHERE a factory uses `fake()->unique()`, THE factory SHALL reset the unique generator at the start of each seeder run by calling `fake()->unique(true)` before the first factory call, ensuring uniqueness constraints are satisfied consistently.

---

### Requirement 8: Seeder Structural Organization

**User Story:** As a developer, I want seeders to follow a consistent structural pattern so that the codebase is maintainable and new seeders can be added without breaking idempotency.

#### Acceptance Criteria

1. THE `DatabaseSeeder` SHALL group its `$this->call([...])` list with inline comments that identify each logical group (e.g., `// --- Platform: Permissions & Roles ---`, `// --- Tenant: Stores & Users ---`, `// --- Catalog: Categories, Brands, Products ---`, `// --- Sales: Orders & Reviews ---`, `// --- CMS: Banners, Blog, Docs, Marketing ---`).
2. WHEN a seeder creates records that depend on a specific store, THE seeder SHALL resolve the store by a stable identifier (e.g., `Store::where('slug', 'merchant-store')->firstOrFail()`) rather than `Store::first()` or a hard-coded integer ID.
3. THE `CategorySeeder` SHALL pass `store_id` explicitly when creating categories, resolving the store by slug rather than assuming `store_id = 1`.
4. THE `BrandSeeder` SHALL pass `store_id` explicitly when creating brands, resolving the store by slug rather than assuming `store_id = 1`.
5. WHEN a seeder encounters a missing dependency (e.g., a category not found for a product), THE seeder SHALL output a warning via `$this->command->warn(...)` and continue processing remaining records rather than silently skipping or crashing.
6. EACH seeder file SHALL contain a single-line doc comment at the top of the `run()` method describing its idempotency key (e.g., `// Idempotency key: slug`).
