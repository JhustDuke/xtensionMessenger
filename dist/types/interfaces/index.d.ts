import type { Runtime } from "webextension-polyfill";
/**
 * Describes the properties you can query when searching for browser tabs.
 * Matches the standard browser tab query API.
 * @example
 * { active: true, currentWindow: true } //just the tab you are looking at
 * { url: "https://*.example.com/*" }    //every example.com tab
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
    /** URL of the tab (only filled in if the extension has the "tabs" permission or access to the site) */
    url?: string;
    /** Title of the tab (same permission note as url) */
    title?: string;
}
/**
 * The structure for messaging across scripts.
 * Generic T allows typing the message payload.
 * @example
 * { type: "GET_USER", payload: { id: 7 } }
 */
export interface ExtensionMessageInterface<T = unknown> {
    /** Names the operation, e.g. "GET_USER". A listener's validateMessage usually checks it */
    type: string;
    /** Optional data sent along with the message */
    payload?: T;
}
/**
 * Defines the structure for sending a message to a content script.
 * Generic T allows typing the message payload.
 * @example
 * api.messageContentScript({
 * 	tabQueryProps: { active: true, currentWindow: true },
 * 	messageToSend: { type: "INSERT_IMAGE" },
 * 	successCb: function (success) { success.data[0].response.status; },
 * 	errorCb: function (error) { console.log(error.errorMessage); },
 * });
 */
export interface SendToContentInterface {
    /** Optional tab query properties to target specific tabs. Without it the call fails through errorCb */
    tabQueryProps?: TabQueryPropsInterface;
    /** The message payload to send */
    messageToSend?: ExtensionMessageInterface;
    /** Callback executed if sending the message fails. Runs only when the whole call fails (no tabQueryProps, query failed, no tabs found), not when a single tab fails */
    errorCb: (errorMsg: StandardResponse) => void | boolean;
    /** Callback executed when the message succeeds. `data` holds one result per tab, so check each `response.status` */
    successCb: (successMsg: StandardResponse<TabMessageResult[]>) => void | boolean;
}
/**
 * The reply from one tab, together with the tab it came from.
 * @example
 * { tabInfo: { id: 5, url: "https://a.com" }, response: { status: true, data: "hello" } }
 */
export interface TabMessageResult {
    /** Information about the tab */
    tabInfo: BrowserTabInterface;
    /** Response received from the content script */
    response: StandardResponse;
}
/**
 * Defines the structure for sending a message to a background script.
 * Generic types T (message) and R (response) allow type safety.
 * @example
 * api.messageBackgroundScript({
 * 	messageToSend: { type: "GET_USER" },
 * 	successCb: function (response) { console.log(response.data); },
 * 	errorCb: function (error) { console.log(error.errorMessage); },
 * });
 */
export interface MessageToBackgroundInterface {
    /** The message payload to send to the background script */
    messageToSend: ExtensionMessageInterface;
    /** Callback executed if sending the message fails. Also runs when the reply has status false or nobody answered */
    errorCb: (error: StandardResponse) => void | boolean;
    /** Callback executed with the response from the background script. Runs only when the reply has status true */
    successCb: (response?: StandardResponse) => void | boolean;
}
/**
 * Defines the structure of a synchronous message handler.
 * Generic R allows typing the reply payload.
 * @example
 * api.onMessageSync({
 * 	validateMessage: function (message) { return message.type === "PING"; },
 * 	onSyncCb: function () { return { pong: true }; },
 * });
 */
export interface OnMessageSyncInterface {
    /**validation for the incoming message returns false if it fails. When it fails the listener stays silent so another listener can answer */
    validateMessage?: (message: ExtensionMessageInterface) => boolean;
    /**validation for the sender returns false if it fails. When it fails the sender gets a failure reply */
    validateSender?: (sender: Runtime.MessageSender) => boolean;
    /**call back executed if the message succeeds and the user can have access to it here. ONLY USED FOR NON I/O TASk. Its return value becomes `data` in the reply */
    onSyncCb: (message: ExtensionMessageInterface, sender: Runtime.MessageSender) => unknown;
}
/**
 * Defines the structure of an asynchronous message handler.
 * @example
 * api.onMessageAsync({
 * 	validateMessage: function (message) { return message.type === "GET_USER"; },
 * 	onAsyncCb: async function () { return await fetchUser(); },
 * });
 */
export interface OnMessageAsyncInterface {
    /**validation for the incoming message returns false if it fails. When it fails the listener stays silent so another listener can answer */
    validateMessage?: (msg: ExtensionMessageInterface) => boolean;
    /**validation for the sender returns false if it fails. When it fails the sender gets a failure reply */
    validateSender?: (sender: Runtime.MessageSender) => boolean;
    /**call back executed if the message succeeds and the user can have access to it here. ONLY USED FOR I/O TASK. The resolved value becomes `data`; a throw becomes a failure reply */
    onAsyncCb?: (message: ExtensionMessageInterface, sender: Runtime.MessageSender) => Promise<any> | boolean;
}
/**
 * Standardized response format for handlers.
 * @example
 * { status: true, data: "hello" }
 * { status: false, errorMessage: "validateSender failed" }
 */
export interface StandardResponse<T = unknown> {
    /** true when the operation worked, false when it failed */
    status: boolean;
    /** Why the operation failed. Only set when status is false */
    errorMessage?: string;
    /** The value the receiver returned. Only set when status is true */
    data?: T;
}
/**
 * Common handler function type.
 */
export interface HandlerInterface {
    (message: ExtensionMessageInterface, sender: Runtime.MessageSender, sendResponse: (payload: StandardResponse) => void): boolean;
}
