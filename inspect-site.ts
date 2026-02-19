/**
 * NZDPU Site Inspector
 * Crawls every page and extracts exact DOM structure, text content,
 * selectors, and interactive elements for test authoring.
 */
import { chromium } from "@playwright/test";
import * as fs from "fs";

const PAGES = [
    { name: "Homepage", path: "/" },
    { name: "Companies", path: "/companies" },
    { name: "DataExplorer", path: "/data-explorer" },
    { name: "DataModelBlueprint", path: "/data-model-blueprint" },
    { name: "About", path: "/about" },
    { name: "Documentation", path: "/documentation" },
    { name: "FAQ", path: "/faq" },
    { name: "ContactUs", path: "/contact-us" },
    { name: "PrivacyPolicy", path: "/privacy-policy" },
    { name: "TermsOfService", path: "/terms-of-service" },
    { name: "NewsAndPublications", path: "/news-and-publications" },
];

async function inspectPage(page: any, pageName: string, path: string) {
    console.log(`\n${"=".repeat(80)}`);
    console.log(`INSPECTING: ${pageName} (${path})`);
    console.log("=".repeat(80));

    await page.goto(`https://nzdpu.com${path}`, { waitUntil: "networkidle", timeout: 30000 });
    await page.waitForTimeout(2000);

    // 1. Page title
    const title = await page.title();
    console.log(`\nTITLE: "${title}"`);

    // 2. All headings
    const headings = await page.evaluate(() => {
        const hTags = document.querySelectorAll("h1, h2, h3, h4, h5, h6");
        return Array.from(hTags).map((h) => ({
            tag: h.tagName.toLowerCase(),
            text: (h as HTMLElement).innerText?.trim().substring(0, 120),
            classes: (h as HTMLElement).className?.substring(0, 80),
        }));
    });
    console.log(`\nHEADINGS (${headings.length}):`);
    headings.forEach((h: any) => console.log(`  <${h.tag}> "${h.text}" [class="${h.classes}"]`));

    // 3. Navigation links
    const navLinks = await page.evaluate(() => {
        const nav = document.querySelector("nav") || document.querySelector("header");
        if (!nav) return [];
        const links = nav.querySelectorAll("a");
        return Array.from(links).map((a) => ({
            text: (a as HTMLAnchorElement).innerText?.trim(),
            href: (a as HTMLAnchorElement).getAttribute("href"),
            ariaLabel: (a as HTMLAnchorElement).getAttribute("aria-label"),
        }));
    });
    console.log(`\nNAV LINKS (${navLinks.length}):`);
    navLinks.forEach((l: any) => console.log(`  "${l.text}" -> ${l.href} [aria="${l.ariaLabel}"]`));

    // 4. All links on page
    const allLinks = await page.evaluate(() => {
        const links = document.querySelectorAll("a");
        return Array.from(links).map((a) => ({
            text: (a as HTMLAnchorElement).innerText?.trim().substring(0, 60),
            href: (a as HTMLAnchorElement).getAttribute("href"),
            role: (a as HTMLAnchorElement).getAttribute("role"),
        }));
    });
    console.log(`\nALL LINKS (${allLinks.length}):`);
    allLinks.forEach((l: any) => console.log(`  "${l.text}" -> ${l.href}`));

    // 5. Buttons
    const buttons = await page.evaluate(() => {
        const btns = document.querySelectorAll("button, [role='button']");
        return Array.from(btns).map((b) => ({
            text: (b as HTMLElement).innerText?.trim().substring(0, 60),
            type: (b as HTMLButtonElement).type,
            ariaLabel: (b as HTMLElement).getAttribute("aria-label"),
            classes: (b as HTMLElement).className?.substring(0, 80),
        }));
    });
    console.log(`\nBUTTONS (${buttons.length}):`);
    buttons.forEach((b: any) => console.log(`  "${b.text}" type=${b.type} [aria="${b.ariaLabel}"] [class="${b.classes}"]`));

    // 6. Form inputs
    const inputs = await page.evaluate(() => {
        const inp = document.querySelectorAll("input, select, textarea");
        return Array.from(inp).map((i) => ({
            tag: i.tagName.toLowerCase(),
            type: (i as HTMLInputElement).type,
            placeholder: (i as HTMLInputElement).placeholder,
            name: (i as HTMLInputElement).name,
            ariaLabel: i.getAttribute("aria-label"),
        }));
    });
    console.log(`\nINPUTS (${inputs.length}):`);
    inputs.forEach((i: any) => console.log(`  <${i.tag}> type="${i.type}" placeholder="${i.placeholder}" name="${i.name}" aria="${i.ariaLabel}"`));

    // 7. Images
    const images = await page.evaluate(() => {
        const imgs = document.querySelectorAll("img");
        return Array.from(imgs).map((img) => ({
            alt: (img as HTMLImageElement).alt,
            src: (img as HTMLImageElement).src?.substring(0, 80),
            width: (img as HTMLImageElement).width,
        }));
    });
    console.log(`\nIMAGES (${images.length}):`);
    images.forEach((i: any) => console.log(`  alt="${i.alt}" src="${i.src}" w=${i.width}`));

    // 8. Footer structure
    const footer = await page.evaluate(() => {
        const f = document.querySelector("footer");
        if (!f) return null;
        const links = f.querySelectorAll("a");
        return {
            text: (f as HTMLElement).innerText?.substring(0, 500),
            links: Array.from(links).map((a) => ({
                text: (a as HTMLAnchorElement).innerText?.trim(),
                href: (a as HTMLAnchorElement).getAttribute("href"),
            })),
        };
    });
    if (footer) {
        console.log(`\nFOOTER TEXT:\n  ${footer.text.substring(0, 300)}`);
        console.log(`\nFOOTER LINKS (${footer.links.length}):`);
        footer.links.forEach((l: any) => console.log(`  "${l.text}" -> ${l.href}`));
    }

    // 9. Key text content (first 3000 chars of body)
    const bodyText = await page.evaluate(() => {
        return document.body?.innerText?.substring(0, 3000);
    });
    console.log(`\nPAGE TEXT (first 3000 chars):\n${bodyText}`);

    // 10. Take screenshot
    await page.screenshot({ path: `inspector-screenshots/${pageName}.png`, fullPage: true });
    console.log(`\nScreenshot saved: inspector-screenshots/${pageName}.png`);
}

(async () => {
    fs.mkdirSync("inspector-screenshots", { recursive: true });
    const browser = await chromium.launch({ headless: true });
    const context = await browser.newContext({ viewport: { width: 1440, height: 900 } });
    const page = await context.newPage();

    for (const p of PAGES) {
        try {
            await inspectPage(page, p.name, p.path);
        } catch (err) {
            console.error(`ERROR on ${p.name}: ${err}`);
        }
    }

    await browser.close();
    console.log("\n\nDONE — All pages inspected.");
})();
