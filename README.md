# One-Time Message Factory (oneTimeMsgFactory)

A utility module for browser extensions that streamlines message passing between background scripts, popup scripts, and content scripts. It also provides helpers for querying tabs and creating both synchronous and asynchronous message listeners.

---

## Features

- Query active or specific browser tabs
- Send messages to:

  - Background scripts
  - Popup scripts
  - Content scripts

- Create synchronous message listeners
- Create asynchronous message listeners (keeps channel open)
- Strong TypeScript typings via provided interfaces

---

## Factory Initialization

```ts
import { oneTimeMsgFactory } from "./path";
const api = oneTimeMsgFactory("my-script");
```

Logs script run time and returns all available helper methods.

---

## API METHODS

### **getTabsFn(tabQueryOptions)**

Queries browser tabs.
Returns: `Promise<BrowserTabInterface[]>`.

### **messageBackgroundScript(options)**

Sends a typed message to the background script.

### **messagePopupScript(options)**

Alias of `messageBackgroundScript` for popup scripts.

### **messageContentScript(options)**

Queries for a tab then sends a message to that tab’s content script.

### **onMessageSync(options)**

Creates a synchronous message listener using optional validators.
Auto-replies and closes channel.

### **onMessageAsync(options)**

Creates an async message listener.
Channel stays open until callback resolves.

---

## INTERFACES

### **TabQueryPropsInterface**

Represents supported browser tab query fields.

### **FutureTabQueryProps**

Extends tab query props with additional dynamic fields.

### **BrowserTabInterface**

Shape of a browser tab object.

### **SendToContentInterface**

Options for messaging content scripts.
Includes query props, message, and callbacks.

### **MessageToBackgroundInterface**

Options for messaging background scripts.

### **OnMessageSyncInterface**

Validator-based sync message handler config.

### **onMessageAsyncInterface**

Validator-based async message handler config with async callback.

### **StandardResponse**

Consistent structure for async responses.

### **handlerInterface**

Signature for message listener functions.

---

## Example (Vanilla TS)

```ts
const api = oneTimeMsgFactory("popup");

api.messageBackgroundScript({
	message: { type: "PING" },
	errorCb: function (err: any) {
		console.error(err);
	},
	successCb: function (res: unknown) {
		console.log(res);
	},
});
```

---

## More Examples

### getTabsFn

```ts
const api = oneTimeMsgFactory("tester");
api.getTabsFn({ active: true }).then(function (tabs) {
	console.log(tabs);
});
```

### messageBackgroundScript

```ts
api.messageBackgroundScript({
	message: { type: "CHECK_STATUS" },
	errorCb: function (err: any) {
		console.error(err);
	},
	successCb: function (res: unknown) {
		console.log(res);
	},
});
```

### messagePopupScript

```ts
api.messagePopupScript({
	message: { popup: true },
	errorCb: function (e: any) {
		console.error(e);
	},
	successCb: function (r: unknown) {
		console.log(r);
	},
});
```

### messageContentScript

```ts
api.messageContentScript({
	tabQueryProps: { active: true, currentWindow: true },
	message: { action: "FETCH_DATA" },
	errorCb: function (e: any) {
		console.error(e);
	},
	successCb: function (d: unknown) {
		console.log(d);
	},
});
```

### onMessageSync

```ts
api.onMessageSync({
	validateMessage: function (msg: any) {
		return msg?.type === "PING";
	},
	validateSender: function () {
		return true;
	},
	reply: { msg: "PONG" },
});
```

### onMessageAsync

```ts
api.onMessageAsync({
	validateMessage: function (msg: any) {
		return msg?.type === "ASYNC_PING";
	},
	validateSender: function (sender: browser.runtime.MessageSender) {
		return Boolean(sender?.id);
	},
	onAsyncCb: async function (
		message: any,
		sender: browser.runtime.MessageSender
	) {
		return new Promise(function (resolve) {
			setTimeout(function () {
				resolve({
					received: message.type,
					from: sender.id,
					tab: sender.tab?.id,
				});
			}, 500);
		});
	},
});
```

## Notes

- All callbacks must be provided.
- `onMessageAsync` must return `true` to keep the channel open.
- Designed for strict, predictable TypeScript typing.
