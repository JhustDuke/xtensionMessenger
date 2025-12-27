/// <reference types="firefox-webext-browser" />
/**
 * Describes the properties you can query when searching for browser tabs.
 * Matches the standard browser tab query API.
 */
export interface TabQueryPropsInterface {
    /** Whether the tab is currently active in its window */
    active?: boolean;
    /** Whether the tab is in the currently focused window */
    currentWindow?: boolean;
    /** Whether the tab is in the last focused window */
    lastFocusedWindow?: boolean;
    /** Whether the tab is producing sound */
    audible?: boolean;
    /** Whether the tab can be automatically discarded by the browser */
    autoDiscardable?: boolean;
    /** Whether the tab has been discarded by the browser */
    discarded?: boolean;
    /** Whether the tab is pinned in the tab strip */
    pinned?: boolean;
    /** Whether the tab is highlighted (selected) */
    highlighted?: boolean;
    /** The zero-based index of the tab within its window */
    index?: number;
    /** Whether the tab is muted */
    muted?: boolean;
    /** The title of the tab */
    title?: string;
    /** The URL of the tab or a list of URLs to match */
    url?: string | string[];
    /** The ID of the window containing the tab */
    windowId?: number;
}
/**
 * Extends TabQueryPropsInterface to allow browser-specific or custom
 * fields not yet standardized.
 * Useful for future-proofing code across browser versions.
 */
export interface FutureTabQueryProps extends TabQueryPropsInterface {
    /** Arbitrary additional properties specific to a browser or extension */
    [key: string]: unknown;
}
/**
 * Represents the minimal information about a single browser tab.
 * This is the shape of a tab object you might receive from
 * `browser.tabs.query()` or similar APIs.
 */
export interface BrowserTabInterface {
    /** Unique identifier of the tab */
    id?: number;
    /** Whether the tab is currently active */
    active?: boolean;
    /** Whether the tab is pinned in the tab strip */
    pinned?: boolean;
    /** ID of the window containing the tab */
    windowId?: number;
    /** Zero-based position of the tab in its window */
    index?: number;
    /** URL of the tab */
    url?: string;
    /** Title of the tab */
    title?: string;
}
/**
 * The structure for messaging across scripts.
 * Generic T allows typing the message payload.
 */
export interface ExtensionMessageInterface<T = unknown> {
    type: string;
    payload?: T;
}
/**
 * Defines the structure for sending a message to a content script.
 * Generic T allows typing the message payload.
 */
export interface SendToContentInterface {
    /** Optional tab query properties to target specific tabs */
    tabQueryProps?: TabQueryPropsInterface;
    /** The message payload to send */
    message?: ExtensionMessageInterface;
    /** Callback executed if sending the message fails */
    errorCb: (errorMsg: StandardResponse) => void | boolean;
    /** Callback executed when the message succeeds */
    successCb: (successMsg: StandardResponse) => void | boolean;
}
/**
 * Defines the structure for sending a message to a background script.
 * Generic types T (message) and R (response) allow type safety.
 */
export interface MessageToBackgroundInterface {
    /** The message payload to send to the background script */
    message: ExtensionMessageInterface;
    /** Callback executed if sending the message fails */
    errorCb: (error: StandardResponse) => void | boolean;
    /** Callback executed with the response from the background script */
    successCb: (response?: StandardResponse) => void | boolean;
}
/**
 * Defines the structure of a synchronous message handler.
 * Generic R allows typing the reply payload.
 */
export interface OnMessageSyncInterface {
    /**
     * Optional function to validate the message structure or content
     * before processing it.
     */
    validateMessage?: (message: ExtensionMessageInterface) => boolean;
    /**
     * Optional function to validate the sender of the message.
     * Useful to ensure messages come from expected tabs or extensions.
     */
    validateSender?: (sender: browser.runtime.MessageSender) => boolean;
    /** Optional reply object to send back to the sender */
    replyCb?: () => string | boolean | Record<any, any>;
}
/**
 * Defines the structure of an asynchronous message handler.
 */
export interface OnMessageAsyncInterface {
    validateMessage?: (msg: ExtensionMessageInterface) => boolean;
    validateSender?: (sender: browser.runtime.MessageSender) => boolean;
    onAsyncCb?: (message: ExtensionMessageInterface, sender: browser.runtime.MessageSender) => Promise<any> | boolean;
}
/**
 * Standardized response format for handlers.
 */
export interface StandardResponse<T = unknown> {
    status: boolean;
    message?: string;
    data?: T;
}
/**
 * Common handler function type.
 */
export interface HandlerInterface {
    (message: ExtensionMessageInterface, sender: browser.runtime.MessageSender, sendResponse: (payload: StandardResponse) => void): boolean;
}
