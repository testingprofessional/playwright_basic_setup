# Playwright Sample Structure

A compact end-to-end testing project built with **Playwright**, **TypeScript**, and the **Page Object Model**. It uses Sauce Demo as the target application and demonstrates a maintainable structure for login and product-page checks.

## What this project covers

- Login scenarios for invalid and locked-out users.
- A product-page smoke test for a standard user.
- Reusable Playwright fixtures for page objects.
- Application health checks that skip dependent tests when the target is unavailable.
- Credentials loaded safely from a local `.env` file.

## Quick start

```bash
npm ci
npx playwright install chromium
cp .env.example .env
```

Fill in the values in `.env` for your test environment:

```dotenv
STANDARD_USER_USERNAME=
STANDARD_USER_PASSWORD=
LOCKED_OUT_USER_USERNAME=
LOCKED_OUT_USER_PASSWORD=
INVALID_USER_USERNAME=
INVALID_USER_PASSWORD=
```

Then run the tests:

```bash
npx playwright test
```

Useful commands:

```bash
npx playwright test --ui
npx playwright test --headed
npx playwright show-report
npx tsc --noEmit
```

## Authentication state

Product and cart scenarios do not repeat the UI login flow. Before those tests run, the `setup` Playwright project executes `auth.setup.ts` once:

1. It signs in with `STANDARD_USER_USERNAME` and `STANDARD_USER_PASSWORD`.
2. It saves the authenticated browser state to `playwright/.auth/standard-user.json`.
3. The Chromium project loads that state for each product and cart test.

Running the complete suite handles this automatically:

```bash
npx playwright test
```

To regenerate the state only, for example after credentials change or the session expires, run:

```bash
npx playwright test --project=setup
```

The auth-state file contains session information and is ignored by Git. Login scenarios explicitly start without saved authentication so they continue to test the real sign-in flow.

## Project structure

```text
src/
├── lib/
│   ├── appHealth.ts       # Availability check for pages used by tests
│   └── baseTest.ts        # Shared Playwright fixtures
├── support/
│   ├── users.ts           # Environment-backed test users
│   └── views/             # Page Object Model classes
│       ├── cartPage.ts
│       ├── loginPage.ts
│       └── productsPage.ts
└── test-scenarios/        # End-to-end test specifications
    ├── auth.setup.ts       # Creates standard-user auth state
    ├── cart.e2e.ts
    ├── logging.e2e.ts
    └── products.e2e.ts
```

## Page Object Model

The page objects keep selectors and page-specific actions in one place. Tests stay focused on user behaviour and assertions:

```ts
await loginPage.visit();
await loginPage.submitLogin(username, password);
await expect(productsPage.title).toHaveText('Products');
```

Use a Page Object when a page is reused across tests, when its interactions have meaningful business names, or when centralising selectors will make change safer. Avoid turning every small assertion into a page-object method—the test should still clearly express the user journey.

## Shared fixtures and health checks

`baseTest.ts` extends Playwright's `test` with `loginPage` and `productsPage` fixtures. The products fixture checks application availability before use. If the health check fails, dependent tests are skipped with the underlying reason instead of failing with misleading selector timeouts.

## Conventions

- Keep credentials in `.env`; it is intentionally excluded from version control.
- Prefer resilient locators such as roles and `data-test` attributes.
- Split actions and assertions into separate `test.step` blocks when it makes reports easier to diagnose.
- Keep tests independent and make assertions explicit.
