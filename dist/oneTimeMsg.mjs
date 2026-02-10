const w = function(l) {
  const i = /* @__PURE__ */ new Date();
  console.log(
    l || "unknown-script",
    "ran",
    i.getHours(),
    ":",
    i.getMinutes()
  );
  const g = function(t) {
    return new Promise((e, s) => {
      t ? e(browser.tabs.query(t)) : s(new Error("tab querying failed"));
    });
  };
  async function f(t) {
    const { message: e, errorCb: s, successCb: c } = t;
    try {
      const a = await browser.runtime.sendMessage(
        e
      );
      if (!a.status)
        throw new Error(
          a.message ?? "browser.runtime.sendMessage error"
        );
      c(a);
    } catch (a) {
      s({
        status: !1,
        message: a.message ?? "message to background script failed"
      });
    }
  }
  return {
    messageBackgroundScript: f,
    messagePopupScript: f,
    messageContentScript: async function(t) {
      const { tabQueryProps: e, message: s, successCb: c, errorCb: a } = t;
      try {
        if (!e)
          throw new Error("tabQueryProps is undefined");
        const n = await g(e), o = n.length > 0 ? n[0].id : null;
        if (!o)
          throw new Error("no tabs found");
        const r = await browser.tabs.sendMessage(
          o,
          s
        );
        c({ status: !0, data: r });
      } catch (n) {
        a({
          status: !1,
          message: n.message ?? "unknown tab querying error"
        });
      }
    },
    onMessageSync: function(t) {
      const { validateMessage: e, validateSender: s, onSyncCb: c } = t, a = function(n, o, r) {
        if (e && !e(n))
          return r({ status: !1, message: "validateMessage failed" }), !1;
        if (s && !s(o))
          return r({ status: !1, message: "validateSender failed" }), !1;
        const u = c(n, o);
        return u === void 0 && console.warn('onSyncCb returned "undefined"'), r({
          status: !0,
          data: u,
          message: "onMessageSync success"
        }), !1;
      };
      browser.runtime.onMessage.addListener(a);
    },
    onMessageAsync: function(t) {
      const { validateMessage: e, validateSender: s, onAsyncCb: c } = t, a = function(n, o, r) {
        return e && !e(n) ? (r?.({
          status: !1,
          message: "validateMessage failed"
        }), !1) : s && !s(o) ? (r?.({
          status: !1,
          message: "validateSender failed"
        }), !1) : ((async function() {
          try {
            const u = await c?.(n, o);
            u || console.warn(
              "onMessageAsync returned undefined,null or a falsy value"
            ), r?.({
              status: !0,
              data: u,
              message: "onMessageAsync success"
            });
          } catch (u) {
            r?.({
              status: !1,
              message: u?.message ?? "onMessageAsync returned undefined, false or a falsy value"
            });
          }
        })(), !0);
      };
      browser.runtime.onMessage.addListener(a);
    },
    getTabsFn: g
  };
};
export {
  w as oneTimeMsgFactory
};
