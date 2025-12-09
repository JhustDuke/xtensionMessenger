import { jest } from "@jest/globals";
import { oneTimeMsgFactory } from "../factory";

const sendMessageMock = jest.fn(function () {
	return Promise.resolve({ active: true });
});
const queryMock = jest.fn();

beforeAll(function () {
	global.browser = {
		tabs: {
			query: queryMock,
			sendMessage: sendMessageMock,
		},
	} as any;
});

describe("messageContentScript", function () {
	it("sends message to the first tab and calls successCb", async function () {
		queryMock.mockImplementation(function () {
			return Promise.resolve([{ id: 1 }]);
		}); // MUST mock this first // resolves to success

		const successCb = jest.fn(function () {});
		const errorCb = jest.fn(function () {});

		await oneTimeMsgFactory.messageContentScript({
			tabQueryProps: { active: true },
			message: { cmd: "hello" },
			successCb,
			errorCb,
		});

		expect(successCb).toHaveBeenCalled();
		expect(errorCb).not.toHaveBeenCalled();
	});

	it("fails when tabQueryProps is missing", async function () {
		const successCb = jest.fn(function () {});
		const errorCb = jest.fn(function () {});

		await oneTimeMsgFactory.messageContentScript({
			tabQueryProps: undefined as any,
			message: {},
			successCb,
			errorCb,
		});

		expect(errorCb).toHaveBeenCalled();
	});

	it("fails when no tabs are found", async function () {
		queryMock.mockImplementation(function () {
			return Promise.resolve({ url: "testUrl" });
		});
		const successCb = jest.fn(function () {});
		const errorCb = jest.fn(function () {});

		await oneTimeMsgFactory.messageContentScript({
			tabQueryProps: { active: true },
			message: {},
			successCb,
			errorCb,
		});

		expect(errorCb).toHaveBeenCalled();
		expect(successCb).not.toHaveBeenCalled();
	});

	it("calls errorCb when sendMessage rejects", async function () {
		sendMessageMock.mockRejectedValue(new Error("reject-msg"));

		const successCb = jest.fn(function () {});
		const errorCb = jest.fn(function () {});
		await oneTimeMsgFactory.messageContentScript({
			tabQueryProps: { active: true },
			message: {},
			successCb,
			errorCb,
		});

		expect(errorCb).toHaveBeenCalled();
	});
});
