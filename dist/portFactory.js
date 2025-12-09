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
exports.portFactory = portFactory;
function portFactory(scriptName) {
    const time = new Date();
    console.log(`${scriptName || "Unnamed script"} ran at ${time.getHours()}:${time.getMinutes()}`);
    const allPorts = {};
    /**
     * Creates a new communication port with a given name and stores it.
     * @param {string} portName - Name of the port to create.
     * @returns {browser.runtime.Port} - The created port instance.
     */
    const createPort = (portName) => {
        const port = browser.runtime.connect({ name: portName });
        allPorts[portName] = port;
        return port;
    };
    /**
     * Listens for messages from a specified port and triggers a callback when a message is received.
     * @param {string} portName - Name of the port to listen to.
     * @param {(msg: any) => void} callback - Function to handle incoming messages.
     */
    const receiveMessage = (portName, callback) => {
        const port = allPorts[portName];
        if (!port) {
            throw new Error(`Port "${portName}" is not created. Use createPort() or joinPort() first.`);
        }
        if (typeof callback !== "function") {
            throw new Error("Callback must be a function.");
        }
        port.onMessage.addListener(callback);
    };
    /**
     * Sends a message through a specified port.
     * @param {string} portName - Name of the port to send the message through.
     * @param {any} message - The message to send.
     */
    const sendMessage = (portName, message) => {
        const port = allPorts[portName];
        if (!port) {
            throw new Error(`Port "${portName}" is not created. Use createPort() or joinPort() first.`);
        }
        port.postMessage(message);
    };
    /**
     * Joins an existing port and registers a callback for when a connection is made.
     * @param {string} portName - Name of the port to join.
     * @param {(port: browser.runtime.Port) => void} onConnectCb - Callback executed when the port connects.
     */
    const joinPort = (portName, onConnectCb) => {
        browser.runtime.onConnect.addListener((port) => {
            if (port.name === portName) {
                allPorts[portName] = port;
                onConnectCb(port);
            }
            else {
                console.error(`${portName} doesn't exist: PORTS => ${allPorts}`);
            }
        });
    };
    /**
     * Connects to a tab using a port and sends a message if applicable.
     * @param {object} [tabQueryProps={}] - Properties for querying tabs.
     * @param {string} portName - Name of the port to use.
     * @param {object} [options={}] - Configuration options.
     * @param {(message: any) => void} [options.receiveMsgCb] - Callback for received messages.
     * @param {() => any} [options.sendMessageCb] - Function returning the message to send.
     */
    const connectToTab = function () {
        return __awaiter(this, arguments, void 0, function* (tabQueryProps = {}, portName, options = {}) {
            try {
                const { receiveMsgCb = (message) => {
                    if (message) {
                        console.log("Received message:", message);
                    }
                }, sendMessageCb = () => ({ defaultMessage: "hello world" }), } = options;
                const tabs = yield browser.tabs.query(tabQueryProps);
                if (tabs.length === 0) {
                    console.warn("No tabs found matching query.");
                    return;
                }
                for (let tab of tabs) {
                    if (tab.id) {
                        const port = browser.tabs.connect(tab.id, { name: portName });
                        console.log(`Connected to tab ${tab.id} with port: ${portName}`);
                        if (receiveMsgCb)
                            port.onMessage.addListener(receiveMsgCb);
                        const message = sendMessageCb();
                        port.postMessage(message);
                        console.log(`Message sent to tab ${tab.id} successfully.`);
                    }
                    else {
                        console.error("Tab ID not found. Message sending failed.");
                    }
                }
            }
            catch (err) {
                console.error("Tab connection error:", err);
            }
        });
    };
    return {
        createPort,
        receiveMessage,
        sendMessage,
        joinPort,
        connectToTab,
    };
}
