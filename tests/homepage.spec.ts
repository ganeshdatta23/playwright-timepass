import { test, expect } from "@playwright/test";
import { setupBaseState } from "./utils";

/**
 * --------------------------------------------------------------------------
 *  NZDPU Homepage — End-to-End Test Suite
 * --------------------------------------------------------------------------
 *  Target:  https://nzdpu.com/
 *  Stack:   React + MUI (Material UI)
 *
 *  Verified against live site structure (Feb 2026):
 *  - H1: "Net-Zero Data Public Utility"
 *  - Engage cards with links: Explore companies, Explore DATA,
 *    COLLABORATE WITH US, SUBSCRIBE
 *  - NZDPU Governance and Collaborators sections
 *  - Consistent footer across all pages
 * --------------------------------------------------------------------------
 */

test.describe("NZDPU Homepage", () => {
    test.beforeEach(async ({ page }) => {
        await page.goto("/", { waitUntil: "networkidle" });
        await setupBaseState(page);
    });

    // ═══════════════════════════════════════════════════════════════════
    //  Page Load
    // ═══════════════════════════════════════════════════════════════════

    test("page loads with NZDPU in the title", async ({ page }) => {
        await expect(page).toHaveTitle(/NZDPU/i);
    });

    test("URL is the homepage", async ({ page }) => {
        expect(page.url()).toMatch(/https:\/\/nzdpu\.com\/?$/);
    });

    // ═══════════════════════════════════════════════════════════════════
    //  Hero Section
    // ═══════════════════════════════════════════════════════════════════

    test("displays 'Net-Zero Data Public Utility' heading", async ({ page }) => {
        const heading = page.getByRole("heading", {
            name: /Net-Zero Data Public Utility/i,
        });
        await expect(heading.first()).toBeVisible();
    });

    test("displays tagline about centralized repository", async ({ page }) => {
        const tagline = page.getByText(
            /global centralized repository of company-level greenhouse gas/i
        );
        await expect(tagline.first()).toBeVisible();
    });

    test("displays 'Free. Transparent. Accessible to all.' text", async ({ page }) => {
        const text = page.getByText(/Free\. Transparent\. Accessible to all/i);
        await expect(text.first()).toBeVisible();
    });

    // ═══════════════════════════════════════════════════════════════════
    //  Header Navigation
    // ═══════════════════════════════════════════════════════════════════

    test("header has COMPANIES link", async ({ page }) => {
        const link = page.getByRole("link", { name: /^COMPANIES$/i });
        await expect(link.first()).toBeVisible();
    });

    test("header has data explorer link", async ({ page }) => {
        const link = page.getByRole("link", { name: /data explorer/i });
        await expect(link.first()).toBeVisible();
    });

    // ═══════════════════════════════════════════════════════════════════
    //  Engage Section
    // ═══════════════════════════════════════════════════════════════════

    test("has 'Engage with NZDPU' section", async ({ page }) => {
        const heading = page.getByText(/Engage with NZDPU/i);
        await expect(heading.first()).toBeVisible();
    });

    test("Explore companies link points to /companies", async ({ page }) => {
        const link = page.getByRole("link", { name: /Explore companies/i });
        await expect(link.first()).toBeVisible();
        await expect(link.first()).toHaveAttribute("href", /\/companies/);
    });

    test("Explore DATA link points to /data-explorer", async ({ page }) => {
        const link = page.getByRole("link", { name: /Explore DATA/i });
        await expect(link.first()).toBeVisible();
        await expect(link.first()).toHaveAttribute("href", /\/data-explorer/);
    });

    test("COLLABORATE WITH US link points to /contact-us", async ({ page }) => {
        const link = page.getByRole("link", { name: /COLLABORATE WITH US/i });
        await expect(link.first()).toBeVisible();
        await expect(link.first()).toHaveAttribute("href", /\/contact-us/);
    });

    test("SUBSCRIBE link is present", async ({ page }) => {
        const link = page.getByRole("link", { name: /SUBSCRIBE/i });
        await expect(link.first()).toBeVisible();
    });

    // ═══════════════════════════════════════════════════════════════════
    //  Governance Section
    // ═══════════════════════════════════════════════════════════════════

    test("displays NZDPU Governance section", async ({ page }) => {
        const heading = page.getByText(/NZDPU Governance/i);
        await expect(heading.first()).toBeVisible();
    });

    test("mentions Climate Data Steering Committee", async ({ page }) => {
        const text = page.getByText(/Climate Data Steering Committee/i);
        await expect(text.first()).toBeVisible();
    });

    // ═══════════════════════════════════════════════════════════════════
    //  Collaborators Section
    // ═══════════════════════════════════════════════════════════════════

    test("displays Collaborators section", async ({ page }) => {
        const heading = page.getByText(/Collaborators/i);
        await expect(heading.first()).toBeVisible();
    });

    test("mentions CDP collaborator", async ({ page }) => {
        const link = page.locator('a[href*="cdp.net"]');
        await expect(link.first()).toBeVisible();
    });

    // ═══════════════════════════════════════════════════════════════════
    //  Footer
    // ═══════════════════════════════════════════════════════════════════

    test("footer displays mission statement", async ({ page }) => {
        const mission = page.getByText(
            /trusted, central source of company-level climate/i
        );
        await expect(mission.first()).toBeVisible();
    });

    test("footer has Companies link", async ({ page }) => {
        const link = page.locator("footer").getByRole("link", { name: /^Companies$/i });
        await expect(link.first()).toBeVisible();
    });

    test("footer has Privacy Policy link", async ({ page }) => {
        const link = page.locator("footer").getByRole("link", { name: /Privacy Policy/i });
        await expect(link.first()).toBeVisible();
    });

    test("footer has Terms of Service link", async ({ page }) => {
        const link = page.locator("footer").getByRole("link", { name: /Terms of Service/i });
        await expect(link.first()).toBeVisible();
    });
});
