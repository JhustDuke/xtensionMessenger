export function portFactory(scriptName?: string) {
	const time = new Date();
	console.log(
		`${
			scriptName || "Unnamed script"
		} ran at ${time.getHours()}:${time.getMinutes()}`
	);

	const allPorts: Record<string, browser.runtime.Port> = {};

	/**
	 * Creates a new communication port with a given name and stores it.
	 * @param {string} portName - Name of the port to create.
	 * @returns {browser.runtime.Port} - The created port instance.
	 */
	const createPort = (portName: string): browser.runtime.Port => {
		const port = browser.runtime.connect({ name: portName });
		allPorts[portName] = port;
		return port;
	};

	/**
	 * Listens for messages from a specified port and triggers a callback when a message is received.
	 * @param {string} portName - Name of the port to listen to.
	 * @param {(msg: any) => void} callback - Function to handle incoming messages.
	 */
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

	/**
	 * Sends a message through a specified port.
	 * @param {string} portName - Name of the port to send the message through.
	 * @param {any} message - The message to send.
	 */
	const sendMessage = (portName: string, message: any) => {
		const port = allPorts[portName];
		if (!port) {
			throw new Error(
				`Port "${portName}" is not created. Use createPort() or joinPort() first.`
			);
		}
		port.postMessage(message);
	};

	/**
	 * Joins an existing port and registers a callback for when a connection is made.
	 * @param {string} portName - Name of the port to join.
	 * @param {(port: browser.runtime.Port) => void} onConnectCb - Callback executed when the port connects.
	 */
	const joinPort = (
		portName: string,
		onConnectCb: (port: browser.runtime.Port) => void
	) => {
		browser.runtime.onConnect.addListener((port: browser.runtime.Port) => {
			if (port.name === portName) {
				allPorts[portName] = port;
				onConnectCb(port);
			} else {
				console.error(`${portName} doesn't exist: PORTS => ${allPorts}`);
			}
		});
	};

	/**
	 * Connects to a tab using a port and sends a message if applicable.
	 * @param {object} [tabQueryProps={}] - Properties for querying tabs.
	 * @param {string} portName - Name of the port to use.
	 * @param {object} [options={}] - Configuration options.
	 * @param {(message: any) => void} [options.receiveMsgCb] - Callback for received messages.
	 * @param {() => any} [options.sendMessageCb] - Function returning the message to send.
	 */
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
						console.log("Received message:", message);
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
					console.log(`Message sent to tab ${tab.id} successfully.`);
				} else {
					console.error("Tab ID not found. Message sending failed.");
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
