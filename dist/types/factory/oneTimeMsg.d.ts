import { TabQueryPropsInterface, SendToContentInterface, MessageToBackgroundInterface, OnMessageAsyncInterface, OnMessageSyncInterface, BrowserTabInterface, FutureTabQueryProps } from "../interfaces";
export declare const oneTimeMsgFactory: (scriptname?: string) => {
    messageBackgroundScript: (options: MessageToBackgroundInterface) => Promise<void>;
    messagePopupScript: (options: MessageToBackgroundInterface) => Promise<void>;
    messageContentScript: (options: SendToContentInterface) => Promise<void>;
    onMessageSync: (opts: OnMessageSyncInterface) => void;
    onMessageAsync: (opts: OnMessageAsyncInterface) => void;
    getTabsFn: (tabQueryOptions: TabQueryPropsInterface | FutureTabQueryProps) => Promise<BrowserTabInterface[]>;
};
