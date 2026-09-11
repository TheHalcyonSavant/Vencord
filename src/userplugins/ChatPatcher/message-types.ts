/*
 * Vencord, a Discord client mod
 * Copyright (c) 2026 Vendicated and contributors
 * SPDX-License-Identifier: GPL-3.0-or-later
 */

type Digit = "0" | "1" | "2" | "3" | "4" | "5" | "6" | "7" | "8" | "9";

type OnlyDigits<S extends string> =
    S extends `${infer F}${infer R}` ? (F extends Digit ? OnlyDigits<R> : never) : S; // empty remainder is fine

type NonEmptyDigits<S extends string = string> =
    S extends `${Digit}${string}` ? OnlyDigits<S> : never;

export type MessageType = "MESSAGE" | "MESSAGE_CREATE" | "MESSAGE_GROUP_BLOCKED" | "MESSAGE_GROUP_IGNORED";

export interface Message {
    activity: unknown | null;
    attachments: unknown[];
    author: {
        id: string;
        username: string;
        verified: boolean;
    }[];
    blocked: boolean;
    bot: boolean;
    channel_id: NonEmptyDigits;
    components: unknown[];
    content: string;
    edited_timestamp: Date | null;
    embeds: unknown[];
    flags: number;
    id: NonEmptyDigits;
    ignored: boolean;
    interaction: unknown | null;
    isUnsupported: boolean;
    mediaMention: unknown | null;
    member: {
        avatar: unknown | null;
        banner: unknown | null;
        communication_disabled_until: unknown | null;
        joined_at: string; // ISO string
        mute: boolean;
        pending: boolean;
        roles: unknown[];
    };
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
    content: Message;
    groupId: NonEmptyDigits;
    type: MessageType;
}

export interface MessageGroup {
    canUncollapse: boolean;
    channel: {
        defaultAutoArchiveDuration: number;
        guild_id: NonEmptyDigits;
        id: NonEmptyDigits;
        lastMessageId: NonEmptyDigits;
        name: string;
        parent_id: NonEmptyDigits;
        permissionOverwrites_: {
            [key: string]: {
                allow: BigInt;
                deny: BigInt;
                id: NonEmptyDigits;
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
    unreadId: NonEmptyDigits;
}

export interface MessageCreate {
    channelId: NonEmptyDigits;
    guildId: NonEmptyDigits;
    isPushNotification: boolean;
    message: Message;
    optimistic: boolean;
    type: MessageType;
}
