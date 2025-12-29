const y = function(l) {
  const u = /* @__PURE__ */ new Date();
  console.log(
    l || "unknown-script",
    "ran",
    u.getHours(),
    ":",
    u.getMinutes()
  );
  const g = function(a) {
    return new Promise((e, s) => {
      a ? e(browser.tabs.query(a)) : s(new Error("tab querying failed"));
    });
  };
  async function f(a) {
    const { message: e, errorCb: s, successCb: c } = a;
    try {
      const t = await browser.runtime.sendMessage(
        e
      );
      if (!t.status)
        throw new Error(
          t.message ?? "browser.runtime.sendMessage error"
        );
      c(t);
    } catch (t) {
      s({
        status: !1,
        message: t.message ?? "message to background script failed"
      });
    }
  }
  return {
    messageBackgroundScript: f,
    messagePopupScript: f,
    messageContentScript: async function(a) {
      const { tabQueryProps: e, message: s, successCb: c, errorCb: t } = a;
      try {
        if (!e)
          throw new Error("tabQueryProps is undefined");
        const r = await g(e), o = r.length > 0 ? r[0].id : null;
        if (!o)
          throw new Error("no tabs found");
        const n = await browser.tabs.sendMessage(
          o,
          s
        );
        c({ status: !0, data: n });
      } catch (r) {
        t({
          status: !1,
          message: r.message ?? "unknown tab querying error"
        });
      }
    },
    onMessageSync: function(a) {
      const { validateMessage: e, validateSender: s, onSyncCb: c } = a, t = function(r, o, n) {
        if (e && !e(r))
          return n({ status: !1, message: "validateMessage failed" }), !1;
        if (s && !s(o))
          return n({ status: !1, message: "validateSender failed" }), !1;
        const i = c(r, o);
        return n({
          status: !0,
          data: i,
          message: "onMessageSync success"
        }), !1;
      };
      browser.runtime.onMessage.addListener(t);
    },
    onMessageAsync: function(a) {
      const { validateMessage: e, validateSender: s, onAsyncCb: c } = a, t = function(r, o, n) {
        return e && !e(r) ? (n?.({
          status: !1,
          message: "validateMessage failed"
        }), !1) : s && !s(o) ? (n?.({
          status: !1,
          message: "validateSender failed"
        }), !1) : ((async function() {
          try {
            const i = await c?.(r, o);
            if (!i)
              throw Error;
            n?.({
              status: !0,
              data: i,
              message: "onMessageAsync success"
            });
          } catch (i) {
            n?.({
              status: !1,
              message: i?.message ?? "onMessageAsync returned an error"
            });
          }
        })(), !0);
      };
      browser.runtime.onMessage.addListener(t);
    },
    getTabsFn: g
  };
};
export {
  y as oneTimeMsgFactory
};
