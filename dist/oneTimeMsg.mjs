const m = function(d) {
  const u = /* @__PURE__ */ new Date();
  console.log(d, "ran", u.getHours(), ":", u.getMinutes());
  const l = function(r) {
    return new Promise((e, s) => {
      r ? e(browser.tabs.query(r)) : s(new Error("tab querying failed"));
    });
  }, f = async function(r) {
    const { message: e, errorCb: s, successCb: o } = r;
    try {
      const a = await browser.runtime.sendMessage(e);
      o(a);
    } catch (a) {
      s(a.message || a);
    }
  };
  return {
    messageBackgroundScript: f,
    messagePopupScript: f,
    messageContentScript: async function(r) {
      const { tabQueryProps: e, message: s, errorCb: o, successCb: a } = r;
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
        a(t);
      } catch (n) {
        o(n);
      }
    },
    onMessageSync: function(r) {
      const { validateMessage: e, validateSender: s, reply: o = "default reply" } = r, a = function(n, c, t) {
        return e && !e(n) ? (t({ status: "fail", error: "validateMessage failed" }), !1) : s && !s(c) ? (t({ status: "fail", error: "validateSender failed" }), !1) : (t({ status: "ok", data: o }), !1);
      };
      browser.runtime.onMessage.addListener(a);
    },
    onMessageAsync: function(r) {
      const { validateMessage: e, validateSender: s, onAsyncCb: o } = r, a = function(n, c, t) {
        return e && !e(n) ? (t?.({
          isPassed: !1,
          response: "validateMessage failed"
        }), !1) : s && !s(c) ? (t?.({
          isPassed: !1,
          response: "validateSender failed"
        }), !1) : ((async function() {
          try {
            const i = await o?.(n, c);
            if (i === !1)
              throw Error("async request returned a falsy value");
            t?.({ isPassed: !0, data: i, response: "async success" });
          } catch (i) {
            t?.({
              isPassed: !1,
              response: i?.message ?? "async error"
            });
          }
        })(), !0);
      };
      browser.runtime.onMessage.addListener(a);
    },
    getTabsFn: l
  };
};
export {
  m as oneTimeMsgFactory
};
