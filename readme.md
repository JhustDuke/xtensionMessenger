# oneTimeMsgFactory

A small, opinionated messaging utility for **WebExtensions** (Firefox ) that standardizes **one-time messaging**, **tab querying**, and **safe message listeners** across **background**, **content**, and **popup** scripts.

This factory centralizes:

- Message sending (background, popup, content)
- Tab querying
- Sync and async message listeners
- Validation and error handling

---

## Factory Signature

```ts
oneTimeMsgFactory(scriptname?: string): OneTimeMsgAPI
```

### Parameters

- **scriptname?** `string`

  - Optional label used only for logging when the script runs.

### Side Effect

Logs execution time:

```
<name> ran <HH>:<MM>
```

---

## Returned API

```ts
{
	messageBackgroundScript,
		messagePopupScript,
		messageContentScript,
		onMessageSync,
		onMessageAsync,
		getTabsFn;
}
```

Each method is described below.

---

## getTabsFn

### Purpose

Query browser tabs using the WebExtension `tabs.query` API.

### Signature

```ts
getTabsFn(
  tabQueryOptions: TabQueryPropsInterface | FutureTabQueryProps
): Promise<BrowserTabInterface[]>
```

### Behavior

- Resolves with matching tabs
- Rejects if query options are missing

### Example

```ts
const tabs = await api.getTabsFn({ active: true, currentWindow: true });
```

---

## messageBackgroundScript

### Purpose

Send a one-time message **to the background script**.

### Signature

```ts
messageBackgroundScript(options: MessageToBackgroundInterface): Promise<void>
```

### Options

- **message**: `ExtensionMessageInterface`
- **successCb**: `(response: any) => void`
- **errorCb**: `(error: any) => void`

### Example

```ts
api.messageBackgroundScript({
	message: { type: "PING" },
	successCb: function (res) {
		console.log(res);
	},
	errorCb: function (err) {
		console.error(err);
	},
});
```

---

## messagePopupScript

Alias of `messageBackgroundScript`.

### Why it exists

- API symmetry
- Semantic clarity when used inside popup scripts

```ts
const messagePopupScript = messageBackgroundScript;
```

---

## messageContentScript

### Purpose

Send a message **to a content script** running in a specific tab.

### Signature

```ts
messageContentScript(options: SendToContentInterface): Promise<void>
```

### Options

- **tabQueryProps**: tab query used to locate target tab
- **message**: `ExtensionMessageInterface`
- **successCb**: `(response: any) => void`
- **errorCb**: `(error: any) => void`

### Behavior

1. Queries tabs
2. Selects first matching tab
3. Sends message to that tab

### Example

```ts
api.messageContentScript({
	tabQueryProps: { active: true, currentWindow: true },
	message: { type: "INJECT" },
	successCb: function (res) {
		console.log(res);
	},
	errorCb: function (err) {
		console.error(err);
	},
});
```

---

## onMessageSync

### Purpose

Register a **synchronous** message listener.

### Signature

```ts
onMessageSync(opts: OnMessageSyncInterface): void
```

### Options

- **validateMessage?** `(msg) => boolean`
- **validateSender?** `(sender) => boolean`
- **reply?** `any` (default: "default reply")

### Behavior

- Validation failures immediately respond with `status: fail`
- Success responds immediately
- Channel closes automatically

### Example (Background or Content)

```ts
api.onMessageSync({
	validateMessage: function (msg) {
		return msg.type === "PING";
	},
	reply: "PONG",
});
```

---

## onMessageAsync

### Purpose

Register an **asynchronous** message listener with full error handling.

### Signature

```ts
onMessageAsync(opts: OnMessageAsyncInterface): void
```

### Options

- **validateMessage?** `(msg) => boolean`
- **validateSender?** `(sender) => boolean`
- **onAsyncCb** `(message, sender) => Promise<any | false>`

### Behavior

1. Runs validators
2. Executes async callback
3. If callback returns `false` → treated as error
4. Any thrown error is caught and returned
5. Message channel kept open (`return true`)

### Example

```ts
api.onMessageAsync({
	validateMessage: function (msg) {
		return msg.type === "FETCH_DATA";
	},
	onAsyncCb: async function () {
		const data = await fetchData();
		return data;
	},
});
```

### Error Example

```ts
onAsyncCb: async function () {
  return false; // will trigger error response
}
```

---

## Message Contract

All messages use:

```ts
interface ExtensionMessageInterface<T = any> {
	type: string;
	payload?: T;
}
```

This ensures:

- Explicit intent via `type`
- Optional structured payload

---

## Design Principles

- One-time messaging only (no ports)
- Single-response guarantee
- Explicit validation hooks
- Async-safe error handling
- Minimal abstraction over WebExtension APIs

---

## Recommended Usage

- Use **onMessageSync** for simple request/response
- Use **onMessageAsync** for async logic or I/O
- Keep validators pure and boolean
- Throw errors inside async callbacks when failing

---

## Summary

`oneTimeMsgFactory` provides a consistent, defensive messaging layer that prevents silent failures, enforces validation, and simplifies extension communication without hiding WebExtension primitives.
