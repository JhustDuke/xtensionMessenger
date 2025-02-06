# xtensionMessenger

# Xtension Messenger

Xtension Messenger is a JavaScript utility designed for handling message passing between different parts of a WebExtension (background scripts, content scripts, and popup scripts). This library is optimized for **Firefox extensions** and provides a simple API for sending and receiving messages.

## Features

- **One-time messaging**: Send messages between content scripts, background scripts, and popup scripts.
- **Tab messaging**: Send messages to specific tabs based on query parameters.
- **Message validation**: Includes optional validation for both messages and senders.
- **Error handling**: Customizable success and error callbacks.
- **Lightweight & flexible**: Easy to integrate into any WebExtension project.

## Installation

```sh
npm install xtension-messenger
```

## Usage

### Importing the Factory

```ts
import { oneTimeMsgFactory } from "xtension-messenger";
```

### Creating an Instance

```ts
const messenger = oneTimeMsgFactory("Content Script");
```

### Sending Messages

#### To Background Script

```ts
messenger.sendMessageToBackgroundScript(
	{ action: "fetch-data" },
	{
		//optional, defaults  logging are available for both
		successCb: (response) => console.log("Success:", response),
		errorCb: (error) => console.error("Error:", error),
	}
);
```

#### To Popup Script

```ts
messenger.sendMessageToPopupScript(
	{ message: "Hello Popup!" },
	{
		successCb: (response) => console.log("Popup Response:", response),
		errorCb: (error) => console.error("Popup Error:", error),
	}
);
```

#### To Content Script

```ts
messenger.sendMessageToContentScript({
	tabQueryProps: { active: true, currentWindow: true },
	message: { type: "GREETINGS" },
	successCb: (res) => console.log("Content Script Response:", res),
	errorCb: (err) => console.error("Failed to send message:", err),
});
```

### Receiving Messages

```ts
messenger.onMessageReceived({
	//use this to validate the message received
	validateMessage: (message) => message?.type === "GREETINGS",
	validateSender: (sender) => sender?.id !== undefined,
	reply: "Message received successfully!",
});
```

## API Reference

### `sendMessageToBackgroundScript(message: object, callbacks: { successCb?: Function, errorCb?: Function })`

Sends a message to the background script and handles the response.

### `sendMessageToPopupScript(message: object, callbacks: { successCb?: Function, errorCb?: Function })`

Sends a message to the popup script.

### `sendMessageToContentScript(tabMessagingOptions: { tabQueryProps?: object, message?: object, successCb?: Function, errorCb?: Function })`

Sends a message to content scripts in specific tabs.

### `onMessageReceived({ validateMessage?, validateSender?, reply? })`

Listens for incoming messages and validates them before responding.

### `getTabs(tabQueryOptions: object): Promise<Tab[]>`

# portFactory README

## Overview

The `portFactory` function is a utility for managing communication ports in a browser extension using the `browser.runtime.port` API. It facilitates creating, joining, sending, and receiving messages through ports, as well as connecting to specific browser tabs.

## Usage

```javascript
const ports = portFactory("MyScript");
```

When `portFactory` is called, it logs the script name (if provided) and the current time.

## Methods

### `createPort(portName: string): browser.runtime.Port`

Creates a new port with the given `portName` and stores it in `allPorts`.

**Example:**

```javascript
const port = ports.createPort("myPort");
```

---

### `receiveMessage(portName: string, callback: (msg: any) => void)`

Listens for messages on the specified port and triggers the provided callback when a message is received.

**Example:**

```javascript
ports.receiveMessage("myPort", (msg) => {
	console.log("Received message:", msg);
});
```

Errors will be thrown if the port does not exist or if the callback is not a function.

---

### `sendMessage(portName: string, message: any)`

Sends a message to the specified port.

**Example:**

```javascript
ports.sendMessage("myPort", { action: "doSomething" });
```

An error is thrown if the port does not exist.

---

### `joinPort(portName: string, onConnectCb: (port: browser.runtime.Port) => void)`

Listens for incoming connections to a specified port and triggers the `onConnectCb` callback when a connection is made.

**Example:**

```javascript
ports.joinPort("myPort", (port) => {
	console.log("Connected to port", port.name);
});
```

If an unknown port connects, an error is logged.

---

### `connectToTab(tabQueryProps: object, portName: string, options?: { receiveMsgCb?: (message: any) => void; sendMessageCb?: () => any; })`

Connects to a browser tab matching `tabQueryProps` and establishes a communication port. It allows specifying callbacks for sending and receiving messages.

**Example:**

```javascript
ports.connectToTab({ active: true, currentWindow: true }, "tabPort", {
	receiveMsgCb: (msg) => console.log("Received from tab:", msg),
	sendMessageCb: () => ({ greeting: "Hello, tab!" }),
});
```

If no tabs match the query, a warning is logged.

## Error Handling

- Errors are thrown if required arguments are missing or incorrect.
- Warnings are logged if a connection attempt is unsuccessful.

## Logging

Throughout the execution, the function logs key events such as:

- Creation of ports
- Connection to tabs
- Sending and receiving messages

These logs assist in debugging and monitoring the communication flow.

## Conclusion

The `portFactory` function is a robust utility for handling message passing between different parts of a browser extension. It simplifies tab communication and ensures structured error handling and logging.
