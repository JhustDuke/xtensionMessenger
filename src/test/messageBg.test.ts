import { jest } from "@jest/globals";
import { oneTimeMsgFactory } from "../factory";

const sendMessageMock = jest.fn(function () {
	return new Promise(function (resolve, reject) {
		resolve({ ok: true });
	});
});

beforeAll(function () {
	global.browser = {
		runtime: {
			sendMessage: sendMessageMock,
		},
	} as any;
});

describe("simulate sending messaging to backgroundScript", function () {
	it("calls successCb when sendMessage resolves", async function () {
		const successCb = jest.fn(function () {
			return true;
		});
		const errorCb = jest.fn();

		await oneTimeMsgFactory.messageBackgroundScript({
			message: { cmd: "ping" },
			successCb,
			errorCb,
		});

		expect(successCb).toHaveBeenCalledWith({ ok: true });
		expect(errorCb).not.toHaveBeenCalled();
	});

	it("calls errorCb when sendMessage rejects", async function () {
		sendMessageMock.mockRejectedValue(new Error("reject-case"));

		const successCb = jest.fn(function () {});
		const errorCb = jest.fn();

		await oneTimeMsgFactory.messageBackgroundScript({
			message: { cmd: "ping" },
			successCb,
			errorCb,
		});

		expect(errorCb).toHaveBeenCalledWith("reject-case");
		expect(successCb).not.toHaveBeenCalled();
	});
});
