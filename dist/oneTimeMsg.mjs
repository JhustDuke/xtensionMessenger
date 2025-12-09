const w = (function(d) {
  const u = /* @__PURE__ */ new Date();
  console.log(d, "ran", u.getHours(), ":", u.getMinutes());
  const l = function(a) {
    return new Promise((e, s) => {
      a ? e(browser.tabs.query(a)) : s(new Error("tab querying failed"));
    });
  }, f = async function(a) {
    const { message: e, errorCb: s, successCb: o } = a;
    try {
      const r = await browser.runtime.sendMessage(e);
      o(r);
    } catch (r) {
      s(r.message || r);
    }
  };
  return {
    messageBackgroundScript: f,
    messagePopupScript: f,
    messageContentScript: async function(a) {
      const { tabQueryProps: e, message: s, errorCb: o, successCb: r } = a;
      try {
        if (!e)
          throw new Error("tabQueryProps is undefined");
        const n = await l(e), c = n.length > 0 ? n[0].id : null;
        if (!c) {
          o(new Error("no valid tab found"));
          return;
        }
        const t = await browser.tabs.sendMessage(
          c,
          s
        );
        r(t);
      } catch (n) {
        o(n);
      }
    },
    onMessageSync: function(a) {
      const { validateMessage: e, validateSender: s, reply: o = "default reply" } = a, r = function(n, c, t) {
        return e && !e(n) ? (t({ status: "fail", error: "validateMessage failed" }), !1) : s && !s(c) ? (t({ status: "fail", error: "validateSender failed" }), !1) : (t({ status: "ok", data: o }), !1);
      };
      browser.runtime.onMessage.addListener(r);
    },
    onMessageAsync: function(a) {
      const { validateMessage: e, validateSender: s, onAsyncCb: o } = a, r = function(n, c, t) {
        return e && !e(n) ? (t?.({
          isPassed: !1,
          response: "validateMessage failed"
        }), !1) : s && !s(c) ? (t?.({
          isPassed: !1,
          response: "validateSender failed"
        }), !1) : ((async function() {
          try {
            const i = await o?.(n, c);
            t?.({ isPassed: !0, data: i, response: "async success" });
          } catch (i) {
            t?.({
              isPassed: !1,
              response: i?.message ?? "async error"
            });
          }
        })(), !0);
      };
      browser.runtime.onMessage.addListener(r);
    },
    getTabsFn: l
  };
})();
export {
  w as oneTimeMsgFactory
};
