import { test, expect, Page } from "@playwright/test";
import { dismissCookieBanner } from "./utils";

/**
 * --------------------------------------------------------------------------
 *  NZDPU Static Pages — End-to-End Test Suite
 * --------------------------------------------------------------------------
 *  Covers: About, Documentation, FAQ, Contact Us, Privacy Policy,
 *          Terms of Service, News & Publications.
 *  Stack:  React + MUI (Material UI)
 *  Notes:  - Cookie consent banner dismissed in beforeEach.
 *          - FAQ loads dynamically — test waits for content.
 *          - News & Publications has tabs (ALL, NEWS & UPDATES, PUBLICATIONS)
 *            and pagination.
 *          - Documentation has download links rendered as MUI buttons.
 * --------------------------------------------------------------------------
 */

// ═════════════════════════════════════════════════════════════════════════
//  About Page
// ═════════════════════════════════════════════════════════════════════════

test.describe("About Page", () => {
    test.beforeEach(async ({ page }) => {
        await page.goto("/about", { waitUntil: "networkidle" });
        await dismissCookieBanner(page);
    });

    test("page loads with NZDPU in the title", async ({ page }) => {
        await expect(page).toHaveTitle(/NZDPU/i);
    });

    test("displays 'About NZDPU' heading", async ({ page }) => {
        const heading = page.getByRole("heading", { name: /About NZDPU/i });
        await expect(heading.first()).toBeVisible();
    });

    test("displays mission statement", async ({ page }) => {
        const mission = page.getByText(
            /trusted, central source of company-level climate data/i
        );
        await expect(mission.first()).toBeVisible();
    });

    test("mentions Climate Data Steering Committee", async ({ page }) => {
        const cdsc = page.getByText(/Climate Data Steering Committee/i);
        await expect(cdsc.first()).toBeVisible();
    });

    test("has link to CDSC website", async ({ page }) => {
        const link = page.locator('a[href*="climatedatasc.org"]');
        await expect(link.first()).toBeVisible();
    });

    test("mentions founding by Macron and Bloomberg", async ({ page }) => {
        const text = page.getByText(/Emmanuel Macron/i);
        await expect(text.first()).toBeVisible();
    });

    test("describes the Technical Advisory Board", async ({ page }) => {
        const tab = page.getByText(/Technical Advisory Board/i);
        await expect(tab.first()).toBeVisible();
    });

    test("describes the Core Team", async ({ page }) => {
        const coreTeam = page.getByText(/Core Team/i);
        await expect(coreTeam.first()).toBeVisible();
    });
});

// ═════════════════════════════════════════════════════════════════════════
//  Documentation Page
// ═════════════════════════════════════════════════════════════════════════

test.describe("Documentation Page", () => {
    test.beforeEach(async ({ page }) => {
        await page.goto("/documentation", { waitUntil: "networkidle" });
        await dismissCookieBanner(page);
    });

    test("page loads with NZDPU in the title", async ({ page }) => {
        await expect(page).toHaveTitle(/NZDPU/i);
    });

    test("displays 'Documentation' heading", async ({ page }) => {
        const heading = page.getByRole("heading", { name: /^Documentation$/i });
        await expect(heading.first()).toBeVisible();
    });

    test("has NZDPU Core Data Model section", async ({ page }) => {
        const section = page.getByText(/NZDPU Core Data Model/i);
        await expect(section.first()).toBeVisible();
    });

    test("has Core Data Model download action", async ({ page }) => {
        // Rendered as MUI button, not necessarily an <a> with matching text
        const download = page.getByText(/Download NZDPU Core Data Model/i)
            .or(page.locator('a, button').filter({ hasText: /Core Data Model/i }));
        await expect(download.first()).toBeVisible();
    });

    test("has CDP-NZDPU Mapping section", async ({ page }) => {
        const section = page.getByText(/CDP.*NZDPU Mapping/i);
        await expect(section.first()).toBeVisible();
    });

    test("has NZDPU Data Guide section", async ({ page }) => {
        const section = page.getByText(/NZDPU Data Guide/i);
        await expect(section.first()).toBeVisible();
    });

    test("has API Documentation section", async ({ page }) => {
        const section = page.getByText(/API Documentation/i);
        await expect(section.first()).toBeVisible();
    });

    test("has link or button to view API docs", async ({ page }) => {
        const apiLink = page.getByText(/VIEW API DOCUMENTATION/i)
            .or(page.locator('a[href*="api-docs"]'));
        await expect(apiLink.first()).toBeVisible();
    });
});

// ═════════════════════════════════════════════════════════════════════════
//  FAQ Page
// ═════════════════════════════════════════════════════════════════════════

test.describe("FAQ Page", () => {
    test.beforeEach(async ({ page }) => {
        await page.goto("/faq", { waitUntil: "networkidle" });
        await dismissCookieBanner(page);
    });

    test("page loads with NZDPU in the title", async ({ page }) => {
        await expect(page).toHaveTitle(/NZDPU/i);
    });

    test("displays 'Frequently Asked Questions' heading", async ({ page }) => {
        const heading = page.getByRole("heading", {
            name: /Frequently Asked Questions/i,
        });
        await expect(heading.first()).toBeVisible();
    });

    test("displays FAQ content or loading state", async ({ page }) => {
        // FAQ loads dynamically; either shows questions or loading indicator
        const content = page.getByText(/Loading FAQ data/i)
            .or(page.locator('[class*="accordion"], [class*="Accordion"], details, [class*="faq"]'));
        await expect(content.first()).toBeVisible();
    });
});

// ═════════════════════════════════════════════════════════════════════════
//  Contact Us Page
// ═════════════════════════════════════════════════════════════════════════

test.describe("Contact Us Page", () => {
    test.beforeEach(async ({ page }) => {
        await page.goto("/contact-us", { waitUntil: "networkidle" });
        await dismissCookieBanner(page);
    });

    test("page loads with NZDPU in the title", async ({ page }) => {
        await expect(page).toHaveTitle(/NZDPU/i);
    });

    test("displays 'Contact Us' heading", async ({ page }) => {
        const heading = page.getByRole("heading", { name: /Contact Us/i });
        await expect(heading.first()).toBeVisible();
    });

    test("references Documentation page for data questions", async ({ page }) => {
        const docLink = page.locator('a[href*="/documentation"]');
        await expect(docLink.first()).toBeVisible();
    });

    test("references FAQ page", async ({ page }) => {
        const faqLink = page.locator('a[href*="/faq"]');
        await expect(faqLink.first()).toBeVisible();
    });

    test("has General Information section", async ({ page }) => {
        const section = page.getByText(/General Information/i);
        await expect(section.first()).toBeVisible();
    });
});

// ═════════════════════════════════════════════════════════════════════════
//  Privacy Policy Page
// ═════════════════════════════════════════════════════════════════════════

test.describe("Privacy Policy Page", () => {
    test.beforeEach(async ({ page }) => {
        await page.goto("/privacy-policy", { waitUntil: "networkidle" });
        await dismissCookieBanner(page);
    });

    test("page loads with NZDPU in the title", async ({ page }) => {
        await expect(page).toHaveTitle(/NZDPU/i);
    });

    test("displays privacy-related content", async ({ page }) => {
        await expect(page.locator("body")).toContainText(/privacy/i);
    });
});

// ═════════════════════════════════════════════════════════════════════════
//  Terms of Service Page
// ═════════════════════════════════════════════════════════════════════════

test.describe("Terms of Service Page", () => {
    test.beforeEach(async ({ page }) => {
        await page.goto("/terms-of-service", { waitUntil: "networkidle" });
        await dismissCookieBanner(page);
    });

    test("page loads with NZDPU in the title", async ({ page }) => {
        await expect(page).toHaveTitle(/NZDPU/i);
    });

    test("displays terms-related content", async ({ page }) => {
        await expect(page.locator("body")).toContainText(/terms/i);
    });
});

// ═════════════════════════════════════════════════════════════════════════
//  News & Publications Page
// ═════════════════════════════════════════════════════════════════════════

test.describe("News & Publications Page", () => {
    test.beforeEach(async ({ page }) => {
        await page.goto("/news-and-publications", { waitUntil: "networkidle" });
        await dismissCookieBanner(page);
    });

    test("page loads with NZDPU in the title", async ({ page }) => {
        await expect(page).toHaveTitle(/NZDPU/i);
    });

    test("displays 'News & Publications' heading", async ({ page }) => {
        const heading = page.getByRole("heading", { name: /News.*Publications/i });
        await expect(heading.first()).toBeVisible();
    });

    test("has tab filter buttons: ALL, NEWS & UPDATES, PUBLICATIONS", async ({ page }) => {
        const allTab = page.getByRole("tab", { name: /^ALL$/i });
        const newsTab = page.getByRole("tab", { name: /NEWS.*UPDATES/i });
        const pubsTab = page.getByRole("tab", { name: /^PUBLICATIONS$/i });
        await expect(allTab).toBeVisible();
        await expect(newsTab).toBeVisible();
        await expect(pubsTab).toBeVisible();
    });

    test("has sort control (NEWEST)", async ({ page }) => {
        const sort = page.getByText(/NEWEST/i);
        await expect(sort.first()).toBeVisible();
    });

    test("displays article cards with READ MORE links", async ({ page }) => {
        const readMore = page.getByText(/READ MORE/i);
        const count = await readMore.count();
        expect(count).toBeGreaterThanOrEqual(1);
    });

    test("has pagination buttons", async ({ page }) => {
        const paginator = page.getByRole("button", { name: /page/i });
        const count = await paginator.count();
        expect(count).toBeGreaterThanOrEqual(1);
    });
});
