import {
	TabQueryPropsInterface,
	SendToContentInterface,
	MessageToBackgroundInterface,
	OnMessageAsyncInterface,
	OnMessageSyncInterface,
	BrowserTabInterface,
	FutureTabQueryProps,
	ExtensionMessageInterface,
} from "../interfaces"; // adjust the path

export const oneTimeMsgFactory = function (scriptname?: string) {
	const logTime = new Date();
	console.log(scriptname, "ran", logTime.getHours(), ":", logTime.getMinutes());

	/**
	 * Returns all active tabs based on query options
	 */
	const getTabsFn = function (
		tabQueryOptions: TabQueryPropsInterface | FutureTabQueryProps
	): Promise<BrowserTabInterface[]> {
		return new Promise((resolve, reject) => {
			if (!tabQueryOptions) {
				reject(new Error("tab querying failed"));
			} else {
				resolve(browser.tabs.query(tabQueryOptions));
			}
		});
	};

	/**
	 * Send a message to the background script
	 */
	const messageBackgroundScript = async function (
		options: MessageToBackgroundInterface
	) {
		const { message, errorCb, successCb } = options;

		try {
			const response = await browser.runtime.sendMessage(message);
			successCb(response);
		} catch (error: any) {
			errorCb(error.message || error);
		}
	};

	//same struc as messageBackgroundScript kept for eaase of use
	const messagePopupScript = messageBackgroundScript;
	/**
	 * Send a message to content scripts
	 */
	const messageContentScript = async function (
		options: SendToContentInterface
	) {
		const { tabQueryProps, message, errorCb, successCb } = options;

		try {
			if (!tabQueryProps) {
				throw new Error("tabQueryProps is undefined");
			}
			const tabs = await getTabsFn(tabQueryProps);
			const targetTab = tabs.length > 0 ? tabs[0].id : null;

			if (!targetTab) {
				errorCb(new Error("no valid tab found"));
				return;
			}

			const messageResponse = await browser.tabs.sendMessage(
				targetTab,
				message
			);
			successCb(messageResponse);
		} catch (error: any) {
			errorCb(error);
		}
	};

	/**
	 * Listen for messages in background or content scripts
	 */
	const onMessageSync = function (opts: OnMessageSyncInterface) {
		const { validateMessage, validateSender, reply = "default reply" } = opts;

		const handler = function (
			message: ExtensionMessageInterface,
			sender: browser.runtime.MessageSender,
			sendResponse: (response?: any) => void
		) {
			if (validateMessage && !validateMessage(message)) {
				sendResponse({ status: "fail", error: "validateMessage failed" });
				return false;
			}

			if (validateSender && !validateSender(sender)) {
				sendResponse({ status: "fail", error: "validateSender failed" });
				return false;
			}

			sendResponse({ status: "ok", data: reply });
			return false;
		};

		browser.runtime.onMessage.addListener(handler);
	};

	// --- ASYNC LISTENER ---
	const onMessageAsync = function (opts: OnMessageAsyncInterface) {
		const { validateMessage, validateSender, onAsyncCb } = opts;

		const handler = function (
			message: ExtensionMessageInterface,
			sender: browser.runtime.MessageSender,
			sendResponse: (response: {
				isPassed: boolean;
				response?: any;
				data?: unknown;
			}) => void
		) {
			if (validateMessage && !validateMessage(message)) {
				sendResponse?.({
					isPassed: false,
					response: "validateMessage failed",
				});
				return false;
			}

			if (validateSender && !validateSender(sender)) {
				sendResponse?.({
					isPassed: false,
					response: "validateSender failed",
				});
				return false;
			}

			(async function () {
				try {
					const data = await onAsyncCb?.(message, sender);

					if (data === false) {
						throw Error("async request returned a falsy value");
					}
					sendResponse?.({ isPassed: true, data, response: "async success" });
				} catch (e: any) {
					sendResponse?.({
						isPassed: false,
						response: e?.message ?? "async error",
					});
				}
			})();

			return true; // keep channel open
		};

		browser.runtime.onMessage.addListener(handler);
	};

	return {
		messageBackgroundScript,
		messagePopupScript,
		messageContentScript,
		onMessageSync,
		onMessageAsync,
		getTabsFn,
	};
};
