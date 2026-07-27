/*
 * Vencord, a Discord client mod
 * Copyright (c) 2026 Vendicated and contributors
 * SPDX-License-Identifier: GPL-3.0-or-later
 */

import { Logger } from "@utils/Logger";
import definePlugin from "@utils/types";

import { ContentMaster, MessageGroup } from "./message-types";

export default definePlugin({
    name: "ChatPatcher",
    description: "Patch the Message Center",
    authors: [{ name: "thehalcyonsavant", id: 0n }],

    patches: [
        {
            find: ".__invalid_blocked,",
            replacement: [
                {
                    match: /let{messages:\i,[^}]*?collapsedReason[^}]*}/,
                    replace: "$self.changeMessageObject(arguments[0]);$&"
                },
            ]
        },
        {
            find: '"ReadStateStore"',
            replacement: [
                {
                    match: /(?<=MESSAGE_CREATE:function\((\i)\){)/,
                    replace: (_, props) => `$self.trackMessage(${props});`
                }
            ]
        }
    ],

    changeMessageObject(thread: MessageGroup) {
        try {
            if (!thread || !thread.messages || !Array.isArray(thread.messages.content)) {
                return;
            }

            // not working
            // obj.compact = false;

            this.logger.info("messages", thread.messages.type, thread.messages.content.filter(c => c.content).map(c => c.content.content), thread);
        } catch (e) {
            this.logger.error("changeMessageObject", e);
        }
    },

    trackMessage(props: { message: ContentMaster; }) {
        try {
            this.logger.info("trackMessage", props);

            if (!props || !props.message || !props.message.content) {
                return;
            }
        } catch (e) {
            this.logger.error("trackMessage", e);
        }
    },

    start() {
        this.logger = new Logger("ChatPatcher");
    },

    stop() {
        this.logger.info("ChatPatcher stopped");
    }
});
