# Legacy Route Compatibility

To ensure a smooth transition and prevent broken deep links, the legacy store-scoped routes (`/stores/{storeId}/*`) are maintained as compatibility adapters.

## Redirect Strategy

Legacy routes are implemented using the `LegacyRouteRedirector` component.

1. **Entry**: User visits a legacy URL (e.g., `/en/stores/5/products`).
2. **Detection**: The redirector checks the requested `storeId` against the currently `activeStore`.
3. **Hydration**:
   - If they match, it immediately redirects to the canonical route (`/merchant/products`).
   - If they mismatch, it triggers the `switchStore` mutation to update the active context on the backend and in the client state.
4. **Transition**: Once the context is hydrated, the user is redirected to the canonical workspace route.

## Analytics Preservation

The redirector logs the transition event, including the original route and target path, to ensure telemetry continuity.

## Supported Legacy Routes

- `/stores/{id}/dashboard` -> `/merchant/dashboard`
- `/stores/{id}/products` -> `/merchant/products`
- `/stores/{id}/orders` -> `/merchant/orders`
- `/stores/{id}/categories` -> `/merchant/categories`
- `/stores/{id}/brands` -> `/merchant/brands`
- `/stores/{id}/tags` -> `/merchant/tags`
- `/stores/{id}/users` -> `/merchant/customers`
