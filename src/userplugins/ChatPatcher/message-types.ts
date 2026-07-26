/*
 * Vencord, a Discord client mod
 * Copyright (c) 2026 Vendicated and contributors
 * SPDX-License-Identifier: GPL-3.0-or-later
 */

export interface Content {
    activity: unknown | null;
    attachments: unknown[];
    author: {
        id: string;
        username: string;
        verified: boolean;
    }[];
    blocked: boolean;
    bot: boolean;
    channel_id: number;
    content: string;
    embeds: unknown[];
    id: string;
    ignored: boolean;
    interaction: unknown | null;
    isUnsupported: boolean;
    mediaMention: unknown | null;
    mentionChannels: unknown[];
    mentionsEveryone: boolean;
    nonce: string;
    pinned: boolean;
    reactions: unknown[];
    state: "SENT" | "DELIVERED" | "READ";
    timestamp: Date;
    type: number;
}

export interface ContentMaster {
    content: Content;
    groupId: string;
    type: MessageType;
}

export type MessageType = "MESSAGE" | "MESSAGE_GROUP_BLOCKED" | "MESSAGE_GROUP_IGNORED";

export interface MessageGroup {
    canUncollapse: boolean;
    channel: {
        defaultAutoArchiveDuration: number;
        guild_id: string;
        id: string;
        lastMessageId: string;
        name: string;
        parent_id: string;
        permissionOverwrites_: {
            [key: string]: {
                allow: BigInt;
                deny: BigInt;
                id: string;
                type: number;
            };
        };
        topic_: string;
    };
    collapsedReason: () => unknown;
    compact: boolean;
    messages: {
        content: ContentMaster[];
        key: string;
        type: MessageType;
    };
    unreadId: string;
}
