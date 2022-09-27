"use strict";

(function (n, o) {
  typeof exports == "object" && typeof module < "u" ? module.exports = o(require("react")) : typeof define == "function" && define.amd ? define(["react"], o) : (n = typeof globalThis < "u" ? globalThis : n || self, n.reactLib = o(n.React));
})(void 0, function (n) {
  "use strict";

  var c = function (e) {
    return e && typeof e == "object" && "default" in e ? e : {
      default: e
    };
  }(n);

  var p = {
    exports: {}
  },
      f = {};
  /**
  * @license React
  * react-jsx-runtime.production.min.js
  *
  * Copyright (c) Facebook, Inc. and its affiliates.
  *
  * This source code is licensed under the MIT license found in the
  * LICENSE file in the root directory of this source tree.
  */

  var l = c.default,
      a = Symbol.for("react.element"),
      y = Symbol.for("react.fragment"),
      m = Object.prototype.hasOwnProperty,
      x = l.__SECRET_INTERNALS_DO_NOT_USE_OR_YOU_WILL_BE_FIRED.ReactCurrentOwner,
      v = {
    key: !0,
    ref: !0,
    __self: !0,
    __source: !0
  };

  function s(e, t, d) {
    var r,
        u = {},
        i = null,
        _ = null;
    d !== void 0 && (i = "" + d), t.key !== void 0 && (i = "" + t.key), t.ref !== void 0 && (_ = t.ref);

    for (r in t) {
      m.call(t, r) && !v.hasOwnProperty(r) && (u[r] = t[r]);
    }

    if (e && e.defaultProps) for (r in t = e.defaultProps, t) {
      u[r] === void 0 && (u[r] = t[r]);
    }
    return {
      $$typeof: a,
      type: e,
      key: i,
      ref: _,
      props: u,
      _owner: x.current
    };
  }

  f.Fragment = y, f.jsx = s, f.jsxs = s, function (e) {
    e.exports = f;
  }(p);

  var O = function O() {
    return p.exports.jsx("input", {});
  };

  return O;
});