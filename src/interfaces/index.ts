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
 * Defines the structure for sending a message to a content script.
 * Generic T allows typing the message payload.
 */
export interface SendToContentInterface {
	/** Optional tab query properties to target specific tabs */
	tabQueryProps?: TabQueryPropsInterface;
	/** The message payload to send */
	message?: Record<string, unknown>;
	/** Callback executed if sending the message fails */
	errorCb: (errorMsg: Error | string) => void | boolean;
	/** Callback executed when the message succeeds */
	successCb: (successMsg: unknown) => void | boolean;
}

/**
 * Defines the structure for sending a message to a background script.
 * Generic types T (message) and R (response) allow type safety.
 */
export interface MessageToBackgroundInterface {
	/** The message payload to send to the background script */
	message: Record<string, unknown>;
	/** Callback executed if sending the message fails */
	errorCb: (error?: Error | string) => void;
	/** Callback executed with the response from the background script */
	successCb: (response?: unknown) => void | boolean;
}

/**
 * Defines the structure of an object representing a message handler
 * that receives messages in either background or content scripts.
 * Generic R allows typing the reply payload.
 */
export interface OnMessageSyncInterface {
	/**
	 * Optional function to validate the message structure or content
	 * before processing it.
	 */
	validateMessage?: (message: unknown) => boolean;
	/**
	 * Optional function to validate the sender of the message.
	 * Useful to ensure messages come from expected tabs or extensions.
	 */
	validateSender?: (sender: browser.runtime.MessageSender) => boolean;
	/** Optional reply object to send back to the sender */
	reply?: unknown;
	/** Whether the handler is asynchronous (returns a promise) */
}
export interface OnMessageSyncInterface {
	/**
	 * Optional function to validate the message structure or content
	 * before processing it.
	 */
	validateMessage?: (message: unknown) => boolean;
	/**
	 * Optional function to validate the sender of the message.
	 * Useful to ensure messages come from expected tabs or extensions.
	 */
	validateSender?: (sender: browser.runtime.MessageSender) => boolean;
	/** Optional reply object to send back to the sender */
	reply?: unknown;
	/** Whether the handler is asynchronous (returns a promise) */
}

export interface onMessageAsyncInterface {
	validateMessage?: (msg: unknown) => boolean;

	validateSender?: (sender: browser.runtime.MessageSender) => boolean;
	onAsyncCb?: (
		message: unknown,
		sender: browser.runtime.MessageSender
	) => Promise<any>;
}

export interface StandardResponse {
	isPassed: boolean;
	response?: any;
	data?: unknown;
}
export interface handlerInterface {
	(
		message: unknown,
		sender: browser.runtime.MessageSender,
		sendResponse?: (payload: StandardResponse) => void
	): boolean;
}
