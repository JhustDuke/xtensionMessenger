function O(p) {
  return p && p.__esModule && Object.prototype.hasOwnProperty.call(p, "default") ? p.default : p;
}
var P = { exports: {} }, W = P.exports, j;
function D() {
  return j || (j = 1, (function(p, F) {
    (function(k, C) {
      C(p);
    })(typeof globalThis < "u" ? globalThis : typeof self < "u" ? self : W, function(k) {
      if (!(globalThis.chrome && globalThis.chrome.runtime && globalThis.chrome.runtime.id))
        throw new Error("This script should only be loaded in a browser extension.");
      if (globalThis.browser && globalThis.browser.runtime && globalThis.browser.runtime.id)
        k.exports = globalThis.browser;
      else {
        const C = "The message port closed before a response was received.", B = (v) => {
          const E = {
            alarms: {
              clear: {
                minArgs: 0,
                maxArgs: 1
              },
              clearAll: {
                minArgs: 0,
                maxArgs: 0
              },
              get: {
                minArgs: 0,
                maxArgs: 1
              },
              getAll: {
                minArgs: 0,
                maxArgs: 0
              }
            },
            bookmarks: {
              create: {
                minArgs: 1,
                maxArgs: 1
              },
              get: {
                minArgs: 1,
                maxArgs: 1
              },
              getChildren: {
                minArgs: 1,
                maxArgs: 1
              },
              getRecent: {
                minArgs: 1,
                maxArgs: 1
              },
              getSubTree: {
                minArgs: 1,
                maxArgs: 1
              },
              getTree: {
                minArgs: 0,
                maxArgs: 0
              },
              move: {
                minArgs: 2,
                maxArgs: 2
              },
              remove: {
                minArgs: 1,
                maxArgs: 1
              },
              removeTree: {
                minArgs: 1,
                maxArgs: 1
              },
              search: {
                minArgs: 1,
                maxArgs: 1
              },
              update: {
                minArgs: 2,
                maxArgs: 2
              }
            },
            browserAction: {
              disable: {
                minArgs: 0,
                maxArgs: 1,
                fallbackToNoCallback: !0
              },
              enable: {
                minArgs: 0,
                maxArgs: 1,
                fallbackToNoCallback: !0
              },
              getBadgeBackgroundColor: {
                minArgs: 1,
                maxArgs: 1
              },
              getBadgeText: {
                minArgs: 1,
                maxArgs: 1
              },
              getPopup: {
                minArgs: 1,
                maxArgs: 1
              },
              getTitle: {
                minArgs: 1,
                maxArgs: 1
              },
              openPopup: {
                minArgs: 0,
                maxArgs: 0
              },
              setBadgeBackgroundColor: {
                minArgs: 1,
                maxArgs: 1,
                fallbackToNoCallback: !0
              },
              setBadgeText: {
                minArgs: 1,
                maxArgs: 1,
                fallbackToNoCallback: !0
              },
              setIcon: {
                minArgs: 1,
                maxArgs: 1
              },
              setPopup: {
                minArgs: 1,
                maxArgs: 1,
                fallbackToNoCallback: !0
              },
              setTitle: {
                minArgs: 1,
                maxArgs: 1,
                fallbackToNoCallback: !0
              }
            },
            browsingData: {
              remove: {
                minArgs: 2,
                maxArgs: 2
              },
              removeCache: {
                minArgs: 1,
                maxArgs: 1
              },
              removeCookies: {
                minArgs: 1,
                maxArgs: 1
              },
              removeDownloads: {
                minArgs: 1,
                maxArgs: 1
              },
              removeFormData: {
                minArgs: 1,
                maxArgs: 1
              },
              removeHistory: {
                minArgs: 1,
                maxArgs: 1
              },
              removeLocalStorage: {
                minArgs: 1,
                maxArgs: 1
              },
              removePasswords: {
                minArgs: 1,
                maxArgs: 1
              },
              removePluginData: {
                minArgs: 1,
                maxArgs: 1
              },
              settings: {
                minArgs: 0,
                maxArgs: 0
              }
            },
            commands: {
              getAll: {
                minArgs: 0,
                maxArgs: 0
              }
            },
            contextMenus: {
              remove: {
                minArgs: 1,
                maxArgs: 1
              },
              removeAll: {
                minArgs: 0,
                maxArgs: 0
              },
              update: {
                minArgs: 2,
                maxArgs: 2
              }
            },
            cookies: {
              get: {
                minArgs: 1,
                maxArgs: 1
              },
              getAll: {
                minArgs: 1,
                maxArgs: 1
              },
              getAllCookieStores: {
                minArgs: 0,
                maxArgs: 0
              },
              remove: {
                minArgs: 1,
                maxArgs: 1
              },
              set: {
                minArgs: 1,
                maxArgs: 1
              }
            },
            devtools: {
              inspectedWindow: {
                eval: {
                  minArgs: 1,
                  maxArgs: 2,
                  singleCallbackArg: !1
                }
              },
              panels: {
                create: {
                  minArgs: 3,
                  maxArgs: 3,
                  singleCallbackArg: !0
                },
                elements: {
                  createSidebarPane: {
                    minArgs: 1,
                    maxArgs: 1
                  }
                }
              }
            },
            downloads: {
              cancel: {
                minArgs: 1,
                maxArgs: 1
              },
              download: {
                minArgs: 1,
                maxArgs: 1
              },
              erase: {
                minArgs: 1,
                maxArgs: 1
              },
              getFileIcon: {
                minArgs: 1,
                maxArgs: 2
              },
              open: {
                minArgs: 1,
                maxArgs: 1,
                fallbackToNoCallback: !0
              },
              pause: {
                minArgs: 1,
                maxArgs: 1
              },
              removeFile: {
                minArgs: 1,
                maxArgs: 1
              },
              resume: {
                minArgs: 1,
                maxArgs: 1
              },
              search: {
                minArgs: 1,
                maxArgs: 1
              },
              show: {
                minArgs: 1,
                maxArgs: 1,
                fallbackToNoCallback: !0
              }
            },
            extension: {
              isAllowedFileSchemeAccess: {
                minArgs: 0,
                maxArgs: 0
              },
              isAllowedIncognitoAccess: {
                minArgs: 0,
                maxArgs: 0
              }
            },
            history: {
              addUrl: {
                minArgs: 1,
                maxArgs: 1
              },
              deleteAll: {
                minArgs: 0,
                maxArgs: 0
              },
              deleteRange: {
                minArgs: 1,
                maxArgs: 1
              },
              deleteUrl: {
                minArgs: 1,
                maxArgs: 1
              },
              getVisits: {
                minArgs: 1,
                maxArgs: 1
              },
              search: {
                minArgs: 1,
                maxArgs: 1
              }
            },
            i18n: {
              detectLanguage: {
                minArgs: 1,
                maxArgs: 1
              },
              getAcceptLanguages: {
                minArgs: 0,
                maxArgs: 0
              }
            },
            identity: {
              launchWebAuthFlow: {
                minArgs: 1,
                maxArgs: 1
              }
            },
            idle: {
              queryState: {
                minArgs: 1,
                maxArgs: 1
              }
            },
            management: {
              get: {
                minArgs: 1,
                maxArgs: 1
              },
              getAll: {
                minArgs: 0,
                maxArgs: 0
              },
              getSelf: {
                minArgs: 0,
                maxArgs: 0
              },
              setEnabled: {
                minArgs: 2,
                maxArgs: 2
              },
              uninstallSelf: {
                minArgs: 0,
                maxArgs: 1
              }
            },
            notifications: {
              clear: {
                minArgs: 1,
                maxArgs: 1
              },
              create: {
                minArgs: 1,
                maxArgs: 2
              },
              getAll: {
                minArgs: 0,
                maxArgs: 0
              },
              getPermissionLevel: {
                minArgs: 0,
                maxArgs: 0
              },
              update: {
                minArgs: 2,
                maxArgs: 2
              }
            },
            pageAction: {
              getPopup: {
                minArgs: 1,
                maxArgs: 1
              },
              getTitle: {
                minArgs: 1,
                maxArgs: 1
              },
              hide: {
                minArgs: 1,
                maxArgs: 1,
                fallbackToNoCallback: !0
              },
              setIcon: {
                minArgs: 1,
                maxArgs: 1
              },
              setPopup: {
                minArgs: 1,
                maxArgs: 1,
                fallbackToNoCallback: !0
              },
              setTitle: {
                minArgs: 1,
                maxArgs: 1,
                fallbackToNoCallback: !0
              },
              show: {
                minArgs: 1,
                maxArgs: 1,
                fallbackToNoCallback: !0
              }
            },
            permissions: {
              contains: {
                minArgs: 1,
                maxArgs: 1
              },
              getAll: {
                minArgs: 0,
                maxArgs: 0
              },
              remove: {
                minArgs: 1,
                maxArgs: 1
              },
              request: {
                minArgs: 1,
                maxArgs: 1
              }
            },
            runtime: {
              getBackgroundPage: {
                minArgs: 0,
                maxArgs: 0
              },
              getPlatformInfo: {
                minArgs: 0,
                maxArgs: 0
              },
              openOptionsPage: {
                minArgs: 0,
                maxArgs: 0
              },
              requestUpdateCheck: {
                minArgs: 0,
                maxArgs: 0
              },
              sendMessage: {
                minArgs: 1,
                maxArgs: 3
              },
              sendNativeMessage: {
                minArgs: 2,
                maxArgs: 2
              },
              setUninstallURL: {
                minArgs: 1,
                maxArgs: 1
              }
            },
            sessions: {
              getDevices: {
                minArgs: 0,
                maxArgs: 1
              },
              getRecentlyClosed: {
                minArgs: 0,
                maxArgs: 1
              },
              restore: {
                minArgs: 0,
                maxArgs: 1
              }
            },
            storage: {
              local: {
                clear: {
                  minArgs: 0,
                  maxArgs: 0
                },
                get: {
                  minArgs: 0,
                  maxArgs: 1
                },
                getBytesInUse: {
                  minArgs: 0,
                  maxArgs: 1
                },
                remove: {
                  minArgs: 1,
                  maxArgs: 1
                },
                set: {
                  minArgs: 1,
                  maxArgs: 1
                }
              },
              managed: {
                get: {
                  minArgs: 0,
                  maxArgs: 1
                },
                getBytesInUse: {
                  minArgs: 0,
                  maxArgs: 1
                }
              },
              sync: {
                clear: {
                  minArgs: 0,
                  maxArgs: 0
                },
                get: {
                  minArgs: 0,
                  maxArgs: 1
                },
                getBytesInUse: {
                  minArgs: 0,
                  maxArgs: 1
                },
                remove: {
                  minArgs: 1,
                  maxArgs: 1
                },
                set: {
                  minArgs: 1,
                  maxArgs: 1
                }
              }
            },
            tabs: {
              captureVisibleTab: {
                minArgs: 0,
                maxArgs: 2
              },
              create: {
                minArgs: 1,
                maxArgs: 1
              },
              detectLanguage: {
                minArgs: 0,
                maxArgs: 1
              },
              discard: {
                minArgs: 0,
                maxArgs: 1
              },
              duplicate: {
                minArgs: 1,
                maxArgs: 1
              },
              executeScript: {
                minArgs: 1,
                maxArgs: 2
              },
              get: {
                minArgs: 1,
                maxArgs: 1
              },
              getCurrent: {
                minArgs: 0,
                maxArgs: 0
              },
              getZoom: {
                minArgs: 0,
                maxArgs: 1
              },
              getZoomSettings: {
                minArgs: 0,
                maxArgs: 1
              },
              goBack: {
                minArgs: 0,
                maxArgs: 1
              },
              goForward: {
                minArgs: 0,
                maxArgs: 1
              },
              highlight: {
                minArgs: 1,
                maxArgs: 1
              },
              insertCSS: {
                minArgs: 1,
                maxArgs: 2
              },
              move: {
                minArgs: 2,
                maxArgs: 2
              },
              query: {
                minArgs: 1,
                maxArgs: 1
              },
              reload: {
                minArgs: 0,
                maxArgs: 2
              },
              remove: {
                minArgs: 1,
                maxArgs: 1
              },
              removeCSS: {
                minArgs: 1,
                maxArgs: 2
              },
              sendMessage: {
                minArgs: 2,
                maxArgs: 3
              },
              setZoom: {
                minArgs: 1,
                maxArgs: 2
              },
              setZoomSettings: {
                minArgs: 1,
                maxArgs: 2
              },
              update: {
                minArgs: 1,
                maxArgs: 2
              }
            },
            topSites: {
              get: {
                minArgs: 0,
                maxArgs: 0
              }
            },
            webNavigation: {
              getAllFrames: {
                minArgs: 1,
                maxArgs: 1
              },
              getFrame: {
                minArgs: 1,
                maxArgs: 1
              }
            },
            webRequest: {
              handlerBehaviorChanged: {
                minArgs: 0,
                maxArgs: 0
              }
            },
            windows: {
              create: {
                minArgs: 0,
                maxArgs: 1
              },
              get: {
                minArgs: 1,
                maxArgs: 2
              },
              getAll: {
                minArgs: 0,
                maxArgs: 1
              },
              getCurrent: {
                minArgs: 0,
                maxArgs: 1
              },
              getLastFocused: {
                minArgs: 0,
                maxArgs: 1
              },
              remove: {
                minArgs: 1,
                maxArgs: 1
              },
              update: {
                minArgs: 2,
                maxArgs: 2
              }
            }
          };
          if (Object.keys(E).length === 0)
            throw new Error("api-metadata.json has not been included in browser-polyfill");
          class N extends WeakMap {
            constructor(r, n = void 0) {
              super(n), this.createItem = r;
            }
            get(r) {
              return this.has(r) || this.set(r, this.createItem(r)), super.get(r);
            }
          }
          const x = (e) => e && typeof e == "object" && typeof e.then == "function", m = (e, r) => (...n) => {
            v.runtime.lastError ? e.reject(new Error(v.runtime.lastError.message)) : r.singleCallbackArg || n.length <= 1 && r.singleCallbackArg !== !1 ? e.resolve(n[0]) : e.resolve(n);
          }, i = (e) => e == 1 ? "argument" : "arguments", y = (e, r) => function(t, ...a) {
            if (a.length < r.minArgs)
              throw new Error(`Expected at least ${r.minArgs} ${i(r.minArgs)} for ${e}(), got ${a.length}`);
            if (a.length > r.maxArgs)
              throw new Error(`Expected at most ${r.maxArgs} ${i(r.maxArgs)} for ${e}(), got ${a.length}`);
            return new Promise((u, f) => {
              if (r.fallbackToNoCallback)
                try {
                  t[e](...a, m({
                    resolve: u,
                    reject: f
                  }, r));
                } catch (s) {
                  console.warn(`${e} API method doesn't seem to support the callback parameter, falling back to call it without a callback: `, s), t[e](...a), r.fallbackToNoCallback = !1, r.noCallback = !0, u();
                }
              else r.noCallback ? (t[e](...a), u()) : t[e](...a, m({
                resolve: u,
                reject: f
              }, r));
            });
          }, A = (e, r, n) => new Proxy(r, {
            apply(t, a, u) {
              return n.call(a, e, ...u);
            }
          });
          let c = Function.call.bind(Object.prototype.hasOwnProperty);
          const o = (e, r = {}, n = {}) => {
            let t = /* @__PURE__ */ Object.create(null), a = {
              has(f, s) {
                return s in e || s in t;
              },
              get(f, s, b) {
                if (s in t)
                  return t[s];
                if (!(s in e))
                  return;
                let g = e[s];
                if (typeof g == "function")
                  if (typeof r[s] == "function")
                    g = A(e, e[s], r[s]);
                  else if (c(n, s)) {
                    let T = y(s, n[s]);
                    g = A(e, e[s], T);
                  } else
                    g = g.bind(e);
                else if (typeof g == "object" && g !== null && (c(r, s) || c(n, s)))
                  g = o(g, r[s], n[s]);
                else if (c(n, "*"))
                  g = o(g, r[s], n["*"]);
                else
                  return Object.defineProperty(t, s, {
                    configurable: !0,
                    enumerable: !0,
                    get() {
                      return e[s];
                    },
                    set(T) {
                      e[s] = T;
                    }
                  }), g;
                return t[s] = g, g;
              },
              set(f, s, b, g) {
                return s in t ? t[s] = b : e[s] = b, !0;
              },
              defineProperty(f, s, b) {
                return Reflect.defineProperty(t, s, b);
              },
              deleteProperty(f, s) {
                return Reflect.deleteProperty(t, s);
              }
            }, u = Object.create(e);
            return new Proxy(u, a);
          }, l = (e) => ({
            addListener(r, n, ...t) {
              r.addListener(e.get(n), ...t);
            },
            hasListener(r, n) {
              return r.hasListener(e.get(n));
            },
            removeListener(r, n) {
              r.removeListener(e.get(n));
            }
          }), h = new N((e) => typeof e != "function" ? e : function(n) {
            const t = o(n, {}, {
              getContent: {
                minArgs: 0,
                maxArgs: 0
              }
            });
            e(t);
          }), d = new N((e) => typeof e != "function" ? e : function(n, t, a) {
            let u = !1, f, s = new Promise((M) => {
              f = function(w) {
                u = !0, M(w);
              };
            }), b;
            try {
              b = e(n, t, f);
            } catch (M) {
              b = Promise.reject(M);
            }
            const g = b !== !0 && x(b);
            if (b !== !0 && !g && !u)
              return !1;
            const T = (M) => {
              M.then((w) => {
                a(w);
              }, (w) => {
                let L;
                w && (w instanceof Error || typeof w.message == "string") ? L = w.message : L = "An unexpected error occurred", a({
                  __mozWebExtensionPolyfillReject__: !0,
                  message: L
                });
              }).catch((w) => {
                console.error("Failed to send onMessage rejected reply", w);
              });
            };
            return T(g ? b : s), !0;
          }), R = ({
            reject: e,
            resolve: r
          }, n) => {
            v.runtime.lastError ? v.runtime.lastError.message === C ? r() : e(new Error(v.runtime.lastError.message)) : n && n.__mozWebExtensionPolyfillReject__ ? e(new Error(n.message)) : r(n);
          }, _ = (e, r, n, ...t) => {
            if (t.length < r.minArgs)
              throw new Error(`Expected at least ${r.minArgs} ${i(r.minArgs)} for ${e}(), got ${t.length}`);
            if (t.length > r.maxArgs)
              throw new Error(`Expected at most ${r.maxArgs} ${i(r.maxArgs)} for ${e}(), got ${t.length}`);
            return new Promise((a, u) => {
              const f = R.bind(null, {
                resolve: a,
                reject: u
              });
              t.push(f), n.sendMessage(...t);
            });
          }, q = {
            devtools: {
              network: {
                onRequestFinished: l(h)
              }
            },
            runtime: {
              onMessage: l(d),
              onMessageExternal: l(d),
              sendMessage: _.bind(null, "sendMessage", {
                minArgs: 1,
                maxArgs: 3
              })
            },
            tabs: {
              sendMessage: _.bind(null, "sendMessage", {
                minArgs: 2,
                maxArgs: 3
              })
            }
          }, $ = {
            clear: {
              minArgs: 1,
              maxArgs: 1
            },
            get: {
              minArgs: 1,
              maxArgs: 1
            },
            set: {
              minArgs: 1,
              maxArgs: 1
            }
          };
          return E.privacy = {
            network: {
              "*": $
            },
            services: {
              "*": $
            },
            websites: {
              "*": $
            }
          }, o(v, q, E);
        };
        k.exports = B(chrome);
      }
    });
  })(P)), P.exports;
}
var I = D();
const S = /* @__PURE__ */ O(I), U = function(p) {
  const F = /* @__PURE__ */ new Date();
  console.log(
    p || "unknown-script",
    "ran",
    F.getHours(),
    ":",
    F.getMinutes()
  );
  const k = function(x) {
    return new Promise((m, i) => {
      x ? m(S.tabs.query(x)) : i(new Error("tab querying failed"));
    });
  };
  async function C(x) {
    const { messageToSend: m, errorCb: i, successCb: y } = x;
    let A;
    try {
      if (A = await S.runtime.sendMessage(m), !A)
        throw new Error("no listener handled this message");
      if (!A.status)
        throw new Error(
          A.errorMessage ?? "browser.runtime.sendMessage error"
        );
    } catch (c) {
      i({
        status: !1,
        errorMessage: c.message ?? "message to background script failed"
      });
      return;
    }
    y(A);
  }
  return {
    messageBackgroundScript: C,
    messagePopupScript: C,
    messageContentScript: async function(x) {
      const { tabQueryProps: m, messageToSend: i, successCb: y, errorCb: A } = x, c = [];
      try {
        if (!m)
          throw new Error("tabQueryProps is undefined");
        const o = await k(m);
        if (o.length === 0)
          throw new Error("no tabs found");
        for (let l = 0; l < o.length; l++) {
          const h = o[l];
          if (h.id === void 0)
            continue;
          const d = await S.tabs.sendMessage(h.id, i).catch(function(R) {
            return { status: !1, errorMessage: R.message };
          });
          c.push({
            tabInfo: h,
            response: d || {
              status: !1,
              errorMessage: "no listener handled this message"
              // e.g. type "UNKNOWN_TYPE"
            }
          });
        }
      } catch (o) {
        A({
          status: !1,
          errorMessage: o.message ?? "unknown tab querying error"
        });
        return;
      }
      y({
        status: !0,
        data: c
      });
    },
    onMessageSync: function(x) {
      const { validateMessage: m, validateSender: i, onSyncCb: y } = x, A = function(c, o, l) {
        const h = c;
        if (m && m(h) !== !0)
          return;
        if (i && i(o) !== !0) {
          l({ status: !1, errorMessage: "validateSender failed" });
          return;
        }
        const d = y(h, o);
        d === void 0 && console.warn(
          "onSyncCb returned undefined, return a value (or null on purpose)"
        ), l({
          status: !0,
          data: d
        });
      };
      S.runtime.onMessage.addListener(A);
    },
    onMessageAsync: function(x) {
      const { validateMessage: m, validateSender: i, onAsyncCb: y } = x, A = function(c, o, l) {
        const h = c;
        if (!(m && m(h) !== !0)) {
          if (i && i(o) !== !0) {
            l?.({
              status: !1,
              errorMessage: "validateSender failed"
            });
            return;
          }
          return (async function() {
            try {
              const d = await y?.(h, o);
              d === void 0 && console.warn(
                "onAsyncCb returned undefined, return a value (or null on purpose)"
              ), l?.({
                status: !0,
                data: d
              });
            } catch (d) {
              l?.({
                status: !1,
                errorMessage: d?.message ?? "onMessageAsync returned undefined, false or a falsy value"
              });
            }
          })(), !0;
        }
      };
      S.runtime.onMessage.addListener(A);
    },
    getTabsFn: k
  };
};
export {
  U as oneTimeMsgFactory
};
