/*
 * Vencord, a Discord client mod
 * Copyright (c) 2026 Vendicated and contributors
 * SPDX-License-Identifier: GPL-3.0-or-later
 */

import { app } from "electron";

app.on("browser-window-created", (_, win) => {
    console.log("from electron: browser-window-created", win);
    win.webContents.once("did-finish-load", () => {
        win.webContents.openDevTools({
            mode: "undocked", // "right" | "bottom" | "detach" | "undocked"
            activate: true
        });
    });
});
