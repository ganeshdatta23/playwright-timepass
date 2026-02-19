import { test, expect, Page } from "@playwright/test";
import { dismissCookieBanner } from "./utils";

/**
 * --------------------------------------------------------------------------
 *  NZDPU Data Model Blueprint — End-to-End Test Suite
 * --------------------------------------------------------------------------
 *  Target:  https://nzdpu.com/data-model-blueprint
 *  Stack:   React + MUI (Material UI)
 *  Notes:   - Two data model cards: IFRS S2 (ISSB) and ESRS E1 (EFRAG).
 *           - Cards link to sub-pages with schema tables.
 *           - "View Data Model" may be a link or button.
 *           - Sub-pages load schema via tabs (emissions, targets, etc.).
 * --------------------------------------------------------------------------
 */

test.describe("NZDPU Data Model Blueprint", () => {
    test.beforeEach(async ({ page }) => {
        await page.goto("/data-model-blueprint", { waitUntil: "networkidle" });
        await dismissCookieBanner(page);
    });

    // ═══════════════════════════════════════════════════════════════════
    //  Page Load
    // ═══════════════════════════════════════════════════════════════════

    test("page loads with NZDPU in the title", async ({ page }) => {
        await expect(page).toHaveTitle(/NZDPU/i);
    });

    test("displays 'Data Model Blueprint' heading", async ({ page }) => {
        const heading = page.getByRole("heading", { name: /Data Model Blueprint/i });
        await expect(heading.first()).toBeVisible();
    });

    test("displays 'Supporting Global Standards' section", async ({ page }) => {
        const section = page.getByText(/Supporting Global Standards/i);
        await expect(section.first()).toBeVisible();
    });

    // ═══════════════════════════════════════════════════════════════════
    //  IFRS S2 (ISSB) Card
    // ═══════════════════════════════════════════════════════════════════

    test("displays IFRS S2 by ISSB card", async ({ page }) => {
        const card = page.getByText(/IFRS S2 by ISSB/i);
        await expect(card.first()).toBeVisible();
    });

    test("IFRS S2 card describes the ISSB standard", async ({ page }) => {
        const desc = page.getByText(/Issued by ISSB/i);
        await expect(desc.first()).toBeVisible();
    });

    test("IFRS S2 card shows last-updated date", async ({ page }) => {
        const date = page.getByText(/DATA MODEL LAST UPDATED/i);
        await expect(date.first()).toBeVisible();
    });

    // ═══════════════════════════════════════════════════════════════════
    //  ESRS E1 (EFRAG) Card
    // ═══════════════════════════════════════════════════════════════════

    test("displays ESRS E1 by EFRAG card", async ({ page }) => {
        const card = page.getByText(/ESRS E1 by EFRAG/i);
        await expect(card.first()).toBeVisible();
    });

    test("ESRS E1 card references CSRD", async ({ page }) => {
        const desc = page.getByText(/Corporate Sustainability Reporting Directive/i);
        await expect(desc.first()).toBeVisible();
    });

    // ═══════════════════════════════════════════════════════════════════
    //  "View Data Model" Actions
    // ═══════════════════════════════════════════════════════════════════

    test("has clickable 'View Data Model' element for ISSB", async ({ page }) => {
        // Could be a link or MUI button
        const viewModel = page.getByText(/View Data Model/i).first();
        await expect(viewModel).toBeVisible();
    });

    test("tapping View Data Model navigates to a sub-page", async ({ page }) => {
        // Note: This test might be flaky if multiple "View Data Model" exist.
        // We target the first one, which is usually ISSB.
        const viewModel = page.getByText(/View Data Model/i).first();
        await viewModel.click();
        await page.waitForURL(/data-model-blueprint\/(issb|efrag)/, { timeout: 10000 });
        expect(page.url()).toMatch(/data-model-blueprint\/(issb|efrag)/);
    });

    // ═══════════════════════════════════════════════════════════════════
    //  "More to Come" Section
    // ═══════════════════════════════════════════════════════════════════

    test("displays 'More to Come' section", async ({ page }) => {
        const section = page.getByText(/More to Come/i);
        await expect(section.first()).toBeVisible();
    });

    // ═══════════════════════════════════════════════════════════════════
    //  Sub-page: ISSB Data Model
    // ═══════════════════════════════════════════════════════════════════

    test("ISSB data model sub-page renders content", async ({ page }) => {
        await page.goto(
            "/data-model-blueprint/issb?schemaTab=GREENHOUSE_GASES&dataModel=issb&tab=emissions",
            { waitUntil: "networkidle" }
        );
        await dismissCookieBanner(page); // Ensure no banner blocks view
        const body = page.locator("body");
        await expect(body).not.toBeEmpty();
        // Should have some text content related to emissions
        await expect(body).toContainText(/.+/);
    });

    // ═══════════════════════════════════════════════════════════════════
    //  Sub-page: EFRAG Data Model
    // ═══════════════════════════════════════════════════════════════════

    test("EFRAG data model sub-page renders content", async ({ page }) => {
        await page.goto(
            "/data-model-blueprint/efrag?schemaTab=TOTAL_EMISSIONS&dataModel=efrag&tab=emissions",
            { waitUntil: "networkidle" }
        );
        await dismissCookieBanner(page); // Ensure no banner blocks view
        const body = page.locator("body");
        await expect(body).not.toBeEmpty();
        await expect(body).toContainText(/.+/);
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
});
