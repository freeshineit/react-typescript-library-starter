import s from "react";
var _ = { exports: {} }, n = {};
/**
 * @license React
 * react-jsx-runtime.production.min.js
 *
 * Copyright (c) Facebook, Inc. and its affiliates.
 *
 * This source code is licensed under the MIT license found in the
 * LICENSE file in the root directory of this source tree.
 */
var l = s, m = Symbol.for("react.element"), y = Symbol.for("react.fragment"), a = Object.prototype.hasOwnProperty, c = l.__SECRET_INTERNALS_DO_NOT_USE_OR_YOU_WILL_BE_FIRED.ReactCurrentOwner, d = { key: !0, ref: !0, __self: !0, __source: !0 };
function i(t, r, p) {
  var e, o = {}, f = null, u = null;
  p !== void 0 && (f = "" + p), r.key !== void 0 && (f = "" + r.key), r.ref !== void 0 && (u = r.ref);
  for (e in r)
    a.call(r, e) && !d.hasOwnProperty(e) && (o[e] = r[e]);
  if (t && t.defaultProps)
    for (e in r = t.defaultProps, r)
      o[e] === void 0 && (o[e] = r[e]);
  return { $$typeof: m, type: t, key: f, ref: u, props: o, _owner: c.current };
}
n.Fragment = y;
n.jsx = i;
n.jsxs = i;
(function(t) {
  t.exports = n;
})(_);
var x = function() {
  return _.exports.jsx("input", {});
};
export {
  x as default
};
