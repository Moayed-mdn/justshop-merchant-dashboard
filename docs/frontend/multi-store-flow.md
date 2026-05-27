# Multi-Store Flow

The platform distinguishes between creating the first store and adding subsequent stores.

## First-Store Flow (Onboarding)

- **Route**: `/setup`
- **Context**: Managed by the `SetupOrchestrator`.
- **Experience**: A focused, step-by-step wizard for platform activation.
- **Redirection**: Merchants with 0 stores are automatically redirected here from any workspace route.

## Additional-Store Flow (Workspace)

- **Route**: `/merchant/stores/create`
- **Context**: Managed by the `CreateStorePage` inside the `(merchant)` shell.
- **Experience**: A lightweight form to expand the business.
- **Provisioning**: Unlike the first-store flow, provisioning happens **inside** the workspace layout via the `WorkspaceProvisioningView`. The merchant remains in the workspace and can see the sidebar/topbar (though some actions are disabled).

## Technical Composition

- **Reuse**: Both flows reuse the `CreateStoreStep` and `ProvisioningStep` components from `src/features/setup/components/`.
- **Interception**: The workspace versions (`CreateStorePage` and `WorkspaceProvisioningView`) wrap these components and intercept their `onSuccess` or redirect logic to keep the user within the `/merchant` path instead of redirecting to the `/stores/[id]` path.

## Success Transition

Upon successful provisioning of an additional store:
1. The `bootstrapStore` is refreshed.
2. The new store becomes the `activeStore`.
3. The user is redirected to `/merchant/dashboard`.
