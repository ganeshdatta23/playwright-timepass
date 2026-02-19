import { Page } from "@playwright/test";

/**
 * Injects a script to visualize clicks as red dots.
 * This makes video recordings much easier to follow.
 */
async function injectClickVisualizer(page: Page) {
    await page.addInitScript(() => {
        if ((window as any)._clickVisualizerInstalled) return;
        (window as any)._clickVisualizerInstalled = true;

        document.addEventListener("click", (event) => {
            const dot = document.createElement("div");
            dot.style.position = "absolute";
            dot.style.borderRadius = "50%";
            dot.style.border = "2px solid red";
            dot.style.width = "20px";
            dot.style.height = "20px";
            dot.style.left = `${event.pageX}px`;
            dot.style.top = `${event.pageY}px`;
            dot.style.transform = "translate(-50%, -50%)";
            dot.style.pointerEvents = "none";
            dot.style.zIndex = "999999";
            dot.style.transition = "all 0.3s ease-out";

            document.body.appendChild(dot);

            setTimeout(() => {
                dot.style.width = "40px";
                dot.style.height = "40px";
                dot.style.opacity = "0";
            }, 10);

            setTimeout(() => {
                dot.remove();
            }, 500);
        }, true); // Capture phase to catch all clicks
    });
}

/**
 * Attempts to dismiss the cookie consent banner by clicking "ALLOW ALL".
 */
export async function dismissCookieBanner(page: Page): Promise<void> {
    const allowBtn = page.getByRole("button", { name: /allow all/i });
    try {
        // Aggressive wait for robustness
        await allowBtn.waitFor({ state: "visible", timeout: 5000 });
        await allowBtn.click();
        await allowBtn.waitFor({ state: "hidden", timeout: 3000 });
    } catch (error) {
        // Banner did not appear or was already handled.
    }
}

/**
 * Standard setup for all tests:
 * 1. Dismisses cookie banner
 * 2. Injects visible click tracking for video recordings
 */
export async function setupBaseState(page: Page): Promise<void> {
    // Inject visualizer first so even cookie click is seen
    await injectClickVisualizer(page);
    await dismissCookieBanner(page);
}
