# NZDPU Playwright E2E Test Suite

Automated end-to-end tests for the live **[NZDPU website](https://nzdpu.com)** (Net-Zero Data Public Utility).  
Built with [Playwright](https://playwright.dev/) and [TypeScript](https://www.typescriptlang.org/).

---

## What Is Tested

| Test File | Pages Covered | # Tests |
|---|---|---|
| `tests/homepage.spec.ts` | Homepage (`/`) | ~40 |
| `tests/companies.spec.ts` | Companies page (`/companies`) | ~20 |
| `tests/data-explorer.spec.ts` | Data Explorer (`/data-explorer`) | ~12 |
| `tests/data-model-blueprint.spec.ts` | Data Model Blueprint (`/data-model-blueprint`) | ~16 |
| `tests/static-pages.spec.ts` | About, Documentation, FAQ, Contact Us, Privacy Policy, Terms of Service, News & Publications | ~25 |
| `tests/navigation.spec.ts` | Header nav, Footer nav, Engage section, Cookie consent, Accessibility (axe-core WCAG 2.1 AA) | ~28 |

**Total: ~140 tests across 6 suites**

---

## Requirements

- [Node.js](https://nodejs.org/) **version 18 or higher**
- [npm](https://www.npmjs.com/) (comes with Node.js)
- Internet access to reach `https://nzdpu.com`

> **Check your Node version:**
> ```bash
> node --version
> ```

---

## Setup (First Time)

Follow these steps **once** to get everything installed.

### Step 1 — Clone or navigate to the project folder

```bash
cd c:\Users\ganes\Projects\playwright
```

### Step 2 — Install npm dependencies

```bash
npm install
```

This installs:
- `@playwright/test` — the core testing framework
- `@axe-core/playwright` — accessibility auditing (WCAG 2.1 AA)
- `typescript` — TypeScript support

### Step 3 — Install Playwright browsers

```bash
npx playwright install
```

This downloads Chromium, Firefox, and WebKit browser binaries.  
You only need to do this once (or after upgrading Playwright).

---

## Running Tests

### Run all tests on all browsers

```bash
npm test
```

### Run tests on Chromium only (fastest)

```bash
npm run test:chromium
```

### Run tests with a visible browser window (good for debugging)

```bash
npm run test:headed
```

### Open the interactive UI mode (visual test runner)

```bash
npm run test:ui
```

### View the HTML report after a test run

```bash
npm run test:report
```

---

## Running a Specific Test File

```bash
npx playwright test tests/homepage.spec.ts --project=chromium
npx playwright test tests/companies.spec.ts --project=chromium
npx playwright test tests/data-explorer.spec.ts --project=chromium
npx playwright test tests/data-model-blueprint.spec.ts --project=chromium
npx playwright test tests/static-pages.spec.ts --project=chromium
npx playwright test tests/navigation.spec.ts --project=chromium
```

## Running a Specific Test by Name

```bash
# Run any test whose name contains "footer"
npx playwright test --grep "footer" --project=chromium

# Run any test whose name contains "accessibility"
npx playwright test --grep "a11y" --project=chromium
```

---

## Project Structure

```
playwright/
├── tests/
│   ├── homepage.spec.ts            # Homepage tests
│   ├── companies.spec.ts           # Companies page tests
│   ├── data-explorer.spec.ts       # Data Explorer tests
│   ├── data-model-blueprint.spec.ts # Data Model Blueprint tests
│   ├── static-pages.spec.ts        # About, Docs, FAQ, Contact, Legal, News
│   └── navigation.spec.ts          # Navigation + Accessibility (axe-core)
├── playwright.config.ts            # Playwright configuration
├── tsconfig.json                   # TypeScript configuration
├── package.json                    # Scripts and dependencies
├── inspect-site.ts                 # Utility: crawls live site to extract DOM info
├── .gitignore
└── README.md
```

---

## Configuration

Open `playwright.config.ts` to see or change these settings:

| Setting | Value | What It Does |
|---|---|---|
| `baseURL` | `https://nzdpu.com` | The website all tests run against |
| `timeout` | `60 seconds` | Max time for a single test |
| `actionTimeout` | `15 seconds` | Max time for a single click/type/wait action |
| `retries` | `1` (local), `2` (CI) | How many times a failing test is retried |
| `workers` | Auto (local), `1` (CI) | How many tests run in parallel |
| `screenshot` | On failure only | Saves a screenshot when a test fails |
| `trace` | On first retry | Records a trace file for debugging retries |
| `video` | On first retry | Records a video for debugging retries |

### Browsers

Tests run on three browsers by default:

| Name | Browser |
|---|---|
| `chromium` | Google Chrome |
| `firefox` | Mozilla Firefox |
| `webkit` | Apple Safari |

---

## After a Test Run

- **HTML report** is saved to `playwright-report/`  
  Open it with: `npm run test:report`

- **Failure screenshots** are saved to `test-results/`

- **Traces and videos** (on failure/retry) are also in `test-results/`  
  Open a trace with: `npx playwright show-trace test-results/<test-name>/trace.zip`

---

## About the Cookie Consent Banner

The NZDPU website shows a cookie consent banner on first visit.  
All tests automatically dismiss this banner before running any assertions, so it does not interfere with test results.

---

## About the Accessibility Tests

The `navigation.spec.ts` file includes **axe-core accessibility audits** for 8 key pages.  
These check for WCAG 2.1 AA compliance.

- **Critical violations** → Test **fails** (these should be fixed on the website)
- **Serious / Moderate / Minor violations** → Logged to the console but test **passes**

This approach lets you track accessibility quality over time without blocking the CI pipeline for lower-severity issues.

---

## Troubleshooting

### "browserType.launch: Executable doesn't exist"
Run `npx playwright install` to download the browser binaries.

### Tests time out
The NZDPU website is a live server. If it is slow or down, tests will time out.  
Increase the `timeout` in `playwright.config.ts` if needed.

### "Cannot find module '@axe-core/playwright'"
Run `npm install` to install all dependencies.

### TypeScript errors
Run `npx tsc --noEmit` to check for type errors.  
All tests require TypeScript 5+ (included in `devDependencies`).

---

## Dependencies

| Package | Version | Purpose |
|---|---|---|
| `@playwright/test` | `^1.58` | Core E2E testing framework |
| `@axe-core/playwright` | `^4.11` | WCAG accessibility auditing |
| `typescript` | `^5.9` | TypeScript language support |

---

## License

ISC
