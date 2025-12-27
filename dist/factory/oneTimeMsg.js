"use strict";
var __awaiter = (this && this.__awaiter) || function (thisArg, _arguments, P, generator) {
    function adopt(value) { return value instanceof P ? value : new P(function (resolve) { resolve(value); }); }
    return new (P || (P = Promise))(function (resolve, reject) {
        function fulfilled(value) { try { step(generator.next(value)); } catch (e) { reject(e); } }
        function rejected(value) { try { step(generator["throw"](value)); } catch (e) { reject(e); } }
        function step(result) { result.done ? resolve(result.value) : adopt(result.value).then(fulfilled, rejected); }
        step((generator = generator.apply(thisArg, _arguments || [])).next());
    });
};
var __generator = (this && this.__generator) || function (thisArg, body) {
    var _ = { label: 0, sent: function() { if (t[0] & 1) throw t[1]; return t[1]; }, trys: [], ops: [] }, f, y, t, g;
    return g = { next: verb(0), "throw": verb(1), "return": verb(2) }, typeof Symbol === "function" && (g[Symbol.iterator] = function() { return this; }), g;
    function verb(n) { return function (v) { return step([n, v]); }; }
    function step(op) {
        if (f) throw new TypeError("Generator is already executing.");
        while (g && (g = 0, op[0] && (_ = 0)), _) try {
            if (f = 1, y && (t = op[0] & 2 ? y["return"] : op[0] ? y["throw"] || ((t = y["return"]) && t.call(y), 0) : y.next) && !(t = t.call(y, op[1])).done) return t;
            if (y = 0, t) op = [op[0] & 2, t.value];
            switch (op[0]) {
                case 0: case 1: t = op; break;
                case 4: _.label++; return { value: op[1], done: false };
                case 5: _.label++; y = op[1]; op = [0]; continue;
                case 7: op = _.ops.pop(); _.trys.pop(); continue;
                default:
                    if (!(t = _.trys, t = t.length > 0 && t[t.length - 1]) && (op[0] === 6 || op[0] === 2)) { _ = 0; continue; }
                    if (op[0] === 3 && (!t || (op[1] > t[0] && op[1] < t[3]))) { _.label = op[1]; break; }
                    if (op[0] === 6 && _.label < t[1]) { _.label = t[1]; t = op; break; }
                    if (t && _.label < t[2]) { _.label = t[2]; _.ops.push(op); break; }
                    if (t[2]) _.ops.pop();
                    _.trys.pop(); continue;
            }
            op = body.call(thisArg, _);
        } catch (e) { op = [6, e]; y = 0; } finally { f = t = 0; }
        if (op[0] & 5) throw op[1]; return { value: op[0] ? op[1] : void 0, done: true };
    }
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.oneTimeMsgFactory = void 0;
var oneTimeMsgFactory = function (scriptname) {
    var logTime = new Date();
    console.log(scriptname || "unknown-script", "ran", logTime.getHours(), ":", logTime.getMinutes());
    /**
     * Returns all active tabs based on query options
     */
    var getTabsFn = function (tabQueryOptions) {
        return new Promise(function (resolve, reject) {
            if (!tabQueryOptions) {
                reject(new Error("tab querying failed"));
            }
            else {
                resolve(browser.tabs.query(tabQueryOptions));
            }
        });
    };
    /**
     * Send a message to the background script
     */
    function messageBackgroundScript(options) {
        return __awaiter(this, void 0, void 0, function () {
            var message, errorCb, successCb, response, error_1;
            var _a;
            return __generator(this, function (_b) {
                switch (_b.label) {
                    case 0:
                        message = options.message, errorCb = options.errorCb, successCb = options.successCb;
                        _b.label = 1;
                    case 1:
                        _b.trys.push([1, 3, , 4]);
                        return [4 /*yield*/, browser.runtime.sendMessage(message)];
                    case 2:
                        response = _b.sent();
                        successCb({ status: true, data: response });
                        return [3 /*break*/, 4];
                    case 3:
                        error_1 = _b.sent();
                        errorCb({
                            status: false,
                            message: (_a = error_1.message) !== null && _a !== void 0 ? _a : "message to background script failed",
                        });
                        return [3 /*break*/, 4];
                    case 4: return [2 /*return*/];
                }
            });
        });
    }
    //same struc as messageBackgroundScript kept for eaase of use
    var messagePopupScript = messageBackgroundScript;
    /**
     * Send a message to content scripts
     */
    var messageContentScript = function (options) {
        return __awaiter(this, void 0, void 0, function () {
            var tabQueryProps, message, errorCb, successCb, tabs, targetTab, messageResponse, error_2;
            var _a;
            return __generator(this, function (_b) {
                switch (_b.label) {
                    case 0:
                        tabQueryProps = options.tabQueryProps, message = options.message, errorCb = options.errorCb, successCb = options.successCb;
                        _b.label = 1;
                    case 1:
                        _b.trys.push([1, 4, , 5]);
                        if (!tabQueryProps) {
                            throw new Error("tabQueryProps is undefined");
                        }
                        return [4 /*yield*/, getTabsFn(tabQueryProps)];
                    case 2:
                        tabs = _b.sent();
                        targetTab = tabs.length > 0 ? tabs[0].id : null;
                        if (!targetTab) {
                            errorCb({ status: false, message: "no tabs found" });
                            return [2 /*return*/];
                        }
                        return [4 /*yield*/, browser.tabs.sendMessage(targetTab, message)];
                    case 3:
                        messageResponse = _b.sent();
                        successCb({ status: true, data: messageResponse });
                        return [3 /*break*/, 5];
                    case 4:
                        error_2 = _b.sent();
                        errorCb({
                            status: false,
                            message: (_a = error_2.message) !== null && _a !== void 0 ? _a : "unknown tab querying error",
                        });
                        return [3 /*break*/, 5];
                    case 5: return [2 /*return*/];
                }
            });
        });
    };
    /**
     * Listen for messages in background or content scripts
     */
    var onMessageSync = function (opts) {
        var validateMessage = opts.validateMessage, validateSender = opts.validateSender, _a = opts.replyCb, replyCb = _a === void 0 ? function () {
            return "default reply";
        } : _a;
        var handler = function (message, sender, sendResponse) {
            if (validateMessage && !validateMessage(message)) {
                sendResponse({ status: false, message: "validateMessage failed" });
                return false;
            }
            if (validateSender && !validateSender(sender)) {
                sendResponse({ status: false, message: "validateSender failed" });
                return false;
            }
            sendResponse({ status: true, data: replyCb() });
            return false;
        };
        browser.runtime.onMessage.addListener(handler);
    };
    // --- ASYNC LISTENER ---
    var onMessageAsync = function (opts) {
        var validateMessage = opts.validateMessage, validateSender = opts.validateSender, onAsyncCb = opts.onAsyncCb;
        var handler = function (message, sender, sendResponse) {
            if (validateMessage && !validateMessage(message)) {
                sendResponse === null || sendResponse === void 0 ? void 0 : sendResponse({
                    status: false,
                    message: "validateMessage failed",
                });
                return false;
            }
            if (validateSender && !validateSender(sender)) {
                sendResponse === null || sendResponse === void 0 ? void 0 : sendResponse({
                    status: false,
                    message: "validateSender failed",
                });
                return false;
            }
            (function () {
                return __awaiter(this, void 0, void 0, function () {
                    var data, e_1;
                    var _a;
                    return __generator(this, function (_b) {
                        switch (_b.label) {
                            case 0:
                                _b.trys.push([0, 2, , 3]);
                                return [4 /*yield*/, (onAsyncCb === null || onAsyncCb === void 0 ? void 0 : onAsyncCb(message, sender))];
                            case 1:
                                data = _b.sent();
                                if (!data) {
                                    throw new Error("onMessageAsync request returned a falsy value");
                                }
                                sendResponse === null || sendResponse === void 0 ? void 0 : sendResponse({
                                    status: true,
                                    data: data,
                                    message: "onMessageAsync success",
                                });
                                return [3 /*break*/, 3];
                            case 2:
                                e_1 = _b.sent();
                                sendResponse === null || sendResponse === void 0 ? void 0 : sendResponse({
                                    status: false,
                                    message: (_a = e_1 === null || e_1 === void 0 ? void 0 : e_1.message) !== null && _a !== void 0 ? _a : "onMessageAsync returned an error",
                                });
                                return [3 /*break*/, 3];
                            case 3: return [2 /*return*/];
                        }
                    });
                });
            })();
            return true; // keep channel open
        };
        browser.runtime.onMessage.addListener(handler);
    };
    return {
        messageBackgroundScript: messageBackgroundScript,
        messagePopupScript: messagePopupScript,
        messageContentScript: messageContentScript,
        onMessageSync: onMessageSync,
        onMessageAsync: onMessageAsync,
        getTabsFn: getTabsFn,
    };
};
exports.oneTimeMsgFactory = oneTimeMsgFactory;
