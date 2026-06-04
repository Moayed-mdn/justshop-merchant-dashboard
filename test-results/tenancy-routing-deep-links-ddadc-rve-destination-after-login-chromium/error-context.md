# Instructions

- Following Playwright test failed.
- Explain why, be concise, respect Playwright best practices.
- Provide a snippet of code with the fix, if possible.

# Test info

- Name: tenancy/routing.spec.ts >> deep links with redirect param preserve destination after login
- Location: tests/e2e/tenancy/routing.spec.ts:103:5

# Error details

```
Error: page.goto: net::ERR_CONNECTION_REFUSED at http://localhost:3000/en/merchant/products/new
Call log:
  - navigating to "http://localhost:3000/en/merchant/products/new", waiting until "load"

```

```
Error: browserContext.close: Target page, context or browser has been closed
```