const w = function(l) {
  const i = /* @__PURE__ */ new Date();
  console.log(
    l || "unknown-script",
    "ran",
    i.getHours(),
    ":",
    i.getMinutes()
  );
  const g = function(a) {
    return new Promise((e, s) => {
      a ? e(browser.tabs.query(a)) : s(new Error("tab querying failed"));
    });
  };
  async function f(a) {
    const { message: e, errorCb: s, successCb: o } = a;
    try {
      const r = await browser.runtime.sendMessage(e);
      o({ status: !0, data: r });
    } catch (r) {
      s({
        status: !1,
        message: r.message ?? "message to background script failed"
      });
    }
  }
  return {
    messageBackgroundScript: f,
    messagePopupScript: f,
    messageContentScript: async function(a) {
      const { tabQueryProps: e, message: s, errorCb: o, successCb: r } = a;
      try {
        if (!e)
          throw new Error("tabQueryProps is undefined");
        const n = await g(e), u = n.length > 0 ? n[0].id : null;
        if (!u) {
          o({ status: !1, message: "no tabs found" });
          return;
        }
        const t = await browser.tabs.sendMessage(
          u,
          s
        );
        r({ status: !0, data: t });
      } catch (n) {
        o({
          status: !1,
          message: n.message ?? "unknown tab querying error"
        });
      }
    },
    onMessageSync: function(a) {
      const {
        validateMessage: e,
        validateSender: s,
        replyCb: o = function() {
          return "default reply";
        }
      } = a, r = function(n, u, t) {
        return e && !e(n) ? (t({ status: !1, message: "validateMessage failed" }), !1) : s && !s(u) ? (t({ status: !1, message: "validateSender failed" }), !1) : (t({ status: !0, data: o }), !1);
      };
      browser.runtime.onMessage.addListener(r);
    },
    onMessageAsync: function(a) {
      const { validateMessage: e, validateSender: s, onAsyncCb: o } = a, r = function(n, u, t) {
        return e && !e(n) ? (t?.({
          status: !1,
          message: "validateMessage failed"
        }), !1) : s && !s(u) ? (t?.({
          status: !1,
          message: "validateSender failed"
        }), !1) : ((async function() {
          try {
            const c = await o?.(n, u);
            if (!c)
              throw new Error("onMessageAsync request returned a falsy value");
            t?.({
              status: !0,
              data: c,
              message: "onMessageAsync success"
            });
          } catch (c) {
            t?.({
              status: !1,
              message: c?.message ?? "onMessageAsync returned an error"
            });
          }
        })(), !0);
      };
      browser.runtime.onMessage.addListener(r);
    },
    getTabsFn: g
  };
};
export {
  w as oneTimeMsgFactory
};
