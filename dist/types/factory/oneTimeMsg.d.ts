import { TabQueryPropsInterface, SendToContentInterface, OnMessageAsyncInterface, OnMessageSyncInterface, BrowserTabInterface, FutureTabQueryProps, ExtensionMessageInterface, StandardResponse } from "../interfaces";
export declare const oneTimeMsgFactory: (scriptname?: string) => {
    messageBackgroundScript: (options: {
        message: ExtensionMessageInterface;
        successCb: (response: StandardResponse) => void;
        errorCb: (error: StandardResponse) => void;
    }) => Promise<void>;
    messagePopupScript: (options: {
        message: ExtensionMessageInterface;
        successCb: (response: StandardResponse) => void;
        errorCb: (error: StandardResponse) => void;
    }) => Promise<void>;
    messageContentScript: (options: SendToContentInterface) => Promise<void>;
    onMessageSync: (opts: OnMessageSyncInterface) => void;
    onMessageAsync: (opts: OnMessageAsyncInterface) => void;
    getTabsFn: (tabQueryOptions: TabQueryPropsInterface | FutureTabQueryProps) => Promise<BrowserTabInterface[]>;
};
