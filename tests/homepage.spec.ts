import { test, expect, Page } from "@playwright/test";

/**
 * --------------------------------------------------------------------------
 *  NZDPU Homepage — End-to-End Test Suite
 * --------------------------------------------------------------------------
 *  Target:  https://nzdpu.com/
 *  Stack:   React + MUI (Material UI)
 *  Notes:   - Page uses MUI components throughout.
 *           - Cookie consent banner may appear — dismissed in beforeEach.
 *           - SICS/NAZCA/Emissions content is rendered dynamically;
 *             some sections require scrolling into view.
 *           - "Visualizations temporarily unavailable" fallback messages
 *             may or may not appear depending on backend status.
 * --------------------------------------------------------------------------
 */

/** Dismiss the cookie consent banner if it appears. */
async function dismissCookieBanner(page: Page): Promise<void> {
    const allowBtn = page.getByRole("button", { name: /allow all/i });
    try {
        await allowBtn.waitFor({ state: "visible", timeout: 5000 });
        await allowBtn.click();
        await allowBtn.waitFor({ state: "hidden", timeout: 3000 });
    } catch {
        // Banner did not appear — that's fine.
    }
}

test.describe("NZDPU Homepage", () => {
    test.beforeEach(async ({ page }) => {
        await page.goto("/", { waitUntil: "networkidle" });
        await dismissCookieBanner(page);
    });

    // ═══════════════════════════════════════════════════════════════════
    //  Page Load & Meta
    // ═══════════════════════════════════════════════════════════════════

    test("page loads with correct title containing NZDPU", async ({ page }) => {
        await expect(page).toHaveTitle(/NZDPU/i);
    });

    test("hero heading 'Net-Zero Data Public Utility' is visible", async ({ page }) => {
        const heading = page.getByRole("heading", { name: /Net-Zero Data Public Utility/i });
        await expect(heading.first()).toBeVisible();
    });

    // ═══════════════════════════════════════════════════════════════════
    //  Top Navigation Bar
    // ═══════════════════════════════════════════════════════════════════

    test("navbar has COMPANIES link", async ({ page }) => {
        const link = page.getByRole("link", { name: /^COMPANIES$/i }).first();
        await expect(link).toBeVisible();
        await expect(link).toHaveAttribute("href", /\/companies/);
    });

    test("navbar has DATA EXPLORER link", async ({ page }) => {
        const link = page.getByRole("link", { name: /^DATA EXPLORER$/i }).first();
        await expect(link).toBeVisible();
        await expect(link).toHaveAttribute("href", /\/data-explorer/);
    });

    test("navbar has RESOURCES dropdown button", async ({ page }) => {
        const btn = page.getByRole("button", { name: /^RESOURCES$/i });
        await expect(btn).toBeVisible();
    });

    test("navbar has ABOUT dropdown button", async ({ page }) => {
        const btn = page.getByRole("button", { name: /^ABOUT$/i });
        await expect(btn).toBeVisible();
    });

    test("navbar has company search icon button", async ({ page }) => {
        const btn = page.getByRole("button", { name: /company search/i });
        await expect(btn).toBeVisible();
    });

    test("navbar has LOG IN/REGISTER button", async ({ page }) => {
        const btn = page.getByRole("button", { name: /log in\/register/i });
        await expect(btn).toBeVisible();
    });

    // ═══════════════════════════════════════════════════════════════════
    //  Homepage Statistics / KPI Counters
    // ═══════════════════════════════════════════════════════════════════

    test("displays total companies covered by NZDPU", async ({ page }) => {
        const stat = page.getByText(/companies covered by NZDPU/i);
        await expect(stat.first()).toBeVisible();
    });

    test("displays SICS® sector information count", async ({ page }) => {
        const stat = page.getByText(/companies with available SICS/i);
        await expect(stat.first()).toBeVisible();
    });

    test("displays NAZCA jurisdictions coverage", async ({ page }) => {
        const stat = page.getByText(/UNFCCC NAZCA jurisdictions covered/i);
        await expect(stat.first()).toBeVisible();
    });

    test("displays GHG emissions coverage percentage", async ({ page }) => {
        const stat = page.getByText(/direct global GHG emissions/i);
        await expect(stat.first()).toBeVisible();
    });

    // ═══════════════════════════════════════════════════════════════════
    //  LEARN MORE Buttons (SICS, NAZCA, Coverage, Targets)
    // ═══════════════════════════════════════════════════════════════════

    test("has LEARN MORE buttons for data sections", async ({ page }) => {
        const learnMoreBtns = page.getByRole("button", { name: /learn more/i });
        const count = await learnMoreBtns.count();
        expect(count).toBeGreaterThanOrEqual(1);
    });

    // ═══════════════════════════════════════════════════════════════════
    //  Companies Table on Homepage
    // ═══════════════════════════════════════════════════════════════════

    test("displays company results count", async ({ page }) => {
        const results = page.getByText(/Results/i);
        await expect(results.first()).toBeVisible();
    });

    test("displays EXPORT COMPANY LIST button", async ({ page }) => {
        const exportBtn = page.getByRole("button", { name: /export company list/i })
            .or(page.getByText(/EXPORT COMPANY LIST/i));
        await expect(exportBtn.first()).toBeVisible();
    });

    test("company table has Jurisdiction filter", async ({ page }) => {
        const filter = page.getByText("Jurisdiction").first();
        await expect(filter).toBeVisible();
    });

    test("company table has SICS Sector filter", async ({ page }) => {
        const filter = page.getByText("SICS Sector").first();
        await expect(filter).toBeVisible();
    });

    test("company table has Data Provider(s) filter", async ({ page }) => {
        const filter = page.getByText("Data Provider(s)").first();
        await expect(filter).toBeVisible();
    });

    test("company table rows display VIEW links", async ({ page }) => {
        const viewLinks = page.getByRole("link", { name: /^VIEW$/i });
        const count = await viewLinks.count();
        expect(count).toBeGreaterThanOrEqual(1);
    });

    test("company table has RESET button for filters", async ({ page }) => {
        const resetBtn = page.getByText(/^RESET$/i);
        await expect(resetBtn.first()).toBeVisible();
    });

    // ═══════════════════════════════════════════════════════════════════
    //  Engage with NZDPU Section
    // ═══════════════════════════════════════════════════════════════════

    test("displays 'Search and Browse Company Data' engage card", async ({ page }) => {
        const card = page.getByText(/Search and Browse Company Data/i);
        await expect(card.first()).toBeVisible();
    });

    test("displays 'Compare Emissions Data Across Companies' engage card", async ({ page }) => {
        const card = page.getByText(/Compare Emissions Data Across Companies/i);
        await expect(card.first()).toBeVisible();
    });

    test("displays 'Collaborate With Us' engage card", async ({ page }) => {
        const card = page.getByText(/Collaborate With Us/i);
        await expect(card.first()).toBeVisible();
    });

    test("displays 'Subscribe Today' engage card", async ({ page }) => {
        const card = page.getByText(/Subscribe Today/i);
        await expect(card.first()).toBeVisible();
    });

    test("has EXPLORE DATA link", async ({ page }) => {
        const link = page.getByRole("link", { name: /^EXPLORE DATA$/i });
        await expect(link.first()).toBeVisible();
    });

    test("has COLLABORATE WITH US link", async ({ page }) => {
        const link = page.getByRole("link", { name: /^COLLABORATE WITH US$/i });
        await expect(link.first()).toBeVisible();
    });

    // ═══════════════════════════════════════════════════════════════════
    //  NZDPU Governance Section
    // ═══════════════════════════════════════════════════════════════════

    test("displays NZDPU Governance section", async ({ page }) => {
        const governance = page.getByText(/NZDPU Governance/i);
        await expect(governance.first()).toBeVisible();
    });

    test("governance section mentions Climate Data Steering Committee", async ({ page }) => {
        const cdsc = page.getByText(/Climate Data Steering Committee/i);
        await expect(cdsc.first()).toBeVisible();
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

    test("footer has Subscribe to Our Newsletter section", async ({ page }) => {
        const subscribe = page.getByText(/Subscribe to Our Newsletter/i);
        await expect(subscribe.first()).toBeVisible();
    });

    test("footer has newsletter email input and SUBMIT button", async ({ page }) => {
        const submitBtn = page.getByRole("button", { name: /^SUBMIT$/i });
        await expect(submitBtn.first()).toBeVisible();
    });

    test("footer has Companies link", async ({ page }) => {
        const link = page.locator("footer").getByRole("link", { name: /^Companies$/i });
        await expect(link.first()).toBeVisible();
    });

    test("footer has Data Explorer link", async ({ page }) => {
        const link = page.locator("footer").getByRole("link", { name: /^Data Explorer$/i });
        await expect(link.first()).toBeVisible();
    });

    test("footer has Documentation link", async ({ page }) => {
        const link = page.locator("footer").getByRole("link", { name: /^Documentation$/i });
        await expect(link.first()).toBeVisible();
    });

    test("footer has FAQs link", async ({ page }) => {
        const link = page.locator("footer").getByRole("link", { name: /^FAQs$/i });
        await expect(link.first()).toBeVisible();
    });

    test("footer has About NZDPU link", async ({ page }) => {
        const link = page.locator("footer").getByRole("link", { name: /^About NZDPU$/i });
        await expect(link.first()).toBeVisible();
    });

    test("footer has Terms of Service link", async ({ page }) => {
        const link = page.locator("footer").getByRole("link", { name: /^Terms of Service$/i });
        await expect(link.first()).toBeVisible();
    });

    test("footer has Privacy Policy link", async ({ page }) => {
        const link = page.locator("footer").getByRole("link", { name: /Privacy Policy/i });
        await expect(link.first()).toBeVisible();
    });

    test("footer has LinkedIn social link", async ({ page }) => {
        const link = page.locator("footer").locator('a[href*="linkedin.com"]');
        await expect(link.first()).toBeVisible();
    });

    test("footer displays copyright notice", async ({ page }) => {
        const copyright = page.getByText(/© NZDPU/i);
        await expect(copyright.first()).toBeVisible();
    });
});
