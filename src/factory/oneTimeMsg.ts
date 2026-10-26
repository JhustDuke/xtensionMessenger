import browser, { Runtime } from "webextension-polyfill";
import {
	TabQueryPropsInterface,
	SendToContentInterface,
	OnMessageAsyncInterface,
	OnMessageSyncInterface,
	BrowserTabInterface,
	FutureTabQueryProps,
	ExtensionMessageInterface,
	TabMessageResult,
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

	async function messageBackgroundScript(options: {
		messageToSend: ExtensionMessageInterface;
		successCb: (response: StandardResponse) => void;
		errorCb: (error: StandardResponse) => void;
	}) {
		const { messageToSend, errorCb, successCb } = options;

		let response: StandardResponse;

		try {
			response = await browser.runtime.sendMessage(messageToSend);
			if (!response) {
				throw new Error("no listener handled this message"); //e.g. type "UNKNOWN_TYPE"
			}
			if (!response.status) {
				throw new Error(
					response.errorMessage ?? "browser.runtime.sendMessage error"
				);
			}
		} catch (error: any) {
			errorCb({
				status: false,
				errorMessage: error.message ?? "message to background script failed",
			});
			return;
		}
		successCb(response);
	}

	//same struc as messageBackgroundScript kept for eaase of use
	const messagePopupScript = messageBackgroundScript;

	const messageContentScript = async function (
		options: SendToContentInterface
	) {
		const { tabQueryProps, messageToSend, successCb, errorCb } = options;

		const allTabResponses: TabMessageResult[] = [];

		try {
			if (!tabQueryProps) {
				throw new Error("tabQueryProps is undefined");
			}

			const matchingTabs = await getTabsFn(tabQueryProps);

			if (matchingTabs.length === 0) {
				throw new Error("no tabs found"); // move to catch → handled by errorCb
			}

			for (let tabIndex = 0; tabIndex < matchingTabs.length; tabIndex++) {
				const tabInfo = matchingTabs[tabIndex];

				if (tabInfo.id === undefined) {
					continue;
				}

				// this is done to solve the nested if problem
				const currentTabResponse: StandardResponse = (await browser.tabs
					.sendMessage(tabInfo.id, messageToSend)
					.catch(function (tabError: any) {
						// e.g. tab 12 is a chrome:// page with no content script
						return { status: false, errorMessage: tabError.message };
					})) as StandardResponse;

				allTabResponses.push({
					tabInfo,
					response: currentTabResponse || {
						status: false,
						errorMessage: "no listener handled this message", // e.g. type "UNKNOWN_TYPE"
					},
				});
			}
		} catch (err: any) {
			errorCb({
				status: false,
				errorMessage: err.message ?? "unknown tab querying error",
			});
			return;
		}

		successCb({
			status: true,
			data: allTabResponses,
		});
	};

	const onMessageSync = function (opts: OnMessageSyncInterface) {
		const { validateMessage, validateSender, onSyncCb } = opts;

		const handler = function (
			message: unknown, //any script can send anything, so it arrives as unknown
			sender: Runtime.MessageSender,
			sendResponse: (response?: StandardResponse) => void
		) {
			const extensionMessage = message as ExtensionMessageInterface;
			if (validateMessage && validateMessage(extensionMessage) !== true) {
				return undefined; //not my message, let another listener answer
			}

			if (validateSender && validateSender(sender) !== true) {
				sendResponse({ status: false, errorMessage: "validateSender failed" });
				return undefined;
			}

			const data = onSyncCb(extensionMessage, sender);

			if (data === undefined) {
				console.warn(
					`onSyncCb returned undefined, return a value (or null on purpose)`
				);
			}
			sendResponse({
				status: true,
				data,
			});

			return undefined;
		};

		browser.runtime.onMessage.addListener(handler as Runtime.OnMessageListener);
	};

	const onMessageAsync = function (opts: OnMessageAsyncInterface) {
		const { validateMessage, validateSender, onAsyncCb } = opts;

		const handler = function (
			message: unknown, //any script can send anything, so it arrives as unknown
			sender: Runtime.MessageSender,
			sendResponse: (response: StandardResponse) => void
		) {
			const extensionMessage = message as ExtensionMessageInterface;

			if (validateMessage && validateMessage(extensionMessage) !== true) {
				return undefined; //not my message, let another listener answer
			}

			if (validateSender && validateSender(sender) !== true) {
				sendResponse?.({
					status: false,
					errorMessage: "validateSender failed",
				});
				return undefined;
			}

			(async function () {
				try {
					const data = await onAsyncCb?.(extensionMessage, sender);

					if (data === undefined) {
						console.warn(
							`onAsyncCb returned undefined, return a value (or null on purpose)`
						);
					}
					sendResponse?.({
						status: true,
						data,
					});
				} catch (e: any) {
					sendResponse?.({
						status: false,
						errorMessage:
							e?.message ??
							"onMessageAsync returned undefined, false or a falsy value",
					});
				}
			})();

			return true; // keep channel open
		};

		browser.runtime.onMessage.addListener(handler as Runtime.OnMessageListener);
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
