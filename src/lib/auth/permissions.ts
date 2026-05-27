const DASHBOARD_PERMISSION_PREFIXES = ['dashboard.', 'store.', 'product.', 'order.', 'category.', 'brand.', 'tag.', 'user.'];

export function hasPermission(permissions: string[], permission: string): boolean {
  return permissions.includes(permission);
}

export function hasPermissionPrefix(permissions: string[], prefixes: string[]): boolean {
  return permissions.some((permission) => prefixes.some((prefix) => permission.startsWith(prefix)));
}

export function canViewDashboardFromPermissions(permissions: string[]): boolean {
  return permissions.length > 0 || hasPermissionPrefix(permissions, DASHBOARD_PERMISSION_PREFIXES);
}

export function canViewUsersFromPermissions(permissions: string[]): boolean {
  return hasPermissionPrefix(permissions, ['user.']);
}

export function canViewProductsFromPermissions(permissions: string[]): boolean {
  return hasPermissionPrefix(permissions, ['product.']);
}

export function canViewOrdersFromPermissions(permissions: string[]): boolean {
  return hasPermissionPrefix(permissions, ['order.']);
}

export function canViewCategoriesFromPermissions(permissions: string[]): boolean {
  return hasPermissionPrefix(permissions, ['category.']);
}

export function canViewBrandsFromPermissions(permissions: string[]): boolean {
  return hasPermissionPrefix(permissions, ['brand.']);
}

export function canViewTagsFromPermissions(permissions: string[]): boolean {
  return hasPermissionPrefix(permissions, ['tag.']);
}

export function canViewCmsPagesFromPermissions(permissions: string[]): boolean {
  // Show to anyone with cms./page. permissions, or fall back to product-level access
  // since CMS page management is a store content capability.
  return hasPermissionPrefix(permissions, ['cms.', 'page.', 'product.']);
}
