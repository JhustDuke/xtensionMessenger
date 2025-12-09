import {
	TabQueryPropsInterface,
	SendToContentInterface,
	MessageToBackgroundInterface,
	onMessageAsyncInterface,
	OnMessageSyncInterface,
	BrowserTabInterface,
	FutureTabQueryProps,
} from "./interfaces";
export declare const oneTimeMsgFactory: {
	messageBackgroundScript: (
		options: MessageToBackgroundInterface
	) => Promise<void>;
	messagePopupScript: (options: MessageToBackgroundInterface) => Promise<void>;
	messageContentScript: (options: SendToContentInterface) => Promise<void>;
	onMessageSync: (opts: OnMessageSyncInterface) => void;
	onMessageAsync: (opts: onMessageAsyncInterface) => void;
	getTabsFn: (
		tabQueryOptions: TabQueryPropsInterface | FutureTabQueryProps
	) => Promise<BrowserTabInterface[]>;
};
