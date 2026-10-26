# oneTimeMsgFactory

A small, opinionated messaging utility for browser extensions built with WebExtensions APIs.

`oneTimeMsgFactory` standardizes one-time message sending, tab querying, synchronous listeners, and asynchronous listeners across popup, background, and content scripts.

It handles the messaging mechanics. Your extension defines what messages mean, what each listener does, and how returned results are used.

## 1. Install

```bash
npm install xtension-messenger
```

```bash
import { oneTimeMsgFactory } from "xtension-messenger";

// background script: answer messages
const bg = oneTimeMsgFactory("background");
bg.onMessageSync({
  validateMessage: function (message) { return message.type === "PING"; },
  onSyncCb: function () { return { pong: true }; },
});

// popup or content script: send a message
const popup = oneTimeMsgFactory("popup");
popup.messageBackgroundScript({
  messageToSend: { type: "PING" },
  successCb: function (response) { console.log(response.data); }, // { pong: true }
  errorCb: function (error) { console.log(error.errorMessage); },
});
```

That is the only install step. The package works in Chrome and Firefox. The WebExtension polyfill is bundled inside the package, and TypeScript types are included.

## 2. Before You Start

These five points will save you debugging time.

### 2.1 Register listeners at the top level of your background script

> **WARNING: `onMessageSync` and `onMessageAsync` must be called at the top level of your background script, not inside another callback.**

In Chrome Manifest V3, the background script runs as a service worker. Chrome can stop it after a period of inactivity and start it again when a message arrives. The script runs from the top again, so listeners must be registered whenever the service worker starts.

If you register a listener inside `onInstalled`, a `setTimeout`, or after an `await`, it might not exist when a message arrives.

```ts
// WRONG: only runs when the extension is installed or updated
browser.runtime.onInstalled.addListener(function () {
	api.onMessageAsync({
		/* ... */
	});
});

// RIGHT: registers the listener whenever the script starts
const api = oneTimeMsgFactory("background");

api.onMessageAsync({
	/* ... */
});
```

Calling `api.onMessageSync(...)` or `api.onMessageAsync(...)` registers the listener, so that call itself must sit at the top level. This is safe in Firefox too.

### 2.2 Use `onMessageSync` only for synchronous work

`onMessageSync` replies with the value returned by `onSyncCb`. If the callback returns a Promise, the sender does not receive its resolved value. Exceptions thrown by `onSyncCb` are not caught by the synchronous handler.

Use `onMessageAsync` when the callback performs I/O, awaits a Promise, or can throw.

### 2.3 `errorCb` means more than "the send failed"

For `messageBackgroundScript` and `messagePopupScript`:

- `successCb` runs when the receiver replies with `status: true`.
- `errorCb` runs when the receiver replies with `status: false`, sending fails, or no listener answers.

A failed reply does not reach `successCb`. Read `error.errorMessage` in `errorCb` to inspect the failure.

### 2.4 Give each message type one owner

A listener that does not own a message stays silent, allowing another listener to handle it. If multiple listeners accept the same message, the first response wins.

Give each message `type` to one listener.

### 2.5 Your callbacks are not wrapped

Your `successCb` runs outside the library's `try/catch`. If your callback throws, the error appears in the console, and `errorCb` is not called for that exception.

## 3. The Example: Request and Send a Bible Picture

Imagine a user wants to get a Bible picture and add it to a webpage.

The user opens the extension popup and clicks a button to request the picture. The background script performs the API request. If the request succeeds, the background sends the picture to the content script and notifies the popup:

**"Image request received and sent. You can double-click to add it."**

The user can then double-click the available image to add it to the webpage. If the request fails, the popup informs the user so they can retry.

- **Popup:** Starts the action and displays the outcome reported by the background. The popup must remain open to receive and display the response.
- **Background:** Receives the request, performs the API request, sends the picture to the content script after success, and reports the outcome to the popup.
- **Content script:** Receives the picture and makes it available for the webpage interaction, including the double-click action.

```text
USER
  |
  | Opens popup and clicks button
  v
POPUP
  |
  | GET_BIBLE_PICTURE
  v
BACKGROUND
  |
  | Performs API request
  |
  +---- Request fails
  |         |
  |         v
  |      POPUP
  |         |
  |         | Displays failure
  |         v
  |      User can retry
  |
  +---- Request succeeds
            |
            +---- Sends picture to CONTENT SCRIPT
            |                |
            |                v
            |        Picture available on webpage
            |                |
            |                v
            |        User double-clicks to add
            |
            +---- Notifies POPUP
                      |
                      v
              "Image request received
               and sent. You can
               double-click to add it."
```

There are two separate messaging operations:

1. **Popup → Background → Popup:** The popup initiates the request and receives its outcome.
2. **Background → Content script(s) → Background:** The background sends the picture to matching tabs and receives individual tab responses.

The background handles the request, the popup communicates the outcome, and the content script handles the webpage interaction.

**Important:** The notification above confirms that the request succeeded and the picture was sent to the content script. It does not, by itself, confirm that the user added the picture to the webpage. The content script must implement the double-click interaction for that behavior to work.

## 4. Initialize the Factory

```ts
import { oneTimeMsgFactory } from "xtension-messenger";

const api = oneTimeMsgFactory("popup");
```

The optional `scriptname` is used for initialization logging. Initialize the factory separately in each extension context that needs it.

## 5. Shared Message and Response Contracts

```ts
import type {
	ExtensionMessageInterface,
	StandardResponse,
	TabMessageResult,
	BrowserTabInterface,
	TabQueryPropsInterface,
} from "xtension-messenger";
```

### `ExtensionMessageInterface`

```ts
export interface ExtensionMessageInterface<T = unknown> {
	type: string;
	payload?: T;
}
```

- `type` identifies the requested operation.
- `payload` optionally carries structured data.

### `StandardResponse`

```ts
export interface StandardResponse<T = unknown> {
	status: boolean;
	errorMessage?: string;
	data?: T;
}
```

- `status` indicates the reported outcome.
- `errorMessage` optionally explains a failure.
- `data` contains the returned value when available.

### `TabMessageResult`

Each individual result from `messageContentScript` includes the tab information and its response.

```ts
export interface TabMessageResult {
	tabInfo: BrowserTabInterface;
	response: StandardResponse;
}
```

- `tabInfo` identifies the tab associated with the result.
- `response` contains that tab's individual response.

The individual response is nested inside `response`. Access its status using `tabResult.response.status`, not `tabResult.status`.

### Example payload types

```ts
type BiblePicture = {
	imageUrl: string;
	title: string;
};

type GetBiblePictureMessage = ExtensionMessageInterface<{ reference: string }>;

type InsertBiblePictureMessage = ExtensionMessageInterface<BiblePicture>;
```

---

## 6. Popup: Start the Action and Receive Its Outcome

The popup is the user's control panel. The user clicks a button to start the action, then the popup displays the outcome returned by the background script.

### Consumer example

```ts
const api = oneTimeMsgFactory("popup");

function requestBiblePicture() {
	const messageToSend: GetBiblePictureMessage = {
		type: "GET_BIBLE_PICTURE",
		payload: {
			reference: "Psalm 23:1",
		},
	};

	api.messageBackgroundScript({
		messageToSend,

		successCb: function (response) {
			console.log("Request succeeded:", response.data);
		},

		errorCb: function (error) {
			console.error("Request failed:", error.errorMessage);
		},
	});
}
```

Call `requestBiblePicture()` from the popup's button click handler.

### What happens?

1. The user opens the popup and clicks the button.
2. The popup sends `GET_BIBLE_PICTURE` to the background.
3. The background performs the API request.
4. If the request succeeds, the background sends the picture to the content script and returns a success response.
5. The popup displays the outcome so the user knows whether to proceed or retry.

**Keep the popup open:** In this example, the popup needs to remain open to receive and display the background's response. If the popup closes before the response arrives, its callback cannot update the closed popup.

The callbacks are not the direct return value of `messageBackgroundScript`. Their return values are ignored.

### `messageBackgroundScript` and `messagePopupScript`

These methods share the same implementation:

```ts
const messagePopupScript = messageBackgroundScript;
```

Use whichever name best describes the calling context. Neither method registers a listener.

---

## 7. Background: Perform the Request and Notify the Popup

The background receives the request, performs the API call, and decides what response to send.

### Listener options

```ts
import type { Runtime } from "webextension-polyfill";

{
	validateMessage?: (message: ExtensionMessageInterface) => boolean;
	validateSender?: (sender: Runtime.MessageSender) => boolean;
	onAsyncCb?: (
		message: ExtensionMessageInterface,
		sender: Runtime.MessageSender
	) => Promise<any> | boolean;
}
```

### Mock API request

```ts
async function fetchBiblePicture(): Promise<BiblePicture> {
	await new Promise(function (resolve) {
		setTimeout(resolve, 3000);
	});

	return {
		imageUrl: "https://example.com/bible-picture.jpg",
		title: "Psalm 23:1",
	};
}
```

This simulates an asynchronous request taking three seconds. It does not call a real Bible-picture service.

### Background consumer example

```ts
const api = oneTimeMsgFactory("background");

api.onMessageAsync({
	validateMessage: function (message) {
		return message.type === "GET_BIBLE_PICTURE";
	},

	onAsyncCb: async function () {
		const picture = await fetchBiblePicture();

		api.messageContentScript({
			tabQueryProps: {
				active: true,
				currentWindow: true,
			},

			messageToSend: {
				type: "INSERT_BIBLE_PICTURE",
				payload: picture,
			},

			successCb: function (response) {
				if (!response.status || !response.data) return;

				for (const tabResult of response.data) {
					console.log("Tab:", tabResult.tabInfo);
					console.log("Content script response:", tabResult.response);
				}
			},

			errorCb: function (error) {
				console.error("Could not query or message tabs:", error.errorMessage);
			},
		});

		// Return the successful API result to the popup.
		return {
			message:
				"Image request received and sent. You can double-click to add it.",
			data: picture,
		};
	},
});
```

The example returns the notification text and picture data to the popup after the API request succeeds.

The `messageContentScript` call has its own callbacks. This example does not wait for that operation to finish before returning the API result to the popup.

Therefore, the popup's success notification indicates that the API request succeeded and the content-script messaging operation was initiated. It does not prove that a content script received the picture or that the user added it to the webpage.

If you need to guarantee that the picture was delivered before notifying the user, the background must wait for and inspect the content-script operation's outcome before returning success.

---

## 8. Content Script: Receive the Picture and Handle the Webpage

The content script registers a listener for `INSERT_BIBLE_PICTURE`.

### Listener options

```ts
{
	validateMessage?: (message: ExtensionMessageInterface) => boolean;
	validateSender?: (sender: Runtime.MessageSender) => boolean;
	onSyncCb: (
		message: ExtensionMessageInterface,
		sender: Runtime.MessageSender
	) => unknown;
}
```

### Consumer example

```ts
const api = oneTimeMsgFactory("content");

api.onMessageSync({
	validateMessage: function (message) {
		return message.type === "INSERT_BIBLE_PICTURE";
	},

	onSyncCb: function (message) {
		const picture = message.payload as BiblePicture;

		// Make the picture available for the webpage interaction.
		const image = document.createElement("img");
		image.src = picture.imageUrl;
		image.alt = picture.title;
		image.style.maxWidth = "100%";
		image.style.cursor = "pointer";

		image.addEventListener("dblclick", function () {
			const addedImage = document.createElement("img");
			addedImage.src = picture.imageUrl;
			addedImage.alt = picture.title;
			addedImage.style.maxWidth = "100%";

			document.body.appendChild(addedImage);
		});

		document.body.appendChild(image);

		return {
			received: true,
			title: picture.title,
		};
	},
});
```

This illustrative implementation displays a clickable image preview and appends another image when the preview is double-clicked.

The content script returns an object describing its operation. That value becomes `data` in the individual tab's response.

This is example behavior for the documentation; the package itself does not automatically implement the image preview or double-click interaction.

---

## 9. `messageContentScript`: The Array Contract

`messageContentScript` queries tabs, sends a message to each matching tab one after another, and collects each processed tab's response alongside its tab information.

### Options

```ts
{
	tabQueryProps?: TabQueryPropsInterface;
	messageToSend?: ExtensionMessageInterface;
	successCb: (
		successMsg: StandardResponse<TabMessageResult[]>
	) => void | boolean;
	errorCb: (error: StandardResponse) => void | boolean;
}
```

### Success response

The success callback receives:

```ts
StandardResponse<TabMessageResult[]>;
```

The outer `StandardResponse` describes the batch operation. Its `data` property contains an array of individual tab results.

Each entry has this structure:

```ts
{
	tabInfo: {
		id: 5,
		url: "https://example.com/"
	},
	response: {
		status: true,
		data: {
			received: true,
			title: "Psalm 23:1"
		}
	}
}
```

The `tabInfo` field identifies the tab, while `response` contains the individual result.

### Consume the results without type assertions

```ts
api.messageContentScript({
	tabQueryProps: {
		active: true,
		currentWindow: true,
	},

	messageToSend: {
		type: "INSERT_BIBLE_PICTURE",
		payload: {
			imageUrl: "https://example.com/bible-picture.jpg",
			title: "Psalm 23:1",
		},
	},

	successCb: function (response) {
		if (!response.status || !response.data) return;

		const tabResponses = response.data;

		for (const tabResult of tabResponses) {
			console.log("Tab information:", tabResult.tabInfo);

			if (tabResult.response.status) {
				console.log("Tab handled the message:", tabResult.response.data);
			} else {
				console.error("Tab failed:", tabResult.response.errorMessage);
			}
		}
	},

	errorCb: function (error) {
		console.error("Batch operation failed:", error.errorMessage);
	},
});
```

### TypeScript protection

Because `response.data` is typed as `TabMessageResult[]`, TypeScript knows each entry contains `tabInfo` and `response`.

Correct:

```ts
tabResponses[0].response.status;
```

Incorrect:

```ts
tabResponses[0].status;
```

The incorrect access should produce a TypeScript error, provided the type information has not been overridden with `any` or a type assertion.

Avoid this old pattern:

```ts
const tabResponses = response.data as StandardResponse[];
```

It tells TypeScript to trust the old response structure instead of using the declared type. Let the callback's inferred type provide the protection.

TypeScript checks types at compile time. It does not validate arbitrary runtime data.

### What does the outer status mean?

The outer `status: true` means the batch operation reached its success callback. It does not mean every tab succeeded.

An individual `tabResult.response.status` can be `false` when:

- `browser.tabs.sendMessage()` rejects, such as when a page has no content script.
- The listener returns a failure response.
- The send operation produces no usable response.

The outer operation can succeed while individual tab entries report failure.

The `errorCb` handles batch-level failures such as missing query options, a failed tab query, or no matching tabs.

Tabs without an ID are skipped, so the returned array may contain fewer entries than the original query results.

### Does the method return the array directly?

No. The array is delivered through `successCb` as `response.data`.

Do not expect this to return the array:

```ts
const responses = await api.messageContentScript(...);
```

The method invokes its callback and resolves to `undefined`.

---

## 10. `getTabsFn`

### Relevant interfaces

```ts
export interface TabQueryPropsInterface {
	active?: boolean;
	currentWindow?: boolean;
	lastFocusedWindow?: boolean;
	audible?: boolean;
	autoDiscardable?: boolean;
	discarded?: boolean;
	pinned?: boolean;
	highlighted?: boolean;
	index?: number;
	muted?: boolean;
	title?: string;
	url?: string | string[];
	windowId?: number;
}

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
```

`TabQueryPropsInterface` describes query filters. `BrowserTabInterface` describes tab information returned by the query.

### Purpose

Queries tabs using the WebExtension `tabs.query` API and resolves with the matching tab objects.

```ts
const tabs = await api.getTabsFn({
	active: true,
	currentWindow: true,
});

console.log(tabs);
```

The function rejects if query options are missing. Otherwise, it delegates to `browser.tabs.query`.

---

## 11. `onMessageSync`

Use `onMessageSync` when the handler can produce its result synchronously and does no I/O.

```ts
api.onMessageSync({
	validateMessage: function (message) {
		return message.type === "PING";
	},

	onSyncCb: function () {
		return { pong: true };
	},
});
```

The listener validates the message, invokes `onSyncCb`, and sends its return value as `response.data`.

If `validateMessage` returns `false`, the listener returns `undefined` without responding, allowing another listener to handle the message.

If `validateSender` returns `false`, the listener sends a failure response.

A falsy result triggers a console warning. The warning is advisory: `false`, `0`, and `""` can be intentional return values.

The synchronous handler does not catch exceptions thrown by `onSyncCb`. Use `onMessageAsync` if the callback can throw.

---

## 12. `onMessageAsync`

Use `onMessageAsync` for operations that need asynchronous work.

```ts
api.onMessageAsync({
	validateMessage: function (message) {
		return message.type === "FETCH_DATA";
	},

	onAsyncCb: async function () {
		const response = await fetch("https://example.com/data");

		if (!response.ok) {
			throw new Error("The request failed");
		}

		return await response.json();
	},
});
```

The listener:

1. Runs the validators.
2. Executes and awaits `onAsyncCb`.
3. Sends the resolved value in `response.data`.
4. Catches exceptions and rejected promises from the callback, returning a failure response.
5. Returns `true` to keep the response channel open while the asynchronous callback is running.

Falsy results trigger a console warning but do not automatically make the response unsuccessful.

The callback is optional in the current interface. If omitted, the handler can return `undefined` with `status: true`, alongside a warning.

---

## 13. Error Handling and Response Semantics

All responses use:

```ts
export interface StandardResponse<T = unknown> {
	status: boolean;
	errorMessage?: string;
	data?: T;
}
```

Interpret each response according to the operation that produced it:

- **Popup-to-background:** `successCb` receives a successful background reply. A failure response, send failure, or missing reply goes to `errorCb`.
- **Background-to-content:** `successCb` receives an outer response whose `data` contains `TabMessageResult` entries.
- **Tab identification:** Each entry contains `tabInfo` and `response`.
- **Batch-level failure:** `errorCb` reports a failure to query or start the batch operation.
- **Individual tab failure:** The entry's `response.status` is `false`, even if the outer batch status is `true`.
- **Message not for this listener:** The listener stays silent so another listener can answer.
- **Async listener failure:** An exception thrown or rejected by `onAsyncCb` becomes a failure response.
- **Falsy handler result:** A warning is logged, but the result itself is still sent as data.
- **Your own callbacks:** An exception thrown inside your `successCb` is not routed to `errorCb`.

Do not treat a successful outer batch status as proof that every tab succeeded.

For the Bible-picture example, also distinguish these outcomes:

1. The API request succeeded.
2. The background sent the picture to a content script.
3. The content script received the picture.
4. The user double-clicked and added the picture.

A success notification should describe the outcome that has actually been confirmed.

---

## 14. Design Principles

- One-time messaging rather than persistent ports.
- Explicit message types and optional payloads.
- Optional message and sender validation.
- Promise-based asynchronous listeners.
- Consistent response objects.
- Per-tab response arrays that retain the associated tab information.
- Minimal abstraction over WebExtension APIs.

## 15. Recommended Usage

- Register listeners at the top level of your background script.
- Use `onMessageSync` for synchronous operations without I/O.
- Use `onMessageAsync` for asynchronous work and anything that can throw.
- Give each message `type` to exactly one listener.
- Keep validators focused and predictable.
- Throw or reject when asynchronous work genuinely fails.
- Handle failed replies in `errorCb`.
- Inspect each `TabMessageResult.response` in `messageContentScript` results.
- Use inferred callback types instead of overriding them with type assertions.
- Keep the popup open when the user needs to receive the response in that popup.
- Tell users what the background has actually confirmed.
- Test supported browsers individually.

`oneTimeMsgFactory` standardizes one-time extension messaging. The extension defines the work performed by each listener, and the consumer handles the resulting responses and failures.
