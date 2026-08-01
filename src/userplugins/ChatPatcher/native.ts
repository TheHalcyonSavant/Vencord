/*
 * Vencord, a Discord client mod
 * Copyright (c) 2026 Vendicated and contributors
 * SPDX-License-Identifier: GPL-3.0-or-later
 */

import { app, BrowserWindow, screen } from "electron";

app.on("browser-window-created", (_, win) => {
    const displays = screen.getAllDisplays();
    const devToolsDisplay = displays[1] || displays[0];

    const mainWindows = BrowserWindow.getAllWindows();

    console.log("mainWindows", mainWindows);
    return;

    // 3. Configure the DevTools Window using ALL standard BrowserWindow options
    const devToolsWindow = new BrowserWindow({
        x: devToolsDisplay.bounds.x,
        y: devToolsDisplay.bounds.y,
        width: devToolsDisplay.bounds.width,
        height: devToolsDisplay.bounds.height,
        title: "Developer Tools - My Application",
        autoHideMenuBar: true,
        // Add any other standard BrowserWindow configs here (e.g. frame: false, backgroundColor, icon)
    });

    // 4. Attach DevTools to our configured window
    mainWindows[0]!.webContents.setDevToolsWebContents(devToolsWindow.webContents);
    mainWindows[0]!.webContents.openDevTools({ mode: "detach" });

    // 5. Apply window state changes
    devToolsWindow.maximize();

    // 6. Housekeeping: Close DevTools window if main window closes
    mainWindows[0]!.on("closed", () => {
        if (!devToolsWindow.isDestroyed()) {
            devToolsWindow.close();
        }
    });

    win.webContents.once("did-finish-load", () => {
        win.webContents.openDevTools({
            mode: "undocked", // "right" | "bottom" | "detach" | "undocked"
            activate: true
        });
    });
});
