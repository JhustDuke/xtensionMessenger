import { jest } from "@jest/globals";
import { oneTimeMsgFactory } from "../factory/oneTimeMsg";
import { BrowserTabInterface } from "../interfaces";

describe("getTabsFn", function () {
	let mockTabs: BrowserTabInterface[] = [{ id: 1, active: true }];

	beforeAll(function () {
		global.browser = {
			tabs: {
				query: mockQuery(mockTabs),
			},
		} as any;
	});

	it("resolves with tabs when query is provided", async function () {
		const tabs = await oneTimeMsgFactory.getTabsFn({ active: true, id: 1 });

		expect(tabs).toEqual(mockTabs);
		expect(browser.tabs.query).toHaveBeenCalledWith({ active: true, id: 1 });
	});

	it("rejects when query is undefined", async function () {
		await expect(oneTimeMsgFactory.getTabsFn(undefined as any)).rejects.toThrow(
			"tab querying failed"
		);
	});

	it("return more than one matching tab", async function () {
		const mockTabs: BrowserTabInterface[] = [
			{ id: 1, active: false, url: "testUrl" },
			{ id: 2, active: false, url: "testUrl" },
		];
		global.browser.tabs.query = mockQuery(mockTabs) as any;
		const tabs = await oneTimeMsgFactory.getTabsFn({
			active: false,
			url: "testUrl",
		});

		expect(tabs.length).toBe(2);
	});
});

function mockQuery(mockTabs: BrowserTabInterface[]) {
	return jest.fn(function (queryInfo: any): Promise<BrowserTabInterface[]> {
		if (!queryInfo) {
			return Promise.reject(new Error("tab querying failed"));
		}
		const matchedTabs: BrowserTabInterface[] = [];
		for (const tab of mockTabs) {
			let isMatch = true;
			for (const key of Object.keys(queryInfo)) {
				if (tab[key as keyof BrowserTabInterface] !== queryInfo[key]) {
					isMatch = false;
					break;
				}
			}
			if (isMatch) matchedTabs.push(tab);
		}
		return Promise.resolve(matchedTabs);
	});
}
