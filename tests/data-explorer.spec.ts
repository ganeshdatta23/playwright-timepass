import { test, expect } from "@playwright/test";
import { setupBaseState } from "./utils";

/**
 * --------------------------------------------------------------------------
 *  NZDPU Data Explorer — End-to-End Test Suite
 * --------------------------------------------------------------------------
 *  Target:  https://nzdpu.com/data-explorer
 *  Stack:   React + MUI (Material UI)
 *
 *  Verified against live site (Feb 2026):
 *  - H1: "Data Explorer"
 *  - "Help Me Get Started" guided search section
 *  - "Advanced Search" section
 * --------------------------------------------------------------------------
 */

test.describe("NZDPU Data Explorer", () => {
    test.beforeEach(async ({ page }) => {
        await page.goto("/data-explorer", { waitUntil: "networkidle" });
        await setupBaseState(page);
    });

    // ═══════════════════════════════════════════════════════════════════
    //  Page Load
    // ═══════════════════════════════════════════════════════════════════

    test("page loads with NZDPU in the title", async ({ page }) => {
        await expect(page).toHaveTitle(/NZDPU/i);
    });

    test("URL is /data-explorer", async ({ page }) => {
        expect(page.url()).toContain("/data-explorer");
    });

    test("displays 'Data Explorer' heading", async ({ page }) => {
        const heading = page.getByRole("heading", { name: /Data Explorer/i });
        await expect(heading.first()).toBeVisible();
    });

    // ═══════════════════════════════════════════════════════════════════
    //  Help Me Get Started (Guided Search)
    // ═══════════════════════════════════════════════════════════════════

    test("displays 'Help Me Get Started' section", async ({ page }) => {
        const section = page.getByText(/Help Me Get Started/i);
        await expect(section.first()).toBeVisible();
    });

    test("guided search has 'I want to see data from' prompt", async ({ page }) => {
        const prompt = page.getByText(/I want to see data from/i);
        await expect(prompt.first()).toBeVisible();
    });

    // ═══════════════════════════════════════════════════════════════════
    //  Advanced Search
    // ═══════════════════════════════════════════════════════════════════

    test("displays 'Advanced Search' section", async ({ page }) => {
        const section = page.getByText(/Advanced Search/i);
        await expect(section.first()).toBeVisible();
    });

    test("Advanced Search mentions NZDPU database", async ({ page }) => {
        const text = page.getByText(/Explore the full NZDPU database/i);
        await expect(text.first()).toBeVisible();
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
