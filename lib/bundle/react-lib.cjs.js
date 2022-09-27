"use strict";const p=require("react"),l=e=>e&&typeof e=="object"&&"default"in e?e:{default:e},c=l(p);var i={exports:{}},n={};/**
 * @license React
 * react-jsx-runtime.production.min.js
 *
 * Copyright (c) Facebook, Inc. and its affiliates.
 *
 * This source code is licensed under the MIT license found in the
 * LICENSE file in the root directory of this source tree.
 */var a=c.default,y=Symbol.for("react.element"),d=Symbol.for("react.fragment"),m=Object.prototype.hasOwnProperty,v=a.__SECRET_INTERNALS_DO_NOT_USE_OR_YOU_WILL_BE_FIRED.ReactCurrentOwner,x={key:!0,ref:!0,__self:!0,__source:!0};function _(e,r,f){var t,o={},u=null,s=null;f!==void 0&&(u=""+f),r.key!==void 0&&(u=""+r.key),r.ref!==void 0&&(s=r.ref);for(t in r)m.call(r,t)&&!x.hasOwnProperty(t)&&(o[t]=r[t]);if(e&&e.defaultProps)for(t in r=e.defaultProps,r)o[t]===void 0&&(o[t]=r[t]);return{$$typeof:y,type:e,key:u,ref:s,props:o,_owner:v.current}}n.Fragment=d;n.jsx=_;n.jsxs=_;(function(e){e.exports=n})(i);var O=function(){return i.exports.jsx("input",{})};module.exports=O;
