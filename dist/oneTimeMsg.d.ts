export declare function oneTimeMsgFactory(scriptname?: string): {
    sendMessageToBackgroundScript: (message?: {}, callbacks?: {
        errorCb?: (error?: Error) => Error | any;
        successCb?: (response: object) => object | void;
    }) => Promise<void>;
    sendMessageToPopupScript: (message?: {}, callbacks?: {
        errorCb?: (error?: Error) => Error | any;
        successCb?: (response: object) => object | void;
    }) => Promise<void>;
    sendMessageToContentScript: (tabMessagingOptions: {
        tabQueryProps?: object;
        message?: object;
        errorCb?: (errorMsg: Error) => void;
        successCb?: (successMsg: any) => void;
    }) => Promise<void>;
    onMessageReceived: ({ validateMessage, validateSender, reply, }: {
        validateMessage?: (message: string) => boolean | undefined;
        validateSender?: (sender: browser.runtime.MessageSender) => boolean | undefined;
        reply?: string;
    }) => void;
    getTabs: (tabQueryOptions: any) => Promise<any>;
};
//# sourceMappingURL=oneTimeMsg.d.ts.map