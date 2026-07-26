/*
 * Vencord, a Discord client mod
 * Copyright (c) 2026 Vendicated and contributors
 * SPDX-License-Identifier: GPL-3.0-or-later
 */

import definePlugin from "@utils/types";

const TOOLTIP_ID = "vc-title-tooltips";
const SHOW_DELAY = 250; // ms before showing
const HIDE_DELAY = 80; // ms before hiding (prevents flicker)
const MAX_LEN = 500; // truncate very long URLs

let tooltip: HTMLDivElement | null = null;
let showTimer: number | null = null;
let hideTimer: number | null = null;
let currentTarget: Element | null = null;

function ensureTooltip() {
    if (tooltip) return tooltip;

    tooltip = document.createElement("div");
    tooltip.id = TOOLTIP_ID;
    tooltip.style.cssText = `
        position: fixed;
        z-index: 100000;
        max-width: 420px;
        padding: 6px 10px;
        border-radius: 5px;
        background: var(--background-floating, #111214);
        color: var(--text-normal, #dbdee1);
        border: 1px solid var(--background-modifier-accent, #3f4147);
        font-size: 13px;
        line-height: 1.35;
        font-family: var(--font-primary, Whitney, "Helvetica Neue", Helvetica, Arial, sans-serif);
        box-shadow: 0 4px 12px rgba(0,0,0,.45);
        pointer-events: none;
        white-space: pre-wrap;
        word-break: break-all;
        opacity: 0;
        transition: opacity .08s ease;
        display: none;
    `;
    document.body.appendChild(tooltip);

    return tooltip;
}

function truncate(text: string): string {
    if (text.length <= MAX_LEN) return text;
    return text.slice(0, MAX_LEN - 1) + "…";
}

const getStringAttribute = (el: Element, attr: string) => el.getAttribute(attr)?.trim() || "";

function positionTooltip(x: number, y: number) {
    if (!tooltip) return;

    const pad = 14;
    const rect = tooltip.getBoundingClientRect();
    let left = x + pad;
    let top = y + pad;

    // Keep inside viewport
    if (left + rect.width > window.innerWidth - 8) {
        left = x - rect.width - pad;
    }
    if (top + rect.height > window.innerHeight - 8) {
        top = y - rect.height - pad;
    }
    if (left < 8) left = 8;
    if (top < 8) top = 8;

    tooltip.style.left = `${left}px`;
    tooltip.style.top = `${top}px`;
}

function show(text: string, x: number, y: number) {
    const el = ensureTooltip();
    el.textContent = truncate(text);
    el.style.display = "block";
    // Force layout so we can measure correctly
    void el.offsetWidth;
    positionTooltip(x, y);
    el.style.opacity = "1";
}

function hide() {
    if (!tooltip) return;
    tooltip.style.opacity = "0";
    // small delay so the fade can finish
    window.setTimeout(() => {
        if (tooltip) tooltip.style.display = "none";
    }, 90);
}

function clearTimers() {
    if (showTimer !== null) {
        clearTimeout(showTimer);
        showTimer = null;
    }
    if (hideTimer !== null) {
        clearTimeout(hideTimer);
        hideTimer = null;
    }
}

function findClosestLimited(element: Element | null, selector: string, maxDepth = 3) {
    let current = element;
    let depth = 0;

    while (current && depth <= maxDepth) {
        // Check if the current element matches the selector
        if (current.matches && current.matches(selector)) {
            return current;
        }

        // Move to the parent node
        current = current.parentElement;
        depth++;
    }

    return null;
}

function onMouseOver(e: MouseEvent) {
    const target = e.target as Element | null;
    if (!target || !(target instanceof Element)) return;

    const el = findClosestLimited(target, "[href], [src], [title]") as Element | null;
    if (!el || el === currentTarget) return;

    const text = getStringAttribute(el, "title") || getStringAttribute(el, "href") || getStringAttribute(el, "src");
    if (!text) return;

    clearTimers();
    currentTarget = el;

    showTimer = window.setTimeout(() => {
        show(text, e.clientX, e.clientY);
    }, SHOW_DELAY);
}

function onMouseMove(e: MouseEvent) {
    if (!tooltip || tooltip.style.display === "none") return;
    // Keep tooltip near the cursor while hovering
    positionTooltip(e.clientX, e.clientY);
}

function onMouseOut(e: MouseEvent) {
    const related = e.relatedTarget as Node | null;
    // Still inside the same element or its children → ignore
    if (currentTarget && related && currentTarget.contains(related)) return;

    clearTimers();
    currentTarget = null;

    hideTimer = window.setTimeout(hide, HIDE_DELAY);
}

export default definePlugin({
    name: "TitleTooltips",
    description: "Reusable floating tooltip that shows href / src / title on hover for any element (works on dynamic Discord content)",
    authors: [{ name: "thehalcyonsavant", id: 0n }],

    start() {
        ensureTooltip();
        // Use capture so we see events even if Discord stops propagation
        document.addEventListener("mouseover", onMouseOver, true);
        document.addEventListener("mousemove", onMouseMove, true);
        document.addEventListener("mouseout", onMouseOut, true);

        console.log("TitleTooltips loaded");
    },

    stop() {
        clearTimers();

        document.removeEventListener("mouseover", onMouseOver, true);
        document.removeEventListener("mousemove", onMouseMove, true);
        document.removeEventListener("mouseout", onMouseOut, true);

        if (tooltip) {
            tooltip.remove();
            tooltip = null;
        }

        currentTarget = null;

        console.log("TitleTooltips stopped");
    }
});
