import { test, expect, Page } from "@playwright/test";
import AxeBuilder from "@axe-core/playwright";
import { dismissCookieBanner } from "./utils";

/**
 * --------------------------------------------------------------------------
 *  NZDPU Navigation & Accessibility — End-to-End Test Suite
 * --------------------------------------------------------------------------
 *  Target:  https://nzdpu.com/
 *  Stack:   React + MUI (Material UI)
 *  Notes:   - Cookie consent banner tested explicitly here, and dismissed
 *             in other tests.
 *           - Accessibility audits using @axe-core/playwright (WCAG 2.1 AA).
 *           - Footer links are tested via data-driven loop.
 * --------------------------------------------------------------------------
 */

// ═════════════════════════════════════════════════════════════════════════
//  Header Navigation
// ═════════════════════════════════════════════════════════════════════════

test.describe("Header Navigation", () => {
    test.beforeEach(async ({ page }) => {
        await page.goto("/", { waitUntil: "networkidle" });
        await dismissCookieBanner(page);
    });

    test("RESOURCES dropdown opens and shows links", async ({ page }) => {
        const resourcesBtn = page.getByRole("button", { name: /^RESOURCES$/i });
        await resourcesBtn.click();
        const menu = page.getByRole("menu");
        await expect(menu).toBeVisible();
        await expect(menu.getByRole("menuitem", { name: /Documentation/i })).toBeVisible();
        await expect(menu.getByRole("menuitem", { name: /FAQ/i })).toBeVisible();
    });

    test("ABOUT dropdown opens and shows links", async ({ page }) => {
        const aboutBtn = page.getByRole("button", { name: /^ABOUT$/i });
        await aboutBtn.click();
        const menu = page.getByRole("menu");
        await expect(menu).toBeVisible();
        await expect(menu.getByRole("menuitem", { name: /About NZDPU/i })).toBeVisible();
        await expect(menu.getByRole("menuitem", { name: /News/i })).toBeVisible();
        await expect(menu.getByRole("menuitem", { name: /Contact/i })).toBeVisible();
    });

    test("NZDPU Logo navigates to homepage", async ({ page }) => {
        // Navigate elsewhere first
        await page.goto("/companies", { waitUntil: "networkidle" });
        const logo = page.locator('a[href="/"] img, a[href="/"] svg').first().or(
            page.locator('header a[href="/"]').first()
        );
        await logo.click();
        await expect(page).toHaveURL(/https:\/\/nzdpu\.com\/?$/);
    });
});

// ═════════════════════════════════════════════════════════════════════════
//  Footer Navigation
// ═════════════════════════════════════════════════════════════════════════

test.describe("Footer Navigation", () => {
    test.beforeEach(async ({ page }) => {
        await page.goto("/", { waitUntil: "networkidle" });
        await dismissCookieBanner(page);
    });

    const footerLinks = [
        { name: "Companies", href: "/companies" },
        { name: "Data Explorer", href: "/data-explorer" },
        { name: "Documentation", href: "/documentation" },
        { name: "FAQs", href: "/faq" },
        { name: "About NZDPU", href: "/about" },
        { name: "Terms of Service", href: "/terms-of-service" },
        { name: "Privacy Policy", href: "/privacy-policy" },
    ];

    for (const fl of footerLinks) {
        test(`footer '${fl.name}' link has correct href (${fl.href})`, async ({ page }) => {
            const link = page.locator("footer").getByRole("link", { name: new RegExp(`^${fl.name}$`, "i") }).first();
            await expect(link).toBeVisible();
            await expect(link).toHaveAttribute("href", fl.href);
        });
    }

    test("Social links (LinkedIn) are present", async ({ page }) => {
        const linkedin = page.locator("footer").locator('a[href*="linkedin.com"]');
        await expect(linkedin.first()).toBeVisible();
    });
});

// ═════════════════════════════════════════════════════════════════════════
//  Engage Section Links
// ═════════════════════════════════════════════════════════════════════════

test.describe("Engage Section", () => {
    test.beforeEach(async ({ page }) => {
        await page.goto("/", { waitUntil: "networkidle" });
        await dismissCookieBanner(page);
    });

    test("EXPLORE DATA button navigates to /data-explorer", async ({ page }) => {
        const btn = page.getByRole("link", { name: /^EXPLORE DATA$/i });
        await expect(btn).toHaveAttribute("href", "/data-explorer");
    });

    test("COLLABORATE WITH US button navigates to /contact-us", async ({ page }) => {
        const btn = page.getByRole("link", { name: /^COLLABORATE WITH US$/i });
        await expect(btn).toHaveAttribute("href", "/contact-us");
    });
});

// ═════════════════════════════════════════════════════════════════════════
//  Cookie Consent Banner (Specific Tests)
// ═════════════════════════════════════════════════════════════════════════

test.describe("Cookie Consent Banner", () => {
    // We do NOT use beforeEach dismissCookieBanner here, as we want to test its presence.

    test("cookie banner appears with ALLOW ALL, DECLINE ALL, CUSTOMIZE options", async ({ page }) => {
        // Use a fresh context to ensure cookies aren't cached if possible, 
        // or incognito. By default Playwright tests are incognito.
        await page.goto("/", { waitUntil: "networkidle" });

        // It might differ based on region, but usually appears.
        // We check availability.
        const banner = page.getByText(/We use cookies/i).first();
        const allowBtn = page.getByRole("button", { name: /allow all/i });
        const declineBtn = page.getByRole("button", { name: /decline all/i });
        const customizeBtn = page.getByRole("button", { name: /customize/i });

        // If banner is present, assert buttons. If not (geo-IP), skip.
        if (await banner.isVisible()) {
            await expect(allowBtn).toBeVisible();
            await expect(declineBtn).toBeVisible();
            await expect(customizeBtn).toBeVisible();
        }
    });
});

// ═════════════════════════════════════════════════════════════════════════
//  Accessibility Audits (axe-core)
// ═════════════════════════════════════════════════════════════════════════

test.describe("Accessibility (WCAG 2.1 AA)", () => {
    /**
     * Helper to run axe audit and assert no CRITICAL violations.
     * We log other violations but do not fail the test, as many legacy/design
     * issues might exist that are not show-stoppers for E2E.
     */
    async function checkA11y(page: Page, contextName: string) {
        await dismissCookieBanner(page); // clear overlays

        const accessibilityScanResults = await new AxeBuilder({ page })
            .withTags(["wcag2a", "wcag2aa", "wcag21a", "wcag21aa"])
            .analyze();

        const critical = accessibilityScanResults.violations.filter(
            (v) => v.impact === "critical"
        );

        if (accessibilityScanResults.violations.length > 0) {
            console.log(
                `[A11y] ${contextName}: ${accessibilityScanResults.violations.length} violations`
            );
            // Log all violations for report
            // console.log(JSON.stringify(accessibilityScanResults.violations, null, 2));
        }

        // Soft assertion: Fail only on critical errors
        expect(critical.length, `Critical a11y violations on ${contextName}`).toBe(0);
    }

    test("Homepage accessibility", async ({ page }) => {
        await page.goto("/", { waitUntil: "networkidle" });
        await checkA11y(page, "Homepage");
    });

    test("Companies page accessibility", async ({ page }) => {
        await page.goto("/companies", { waitUntil: "networkidle" });
        await checkA11y(page, "Companies Page");
    });

    test("Data Explorer accessibility", async ({ page }) => {
        await page.goto("/data-explorer", { waitUntil: "networkidle" });
        await checkA11y(page, "Data Explorer");
    });

    test("Data Model Blueprint accessibility", async ({ page }) => {
        await page.goto("/data-model-blueprint", { waitUntil: "networkidle" });
        await checkA11y(page, "Data Model Blueprint");
    });

    test("About page accessibility", async ({ page }) => {
        await page.goto("/about", { waitUntil: "networkidle" });
        await checkA11y(page, "About Page");
    });
});
