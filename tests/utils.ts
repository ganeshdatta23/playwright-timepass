import { Page, Locator } from "@playwright/test";

/**
 * Attempts to dismiss the cookie consent banner by clicking "ALLOW ALL".
 * 
 * Logic:
 * 1. Waits up to 5s for the banner (specifically the "ALLOW ALL" button).
 * 2. If found, clicks it.
 * 3. Waits for it to disappear.
 * 4. Silently catches errors if the banner doesn't appear (e.g. already dismissed).
 */
export async function dismissCookieBanner(page: Page): Promise<void> {
    const allowBtn = page.getByRole("button", { name: /allow all/i });

    try {
        // Check if visible first to avoid waiting 5s if not there? 
        // Actually waitFor is better for robustness against slow load.
        // If we want it "default", we should be aggressive.
        await allowBtn.waitFor({ state: "visible", timeout: 5000 });
        await allowBtn.click();
        // Wait for the overlay to be gone so it doesn't block other clicks
        await allowBtn.waitFor({ state: "hidden", timeout: 3000 });
    } catch (error) {
        // Banner did not appear or was already handled.
        // This is expected behavior for subsequent tests in same context.
    }
}
