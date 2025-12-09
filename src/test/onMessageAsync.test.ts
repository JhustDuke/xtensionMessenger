import { jest } from "@jest/globals";
import { oneTimeMsgFactory } from "../factory/oneTimeMsg";
import { handlerInterface, StandardResponse } from "../interfaces";

// Mock function to simulate browser.runtime.onMessage.addListener
const addListenerMock = jest.fn();

// Global setup before all tests run
beforeAll(function () {
	// Mock the global `browser` object used in the factory
	global.browser = {
		runtime: {
			onMessage: {
				addListener: addListenerMock, // capture registered handlers
			},
		},
	} as any;
});

describe("oneTimeMsgFactory onMessageAsync", function () {
	// Reset mocks before each test to ensure no call history leaks between tests
	beforeEach(function () {
		jest.clearAllMocks();
	});

	it("fails if validateMessage returns false", function () {
		// Mock sendResponse function
		const sendResponseMock = jest.fn();

		// Register async message handler with only validateMessage failing
		oneTimeMsgFactory.onMessageAsync({
			validateMessage: () => false,
		});

		// Grab the registered handler from addListenerMock
		const onMessageCb = addListenerMock.mock.calls[0][0] as handlerInterface;

		// Invoke the handler with a test message and mock sender
		onMessageCb("anyMessage", { id: "1" }, sendResponseMock);

		// Assert that sendResponse was called with expected failure structure
		expect(sendResponseMock).toHaveBeenCalledWith({
			isPassed: false,
			response: "validateMessage failed",
		});
	});

	it("fails if validateSender returns false", function () {
		const sendResponseMock = jest.fn();

		// Register handler where sender validation fails
		oneTimeMsgFactory.onMessageAsync({
			validateSender: () => false,
		});

		// Extract handler
		const onMessageCb = addListenerMock.mock.calls[0][0] as handlerInterface;

		// Invoke handler
		onMessageCb("anyMessage", { id: "1" }, sendResponseMock);

		// Assert response indicates sender validation failure
		expect(sendResponseMock).toHaveBeenCalledWith({
			isPassed: false,
			response: "validateSender failed",
		});
	});

	it("calls onAsync callback when sender validation passes", async function () {
		const sendResponseMock = jest.fn();
		const onAsyncCb = jest.fn(() => Promise.resolve("async ran"));

		// Register handler with sender validation passing
		oneTimeMsgFactory.onMessageAsync({
			validateSender: (sender) => sender.url === "testUrl",
			onAsyncCb,
		});

		const onMessageCb = addListenerMock.mock.calls[0][0] as handlerInterface;

		// Await handler to allow async IIFE to finish
		await onMessageCb("anyMessage", { url: "testUrl" }, sendResponseMock);

		// Assert the async callback ran with correct args
		expect(onAsyncCb).toHaveBeenCalledWith("anyMessage", { url: "testUrl" });

		// Assert sendResponse called with standardized success response
		expect(sendResponseMock).toHaveBeenCalledWith({
			data: "async ran",
			isPassed: true,
			response: "async success",
		});
	});

	it("handles async callback failure correctly", async function () {
		const sendResponseMock = jest.fn();
		const onAsyncCb = jest.fn(() => Promise.reject(new Error("async failed")));

		// Register handler with always-passing sender validation
		oneTimeMsgFactory.onMessageAsync({
			validateSender: () => true,
			onAsyncCb,
		});

		const onMessageCb = addListenerMock.mock.calls[0][0] as handlerInterface;

		await onMessageCb("anyMessage", { url: "anyUrl" }, sendResponseMock);

		// Async callback should have been called
		expect(onAsyncCb).toHaveBeenCalled();

		// sendResponse should capture standardized async failure
		expect(sendResponseMock).toHaveBeenCalledWith({
			isPassed: false,
			response: "async failed",
		});
	});

	it("calls onAsync callback with simulated delay using fake timers", async function () {
		// Enable fake timers to simulate delays without slowing tests
		jest.useFakeTimers();

		const sendResponseMock = jest.fn();
		const onAsyncCb = jest.fn(
			() =>
				new Promise((resolve) => {
					// Simulate 2s API delay
					setTimeout(() => {
						resolve("async ran after delay");
					}, 2000);
				})
		);

		oneTimeMsgFactory.onMessageAsync({
			validateSender: (sender) => sender.url === "testUrl",
			onAsyncCb,
		});

		const handler = addListenerMock.mock.calls[0][0] as handlerInterface;

		// Trigger handler and capture promise for async completion
		const promise = handler("anyMessage", { url: "testUrl" }, sendResponseMock);

		// Fast-forward all timers to immediately resolve setTimeout
		jest.runAllTimers();

		// Wait for the handler's async IIFE to complete
		await promise;

		// Assert async callback received correct arguments
		expect(onAsyncCb).toHaveBeenCalledWith("anyMessage", { url: "testUrl" });

		// Assert sendResponse called with standardized response after delay
		expect(sendResponseMock).toHaveBeenCalledWith({
			isPassed: true,
			data: "async ran after delay",
			response: "async success",
		});

		// Restore real timers after test
		jest.useRealTimers();
	});
});
