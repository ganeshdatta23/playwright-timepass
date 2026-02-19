import { Page } from "@playwright/test";

/**
 * Script injected into the page to visualize mouse movement, clicks,
 * and highlight interacted elements.
 *
 * Creates:
 *  - A red dot that follows the mouse cursor
 *  - A ripple animation on every click
 *  - A red outline box around the clicked element (persists ~1s)
 *
 * This makes Playwright video recordings and screenshots much easier
 * to follow — you can see exactly where the mouse is and what was clicked.
 */
function clickVisualizerScript() {
    if ((window as any).__clickVizInstalled) return;
    (window as any).__clickVizInstalled = true;

    // ── CSS for cursor, ripple, and element highlight ─────────────────
    const style = document.createElement("style");
    style.textContent = `
        #__pw_cursor {
            position: fixed;
            width: 20px;
            height: 20px;
            border-radius: 50%;
            background: rgba(255, 0, 0, 0.6);
            border: 2px solid red;
            pointer-events: none;
            z-index: 2147483647;
            transform: translate(-50%, -50%);
            transition: width 0.15s, height 0.15s, background 0.15s;
            top: -100px;
            left: -100px;
        }

        @keyframes __pw_ripple {
            from { width: 0; height: 0; opacity: 1; border-width: 3px; }
            to   { width: 50px; height: 50px; opacity: 0; border-width: 1px; }
        }
        .__pw_ripple {
            position: fixed;
            border-radius: 50%;
            border: 3px solid red;
            pointer-events: none;
            z-index: 2147483646;
            transform: translate(-50%, -50%);
            animation: __pw_ripple 0.5s ease-out forwards;
        }

        .__pw_element_highlight {
            outline: 3px solid red !important;
            outline-offset: 2px !important;
            box-shadow: 0 0 8px 2px rgba(255, 0, 0, 0.4) !important;
            transition: outline-color 0.3s, box-shadow 0.3s;
        }
    `;
    document.head.appendChild(style);

    // ── Cursor dot ───────────────────────────────────────────────────
    const cursor = document.createElement("div");
    cursor.id = "__pw_cursor";
    document.body.appendChild(cursor);

    document.addEventListener(
        "mousemove",
        (e: MouseEvent) => {
            cursor.style.left = e.clientX + "px";
            cursor.style.top = e.clientY + "px";
        },
        true
    );

    // ── Mouse down / up feedback ─────────────────────────────────────
    document.addEventListener(
        "mousedown",
        () => {
            cursor.style.width = "14px";
            cursor.style.height = "14px";
            cursor.style.background = "rgba(255, 0, 0, 0.95)";
        },
        true
    );

    document.addEventListener(
        "mouseup",
        () => {
            cursor.style.width = "20px";
            cursor.style.height = "20px";
            cursor.style.background = "rgba(255, 0, 0, 0.6)";
        },
        true
    );

    // ── Click: ripple + element highlight ─────────────────────────────
    document.addEventListener(
        "click",
        (e: MouseEvent) => {
            // Ripple at click position
            const ripple = document.createElement("div");
            ripple.className = "__pw_ripple";
            ripple.style.left = e.clientX + "px";
            ripple.style.top = e.clientY + "px";
            document.body.appendChild(ripple);
            setTimeout(() => ripple.remove(), 600);

            // Highlight the clicked element with a red box
            const target = e.target as HTMLElement;
            if (target && target !== document.body && target !== document.documentElement) {
                target.classList.add("__pw_element_highlight");
                setTimeout(() => {
                    target.classList.remove("__pw_element_highlight");
                }, 1500);
            }
        },
        true
    );
}

/**
 * Injects the click visualizer into the page so clicks, mouse
 * movement, and element highlights are visible in video recordings
 * and screenshots.
 *
 * Uses BOTH:
 *  - page.evaluate()     → injects into the CURRENT page immediately
 *  - page.addInitScript() → re-injects on any FUTURE navigations
 */
async function injectClickVisualizer(page: Page) {
    // Register for future navigations within this test
    await page.addInitScript(clickVisualizerScript);

    // Inject into the current (already-loaded) page right now
    await page.evaluate(clickVisualizerScript);
}

/**
 * Attempts to dismiss the cookie consent banner by clicking "ALLOW ALL".
 */
export async function dismissCookieBanner(page: Page): Promise<void> {
    const allowBtn = page.getByRole("button", { name: /allow all/i });
    try {
        await allowBtn.waitFor({ state: "visible", timeout: 5000 });
        await allowBtn.click();
        await allowBtn.waitFor({ state: "hidden", timeout: 3000 });
    } catch {
        // Banner did not appear or was already handled.
    }
}

/**
 * Standard setup for all tests:
 * 1. Injects click visualizer (red cursor dot + ripple + element highlight)
 * 2. Dismisses cookie consent banner
 *
 * Call this in beforeEach AFTER page.goto().
 */
export async function setupBaseState(page: Page): Promise<void> {
    await injectClickVisualizer(page);
    await dismissCookieBanner(page);
}
