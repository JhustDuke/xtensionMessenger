export declare function portFactory(scriptName?: string): {
    createPort: (portName: string) => browser.runtime.Port;
    receiveMessage: (portName: string, callback: (msg: any) => void) => void;
    sendMessage: (portName: string, message: any) => void;
    joinPort: (portName: string, onConnectCb: (port: browser.runtime.Port) => void) => void;
    connectToTab: (tabQueryProps: object, portName: string, options?: {
        receiveMsgCb?: (message: any) => void;
        sendMessageCb?: () => any;
    }) => Promise<void>;
};
//# sourceMappingURL=portFactory.d.ts.map