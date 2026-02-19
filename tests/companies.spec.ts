import { test, expect, Page } from "@playwright/test";
import { dismissCookieBanner } from "./utils";

/**
 * --------------------------------------------------------------------------
 *  NZDPU Companies Page — End-to-End Test Suite
 * --------------------------------------------------------------------------
 *  Target:  https://nzdpu.com/companies
 *  Stack:   React + MUI (Material UI)
 *  Notes:   - Cookie consent banner is dismissed in beforeEach.
 *           - Company list is a paginated MUI table (25 rows per page).
 *           - Filters: Jurisdiction, SICS Sector, Data Provider(s).
 *           - SICS/NAZCA info accordions with LEARN MORE expand buttons.
 *           - Company rows have VIEW link navigating to detail page.
 * --------------------------------------------------------------------------
 */

test.describe("NZDPU Companies Page", () => {
    test.beforeEach(async ({ page }) => {
        await page.goto("/companies", { waitUntil: "networkidle" });
        await dismissCookieBanner(page);
    });

    // ═══════════════════════════════════════════════════════════════════
    //  Page Load
    // ═══════════════════════════════════════════════════════════════════

    test("page loads with NZDPU in the title", async ({ page }) => {
        await expect(page).toHaveTitle(/NZDPU/i);
    });

    test("URL is /companies", async ({ page }) => {
        expect(page.url()).toContain("/companies");
    });

    // ═══════════════════════════════════════════════════════════════════
    //  Company List & Results Count
    // ═══════════════════════════════════════════════════════════════════

    test("displays results count", async ({ page }) => {
        const results = page.getByText(/Results/i);
        await expect(results.first()).toBeVisible();
    });

    test("displays EXPORT COMPANY LIST button", async ({ page }) => {
        const exportBtn = page.getByText(/EXPORT COMPANY LIST/i);
        await expect(exportBtn.first()).toBeVisible();
    });

    // ═══════════════════════════════════════════════════════════════════
    //  Filters
    // ═══════════════════════════════════════════════════════════════════

    test("has Jurisdiction filter column", async ({ page }) => {
        const filter = page.getByText("Jurisdiction").first();
        await expect(filter).toBeVisible();
    });

    test("has SICS Sector filter column", async ({ page }) => {
        const filter = page.getByText("SICS Sector").first();
        await expect(filter).toBeVisible();
    });

    test("has Data Provider(s) filter column", async ({ page }) => {
        const filter = page.getByText("Data Provider(s)").first();
        await expect(filter).toBeVisible();
    });

    test("has RESET button for clearing filters", async ({ page }) => {
        const resetBtn = page.getByText(/^RESET$/i);
        await expect(resetBtn.first()).toBeVisible();
    });

    // ═══════════════════════════════════════════════════════════════════
    //  Company Table Rows
    // ═══════════════════════════════════════════════════════════════════

    test("renders company rows with VIEW links", async ({ page }) => {
        const viewLinks = page.getByRole("link", { name: /^VIEW$/i });
        const count = await viewLinks.count();
        expect(count).toBeGreaterThanOrEqual(1);
    });

    test("VIEW link navigates to company detail page", async ({ page }) => {
        const firstViewLink = page.getByRole("link", { name: /^VIEW$/i }).first();
        const href = await firstViewLink.getAttribute("href");
        expect(href).toMatch(/\/companies\/\d+/);
    });

    test("company rows display company name", async ({ page }) => {
        // First company row should contain some text (company name)
        const tableBody = page.locator("table tbody, [role='rowgroup']").first();
        await expect(tableBody).not.toBeEmpty();
    });

    // ═══════════════════════════════════════════════════════════════════
    //  Pagination
    // ═══════════════════════════════════════════════════════════════════

    test("displays pagination with Rows per page", async ({ page }) => {
        const rowsPerPage = page.getByText(/Rows per page/i);
        await expect(rowsPerPage.first()).toBeVisible();
    });

    test("displays page count (e.g. 'of N pages')", async ({ page }) => {
        const pageCount = page.getByText(/of \d+ pages/i);
        await expect(pageCount.first()).toBeVisible();
    });

    test("has pagination next page button", async ({ page }) => {
        const nextBtn = page.getByRole("button", { name: /next/i });
        await expect(nextBtn).toBeVisible();
    });

    // ═══════════════════════════════════════════════════════════════════
    //  SICS & NAZCA Info Sections
    // ═══════════════════════════════════════════════════════════════════

    test("has LEARN MORE button for SICS classification", async ({ page }) => {
        const learnMore = page.getByRole("button", {
            name: /learn more about.*SICS/i,
        });
        await expect(learnMore.first()).toBeVisible();
    });

    // ═══════════════════════════════════════════════════════════════════
    //  Navigation Bar Consistency
    // ═══════════════════════════════════════════════════════════════════

    test("navbar is visible on Companies page", async ({ page }) => {
        const companiesLink = page.getByRole("link", { name: /^COMPANIES$/i }).first();
        await expect(companiesLink).toBeVisible();
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
