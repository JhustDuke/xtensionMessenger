import { oneTimeMsgFactory } from "../factory";

const background = oneTimeMsgFactory("backgroundscript");
background.messageContentScript({
	tabQueryProps: { active: true, currentWindow: true },
	message: "Message from background",
	errorCb: (err) => console.error(err),
	successCb: (res) => console.log(res),
});
console.log("tt");
