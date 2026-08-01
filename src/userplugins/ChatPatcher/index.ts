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
            find: '"MessageStore"',
            replacement: [
                {
                    match: /(?<=MESSAGE_CREATE:function\((\i)\){)/,
                    replace: (_, props) => `if($self.shouldIgnoreMessage(${props}))return;`
                }
            ]
        },
        {
            find: '"ReadStateStore"',
            replacement: [
                {
                    match: /(?<=MESSAGE_CREATE:function\((\i)\){)/,
                    replace: (_, props) => `if($self.shouldIgnoreMessage(${props}))return;`
                }
            ]
        },
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

    shouldIgnoreMessage(props: { message: ContentMaster; }) {
        try {
            this.logger.info("MESSAGE_CREATE", props);

            if (!props || !props.message || !props.message.content) {
                return false;
            }
            return false;
        } catch (e) {
            this.logger.error("MESSAGE_CREATE", e);
            return false;
        }
    },

    start() {
        this.logger = new Logger("ChatPatcher");
    },

    stop() {
        this.logger.info("ChatPatcher stopped");
    }
});
