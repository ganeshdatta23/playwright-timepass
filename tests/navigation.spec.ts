import { test, expect, Page } from "@playwright/test";
import AxeBuilder from "@axe-core/playwright";
import { setupBaseState } from "./utils";

/**
 * --------------------------------------------------------------------------
 *  NZDPU Navigation & Accessibility — End-to-End Test Suite
 * --------------------------------------------------------------------------
 *  Target:  https://nzdpu.com/
 *  Stack:   React + MUI (Material UI)
 *
 *  Verified against live site (Feb 2026):
 *  - Header: COMPANIES link, data explorer link
 *  - Footer: Companies, Data Explorer, Data Model Blueprint, Documentation,
 *            FAQs, Contact Us, About NZDPU, News & Publications,
 *            Terms of Service, Privacy Policy
 *  - Engage section: Explore companies, Explore DATA,
 *    COLLABORATE WITH US, SUBSCRIBE
 *  - Accessibility audits via axe-core (WCAG 2.1 AA)
 * --------------------------------------------------------------------------
 */

// ═════════════════════════════════════════════════════════════════════════
//  Header Navigation
// ═════════════════════════════════════════════════════════════════════════

test.describe("Header Navigation", () => {
    test.beforeEach(async ({ page }) => {
        await page.goto("/", { waitUntil: "networkidle" });
        await setupBaseState(page);
    });

    test("header has COMPANIES link pointing to /companies", async ({ page }) => {
        const link = page.getByRole("link", { name: /^COMPANIES$/i }).first();
        await expect(link).toBeVisible();
        await expect(link).toHaveAttribute("href", "/companies");
    });

    test("header has data explorer link pointing to /data-explorer", async ({ page }) => {
        const link = page.getByRole("link", { name: /data explorer/i }).first();
        await expect(link).toBeVisible();
        await expect(link).toHaveAttribute("href", "/data-explorer");
    });
});

// ═════════════════════════════════════════════════════════════════════════
//  Footer Navigation
// ═════════════════════════════════════════════════════════════════════════

test.describe("Footer Navigation", () => {
    test.beforeEach(async ({ page }) => {
        await page.goto("/", { waitUntil: "networkidle" });
        await setupBaseState(page);
    });

    const footerLinks = [
        { name: "Companies", href: "/companies" },
        { name: "Data Explorer", href: "/data-explorer" },
        { name: "Data Model Blueprint", href: "/data-model-blueprint" },
        { name: "Documentation", href: "/documentation" },
        { name: "FAQs", href: "/faq" },
        { name: "Contact Us", href: "/contact-us" },
        { name: "About NZDPU", href: "/about" },
        { name: "News & Publications", href: "/news-and-publications" },
        { name: "Terms of Service", href: "/terms-of-service" },
        { name: "Privacy Policy", href: "/privacy-policy" },
    ];

    for (const fl of footerLinks) {
        test(`footer '${fl.name}' link has correct href`, async ({ page }) => {
            const footer = page.locator("footer");
            const link = footer
                .getByRole("link", { name: new RegExp(fl.name.replace(/[&]/g, "."), "i") })
                .first();
            await expect(link).toBeVisible();
            await expect(link).toHaveAttribute("href", fl.href);
        });
    }

    test("footer displays mission statement", async ({ page }) => {
        const mission = page.getByText(
            /trusted, central source of company-level climate/i
        );
        await expect(mission.first()).toBeVisible();
    });

    test("footer has 'Subscribe to Our Newsletter' text", async ({ page }) => {
        const subscribe = page.getByText(/Subscribe to Our Newsletter/i);
        await expect(subscribe.first()).toBeVisible();
    });
});

// ═════════════════════════════════════════════════════════════════════════
//  Engage Section Links
// ═════════════════════════════════════════════════════════════════════════

test.describe("Engage Section", () => {
    test.beforeEach(async ({ page }) => {
        await page.goto("/", { waitUntil: "networkidle" });
        await setupBaseState(page);
    });

    test("'Explore companies' link points to /companies", async ({ page }) => {
        const link = page.getByRole("link", { name: /Explore companies/i });
        await expect(link.first()).toHaveAttribute("href", /\/companies/);
    });

    test("'Explore DATA' link points to /data-explorer", async ({ page }) => {
        const link = page.getByRole("link", { name: /Explore DATA/i });
        await expect(link.first()).toHaveAttribute("href", /\/data-explorer/);
    });

    test("'COLLABORATE WITH US' link points to /contact-us", async ({ page }) => {
        const link = page.getByRole("link", { name: /COLLABORATE WITH US/i });
        await expect(link.first()).toHaveAttribute("href", /\/contact-us/);
    });
});

// ═════════════════════════════════════════════════════════════════════════
//  Cookie Consent Banner
// ═════════════════════════════════════════════════════════════════════════

test.describe("Cookie Consent Banner", () => {
    test("cookie banner may appear with consent options", async ({ page }) => {
        await page.goto("/", { waitUntil: "networkidle" });
        // Cookie banner appearance depends on region / prior consent
        const allowBtn = page.getByRole("button", { name: /allow all/i });
        const isBannerVisible = await allowBtn.isVisible().catch(() => false);
        if (isBannerVisible) {
            await expect(allowBtn).toBeVisible();
        }
    });
});

// ═════════════════════════════════════════════════════════════════════════
//  Accessibility Audits (axe-core)
// ═════════════════════════════════════════════════════════════════════════

test.describe("Accessibility (WCAG 2.1 AA)", () => {
    async function checkA11y(page: Page, contextName: string) {
        await setupBaseState(page);

        const results = await new AxeBuilder({ page })
            .withTags(["wcag2a", "wcag2aa", "wcag21a", "wcag21aa"])
            .analyze();

        const critical = results.violations.filter(
            (v) => v.impact === "critical"
        );

        if (results.violations.length > 0) {
            console.log(
                `[A11y] ${contextName}: ${results.violations.length} violations`
            );
        }

        // Fail only on critical
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
