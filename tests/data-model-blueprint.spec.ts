import { test, expect } from "@playwright/test";
import { setupBaseState } from "./utils";

/**
 * --------------------------------------------------------------------------
 *  NZDPU Data Model Blueprint — End-to-End Test Suite
 * --------------------------------------------------------------------------
 *  Target:  https://nzdpu.com/data-model-blueprint
 *  Stack:   React + MUI (Material UI)
 *
 *  Verified against live site (Feb 2026):
 *  - H1: "Data Model Blueprint"
 *  - "Supporting Global Standards" section
 *  - IFRS S2 (ISSB) card + "View Data Model" link
 *  - ESRS E1 (EFRAG) card + "View Data Model" link
 *  - "More to Come" section
 * --------------------------------------------------------------------------
 */

test.describe("NZDPU Data Model Blueprint", () => {
    test.beforeEach(async ({ page }) => {
        await page.goto("/data-model-blueprint", { waitUntil: "networkidle" });
        await setupBaseState(page);
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

    test("IFRS S2 card describes ISSB standard", async ({ page }) => {
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

    test("has 'View Data Model' links", async ({ page }) => {
        const viewModel = page.getByRole("link", { name: /View Data Model/i });
        const count = await viewModel.count();
        expect(count).toBeGreaterThanOrEqual(2); // ISSB + EFRAG
    });

    test("View Data Model link navigates to sub-page", async ({ page }) => {
        const viewModel = page.getByRole("link", { name: /View Data Model/i }).first();
        const href = await viewModel.getAttribute("href");
        expect(href).toMatch(/data-model-blueprint\/(issb|efrag)/);
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
        await setupBaseState(page);
        const body = page.locator("body");
        await expect(body).not.toBeEmpty();
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
        await setupBaseState(page);
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
