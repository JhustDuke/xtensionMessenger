"use strict";
var __awaiter = (this && this.__awaiter) || function (thisArg, _arguments, P, generator) {
    function adopt(value) { return value instanceof P ? value : new P(function (resolve) { resolve(value); }); }
    return new (P || (P = Promise))(function (resolve, reject) {
        function fulfilled(value) { try { step(generator.next(value)); } catch (e) { reject(e); } }
        function rejected(value) { try { step(generator["throw"](value)); } catch (e) { reject(e); } }
        function step(result) { result.done ? resolve(result.value) : adopt(result.value).then(fulfilled, rejected); }
        step((generator = generator.apply(thisArg, _arguments || [])).next());
    });
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.oneTimeMsgFactory = oneTimeMsgFactory;
function oneTimeMsgFactory(scriptname) {
    const logTime = new Date();
    // Log the script name and the time it ran for debugging purposes
    //prettier-ignore
    console.log(scriptname, 'ran at', logTime.getHours(), ":", logTime.getMinutes());
    // Function to query tabs; returns a Promise for async usage
    const getTabs = function (tabQueryOptions) {
        return new Promise((resolve, reject) => {
            try {
                // Check if valid tabQueryOptions are provided
                if (!tabQueryOptions) {
                    return reject(new Error("tab querying failed"));
                }
                // Query the tabs using the browser API
                resolve(browser.tabs.query(tabQueryOptions));
            }
            catch (error) {
                // Catch and reject any errors during tab querying
                reject(error);
            }
        });
    };
    // Method to send a message to the background script
    const sendMessageToBackgroundScript = function () {
        return __awaiter(this, arguments, void 0, function* (message = {}, callbacks = {
            // Default error callback: Logs the error
            errorCb: (error) => {
                console.error("this is the error =>", error);
            },
            // Default success callback: Logs the response
            successCb: (response) => {
                console.log("this is the response =>", response);
            },
        }) {
            try {
                // Sends a message to the background script
                const response = yield browser.runtime.sendMessage(message);
                // Validate the response status; throw an error if invalid
                if (response.validationStatus !== "ok") {
                    throw new Error("Validation failed: " + response.validationStatus);
                }
                // Execute the success callback with the response if provided
                if (callbacks.successCb)
                    callbacks.successCb(response);
            }
            catch (error) {
                // Execute the error callback with the error message if provided
                if (callbacks.errorCb)
                    callbacks.errorCb(error.message);
            }
        });
    };
    const sendMessageToPopupScript = sendMessageToBackgroundScript;
    // Method to send a message to the content script of a specific tab
    const sendMessageToContentScript = function (tabMessagingOptions) {
        return __awaiter(this, void 0, void 0, function* () {
            const { message = { test: "test-message" }, errorCb = (error) => console.error("Error occurred:", error), successCb = (response) => console.log("Message sent successfully:", response), tabQueryProps = {}, // Default to an empty object if no tab query props are provided
             } = tabMessagingOptions;
            try {
                // Query the tabs based on the provided properties
                const tabs = yield getTabs(tabQueryProps);
                //if there are no tabs
                if (tabs.length === 0)
                    throw new Error("tabs length is 0");
                // Iterate over each matching tab and send a message
                for (const tab of tabs) {
                    if (!tab.id)
                        throw new Error("no valid tab with id"); // Skip tabs without a valid ID
                    const response = yield browser.tabs.sendMessage(tab.id, message);
                    if (successCb)
                        successCb(response);
                }
                // Call success callback with the response
            }
            catch (error) {
                // Call error callback with the error message
                errorCb(error);
            }
        });
    };
    // Method to handle incoming messages in the background script
    const onMessageReceived = function ({ validateMessage, validateSender, reply = "Default response from content script when none is provided", }) {
        const responseHandlerCb = function (message, sender, sendResponse) {
            let currentResponse = reply; // Set default reply initially
            // Validate the message if validation logic is provided
            if (validateMessage) {
                const validationResult = validateMessage(message);
                if (!validationResult) {
                    return sendResponse({
                        validationStatus: "fail",
                        response: "validation failure from validateMessage",
                    });
                }
            }
            // Validate the sender if validation logic is provided
            if (validateSender) {
                const validationResult = validateSender(sender);
                if (!validationResult) {
                    return sendResponse({
                        validationStatus: "fail",
                        response: "validation failure from validateSender",
                    });
                }
            }
            // Send the final response if validation passes
            sendResponse({ response: currentResponse, validationStatus: "ok" });
        };
        // Register the response handler for incoming messages
        browser.runtime.onMessage.addListener(responseHandlerCb);
    };
    // Return all public API methods
    return {
        sendMessageToBackgroundScript,
        sendMessageToPopupScript,
        sendMessageToContentScript,
        onMessageReceived,
        getTabs,
    };
}
