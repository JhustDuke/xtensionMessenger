export function portFactory(scriptName?: string) {
	const time = new Date();
	console.log(
		`${
			scriptName || "Unnamed script"
		} ran at ${time.getHours()}:${time.getMinutes()}`
	);

	const allPorts: Record<string, browser.runtime.Port> = {};

	const createPort = (portName: string): browser.runtime.Port => {
		const port = browser.runtime.connect({ name: portName });
		allPorts[portName] = port;
		return port;
	};

	const receiveMessage = (portName: string, callback: (msg: any) => void) => {
		const port = allPorts[portName];
		if (!port) {
			throw new Error(
				`Port "${portName}" is not created. Use createPort() or joinPort() first.`
			);
		}
		if (typeof callback !== "function") {
			throw new Error("Callback must be a function.");
		}
		port.onMessage.addListener(callback);
	};

	const sendMessage = (portName: string, message: any) => {
		const port = allPorts[portName];
		if (!port) {
			throw new Error(
				`Port "${portName}" is not created. Use createPort() or joinPort() first.`
			);
		}
		port.postMessage(message);
	};

	const joinPort = (
		portName: string,
		onConnectCb: (port: browser.runtime.Port) => void
	) => {
		browser.runtime.onConnect.addListener((port: browser.runtime.Port) => {
			if (port.name === portName) {
				allPorts[portName] = port;
				onConnectCb(port);
			} else {
				console.error(`${portName} doesnt exist:  PORTS => ${allPorts}`);
			}
		});
	};
	const connectToTab = async function (
		tabQueryProps: object = {},
		portName: string,
		options: {
			receiveMsgCb?: (message: any) => void;
			sendMessageCb?: () => any;
		} = {}
	): Promise<void> {
		try {
			const {
				receiveMsgCb = (message) => {
					if (message) {
						console.log("receive message:", message);
					}
				},
				sendMessageCb = () => ({ defaultMessage: "hello world" }),
			} = options;
			const tabs = await browser.tabs.query(tabQueryProps);

			if (tabs.length === 0) {
				console.warn("No tabs found matching query.");
				return;
			}

			for (let tab of tabs) {
				if (tab.id) {
					const port = browser.tabs.connect(tab.id, { name: portName });
					console.log(`Connected to tab ${tab.id} with port: ${portName}`);

					if (receiveMsgCb) port.onMessage.addListener(receiveMsgCb);

					const message = sendMessageCb();
					port.postMessage(message);
					console.log(`Message sent to tab ${tab.id}: successfully`);
				} else {
					console.error("Tab ID not found and message sending failed");
				}
			}
		} catch (err) {
			console.error("Tab connection error:", err);
		}
	};

	return {
		createPort,
		receiveMessage,
		sendMessage,
		joinPort,
		connectToTab,
	};
}
