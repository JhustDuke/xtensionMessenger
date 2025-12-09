import { oneTimeMsgFactory } from "../factory";

const contentScript = oneTimeMsgFactory("contentscript");

contentScript.onRecievingMessage({
	globalResponse: "Default response from content script",
	validateMessage: (message, response) => {
		console.log("Validating message:", message);
		return response;
	},
});
console.log(4);
