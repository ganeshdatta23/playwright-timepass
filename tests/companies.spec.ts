import { test, expect } from "@playwright/test";
import { setupBaseState } from "./utils";

/**
 * --------------------------------------------------------------------------
 *  NZDPU Companies Page — End-to-End Test Suite
 * --------------------------------------------------------------------------
 *  Target:  https://nzdpu.com/companies
 *  Stack:   React + MUI (Material UI)
 *
 *  Verified against live site (Feb 2026):
 *  - H1: "Companies"
 *  - "N Results" counter
 *  - SICS® classification info section
 *  - NAZCA Jurisdictions info section
 *  - Company table (may show 0 results in static fetch)
 * --------------------------------------------------------------------------
 */

test.describe("NZDPU Companies Page", () => {
    test.beforeEach(async ({ page }) => {
        await page.goto("/companies", { waitUntil: "networkidle" });
        await setupBaseState(page);
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

    test("displays 'Companies' heading", async ({ page }) => {
        const heading = page.getByRole("heading", { name: /^Companies$/i });
        await expect(heading.first()).toBeVisible();
    });

    // ═══════════════════════════════════════════════════════════════════
    //  Results & Table
    // ═══════════════════════════════════════════════════════════════════

    test("displays results count", async ({ page }) => {
        const results = page.getByText(/Results/i);
        await expect(results.first()).toBeVisible();
    });

    // ═══════════════════════════════════════════════════════════════════
    //  SICS Classification Info
    // ═══════════════════════════════════════════════════════════════════

    test("mentions SICS classification system", async ({ page }) => {
        const sics = page.getByText(/Sustainable Industry Classification System/i);
        await expect(sics.first()).toBeVisible();
    });

    test("has SICS link to sasb.org", async ({ page }) => {
        const link = page.locator('a[href*="sasb.org"]');
        await expect(link.first()).toBeVisible();
    });

    // ═══════════════════════════════════════════════════════════════════
    //  NAZCA Jurisdictions Info
    // ═══════════════════════════════════════════════════════════════════

    test("mentions NAZCA Jurisdictions", async ({ page }) => {
        const nazca = page.getByText(/Non-State Actor Zone for Climate Action/i);
        await expect(nazca.first()).toBeVisible();
    });

    // ═══════════════════════════════════════════════════════════════════
    //  Navigation Consistency
    // ═══════════════════════════════════════════════════════════════════

    test("header has COMPANIES link", async ({ page }) => {
        const link = page.getByRole("link", { name: /^COMPANIES$/i });
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
});
