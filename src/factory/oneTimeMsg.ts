import {
	TabQueryPropsInterface,
	SendToContentInterface,
	MessageToBackgroundInterface,
	OnMessageAsyncInterface,
	OnMessageSyncInterface,
	BrowserTabInterface,
	FutureTabQueryProps,
	ExtensionMessageInterface,
	StandardResponse,
} from "../interfaces"; // adjust the path

export const oneTimeMsgFactory = function (scriptname?: string) {
	const logTime = new Date();
	console.log(
		scriptname || "unknown-script",
		"ran",
		logTime.getHours(),
		":",
		logTime.getMinutes()
	);

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
	async function messageBackgroundScript(options: {
		message: ExtensionMessageInterface;
		successCb: (response: StandardResponse) => void;
		errorCb: (error: StandardResponse) => void;
	}) {
		const { message, errorCb, successCb } = options;

		try {
			const response = await browser.runtime.sendMessage(message);
			successCb({ status: true, data: response });
		} catch (error: any) {
			errorCb({
				status: false,
				message: error.message ?? "message to background script failed",
			});
		}
	}

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
				errorCb({ status: false, message: "no tabs found" });
				return;
			}

			const messageResponse = await browser.tabs.sendMessage(
				targetTab,
				message
			);
			successCb({ status: true, data: messageResponse });
		} catch (error: any) {
			errorCb({
				status: false,
				message: error.message ?? "unknown tab querying error",
			});
		}
	};

	/**
	 * Listen for messages in background or content scripts
	 */
	const onMessageSync = function (opts: OnMessageSyncInterface) {
		const {
			validateMessage,
			validateSender,
			replyCb = function () {
				return "default reply";
			},
		} = opts;

		const handler = function (
			message: ExtensionMessageInterface,
			sender: browser.runtime.MessageSender,
			sendResponse: (response?: StandardResponse) => void
		) {
			if (validateMessage && !validateMessage(message)) {
				sendResponse({ status: false, message: "validateMessage failed" });
				return false;
			}

			if (validateSender && !validateSender(sender)) {
				sendResponse({ status: false, message: "validateSender failed" });
				return false;
			}

			sendResponse({ status: true, data: replyCb() });
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
			sendResponse: (response: StandardResponse) => void
		) {
			if (validateMessage && !validateMessage(message)) {
				sendResponse?.({
					status: false,
					message: "validateMessage failed",
				});
				return false;
			}

			if (validateSender && !validateSender(sender)) {
				sendResponse?.({
					status: false,
					message: "validateSender failed",
				});
				return false;
			}

			(async function () {
				try {
					const data = await onAsyncCb?.(message, sender);

					if (!data) {
						throw new Error("onMessageAsync request returned a falsy value");
					}
					sendResponse?.({
						status: true,
						data,
						message: "onMessageAsync success",
					});
				} catch (e: any) {
					sendResponse?.({
						status: false,
						message: e?.message ?? "onMessageAsync returned an error",
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
