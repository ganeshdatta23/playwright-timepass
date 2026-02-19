import { test, expect, Page } from "@playwright/test";
import { dismissCookieBanner } from "./utils";

/**
 * --------------------------------------------------------------------------
 *  NZDPU Data Explorer — End-to-End Test Suite
 * --------------------------------------------------------------------------
 *  Target:  https://nzdpu.com/data-explorer
 *  Stack:   React + MUI (Material UI)
 *  Notes:   - "Help Me Get Started" guided wizard with filter dropdowns.
 *           - "Advanced Search" section for full database queries.
 *           - MUI Select / Autocomplete components for filter inputs.
 * --------------------------------------------------------------------------
 */

test.describe("NZDPU Data Explorer", () => {
    test.beforeEach(async ({ page }) => {
        await page.goto("/data-explorer", { waitUntil: "networkidle" });
        await dismissCookieBanner(page);
    });

    // ═══════════════════════════════════════════════════════════════════
    //  Page Load
    // ═══════════════════════════════════════════════════════════════════

    test("page loads with NZDPU in the title", async ({ page }) => {
        await expect(page).toHaveTitle(/NZDPU/i);
    });

    test("displays 'Data Explorer' heading", async ({ page }) => {
        const heading = page.getByRole("heading", { name: /Data Explorer/i });
        await expect(heading.first()).toBeVisible();
    });

    test("URL is /data-explorer", async ({ page }) => {
        expect(page.url()).toContain("/data-explorer");
    });

    // ═══════════════════════════════════════════════════════════════════
    //  Guided Search — "Help Me Get Started"
    // ═══════════════════════════════════════════════════════════════════

    test("displays 'Help Me Get Started' section", async ({ page }) => {
        const section = page.getByText(/Help Me Get Started/i);
        await expect(section.first()).toBeVisible();
    });

    test("displays guided prompt 'I want to see data from...'", async ({ page }) => {
        const prompt = page.getByText(/I want to see data from/i);
        await expect(prompt.first()).toBeVisible();
    });

    test("guided search has interactive dropdown/select elements", async ({ page }) => {
        // MUI Select components rendered as divs with role=combobox or aria-haspopup
        const dropdowns = page.locator(
            '[role="combobox"], [aria-haspopup="listbox"], .MuiSelect-select, .MuiAutocomplete-root'
        );
        const count = await dropdowns.count();
        expect(count).toBeGreaterThanOrEqual(1);
    });

    // ═══════════════════════════════════════════════════════════════════
    //  Advanced Search
    // ═══════════════════════════════════════════════════════════════════

    test("displays 'Advanced Search' section", async ({ page }) => {
        const section = page.getByText(/Advanced Search/i);
        await expect(section.first()).toBeVisible();
    });

    test("displays 'Explore the full NZDPU database' text", async ({ page }) => {
        const text = page.getByText(/Explore the full NZDPU database/i);
        await expect(text.first()).toBeVisible();
    });

    // ═══════════════════════════════════════════════════════════════════
    //  Navigation from Data Explorer
    // ═══════════════════════════════════════════════════════════════════

    test("can navigate to Companies page via navbar", async ({ page }) => {
        const companiesLink = page.getByRole("link", { name: /^COMPANIES$/i }).first();
        await companiesLink.click();
        await expect(page).toHaveURL(/\/companies/);
    });

    // ═══════════════════════════════════════════════════════════════════
    //  Footer Consistency
    // ═══════════════════════════════════════════════════════════════════

    test("footer displays mission statement", async ({ page }) => {
        const mission = page.getByText(
            /trusted, central source of company-level climate/i
        );
        await expect(mission.first()).toBeVisible();
    });

    test("footer displays copyright", async ({ page }) => {
        const copyright = page.getByText(/© NZDPU/i);
        await expect(copyright.first()).toBeVisible();
    });
});
