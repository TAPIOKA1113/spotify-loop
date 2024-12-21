import {
  require_jsx_runtime
} from "./chunk-KIB7QIAR.js";
import {
  require_react
} from "./chunk-E4IJLYFW.js";
import {
  __commonJS,
  __publicField,
  __toESM
} from "./chunk-45IN2YCG.js";

// node_modules/nano-css/index.js
var require_nano_css = __commonJS({
  "node_modules/nano-css/index.js"(exports) {
    "use strict";
    var KEBAB_REGEX = /[A-Z]/g;
    var hash = function(str) {
      var h = 5381, i = str.length;
      while (i) h = h * 33 ^ str.charCodeAt(--i);
      return "_" + (h >>> 0).toString(36);
    };
    exports.create = function(config) {
      config = config || {};
      var assign = config.assign || Object.assign;
      var client = typeof window === "object";
      if (true) {
        if (client) {
          if (typeof document !== "object" || !document.getElementsByTagName("HTML")) {
            console.error(
              'nano-css detected browser environment because of "window" global, but "document" global seems to be defective.'
            );
          }
        }
      }
      var renderer = assign({
        raw: "",
        pfx: "_",
        client,
        assign,
        stringify: JSON.stringify,
        kebab: function(prop) {
          return prop.replace(KEBAB_REGEX, "-$&").toLowerCase();
        },
        decl: function(key, value) {
          key = renderer.kebab(key);
          return key + ":" + value + ";";
        },
        hash: function(obj) {
          return hash(renderer.stringify(obj));
        },
        selector: function(parent, selector) {
          return parent + (selector[0] === ":" ? "" : " ") + selector;
        },
        putRaw: function(rawCssRule) {
          renderer.raw += rawCssRule;
        }
      }, config);
      if (renderer.client) {
        if (!renderer.sh)
          document.head.appendChild(renderer.sh = document.createElement("style"));
        if (true) {
          renderer.sh.setAttribute("data-nano-css-dev", "");
          renderer.shTest = document.createElement("style");
          renderer.shTest.setAttribute("data-nano-css-dev-tests", "");
          document.head.appendChild(renderer.shTest);
        }
        renderer.putRaw = function(rawCssRule) {
          if (false) {
            var sheet = renderer.sh.sheet;
            try {
              sheet.insertRule(rawCssRule, sheet.cssRules.length);
            } catch (error) {
            }
          } else {
            try {
              renderer.shTest.sheet.insertRule(rawCssRule, renderer.shTest.sheet.cssRules.length);
            } catch (error) {
              if (config.verbose) {
                console.error(error);
              }
            }
            renderer.sh.appendChild(document.createTextNode(rawCssRule));
          }
        };
      }
      renderer.put = function(selector, decls, atrule) {
        var str = "";
        var prop, value;
        var postponed = [];
        for (prop in decls) {
          value = decls[prop];
          if (value instanceof Object && !(value instanceof Array)) {
            postponed.push(prop);
          } else {
            if (!renderer.sourcemaps) {
              str += "    " + renderer.decl(prop, value, selector, atrule) + "\n";
            } else {
              str += renderer.decl(prop, value, selector, atrule);
            }
          }
        }
        if (str) {
          if (!renderer.sourcemaps) {
            str = "\n" + selector + " {\n" + str + "}\n";
          } else {
            str = selector + "{" + str + "}";
          }
          renderer.putRaw(atrule ? atrule + "{" + str + "}" : str);
        }
        for (var i = 0; i < postponed.length; i++) {
          prop = postponed[i];
          if (prop[0] === "@" && prop !== "@font-face") {
            renderer.putAt(selector, decls[prop], prop);
          } else {
            renderer.put(renderer.selector(selector, prop), decls[prop], atrule);
          }
        }
      };
      renderer.putAt = renderer.put;
      return renderer;
    };
  }
});

// node_modules/nano-css/addon/cache.js
var require_cache = __commonJS({
  "node_modules/nano-css/addon/cache.js"(exports) {
    "use strict";
    exports.addon = function(renderer) {
      var cache = {};
      renderer.cache = function(css) {
        if (!css) return "";
        var key = renderer.hash(css);
        if (!cache[key]) {
          cache[key] = renderer.rule(css, key);
        }
        return cache[key];
      };
    };
  }
});

// node_modules/nano-css/addon/__dev__/warnOnMissingDependencies.js
var require_warnOnMissingDependencies = __commonJS({
  "node_modules/nano-css/addon/__dev__/warnOnMissingDependencies.js"(exports, module) {
    "use strict";
    var pkgName = "nano-css";
    module.exports = function warnOnMissingDependencies(addon, renderer, deps) {
      var missing = [];
      for (var i = 0; i < deps.length; i++) {
        var name = deps[i];
        if (!renderer[name]) {
          missing.push(name);
        }
      }
      if (missing.length) {
        var str = 'Addon "' + addon + '" is missing the following dependencies:';
        for (var j = 0; j < missing.length; j++) {
          str += '\n require("' + pkgName + "/addon/" + missing[j] + '").addon(nano);';
        }
        throw new Error(str);
      }
    };
  }
});

// node_modules/nano-css/addon/jsx.js
var require_jsx = __commonJS({
  "node_modules/nano-css/addon/jsx.js"(exports) {
    "use strict";
    var addonCache = require_cache().addon;
    exports.addon = function(renderer) {
      if (!renderer.cache) {
        addonCache(renderer);
      }
      if (true) {
        require_warnOnMissingDependencies()("jsx", renderer, ["rule", "cache"]);
      }
      renderer.jsx = function(fn, styles, block) {
        var className;
        var isElement = typeof fn === "string";
        if (true) {
          className = renderer.rule(styles, block);
        }
        var Component2 = function(props) {
          if (!className) {
            className = renderer.rule(styles, block);
          }
          var copy = props;
          var $as = copy.$as;
          var $ref = copy.$ref;
          if (true) {
            copy = renderer.assign({}, props);
          }
          var dynamicClassName = renderer.cache(props.css);
          delete copy.css;
          delete copy.$as;
          if (isElement || $as) {
            delete copy.$ref;
            copy.ref = $ref;
          }
          copy.className = (props.className || "") + className + dynamicClassName;
          return isElement || $as ? renderer.h($as || fn, copy) : fn(copy);
        };
        if (true) {
          if (block) {
            Component2.displayName = "jsx(" + block + ")";
          }
        }
        return Component2;
      };
    };
  }
});

// node_modules/nano-css/addon/keyframes.js
var require_keyframes = __commonJS({
  "node_modules/nano-css/addon/keyframes.js"(exports) {
    "use strict";
    exports.addon = function(renderer, config) {
      if (true) {
        require_warnOnMissingDependencies()("keyframes", renderer, ["putRaw", "put"]);
      }
      config = renderer.assign({
        prefixes: ["-webkit-", "-moz-", "-o-", ""]
      }, config || {});
      var prefixes = config.prefixes;
      if (renderer.client) {
        document.head.appendChild(renderer.ksh = document.createElement("style"));
      }
      var putAt = renderer.putAt;
      renderer.putAt = function(__, keyframes2, prelude) {
        if (prelude[1] === "k") {
          var str = "";
          for (var keyframe in keyframes2) {
            var decls = keyframes2[keyframe];
            var strDecls = "";
            for (var prop in decls)
              strDecls += renderer.decl(prop, decls[prop]);
            str += keyframe + "{" + strDecls + "}";
          }
          for (var i = 0; i < prefixes.length; i++) {
            var prefix = prefixes[i];
            var rawKeyframes = prelude.replace("@keyframes", "@" + prefix + "keyframes") + "{" + str + "}";
            if (renderer.client) {
              renderer.ksh.appendChild(document.createTextNode(rawKeyframes));
            } else {
              renderer.putRaw(rawKeyframes);
            }
          }
          return;
        }
        putAt(__, keyframes2, prelude);
      };
      renderer.keyframes = function(keyframes2, block) {
        if (!block) block = renderer.hash(keyframes2);
        block = renderer.pfx + block;
        renderer.putAt("", keyframes2, "@keyframes " + block);
        return block;
      };
    };
  }
});

// node_modules/nano-css/addon/nesting.js
var require_nesting = __commonJS({
  "node_modules/nano-css/addon/nesting.js"(exports) {
    "use strict";
    exports.addon = function(renderer) {
      renderer.selector = function(parentSelectors, selector) {
        var parents = parentSelectors.split(",");
        var result = [];
        var selectors = selector.split(",");
        var len1 = parents.length;
        var len2 = selectors.length;
        var i, j, sel, pos, parent, replacedSelector;
        for (i = 0; i < len2; i++) {
          sel = selectors[i];
          pos = sel.indexOf("&");
          if (pos > -1) {
            for (j = 0; j < len1; j++) {
              parent = parents[j];
              replacedSelector = sel.replace(/&/g, parent);
              result.push(replacedSelector);
            }
          } else {
            for (j = 0; j < len1; j++) {
              parent = parents[j];
              if (parent) {
                result.push(parent + " " + sel);
              } else {
                result.push(sel);
              }
            }
          }
        }
        return result.join(",");
      };
    };
  }
});

// node_modules/nano-css/addon/rule.js
var require_rule = __commonJS({
  "node_modules/nano-css/addon/rule.js"(exports) {
    "use strict";
    exports.addon = function(renderer) {
      if (true) {
        require_warnOnMissingDependencies()("rule", renderer, ["put"]);
      }
      var blocks;
      if (true) {
        blocks = {};
      }
      renderer.rule = function(css, block) {
        if (true) {
          if (block) {
            if (typeof block !== "string") {
              throw new TypeError(
                'nano-css block name must be a string. For example, use nano.rule({color: "red", "RedText").'
              );
            }
            if (blocks[block]) {
              console.error('Block name "' + block + '" used more than once.');
            }
            blocks[block] = 1;
          }
        }
        block = block || renderer.hash(css);
        block = renderer.pfx + block;
        renderer.put("." + block, css);
        return " " + block;
      };
    };
  }
});

// node_modules/nano-css/addon/style.js
var require_style = __commonJS({
  "node_modules/nano-css/addon/style.js"(exports) {
    "use strict";
    exports.addon = function(renderer) {
      if (true) {
        require_warnOnMissingDependencies()("style", renderer, ["jsx"]);
      }
      renderer.style = function(fn, styles, dynamicTemplate, block) {
        var jsxComponent = renderer.jsx(fn, styles, block);
        var Component2 = function(props) {
          var copy = props;
          if (true) {
            copy = Object.assign({}, props);
          }
          if (dynamicTemplate) {
            copy.css = dynamicTemplate(props);
          }
          return jsxComponent(copy);
        };
        if (true) {
          if (block || typeof fn === "function") {
            Component2.displayName = "style(" + (block || fn.displayName || fn.name) + ")";
          }
        }
        return Component2;
      };
    };
  }
});

// node_modules/nano-css/addon/styled.js
var require_styled = __commonJS({
  "node_modules/nano-css/addon/styled.js"(exports) {
    "use strict";
    var tags = [
      "a",
      "abbr",
      "address",
      "area",
      "article",
      "aside",
      "audio",
      "b",
      "base",
      "bdi",
      "bdo",
      "big",
      "blockquote",
      "body",
      "br",
      "button",
      "canvas",
      "caption",
      "cite",
      "code",
      "col",
      "colgroup",
      "data",
      "datalist",
      "dd",
      "del",
      "details",
      "dfn",
      "dialog",
      "div",
      "dl",
      "dt",
      "em",
      "embed",
      "fieldset",
      "figcaption",
      "figure",
      "footer",
      "form",
      "h1",
      "h2",
      "h3",
      "h4",
      "h5",
      "h6",
      "head",
      "header",
      "hgroup",
      "hr",
      "html",
      "i",
      "iframe",
      "img",
      "input",
      "ins",
      "kbd",
      "keygen",
      "label",
      "legend",
      "li",
      "link",
      "main",
      "map",
      "mark",
      "marquee",
      "menu",
      "menuitem",
      "meta",
      "meter",
      "nav",
      "noscript",
      "object",
      "ol",
      "optgroup",
      "option",
      "output",
      "p",
      "param",
      "picture",
      "pre",
      "progress",
      "q",
      "rp",
      "rt",
      "ruby",
      "s",
      "samp",
      "script",
      "section",
      "select",
      "small",
      "source",
      "span",
      "strong",
      "style",
      "sub",
      "summary",
      "sup",
      "table",
      "tbody",
      "td",
      "textarea",
      "tfoot",
      "th",
      "thead",
      "time",
      "title",
      "tr",
      "track",
      "u",
      "ul",
      "var",
      "video",
      "wbr",
      // SVG
      "circle",
      "clipPath",
      "defs",
      "ellipse",
      "foreignObject",
      "g",
      "image",
      "line",
      "linearGradient",
      "mask",
      "path",
      "pattern",
      "polygon",
      "polyline",
      "radialGradient",
      "rect",
      "stop",
      "svg",
      "text",
      "tspan"
    ];
    exports.addon = function(renderer) {
      if (true) {
        require_warnOnMissingDependencies()("styled", renderer, ["style"]);
      }
      var styled2 = function(tag2) {
        return function(styles, dynamicTemplate, block) {
          return renderer.style(tag2, styles, dynamicTemplate, block);
        };
      };
      var tag;
      for (var i = 0; i < tags.length; i++) {
        tag = tags[i];
        styled2[tag] = styled2(tag);
      }
      renderer.styled = styled2;
    };
  }
});

// node_modules/react-spotify-web-playback/dist/index.mjs
var import_react = __toESM(require_react(), 1);

// node_modules/@gilbarbara/deep-equal/dist/index.mjs
function isOfType(type) {
  return (value) => typeof value === type;
}
var isFunction = isOfType("function");
var isNull = (value) => {
  return value === null;
};
var isRegex = (value) => {
  return Object.prototype.toString.call(value).slice(8, -1) === "RegExp";
};
var isObject = (value) => {
  return !isUndefined(value) && !isNull(value) && (isFunction(value) || typeof value === "object");
};
var isUndefined = isOfType("undefined");
function equalArray(left, right) {
  const { length } = left;
  if (length !== right.length) {
    return false;
  }
  for (let index = length; index-- !== 0; ) {
    if (!equal(left[index], right[index])) {
      return false;
    }
  }
  return true;
}
function equalArrayBuffer(left, right) {
  if (left.byteLength !== right.byteLength) {
    return false;
  }
  const view1 = new DataView(left.buffer);
  const view2 = new DataView(right.buffer);
  let index = left.byteLength;
  while (index--) {
    if (view1.getUint8(index) !== view2.getUint8(index)) {
      return false;
    }
  }
  return true;
}
function equalMap(left, right) {
  if (left.size !== right.size) {
    return false;
  }
  for (const index of left.entries()) {
    if (!right.has(index[0])) {
      return false;
    }
  }
  for (const index of left.entries()) {
    if (!equal(index[1], right.get(index[0]))) {
      return false;
    }
  }
  return true;
}
function equalSet(left, right) {
  if (left.size !== right.size) {
    return false;
  }
  for (const index of left.entries()) {
    if (!right.has(index[0])) {
      return false;
    }
  }
  return true;
}
function equal(left, right) {
  if (left === right) {
    return true;
  }
  if (left && isObject(left) && right && isObject(right)) {
    if (left.constructor !== right.constructor) {
      return false;
    }
    if (Array.isArray(left) && Array.isArray(right)) {
      return equalArray(left, right);
    }
    if (left instanceof Map && right instanceof Map) {
      return equalMap(left, right);
    }
    if (left instanceof Set && right instanceof Set) {
      return equalSet(left, right);
    }
    if (ArrayBuffer.isView(left) && ArrayBuffer.isView(right)) {
      return equalArrayBuffer(left, right);
    }
    if (isRegex(left) && isRegex(right)) {
      return left.source === right.source && left.flags === right.flags;
    }
    if (left.valueOf !== Object.prototype.valueOf) {
      return left.valueOf() === right.valueOf();
    }
    if (left.toString !== Object.prototype.toString) {
      return left.toString() === right.toString();
    }
    const leftKeys = Object.keys(left);
    const rightKeys = Object.keys(right);
    if (leftKeys.length !== rightKeys.length) {
      return false;
    }
    for (let index = leftKeys.length; index-- !== 0; ) {
      if (!Object.prototype.hasOwnProperty.call(right, leftKeys[index])) {
        return false;
      }
    }
    for (let index = leftKeys.length; index-- !== 0; ) {
      const key = leftKeys[index];
      if (key === "_owner" && left.$$typeof) {
        continue;
      }
      if (!equal(left[key], right[key])) {
        return false;
      }
    }
    return true;
  }
  if (Number.isNaN(left) && Number.isNaN(right)) {
    return true;
  }
  return left === right;
}

// node_modules/memoize-one/dist/memoize-one.esm.js
var safeIsNaN = Number.isNaN || function ponyfill(value) {
  return typeof value === "number" && value !== value;
};
function isEqual(first, second) {
  if (first === second) {
    return true;
  }
  if (safeIsNaN(first) && safeIsNaN(second)) {
    return true;
  }
  return false;
}
function areInputsEqual(newInputs, lastInputs) {
  if (newInputs.length !== lastInputs.length) {
    return false;
  }
  for (var i = 0; i < newInputs.length; i++) {
    if (!isEqual(newInputs[i], lastInputs[i])) {
      return false;
    }
  }
  return true;
}
function memoizeOne(resultFn, isEqual2) {
  if (isEqual2 === void 0) {
    isEqual2 = areInputsEqual;
  }
  var cache = null;
  function memoized() {
    var newArgs = [];
    for (var _i = 0; _i < arguments.length; _i++) {
      newArgs[_i] = arguments[_i];
    }
    if (cache && cache.lastThis === this && isEqual2(newArgs, cache.lastArgs)) {
      return cache.lastResult;
    }
    var lastResult = resultFn.apply(this, newArgs);
    cache = {
      lastResult,
      lastArgs: newArgs,
      lastThis: this
    };
    return lastResult;
  }
  memoized.clear = function clear() {
    cache = null;
  };
  return memoized;
}

// node_modules/react-spotify-web-playback/dist/index.mjs
var import_react2 = __toESM(require_react(), 1);
var import_nano_css = __toESM(require_nano_css(), 1);
var import_jsx = __toESM(require_jsx(), 1);
var import_keyframes = __toESM(require_keyframes(), 1);
var import_nesting = __toESM(require_nesting(), 1);
var import_rule = __toESM(require_rule(), 1);
var import_style = __toESM(require_style(), 1);
var import_styled = __toESM(require_styled(), 1);
var import_react3 = __toESM(require_react(), 1);
var import_jsx_runtime = __toESM(require_jsx_runtime(), 1);
var import_react4 = __toESM(require_react(), 1);
var import_jsx_runtime2 = __toESM(require_jsx_runtime(), 1);
var import_jsx_runtime3 = __toESM(require_jsx_runtime(), 1);
var import_jsx_runtime4 = __toESM(require_jsx_runtime(), 1);
var import_jsx_runtime5 = __toESM(require_jsx_runtime(), 1);
var import_react5 = __toESM(require_react(), 1);

// node_modules/@gilbarbara/react-range-slider/esm/index.js
var React = __toESM(require_react());

// node_modules/deepmerge-ts/dist/node/index.mjs
var actions = {
  defaultMerge: Symbol("deepmerge-ts: default merge"),
  skip: Symbol("deepmerge-ts: skip")
};
var actionsInto = {
  defaultMerge: actions.defaultMerge
};
function defaultMetaDataUpdater(previousMeta, metaMeta) {
  return metaMeta;
}
function getObjectType(object) {
  if (typeof object !== "object" || object === null) {
    return 0;
  }
  if (Array.isArray(object)) {
    return 2;
  }
  if (isRecord(object)) {
    return 1;
  }
  if (object instanceof Set) {
    return 3;
  }
  if (object instanceof Map) {
    return 4;
  }
  return 5;
}
function getKeys(objects) {
  const keys = /* @__PURE__ */ new Set();
  for (const object of objects) {
    for (const key of [
      ...Object.keys(object),
      ...Object.getOwnPropertySymbols(object)
    ]) {
      keys.add(key);
    }
  }
  return keys;
}
function objectHasProperty(object, property) {
  return typeof object === "object" && Object.prototype.propertyIsEnumerable.call(object, property);
}
function getIterableOfIterables(iterables) {
  return {
    *[Symbol.iterator]() {
      for (const iterable of iterables) {
        for (const value of iterable) {
          yield value;
        }
      }
    }
  };
}
var validRecordToStringValues = /* @__PURE__ */ new Set([
  "[object Object]",
  "[object Module]"
]);
function isRecord(value) {
  if (!validRecordToStringValues.has(Object.prototype.toString.call(value))) {
    return false;
  }
  const { constructor } = value;
  if (constructor === void 0) {
    return true;
  }
  const prototype = constructor.prototype;
  if (prototype === null || typeof prototype !== "object" || !validRecordToStringValues.has(Object.prototype.toString.call(prototype))) {
    return false;
  }
  if (!prototype.hasOwnProperty("isPrototypeOf")) {
    return false;
  }
  return true;
}
function mergeRecords$2(values, utils, meta) {
  const result = {};
  for (const key of getKeys(values)) {
    const propValues = [];
    for (const value of values) {
      if (objectHasProperty(value, key)) {
        propValues.push(value[key]);
      }
    }
    if (propValues.length === 0) {
      continue;
    }
    const updatedMeta = utils.metaDataUpdater(meta, {
      key,
      parents: values
    });
    const propertyResult = mergeUnknowns(propValues, utils, updatedMeta);
    if (propertyResult === actions.skip) {
      continue;
    }
    if (key === "__proto__") {
      Object.defineProperty(result, key, {
        value: propertyResult,
        configurable: true,
        enumerable: true,
        writable: true
      });
    } else {
      result[key] = propertyResult;
    }
  }
  return result;
}
function mergeArrays$2(values) {
  return values.flat();
}
function mergeSets$2(values) {
  return new Set(getIterableOfIterables(values));
}
function mergeMaps$2(values) {
  return new Map(getIterableOfIterables(values));
}
function mergeOthers$2(values) {
  return values[values.length - 1];
}
var defaultMergeFunctions = Object.freeze({
  __proto__: null,
  mergeRecords: mergeRecords$2,
  mergeArrays: mergeArrays$2,
  mergeSets: mergeSets$2,
  mergeMaps: mergeMaps$2,
  mergeOthers: mergeOthers$2
});
function deepmerge(...objects) {
  return deepmergeCustom({})(...objects);
}
function deepmergeCustom(options, rootMetaData) {
  const utils = getUtils(options, customizedDeepmerge);
  function customizedDeepmerge(...objects) {
    return mergeUnknowns(objects, utils, rootMetaData);
  }
  return customizedDeepmerge;
}
function getUtils(options, customizedDeepmerge) {
  var _a2, _b;
  return {
    defaultMergeFunctions,
    mergeFunctions: {
      ...defaultMergeFunctions,
      ...Object.fromEntries(Object.entries(options).filter(([key, option]) => Object.prototype.hasOwnProperty.call(defaultMergeFunctions, key)).map(([key, option]) => option === false ? [key, mergeOthers$2] : [key, option]))
    },
    metaDataUpdater: (_a2 = options.metaDataUpdater) !== null && _a2 !== void 0 ? _a2 : defaultMetaDataUpdater,
    deepmerge: customizedDeepmerge,
    useImplicitDefaultMerging: (_b = options.enableImplicitDefaultMerging) !== null && _b !== void 0 ? _b : false,
    actions
  };
}
function mergeUnknowns(values, utils, meta) {
  if (values.length === 0) {
    return void 0;
  }
  if (values.length === 1) {
    return mergeOthers$1(values, utils, meta);
  }
  const type = getObjectType(values[0]);
  if (type !== 0 && type !== 5) {
    for (let m_index = 1; m_index < values.length; m_index++) {
      if (getObjectType(values[m_index]) === type) {
        continue;
      }
      return mergeOthers$1(values, utils, meta);
    }
  }
  switch (type) {
    case 1: {
      return mergeRecords$1(values, utils, meta);
    }
    case 2: {
      return mergeArrays$1(values, utils, meta);
    }
    case 3: {
      return mergeSets$1(values, utils, meta);
    }
    case 4: {
      return mergeMaps$1(values, utils, meta);
    }
    default: {
      return mergeOthers$1(values, utils, meta);
    }
  }
}
function mergeRecords$1(values, utils, meta) {
  const result = utils.mergeFunctions.mergeRecords(values, utils, meta);
  if (result === actions.defaultMerge || utils.useImplicitDefaultMerging && result === void 0 && utils.mergeFunctions.mergeRecords !== utils.defaultMergeFunctions.mergeRecords) {
    return utils.defaultMergeFunctions.mergeRecords(values, utils, meta);
  }
  return result;
}
function mergeArrays$1(values, utils, meta) {
  const result = utils.mergeFunctions.mergeArrays(values, utils, meta);
  if (result === actions.defaultMerge || utils.useImplicitDefaultMerging && result === void 0 && utils.mergeFunctions.mergeArrays !== utils.defaultMergeFunctions.mergeArrays) {
    return utils.defaultMergeFunctions.mergeArrays(values);
  }
  return result;
}
function mergeSets$1(values, utils, meta) {
  const result = utils.mergeFunctions.mergeSets(values, utils, meta);
  if (result === actions.defaultMerge || utils.useImplicitDefaultMerging && result === void 0 && utils.mergeFunctions.mergeSets !== utils.defaultMergeFunctions.mergeSets) {
    return utils.defaultMergeFunctions.mergeSets(values);
  }
  return result;
}
function mergeMaps$1(values, utils, meta) {
  const result = utils.mergeFunctions.mergeMaps(values, utils, meta);
  if (result === actions.defaultMerge || utils.useImplicitDefaultMerging && result === void 0 && utils.mergeFunctions.mergeMaps !== utils.defaultMergeFunctions.mergeMaps) {
    return utils.defaultMergeFunctions.mergeMaps(values);
  }
  return result;
}
function mergeOthers$1(values, utils, meta) {
  const result = utils.mergeFunctions.mergeOthers(values, utils, meta);
  if (result === actions.defaultMerge || utils.useImplicitDefaultMerging && result === void 0 && utils.mergeFunctions.mergeOthers !== utils.defaultMergeFunctions.mergeOthers) {
    return utils.defaultMergeFunctions.mergeOthers(values);
  }
  return result;
}
function mergeRecords(m_target, values, utils, meta) {
  for (const key of getKeys(values)) {
    const propValues = [];
    for (const value of values) {
      if (objectHasProperty(value, key)) {
        propValues.push(value[key]);
      }
    }
    if (propValues.length === 0) {
      continue;
    }
    const updatedMeta = utils.metaDataUpdater(meta, {
      key,
      parents: values
    });
    const propertyTarget = { value: propValues[0] };
    mergeUnknownsInto(propertyTarget, propValues, utils, updatedMeta);
    if (key === "__proto__") {
      Object.defineProperty(m_target, key, {
        value: propertyTarget.value,
        configurable: true,
        enumerable: true,
        writable: true
      });
    } else {
      m_target.value[key] = propertyTarget.value;
    }
  }
}
function mergeArrays(m_target, values) {
  m_target.value.push(...values.slice(1).flat());
}
function mergeSets(m_target, values) {
  for (const value of getIterableOfIterables(values.slice(1))) {
    m_target.value.add(value);
  }
}
function mergeMaps(m_target, values) {
  for (const [key, value] of getIterableOfIterables(values.slice(1))) {
    m_target.value.set(key, value);
  }
}
function mergeOthers(m_target, values) {
  m_target.value = values[values.length - 1];
}
var defaultMergeIntoFunctions = Object.freeze({
  __proto__: null,
  mergeRecords,
  mergeArrays,
  mergeSets,
  mergeMaps,
  mergeOthers
});
function mergeUnknownsInto(m_target, values, utils, meta) {
  if (values.length === 0) {
    return;
  }
  if (values.length === 1) {
    return void mergeOthersInto(m_target, values, utils, meta);
  }
  const type = getObjectType(m_target.value);
  if (type !== 0 && type !== 5) {
    for (let m_index = 1; m_index < values.length; m_index++) {
      if (getObjectType(values[m_index]) === type) {
        continue;
      }
      return void mergeOthersInto(m_target, values, utils, meta);
    }
  }
  switch (type) {
    case 1: {
      return void mergeRecordsInto(m_target, values, utils, meta);
    }
    case 2: {
      return void mergeArraysInto(m_target, values, utils, meta);
    }
    case 3: {
      return void mergeSetsInto(m_target, values, utils, meta);
    }
    case 4: {
      return void mergeMapsInto(m_target, values, utils, meta);
    }
    default: {
      return void mergeOthersInto(m_target, values, utils, meta);
    }
  }
}
function mergeRecordsInto(m_target, values, utils, meta) {
  const action = utils.mergeFunctions.mergeRecords(m_target, values, utils, meta);
  if (action === actionsInto.defaultMerge) {
    utils.defaultMergeFunctions.mergeRecords(m_target, values, utils, meta);
  }
}
function mergeArraysInto(m_target, values, utils, meta) {
  const action = utils.mergeFunctions.mergeArrays(m_target, values, utils, meta);
  if (action === actionsInto.defaultMerge) {
    utils.defaultMergeFunctions.mergeArrays(m_target, values);
  }
}
function mergeSetsInto(m_target, values, utils, meta) {
  const action = utils.mergeFunctions.mergeSets(m_target, values, utils, meta);
  if (action === actionsInto.defaultMerge) {
    utils.defaultMergeFunctions.mergeSets(m_target, values);
  }
}
function mergeMapsInto(m_target, values, utils, meta) {
  const action = utils.mergeFunctions.mergeMaps(m_target, values, utils, meta);
  if (action === actionsInto.defaultMerge) {
    utils.defaultMergeFunctions.mergeMaps(m_target, values);
  }
}
function mergeOthersInto(m_target, values, utils, meta) {
  const action = utils.mergeFunctions.mergeOthers(m_target, values, utils, meta);
  if (action === actionsInto.defaultMerge || m_target.value === actionsInto.defaultMerge) {
    utils.defaultMergeFunctions.mergeOthers(m_target, values);
  }
}

// node_modules/@gilbarbara/react-range-slider/esm/utils.js
var __read = function(o, n) {
  var m = typeof Symbol === "function" && o[Symbol.iterator];
  if (!m) return o;
  var i = m.call(o), r, ar = [], e;
  try {
    while ((n === void 0 || n-- > 0) && !(r = i.next()).done) ar.push(r.value);
  } catch (error) {
    e = { error };
  } finally {
    try {
      if (r && !r.done && (m = i["return"])) m.call(i);
    } finally {
      if (e) throw e.error;
    }
  }
  return ar;
};
var __spreadArray = function(to, from, pack) {
  if (pack || arguments.length === 2) for (var i = 0, l = from.length, ar; i < l; i++) {
    if (ar || !(i in from)) {
      if (!ar) ar = Array.prototype.slice.call(from, 0, i);
      ar[i] = from[i];
    }
  }
  return to.concat(ar || Array.prototype.slice.call(from));
};
function getBaseProps(props) {
  var _a2, _b, _c, _d, _e, _f, _g;
  return {
    axis: (_a2 = props === null || props === void 0 ? void 0 : props.axis) !== null && _a2 !== void 0 ? _a2 : "x",
    xMax: (_b = props === null || props === void 0 ? void 0 : props.xMax) !== null && _b !== void 0 ? _b : 100,
    xMin: (_c = props === null || props === void 0 ? void 0 : props.xMin) !== null && _c !== void 0 ? _c : 0,
    xStep: (_d = props === null || props === void 0 ? void 0 : props.xStep) !== null && _d !== void 0 ? _d : 1,
    yMax: (_e = props === null || props === void 0 ? void 0 : props.yMax) !== null && _e !== void 0 ? _e : 100,
    yMin: (_f = props === null || props === void 0 ? void 0 : props.yMin) !== null && _f !== void 0 ? _f : 0,
    yStep: (_g = props === null || props === void 0 ? void 0 : props.yStep) !== null && _g !== void 0 ? _g : 1
  };
}
function getCoordinates(event, lastPosition) {
  if ("touches" in event) {
    var _a2 = __read(__spreadArray([], __read(Array.from(event.touches)), false), 1), touch = _a2[0];
    return {
      x: touch ? touch.clientX : lastPosition.x,
      y: touch ? touch.clientY : lastPosition.y
    };
  }
  return {
    x: event.clientX,
    y: event.clientY
  };
}
function getPosition(position, props, el) {
  var _a2 = getBaseProps(props), axis = _a2.axis, xMax = _a2.xMax, xMin = _a2.xMin, xStep = _a2.xStep, yMax = _a2.yMax, yMin = _a2.yMin, yStep = _a2.yStep;
  var _b = (el === null || el === void 0 ? void 0 : el.getBoundingClientRect()) || {}, _c = _b.height, height = _c === void 0 ? xMax : _c, _d = _b.width, width = _d === void 0 ? yMax : _d;
  var x = position.x, y = position.y;
  var dx = 0;
  var dy = 0;
  if (x < 0) {
    x = 0;
  }
  if (x > width) {
    x = width;
  }
  if (y < 0) {
    y = 0;
  }
  if (y > height) {
    y = height;
  }
  if (axis === "x" || axis === "xy") {
    dx = Math.round(x / width * (xMax - xMin));
  }
  if (axis === "y" || axis === "xy") {
    dy = Math.round(y / height * (yMax - yMin));
  }
  return {
    x: round(dx, xStep),
    y: round(dy, yStep)
  };
}
function getNormalizedValue(name, props) {
  var value = props[name] || 0;
  var min = name === "x" ? props.xMin : props.yMin;
  var max = name === "x" ? props.xMax : props.yMax;
  if (isNumber(min) && value < min) {
    return min;
  }
  if (isNumber(max) && value > max) {
    return max;
  }
  return value;
}
function isNumber(value) {
  return typeof value === "number";
}
function isUndefined2(value) {
  return typeof value === "undefined";
}
function parseNumber(value) {
  if (typeof value === "number") {
    return value;
  }
  return parseInt(value, 10);
}
function removeProperties(input) {
  var filter = [];
  for (var _i = 1; _i < arguments.length; _i++) {
    filter[_i - 1] = arguments[_i];
  }
  var output = {};
  for (var key in input) {
    if ({}.hasOwnProperty.call(input, key)) {
      if (!filter.includes(key)) {
        output[key] = input[key];
      }
    }
  }
  return output;
}
function round(value, increment) {
  return Math.ceil(value / increment) * increment;
}

// node_modules/@gilbarbara/react-range-slider/esm/styles.js
var __assign = function() {
  __assign = Object.assign || function(t) {
    for (var s, i = 1, n = arguments.length; i < n; i++) {
      s = arguments[i];
      for (var p in s) if (Object.prototype.hasOwnProperty.call(s, p))
        t[p] = s[p];
    }
    return t;
  };
  return __assign.apply(this, arguments);
};
var defaultOptions = {
  height: "20px",
  padding: "6px",
  rangeColor: "#007bff",
  thumbBorder: "2px solid #000",
  thumbBorderRadius: "4px",
  thumbBorderRadiusXY: "50%",
  thumbColor: "#fff",
  thumbSize: "10px",
  thumbSizeXY: "20px",
  thumbSpace: "6px",
  trackBorderRadius: "3px",
  trackColor: "#ccc",
  width: "20px"
};
function getStyles(styles) {
  var options = deepmerge(defaultOptions, styles ? styles.options : {});
  var slider = {
    boxSizing: "border-box",
    display: "inline-block",
    padding: options.padding,
    transition: "height 0.4s, width 0.4s"
  };
  var track = {
    backgroundColor: options.trackColor,
    borderRadius: options.trackBorderRadius,
    boxSizing: "border-box",
    height: "100%",
    position: "relative",
    width: "100%"
  };
  var range = {
    backgroundColor: options.rangeColor,
    borderRadius: options.trackBorderRadius,
    position: "absolute"
  };
  var rail = {
    boxSizing: "border-box",
    height: options.height,
    position: "absolute",
    transition: "height 0.4s, width 0.4s",
    width: options.width
  };
  var thumb = {
    backgroundColor: options.thumbColor,
    border: options.thumbBorder,
    borderRadius: options.thumbBorderRadius,
    boxSizing: "border-box",
    display: "block",
    position: "absolute",
    transition: "height 0.4s, width 0.4s"
  };
  var defaultStyles = {
    rail,
    rangeX: __assign(__assign({}, range), { height: "100%", top: 0 }),
    rangeXY: __assign(__assign({}, range), { bottom: 0 }),
    rangeY: __assign(__assign({}, range), { bottom: 0, left: 0, width: "100%" }),
    sliderX: __assign(__assign({}, slider), { height: parseNumber(options.height) + parseNumber(options.padding) * 2, width: "100%" }),
    sliderXY: __assign(__assign({}, slider), { height: "100%", width: "100%" }),
    sliderY: __assign(__assign({}, slider), { height: "100%", width: parseNumber(options.width) + parseNumber(options.padding) * 2 }),
    thumbX: __assign(__assign({}, thumb), { height: parseNumber(options.height) + parseNumber(options.thumbSpace), left: -(parseNumber(options.thumbSize) / 2), top: -(parseNumber(options.thumbSpace) / 2), width: options.thumbSize }),
    thumbXY: __assign(__assign({}, thumb), { backgroundColor: "transparent", border: options.thumbBorder, borderRadius: options.thumbBorderRadiusXY, bottom: -(parseNumber(options.thumbSizeXY) / 2), height: options.thumbSizeXY, left: -(parseNumber(options.thumbSizeXY) / 2), position: "absolute", width: options.thumbSizeXY }),
    thumbY: __assign(__assign({}, thumb), { bottom: -(parseNumber(options.thumbSize) / 2), height: options.thumbSize, left: -(parseNumber(options.thumbSpace) / 2), width: parseNumber(options.width) + parseNumber(options.thumbSpace) }),
    trackX: __assign(__assign({}, track), { height: options.height }),
    trackXY: __assign(__assign({}, track), { height: "100%", minHeight: "50px", width: "100%" }),
    trackY: __assign(__assign({}, track), { height: "100%", minHeight: "50px", width: options.width })
  };
  return deepmerge(defaultStyles, styles || {});
}

// node_modules/@gilbarbara/react-range-slider/esm/index.js
var __extends = /* @__PURE__ */ function() {
  var extendStatics = function(d, b) {
    extendStatics = Object.setPrototypeOf || { __proto__: [] } instanceof Array && function(d2, b2) {
      d2.__proto__ = b2;
    } || function(d2, b2) {
      for (var p in b2) if (Object.prototype.hasOwnProperty.call(b2, p)) d2[p] = b2[p];
    };
    return extendStatics(d, b);
  };
  return function(d, b) {
    if (typeof b !== "function" && b !== null)
      throw new TypeError("Class extends value " + String(b) + " is not a constructor or null");
    extendStatics(d, b);
    function __() {
      this.constructor = d;
    }
    d.prototype = b === null ? Object.create(b) : (__.prototype = b.prototype, new __());
  };
}();
var __assign2 = function() {
  __assign2 = Object.assign || function(t) {
    for (var s, i = 1, n = arguments.length; i < n; i++) {
      s = arguments[i];
      for (var p in s) if (Object.prototype.hasOwnProperty.call(s, p))
        t[p] = s[p];
    }
    return t;
  };
  return __assign2.apply(this, arguments);
};
var RangeSlider = (
  /** @class */
  function(_super) {
    __extends(RangeSlider2, _super);
    function RangeSlider2(props) {
      var _this = _super.call(this, props) || this;
      _this.lastCoordinates = { x: 0, y: 0 };
      _this.mounted = false;
      _this.offset = { x: 0, y: 0 };
      _this.start = { x: 0, y: 0 };
      _this.getDragPosition = function(_a2) {
        var x = _a2.x, y = _a2.y;
        return {
          x: x + _this.start.x - _this.offset.x,
          y: _this.offset.y + _this.start.y - y
        };
      };
      _this.updateOptions = function(_a2) {
        var _b, _c, _d, _e, _f, _g, _h, _j;
        var x = _a2.x, y = _a2.y;
        var _k = _this, rail = _k.rail, track = _k.track;
        _this.start = {
          x: (_c = (_b = rail.current) === null || _b === void 0 ? void 0 : _b.offsetLeft) !== null && _c !== void 0 ? _c : 0,
          y: ((_e = (_d = track.current) === null || _d === void 0 ? void 0 : _d.offsetHeight) !== null && _e !== void 0 ? _e : 0) - ((_g = (_f = rail.current) === null || _f === void 0 ? void 0 : _f.offsetTop) !== null && _g !== void 0 ? _g : 0) - ((_j = (_h = rail.current) === null || _h === void 0 ? void 0 : _h.offsetHeight) !== null && _j !== void 0 ? _j : 0)
        };
        _this.lastCoordinates = { x, y };
        _this.offset = { x, y };
      };
      _this.updatePosition = function(position) {
        _this.setState(getPosition(position, _this.props, _this.slider.current));
      };
      _this.handleBlur = function() {
        document.removeEventListener("keydown", _this.handleKeydown);
      };
      _this.handleClickTrack = function(event) {
        var onAfterEnd = _this.props.onAfterEnd;
        var isDragging = _this.state.isDragging;
        if (!isDragging) {
          var element = event.currentTarget;
          var _a2 = getCoordinates(event, _this.lastCoordinates), x = _a2.x, y = _a2.y;
          var _b = element.getBoundingClientRect(), bottom = _b.bottom, left = _b.left;
          var nextPosition = {
            x: x - left,
            y: bottom - y
          };
          _this.lastCoordinates = { x, y };
          _this.updatePosition(nextPosition);
          if (onAfterEnd) {
            onAfterEnd(getPosition(nextPosition, _this.props, _this.slider.current), _this.props);
          }
        } else if (_this.mounted) {
          _this.setState({ isDragging: false });
        }
      };
      _this.handleDrag = function(event) {
        event.preventDefault();
        var coordinates = getCoordinates(event, _this.lastCoordinates);
        _this.updatePosition(_this.getDragPosition(coordinates));
        _this.lastCoordinates = coordinates;
      };
      _this.handleDragEnd = function(event) {
        event.preventDefault();
        var _a2 = _this.props, onAfterEnd = _a2.onAfterEnd, onDragEnd = _a2.onDragEnd;
        var position = getPosition(_this.getDragPosition(getCoordinates(event, _this.lastCoordinates)), _this.props, _this.slider.current);
        document.removeEventListener("mousemove", _this.handleDrag);
        document.removeEventListener("mouseup", _this.handleDragEnd);
        document.removeEventListener("touchmove", _this.handleDrag);
        document.removeEventListener("touchend", _this.handleDragEnd);
        document.removeEventListener("touchcancel", _this.handleDragEnd);
        if (onDragEnd) {
          onDragEnd(position, _this.props);
        }
        if (onAfterEnd) {
          onAfterEnd(position, _this.props);
        }
      };
      _this.handleFocus = function() {
        document.addEventListener("keydown", _this.handleKeydown, { passive: false });
      };
      _this.handleKeydown = function(event) {
        var _a2 = _this.state, innerX = _a2.x, innerY = _a2.y;
        var _b = _this.props, x = _b.x, y = _b.y;
        var _c = getBaseProps(_this.props), axis = _c.axis, xMax = _c.xMax, xMin = _c.xMin, xStep = _c.xStep, yMax = _c.yMax, yMin = _c.yMin, yStep = _c.yStep;
        var codes = { down: "ArrowDown", left: "ArrowLeft", up: "ArrowUp", right: "ArrowRight" };
        if (Object.values(codes).includes(event.code)) {
          event.preventDefault();
          var position = {
            x: isUndefined2(x) ? innerX : getNormalizedValue("x", _this.props),
            y: isUndefined2(y) ? innerY : getNormalizedValue("y", _this.props)
          };
          var xMinus = position.x - xStep <= xMin ? xMin : position.x - xStep;
          var xPlus = position.x + xStep >= xMax ? xMax : position.x + xStep;
          var yMinus = position.y - yStep <= yMin ? yMin : position.y - yStep;
          var yPlus = position.y + yStep >= yMax ? yMax : position.y + yStep;
          switch (event.code) {
            case codes.up: {
              if (axis === "x") {
                position.x = xPlus;
              } else {
                position.y = yPlus;
              }
              break;
            }
            case codes.down: {
              if (axis === "x") {
                position.x = xMinus;
              } else {
                position.y = yMinus;
              }
              break;
            }
            case codes.left: {
              if (axis === "y") {
                position.y = yMinus;
              } else {
                position.x = xMinus;
              }
              break;
            }
            case codes.right:
            default: {
              if (axis === "y") {
                position.y = yPlus;
              } else {
                position.x = xPlus;
              }
              break;
            }
          }
          _this.setState(position);
        }
      };
      _this.handleMouseDown = function(event) {
        event.preventDefault();
        _this.updateOptions(getCoordinates(event, _this.lastCoordinates));
        _this.setState({ isDragging: true });
        document.addEventListener("mousemove", _this.handleDrag);
        document.addEventListener("mouseup", _this.handleDragEnd);
      };
      _this.handleTouchStart = function(event) {
        event.preventDefault();
        _this.updateOptions(getCoordinates(event, _this.lastCoordinates));
        document.addEventListener("touchmove", _this.handleDrag, { passive: false });
        document.addEventListener("touchend", _this.handleDragEnd, { passive: false });
        document.addEventListener("touchcancel", _this.handleDragEnd, { passive: false });
      };
      _this.slider = React.createRef();
      _this.rail = React.createRef();
      _this.track = React.createRef();
      _this.state = {
        isDragging: false,
        x: getNormalizedValue("x", props),
        y: getNormalizedValue("y", props)
      };
      return _this;
    }
    RangeSlider2.prototype.componentDidMount = function() {
      this.mounted = true;
    };
    RangeSlider2.prototype.componentDidUpdate = function(_, previousState) {
      var _a2 = this.state, x = _a2.x, y = _a2.y;
      var onChange = this.props.onChange;
      var previousX = previousState.x, previousY = previousState.y;
      if (onChange && (x !== previousX || y !== previousY)) {
        onChange({ x, y }, this.props);
      }
    };
    RangeSlider2.prototype.componentWillUnmount = function() {
      this.mounted = false;
    };
    Object.defineProperty(RangeSlider2.prototype, "position", {
      get: function() {
        var _a2 = getBaseProps(this.props), axis = _a2.axis, xMax = _a2.xMax, xMin = _a2.xMin, yMax = _a2.yMax, yMin = _a2.yMin;
        var bottom = (this.y - yMin) / (yMax - yMin) * 100;
        var left = (this.x - xMin) / (xMax - xMin) * 100;
        if (bottom > 100) {
          bottom = 100;
        }
        if (bottom < 0) {
          bottom = 0;
        }
        if (axis === "x") {
          bottom = 0;
        }
        if (left > 100) {
          left = 100;
        }
        if (left < 0) {
          left = 0;
        }
        if (axis === "y") {
          left = 0;
        }
        return { x: left, y: bottom };
      },
      enumerable: false,
      configurable: true
    });
    Object.defineProperty(RangeSlider2.prototype, "styles", {
      get: function() {
        var styles = this.props.styles;
        return getStyles(styles);
      },
      enumerable: false,
      configurable: true
    });
    Object.defineProperty(RangeSlider2.prototype, "x", {
      get: function() {
        var innerX = this.state.x;
        var x = this.props.x;
        return isUndefined2(x) ? innerX : x;
      },
      enumerable: false,
      configurable: true
    });
    Object.defineProperty(RangeSlider2.prototype, "y", {
      get: function() {
        var innerY = this.state.y;
        var y = this.props.y;
        return isUndefined2(y) ? innerY : y;
      },
      enumerable: false,
      configurable: true
    });
    RangeSlider2.prototype.render = function() {
      var _a2 = this.props, axis = _a2.axis, className = _a2.className, xMax = _a2.xMax, xMin = _a2.xMin, yMax = _a2.yMax, yMin = _a2.yMin;
      var rest = removeProperties(this.props, "axis", "className", "onAfterEnd", "onChange", "onDragEnd", "styles", "x", "xMin", "xMax", "xStep", "y", "yMin", "yMax", "yStep");
      var _b = this.position, xPos = _b.x, yPos = _b.y;
      var position = { left: "".concat(xPos, "%"), bottom: "".concat(yPos, "%") };
      var size = {};
      var orientation;
      var range;
      var slider;
      var thumb;
      var track;
      var valuemax = xMax;
      var valuemin = xMin;
      var valuenow = this.x;
      if (axis === "x") {
        size.width = "".concat(xPos, "%");
        slider = this.styles.sliderX;
        orientation = "horizontal";
        range = this.styles.rangeX;
        track = this.styles.trackX;
        thumb = this.styles.thumbX;
      }
      if (axis === "y") {
        size.height = "".concat(yPos, "%");
        slider = this.styles.sliderY;
        range = this.styles.rangeY;
        track = this.styles.trackY;
        thumb = this.styles.thumbY;
        orientation = "vertical";
        valuemax = yMax;
        valuemin = yMin;
        valuenow = this.y;
      }
      if (axis === "xy") {
        size.height = "".concat(yPos, "%");
        size.width = "".concat(xPos, "%");
        slider = this.styles.sliderXY;
        range = this.styles.rangeXY;
        track = this.styles.trackXY;
        thumb = this.styles.thumbXY;
      }
      return React.createElement(
        "div",
        __assign2({ ref: this.slider, className, style: slider }, rest),
        React.createElement(
          "div",
          {
            ref: this.track,
            className: className && "".concat(className, "__track"),
            onClick: this.handleClickTrack,
            role: "presentation",
            // @ts-ignore We can't use React's events because the listeners
            style: track
          },
          React.createElement("div", { className: className && "".concat(className, "__range"), style: __assign2(__assign2({}, size), range) }),
          React.createElement(
            "div",
            {
              ref: this.rail,
              onMouseDown: this.handleMouseDown,
              onTouchStart: this.handleTouchStart,
              // @ts-ignore We can't use React's events because the listeners
              role: "presentation",
              // @ts-ignore We can't use React's events because the listeners
              style: __assign2(__assign2({}, this.styles.rail), position)
            },
            React.createElement("span", { "aria-label": "slider handle", "aria-orientation": orientation, "aria-valuemax": valuemax, "aria-valuemin": valuemin, "aria-valuenow": valuenow, className: className && "".concat(className, "__thumb"), onBlur: this.handleBlur, onFocus: this.handleFocus, role: "slider", style: thumb, tabIndex: 0 })
          )
        )
      );
    };
    RangeSlider2.defaultProps = getBaseProps();
    return RangeSlider2;
  }(React.Component)
);
var esm_default = RangeSlider;

// node_modules/react-spotify-web-playback/dist/index.mjs
var import_jsx_runtime6 = __toESM(require_jsx_runtime(), 1);
var import_jsx_runtime7 = __toESM(require_jsx_runtime(), 1);
var import_react6 = __toESM(require_react(), 1);
var import_react7 = __toESM(require_react(), 1);
var import_jsx_runtime8 = __toESM(require_jsx_runtime(), 1);
var import_jsx_runtime9 = __toESM(require_jsx_runtime(), 1);
var import_jsx_runtime10 = __toESM(require_jsx_runtime(), 1);
var import_jsx_runtime11 = __toESM(require_jsx_runtime(), 1);
var import_jsx_runtime12 = __toESM(require_jsx_runtime(), 1);
var import_jsx_runtime13 = __toESM(require_jsx_runtime(), 1);
var import_jsx_runtime14 = __toESM(require_jsx_runtime(), 1);
var import_react8 = __toESM(require_react(), 1);

// node_modules/colorizr/dist/index.mjs
var __defProp = Object.defineProperty;
var __export = (target, all) => {
  for (var name2 in all)
    __defProp(target, name2, { get: all[name2], enumerable: true });
};
function invariant(condition, message) {
  if (condition) {
    return;
  }
  if (true) {
    if (message === void 0) {
      throw new Error("invariant requires an error message argument");
    }
  }
  const error = !message ? new Error(
    "Minified exception occurred; use the non-minified dev environment for the full error message and additional helpful warnings."
  ) : new Error(message);
  error.name = "colorizr";
  throw error;
}
var COLOR_KEYS = {
  hsl: ["h", "s", "l"],
  oklab: ["l", "a", "b"],
  oklch: ["l", "c", "h"],
  rgb: ["r", "g", "b"]
};
var COLOR_MODELS = ["hsl", "oklab", "oklch", "rgb"];
var DEG2RAD = Math.PI / 180;
var LAB_TO_LMS = {
  l: [0.3963377773761749, 0.2158037573099136],
  m: [-0.1055613458156586, -0.0638541728258133],
  s: [-0.0894841775298119, -1.2914855480194092]
};
var LRGB_TO_LMS = {
  l: [0.4122214708, 0.5363325363, 0.0514459929],
  m: [0.2119034982, 0.6806995451, 0.1073969566],
  s: [0.0883024619, 0.2817188376, 0.6299787005]
};
var LSM_TO_LAB = {
  l: [0.2104542553, 0.793617785, 0.0040720468],
  a: [1.9779984951, 2.428592205, 0.4505937099],
  b: [0.0259040371, 0.7827717662, 0.808675766]
};
var LSM_TO_RGB = {
  r: [4.076741636075958, -3.307711539258063, 0.2309699031821043],
  g: [-1.2684379732850315, 2.609757349287688, -0.341319376002657],
  b: [-0.0041960761386756, -0.7034186179359362, 1.7076146940746117]
};
var PRECISION = 5;
var RAD2DEG = 180 / Math.PI;
var MESSAGES = {
  alpha: "amount must be a number between 0 and 1",
  hueRange: "hue must be a number between 0 and 360",
  input: "input is required",
  inputHex: "input is required and must be a hex",
  inputNumber: "input is required and must be a number",
  inputString: "input is required and must be a string",
  invalid: "invalid input",
  invalidCSS: "invalid CSS string",
  left: "left is required and must be a string",
  lightnessRange: "lightness must be a number between 0 and 1",
  options: "invalid options",
  right: "right is required and must be a string",
  threshold: "threshold must be a number between 0 and 255"
};
var cssColors = {
  aliceblue: "#f0f8ff",
  antiquewhite: "#faebd7",
  aqua: "#00ffff",
  aquamarine: "#7fffd4",
  azure: "#f0ffff",
  beige: "#f5f5dc",
  bisque: "#ffe4c4",
  black: "#000000",
  blanchedalmond: "#ffebcd",
  blue: "#0000ff",
  blueviolet: "#8a2be2",
  brown: "#a52a2a",
  burlywood: "#deb887",
  cadetblue: "#5f9ea0",
  chartreuse: "#7fff00",
  chocolate: "#d2691e",
  coral: "#ff7f50",
  cornflowerblue: "#6495ed",
  cornsilk: "#fff8dc",
  crimson: "#dc143c",
  cyan: "#00ffff",
  darkblue: "#00008b",
  darkcyan: "#008b8b",
  darkgoldenrod: "#b8860b",
  darkgray: "#a9a9a9",
  darkgreen: "#006400",
  darkkhaki: "#bdb76b",
  darkmagenta: "#8b008b",
  darkolivegreen: "#556b2f",
  darkorange: "#ff8c00",
  darkorchid: "#9932cc",
  darkred: "#8b0000",
  darksalmon: "#e9967a",
  darkseagreen: "#8fbc8f",
  darkslateblue: "#483d8b",
  darkslategray: "#2f4f4f",
  darkslategrey: "#2f4f4f",
  darkturquoise: "#00ced1",
  darkviolet: "#9400d3",
  deeppink: "#ff1493",
  deepskyblue: "#00bfff",
  dimgray: "#696969",
  dimgrey: "#696969",
  dodgerblue: "#1e90ff",
  firebrick: "#b22222",
  floralwhite: "#fffaf0",
  forestgreen: "#228b22",
  fuchsia: "#ff00ff",
  gainsboro: "#dcdcdc",
  ghostwhite: "#f8f8ff",
  gold: "#ffd700",
  goldenrod: "#daa520",
  gray: "#808080",
  grey: "#808080",
  green: "#008000",
  greenyellow: "#adff2f",
  honeydew: "#f0fff0",
  hotpink: "#ff69b4",
  indianred: "#cd5c5c",
  indigo: "#4b0082",
  ivory: "#fffff0",
  khaki: "#f0e68c",
  lavender: "#e6e6fa",
  lavenderblush: "#fff0f5",
  lawngreen: "#7cfc00",
  lemonchiffon: "#fffacd",
  lightblue: "#add8e6",
  lightcoral: "#f08080",
  lightcyan: "#e0ffff",
  lightgoldenrodyellow: "#fafad2",
  lightgray: "#d3d3d3",
  lightgreen: "#90ee90",
  lightgrey: "#d3d3d3",
  lightpink: "#ffb6c1",
  lightsalmon: "#ffa07a",
  lightseagreen: "#20b2aa",
  lightskyblue: "#87cefa",
  lightslategray: "#778899",
  lightslategrey: "#778899",
  lightsteelblue: "#b0c4de",
  lightyellow: "#ffffe0",
  lime: "#00ff00",
  limegreen: "#32cd32",
  linen: "#faf0e6",
  magenta: "#ff00ff",
  maroon: "#800000",
  mediumaquamarine: "#66cdaa",
  mediumblue: "#0000cd",
  mediumorchid: "#ba55d3",
  mediumpurple: "#9370db",
  mediumseagreen: "#3cb371",
  mediumslateblue: "#7b68ee",
  mediumspringgreen: "#00fa9a",
  mediumturquoise: "#48d1cc",
  mediumvioletred: "#c71585",
  midnightblue: "#191970",
  mintcream: "#f5fffa",
  mistyrose: "#ffe4e1",
  moccasin: "#ffe4b5",
  navajowhite: "#ffdead",
  navy: "#000080",
  oldlace: "#fdf5e6",
  olive: "#808000",
  olivedrab: "#6b8e23",
  orange: "#ffa500",
  orangered: "#ff4500",
  orchid: "#da70d6",
  palegoldenrod: "#eee8aa",
  palegreen: "#98fb98",
  paleturquoise: "#afeeee",
  palevioletred: "#db7093",
  papayawhip: "#ffefd5",
  peachpuff: "#ffdab9",
  peru: "#cd853f",
  pink: "#ffc0cb",
  plum: "#dda0dd",
  powderblue: "#b0e0e6",
  purple: "#800080",
  rebeccapurple: "#663399",
  red: "#ff0000",
  rosybrown: "#bc8f8f",
  royalblue: "#4169e1",
  saddlebrown: "#8b4513",
  salmon: "#fa8072",
  sandybrown: "#f4a460",
  seagreen: "#2e8b57",
  seashell: "#fff5ee",
  sienna: "#a0522d",
  silver: "#c0c0c0",
  skyblue: "#87ceeb",
  slateblue: "#6a5acd",
  slategray: "#708090",
  slategrey: "#708090",
  snow: "#fffafa",
  springgreen: "#00ff7f",
  steelblue: "#4682b4",
  tan: "#d2b48c",
  teal: "#008080",
  thistle: "#d8bfd8",
  tomato: "#ff6347",
  turquoise: "#40e0d0",
  violet: "#ee82ee",
  wheat: "#f5deb3",
  white: "#ffffff",
  whitesmoke: "#f5f5f5",
  yellow: "#ffff00",
  yellowgreen: "#9acd32"
};
function hasValidMatches(input) {
  return Array.isArray(input) && input.length === 6;
}
function isNamedColor(input) {
  return isString(input) && Object.keys(cssColors).includes(input.toLowerCase());
}
function isNumber2(input) {
  return typeof input === "number" && !Number.isNaN(input);
}
function isPlainObject(input) {
  if (!input) {
    return false;
  }
  const { toString } = Object.prototype;
  const prototype = Object.getPrototypeOf(input);
  return toString.call(input) === "[object Object]" && (prototype === null || prototype === Object.getPrototypeOf({}));
}
function isString(input, validate = true) {
  const isValid = typeof input === "string";
  if (validate) {
    return isValid && !!input.trim().length;
  }
  return isValid;
}
function isValidColorModel(input) {
  return isHSL(input) || isRGB(input) || isLAB(input) || isLCH(input);
}
function isHex(input) {
  if (!isString(input)) {
    return false;
  }
  return /^#([\da-f]{3,4}|[\da-f]{6,8})$/i.test(input);
}
function isHSL(input) {
  if (!isPlainObject(input)) {
    return false;
  }
  const entries = Object.entries(input);
  return !!entries.length && entries.every(([key, value]) => {
    if (key === "h") {
      return value >= 0 && value <= 360;
    }
    if (key === "alpha") {
      return value >= 0 && value <= 1;
    }
    return COLOR_KEYS.hsl.includes(key) && value >= 0 && value <= 100;
  });
}
function isLAB(input) {
  if (!isPlainObject(input)) {
    return false;
  }
  const entries = Object.entries(input);
  return !!entries.length && entries.every(([key, value]) => {
    if (key === "l") {
      return value >= 0 && value <= 100;
    }
    if (key === "alpha") {
      return value >= 0 && value <= 1;
    }
    return COLOR_KEYS.oklab.includes(key) && value >= -1 && value <= 1;
  });
}
function isLCH(input) {
  if (!isPlainObject(input)) {
    return false;
  }
  const entries = Object.entries(input);
  return !!entries.length && entries.every(([key, value]) => {
    if (key === "l") {
      return value >= 0 && value <= 100;
    }
    if (key === "alpha") {
      return value >= 0 && value <= 1;
    }
    return COLOR_KEYS.oklch.includes(key) && value >= 0 && value <= (key === "h" ? 360 : 1);
  });
}
function isRGB(input) {
  if (!isPlainObject(input)) {
    return false;
  }
  const entries = Object.entries(input);
  return !!entries.length && entries.every(([key, value]) => {
    if (key === "alpha") {
      return value >= 0 && value <= 1;
    }
    return COLOR_KEYS.rgb.includes(key) && value >= 0 && value <= 255;
  });
}
function addAlpha(input, alpha) {
  invariant(isValidColorModel(input), MESSAGES.invalid);
  let value = alpha;
  if (!value) {
    return input;
  }
  if (value > 1) {
    value /= 100;
  }
  if (value === 1) {
    return input;
  }
  return { ...input, alpha: value };
}
function clamp(value, min = 0, max = 100) {
  return Math.min(Math.max(value, min), max);
}
function limit(input, model, key) {
  invariant(isNumber2(input), "Input is not a number");
  invariant(COLOR_MODELS.includes(model), `Invalid model${model ? `: ${model}` : ""}`);
  invariant(COLOR_KEYS[model].includes(key), `Invalid key${key ? `: ${key}` : ""}`);
  switch (model) {
    case "hsl": {
      invariant(COLOR_KEYS.hsl.includes(key), "Invalid key");
      if (["s", "l"].includes(key)) {
        return clamp(input);
      }
      return clamp(input, 0, 360);
    }
    case "rgb": {
      invariant(COLOR_KEYS.rgb.includes(key), "Invalid key");
      return clamp(input, 0, 255);
    }
    /* c8 ignore next 3 */
    default: {
      throw new Error("Invalid inputs");
    }
  }
}
function parseInput(input, model) {
  const keys = COLOR_KEYS[model];
  const validator = {
    hsl: isHSL,
    oklab: isLAB,
    oklch: isLCH,
    rgb: isRGB
  };
  invariant(isPlainObject(input) || Array.isArray(input), MESSAGES.invalid);
  const value = Array.isArray(input) ? { [keys[0]]: input[0], [keys[1]]: input[1], [keys[2]]: input[2] } : input;
  invariant(validator[model](value), `invalid ${model} color`);
  return value;
}
function restrictValues(input, precision = PRECISION, forcePrecision = true) {
  const output = new Map(Object.entries(input));
  for (const [key, value] of output.entries()) {
    output.set(key, round2(value, precision, forcePrecision));
  }
  return Object.fromEntries(output);
}
function round2(input, precision = 2, forcePrecision = true) {
  if (!isNumber2(input) || input === 0) {
    return 0;
  }
  if (forcePrecision) {
    const factor2 = 10 ** precision;
    return Math.round(input * factor2) / factor2;
  }
  const absInput = Math.abs(input);
  let digits = Math.abs(Math.ceil(Math.log(absInput) / Math.LN10));
  if (digits === 0) {
    digits = 2;
  } else if (digits > precision) {
    digits = precision;
  }
  let exponent = precision - (digits < 0 ? 0 : digits);
  if (exponent <= 1 && precision > 1) {
    exponent = 2;
  } else if (exponent > precision || exponent === 0) {
    exponent = precision;
  }
  const factor = 10 ** exponent;
  return Math.round(input * factor) / factor;
}
function convertAlphaToHex(input) {
  invariant(isNumber2(input), MESSAGES.inputNumber);
  let alpha = input;
  if (input > 1) {
    alpha /= 100;
  }
  return Math.round(alpha * 255).toString(16).padStart(2, "0");
}
function extractAlphaFromHex(input) {
  invariant(isHex(input), MESSAGES.inputString);
  const alpha = input.substring(7, 9);
  if (!alpha) {
    return 1;
  }
  return round2(parseInt(alpha, 16) / 255);
}
function removeAlphaFromHex(input) {
  invariant(isHex(input), MESSAGES.inputHex);
  if (input.length === 5) {
    return input.substring(0, 4);
  }
  return input.substring(0, 7);
}
var converters_exports = {};
__export(converters_exports, {
  hex2hsl: () => hex2hsl,
  hex2oklab: () => hex2oklab,
  hex2oklch: () => hex2oklch,
  hex2rgb: () => hex2rgb,
  hsl2hex: () => hsl2hex,
  hsl2oklab: () => hsl2oklab,
  hsl2oklch: () => hsl2oklch,
  hsl2rgb: () => hsl2rgb,
  oklab2hex: () => oklab2hex,
  oklab2hsl: () => oklab2hsl,
  oklab2oklch: () => oklab2oklch,
  oklab2rgb: () => oklab2rgb,
  oklch2hex: () => oklch2hex,
  oklch2hsl: () => oklch2hsl,
  oklch2oklab: () => oklch2oklab,
  oklch2rgb: () => oklch2rgb,
  rgb2hex: () => rgb2hex,
  rgb2hsl: () => rgb2hsl,
  rgb2oklab: () => rgb2oklab,
  rgb2oklch: () => rgb2oklch
});
function formatHex(input) {
  invariant(isHex(input), MESSAGES.inputHex);
  let color = input.replace("#", "");
  if (color.length === 3 || color.length === 4) {
    const values = [...color];
    color = "";
    values.forEach((d) => {
      color += `${d}${d}`;
    });
  }
  const hex = `#${color}`;
  invariant(isHex(hex), "invalid hex");
  return hex;
}
function hex2rgb(input) {
  invariant(isHex(input), MESSAGES.inputHex);
  const hex = formatHex(input).slice(1);
  return {
    r: parseInt(hex.charAt(0) + hex.charAt(1), 16),
    g: parseInt(hex.charAt(2) + hex.charAt(3), 16),
    b: parseInt(hex.charAt(4) + hex.charAt(5), 16)
  };
}
function rgb2hsl(input) {
  const value = parseInput(input, "rgb");
  const rLimit = limit(value.r, "rgb", "r") / 255;
  const gLimit = limit(value.g, "rgb", "g") / 255;
  const bLimit = limit(value.b, "rgb", "b") / 255;
  const min = Math.min(rLimit, gLimit, bLimit);
  const max = Math.max(rLimit, gLimit, bLimit);
  const delta = max - min;
  let h = 0;
  let s;
  const l = (max + min) / 2;
  let rate;
  switch (max) {
    case rLimit:
      rate = !delta ? 0 : (gLimit - bLimit) / delta;
      h = 60 * rate;
      break;
    case gLimit:
      rate = (bLimit - rLimit) / delta;
      h = 60 * rate + 120;
      break;
    case bLimit:
      rate = (rLimit - gLimit) / delta;
      h = 60 * rate + 240;
      break;
    /* c8 ignore next 2 */
    default:
      break;
  }
  if (h < 0) {
    h = 360 + h;
  }
  if (min === max) {
    s = 0;
  } else {
    s = l < 0.5 ? delta / (2 * l) : delta / (2 - 2 * l);
  }
  return {
    h: Math.abs(+(h % 360).toFixed(2)),
    s: +(s * 100).toFixed(2),
    l: +(l * 100).toFixed(2)
  };
}
function hex2hsl(input) {
  invariant(isHex(input), MESSAGES.inputHex);
  return rgb2hsl(hex2rgb(input));
}
var { cbrt, sign } = Math;
function rgb2lrgb(input) {
  const abs2 = Math.abs(input);
  if (abs2 < 0.04045) {
    return input / 12.92;
  }
  return (sign(input) || 1) * ((abs2 + 0.055) / 1.055) ** 2.4;
}
function rgb2oklab(input, precision = PRECISION) {
  const value = parseInput(input, "rgb");
  const [lr, lg, lb] = [rgb2lrgb(value.r / 255), rgb2lrgb(value.g / 255), rgb2lrgb(value.b / 255)];
  const l = cbrt(LRGB_TO_LMS.l[0] * lr + LRGB_TO_LMS.l[1] * lg + LRGB_TO_LMS.l[2] * lb);
  const m = cbrt(LRGB_TO_LMS.m[0] * lr + LRGB_TO_LMS.m[1] * lg + LRGB_TO_LMS.m[2] * lb);
  const s = cbrt(LRGB_TO_LMS.s[0] * lr + LRGB_TO_LMS.s[1] * lg + LRGB_TO_LMS.s[2] * lb);
  const lab = {
    l: LSM_TO_LAB.l[0] * l + LSM_TO_LAB.l[1] * m - LSM_TO_LAB.l[2] * s,
    a: LSM_TO_LAB.a[0] * l - LSM_TO_LAB.a[1] * m + LSM_TO_LAB.a[2] * s,
    b: LSM_TO_LAB.b[0] * l + LSM_TO_LAB.b[1] * m - LSM_TO_LAB.b[2] * s
  };
  return restrictValues(lab, precision);
}
function hex2oklab(input, precision) {
  invariant(isHex(input), MESSAGES.inputHex);
  return rgb2oklab(hex2rgb(input), precision);
}
var { atan2, sqrt } = Math;
function oklab2oklch(input, precision) {
  const { l, a, b } = restrictValues(parseInput(input, "oklab"));
  const c = sqrt(a ** 2 + b ** 2);
  let h = (atan2(b, a) * RAD2DEG + 360) % 360;
  if (round2(c * 1e4) === 0) {
    h = 0;
  }
  return restrictValues({ l, c, h }, precision);
}
function rgb2oklch(input, precision) {
  const value = parseInput(input, "rgb");
  return oklab2oklch(rgb2oklab(value, precision), precision);
}
function hex2oklch(input, precision) {
  invariant(isHex(input), MESSAGES.inputHex);
  return rgb2oklch(hex2rgb(input), precision);
}
function hue2rgb(point, chroma2, h) {
  invariant(isNumber2(point) && isNumber2(chroma2) && isNumber2(h), "point, chroma and h are required");
  let hue = h;
  if (hue < 0) {
    hue += 1;
  }
  if (hue > 1) {
    hue -= 1;
  }
  if (hue < 1 / 6) {
    return round2(point + (chroma2 - point) * 6 * hue, 4);
  }
  if (hue < 1 / 2) {
    return round2(chroma2, 4);
  }
  if (hue < 2 / 3) {
    return round2(point + (chroma2 - point) * (2 / 3 - hue) * 6, 4);
  }
  return round2(point, 4);
}
function hsl2rgb(input) {
  const value = parseInput(input, "hsl");
  const h = round2(value.h) / 360;
  const s = round2(value.s) / 100;
  const l = round2(value.l) / 100;
  let r;
  let g;
  let b;
  let point;
  let chroma2;
  if (s === 0) {
    r = l;
    g = l;
    b = l;
  } else {
    chroma2 = l < 0.5 ? l * (1 + s) : l + s - l * s;
    point = 2 * l - chroma2;
    r = hue2rgb(point, chroma2, h + 1 / 3);
    g = hue2rgb(point, chroma2, h);
    b = hue2rgb(point, chroma2, h - 1 / 3);
  }
  return {
    r: Math.round(r * 255),
    g: Math.round(g * 255),
    b: Math.round(b * 255)
  };
}
function rgb2hex(input) {
  const rgb = parseInput(input, "rgb");
  return `#${Object.values(rgb).map((d) => `0${Math.floor(d).toString(16)}`.slice(-2)).join("")}`;
}
function hsl2hex(input) {
  const value = parseInput(input, "hsl");
  return rgb2hex(hsl2rgb(value));
}
function hsl2oklab(input, precision) {
  const value = parseInput(input, "hsl");
  return rgb2oklab(hsl2rgb(value), precision);
}
function hsl2oklch(input, precision) {
  const value = parseInput(input, "hsl");
  return rgb2oklch(hsl2rgb(value), precision);
}
var { abs } = Math;
function lrgb2rgb(input) {
  const absoluteNumber = abs(input);
  const sign2 = input < 0 ? -1 : 1;
  if (absoluteNumber > 31308e-7) {
    return sign2 * (absoluteNumber ** (1 / 2.4) * 1.055 - 0.055);
  }
  return input * 12.92;
}
function oklab2rgb(input, precision = 0) {
  const { l: L, a: A, b: B } = parseInput(input, "oklab");
  const l = (L + LAB_TO_LMS.l[0] * A + LAB_TO_LMS.l[1] * B) ** 3;
  const m = (L + LAB_TO_LMS.m[0] * A + LAB_TO_LMS.m[1] * B) ** 3;
  const s = (L + LAB_TO_LMS.s[0] * A + LAB_TO_LMS.s[1] * B) ** 3;
  const r = 255 * lrgb2rgb(LSM_TO_RGB.r[0] * l + LSM_TO_RGB.r[1] * m + LSM_TO_RGB.r[2] * s);
  const g = 255 * lrgb2rgb(LSM_TO_RGB.g[0] * l + LSM_TO_RGB.g[1] * m + LSM_TO_RGB.g[2] * s);
  const b = 255 * lrgb2rgb(LSM_TO_RGB.b[0] * l + LSM_TO_RGB.b[1] * m + LSM_TO_RGB.b[2] * s);
  return {
    r: clamp(round2(r, precision), 0, 255),
    g: clamp(round2(g, precision), 0, 255),
    b: clamp(round2(b, precision), 0, 255)
  };
}
function oklab2hex(input) {
  const value = parseInput(input, "oklab");
  return rgb2hex(oklab2rgb(value));
}
function oklab2hsl(input) {
  const value = parseInput(input, "oklab");
  return rgb2hsl(oklab2rgb(value));
}
var { sin, cos } = Math;
function oklch2oklab(input, precision) {
  let { l, c, h } = parseInput(input, "oklch");
  if (Number.isNaN(h) || h < 0) {
    h = 0;
  }
  return restrictValues({ l, a: c * cos(h * DEG2RAD), b: c * sin(h * DEG2RAD) }, precision);
}
function oklch2rgb(input, precision = 0) {
  const value = parseInput(input, "oklch");
  return oklab2rgb(oklch2oklab(value), precision);
}
function oklch2hex(input) {
  const value = parseInput(input, "oklch");
  return rgb2hex(oklch2rgb(value));
}
function oklch2hsl(input) {
  const value = parseInput(input, "oklch");
  return rgb2hsl(oklch2rgb(value));
}
function extractColorParts(input) {
  invariant(isString(input), MESSAGES.inputString);
  if (isHex(input)) {
    const keys2 = COLOR_KEYS.rgb;
    const { r, g, b } = hex2rgb(input);
    const alpha2 = extractAlphaFromHex(input);
    return {
      model: "rgb",
      [keys2[0]]: r,
      [keys2[1]]: g,
      [keys2[2]]: b,
      alpha: alpha2 < 1 ? alpha2 : void 0
    };
  }
  const colorRegex = /(?:(rgb|hsl|oklab|oklch)a?\s*\(\s*([\d%.-]+)\s*[ ,/]\s*([\d%.-]+)\s*[ ,/]\s*([\d%.-]+)(?:\s*[ ,/]\s*([\d%.-]+))?\s*\))/i;
  const matches = colorRegex.exec(input);
  invariant(hasValidMatches(matches), MESSAGES.invalidCSS);
  const model = matches[1];
  const keys = COLOR_KEYS[model];
  let alpha = matches[5] ? parseFloat(matches[5]) : 1;
  if (alpha > 1) {
    alpha /= 100;
  }
  return {
    model,
    [keys[0]]: parseFloat(matches[2]),
    [keys[1]]: parseFloat(matches[3]),
    [keys[2]]: parseFloat(matches[4]),
    alpha: alpha < 1 ? alpha : void 0
  };
}
function parseCSS(input, format) {
  invariant(isString(input), MESSAGES.inputString);
  let result;
  const value = isNamedColor(input) ? cssColors[input.toLowerCase()] : input;
  const output = format ?? (isHex(value) ? "hex" : extractColorParts(value).model);
  const colorParams = (params) => Object.values(params);
  if (isHex(value)) {
    const alpha = extractAlphaFromHex(value);
    switch (output) {
      case "hsl": {
        result = addAlpha(hex2hsl(value), alpha);
        break;
      }
      case "oklab": {
        result = addAlpha(hex2oklab(value), alpha);
        break;
      }
      case "oklch": {
        result = addAlpha(hex2oklch(value), alpha);
        break;
      }
      case "rgb": {
        result = addAlpha(hex2rgb(value), alpha);
        break;
      }
      default: {
        result = `${removeAlphaFromHex(value)}${alpha !== 1 ? convertAlphaToHex(alpha) : ""}`;
        break;
      }
    }
    return result;
  }
  switch (output) {
    case "hsl": {
      const { alpha, model, ...color } = extractColorParts(value);
      if (["oklab", "oklch"].includes(model) && color.l > 1) {
        color.l = round2(color.l / 100, PRECISION);
      }
      result = addAlpha(
        model === "hsl" ? color : converters_exports[`${model}2hsl`](colorParams(color)),
        alpha
      );
      break;
    }
    case "oklab": {
      const { alpha, model, ...color } = extractColorParts(value);
      if (["oklab", "oklch"].includes(model) && color.l > 1) {
        color.l = round2(color.l / 100, PRECISION);
      }
      result = addAlpha(
        model === "oklab" ? color : converters_exports[`${model}2oklab`](colorParams(color)),
        alpha
      );
      break;
    }
    case "oklch": {
      const { alpha, model, ...color } = extractColorParts(value);
      if (["oklab", "oklch"].includes(model) && color.l > 1) {
        color.l = round2(color.l / 100, PRECISION);
      }
      result = addAlpha(
        model === "oklch" ? color : converters_exports[`${model}2oklch`](colorParams(color)),
        alpha
      );
      break;
    }
    case "rgb": {
      const { alpha, model, ...color } = extractColorParts(value);
      if (["oklab", "oklch"].includes(model) && color.l > 1) {
        color.l /= 100;
      }
      result = addAlpha(
        model === "rgb" ? color : converters_exports[`${model}2rgb`](colorParams(color)),
        alpha
      );
      break;
    }
    case "hex":
    default: {
      const { alpha, model, ...color } = extractColorParts(value);
      let alphaPrefix = "";
      if (["oklab", "oklch"].includes(model) && color.l > 1) {
        color.l = round2(color.l / 100, PRECISION);
      }
      if (alpha) {
        alphaPrefix = convertAlphaToHex(alpha);
      }
      result = `${converters_exports[`${model}2hex`](colorParams(color))}${alphaPrefix}`;
      break;
    }
  }
  return result;
}
function formatCSS(input, options = {}) {
  invariant(isHex(input) || isValidColorModel(input), MESSAGES.invalid);
  const { alpha, format = "hex", precision = PRECISION, separator: baseSeparator = " " } = options;
  let value;
  if (isHex(input)) {
    value = hex2hsl(input);
  } else if (isHSL(input)) {
    value = input;
  } else if (isLAB(input)) {
    value = oklab2hsl(input);
  } else if (isLCH(input)) {
    value = oklch2hsl(input);
  } else {
    value = rgb2hsl(input);
  }
  const opacity2 = alpha && alpha !== 1 ? `${round2(alpha * 100)}%` : null;
  let params = [];
  let separator = baseSeparator;
  switch (format) {
    case "hsl": {
      const { h, s, l } = value;
      params = [h, `${s}%`, `${l}%`];
      break;
    }
    case "oklab": {
      separator = " ";
      const { l, a, b } = restrictValues(hsl2oklab(value), precision);
      params = [`${round2(l * 100, precision)}%`, a, b];
      break;
    }
    case "oklch": {
      separator = " ";
      const { l, c, h } = restrictValues(hsl2oklch(value), precision);
      params = [`${round2(l * 100, precision)}%`, c, h];
      break;
    }
    case "rgb": {
      const { r, g, b } = hsl2rgb(value);
      params = [r, g, b];
      break;
    }
    default: {
      const hex = hsl2hex(value);
      if (alpha && alpha !== 1) {
        return `${hex}${convertAlphaToHex(alpha)}`;
      }
      return hex;
    }
  }
  return `${format}(${params.join(separator)}${opacity2 ? ` / ${opacity2}` : ""})`;
}
function opacify(input, alpha, format) {
  invariant(isString(input), MESSAGES.inputString);
  invariant(isNumber2(alpha), MESSAGES.alpha);
  const type = isHex(input) || isNamedColor(input) ? "hex" : extractColorParts(input).model;
  const rgb = parseCSS(input, "rgb");
  return formatCSS(rgb, { format: format ?? type, alpha });
}
function textColor(input, options = {}) {
  const { darkColor = "#000000", lightColor = "#ffffff", threshold = 128 } = options;
  invariant(isString(input), MESSAGES.inputString);
  invariant(threshold >= 0 && threshold <= 255, MESSAGES.threshold);
  const { r, g, b } = hex2rgb(parseCSS(input, "hex"));
  const yiq = (r * 299 + g * 587 + b * 114) / 1e3;
  return yiq >= threshold ? darkColor : lightColor;
}

// node_modules/react-spotify-web-playback/dist/index.mjs
var import_react9 = __toESM(require_react(), 1);
var import_jsx_runtime15 = __toESM(require_jsx_runtime(), 1);
var import_jsx_runtime16 = __toESM(require_jsx_runtime(), 1);
var import_jsx_runtime17 = __toESM(require_jsx_runtime(), 1);
var import_jsx_runtime18 = __toESM(require_jsx_runtime(), 1);
var import_jsx_runtime19 = __toESM(require_jsx_runtime(), 1);
var import_react10 = __toESM(require_react(), 1);
var import_jsx_runtime20 = __toESM(require_jsx_runtime(), 1);
var import_react11 = __toESM(require_react(), 1);
var import_jsx_runtime21 = __toESM(require_jsx_runtime(), 1);
var import_jsx_runtime22 = __toESM(require_jsx_runtime(), 1);
var import_jsx_runtime23 = __toESM(require_jsx_runtime(), 1);
var import_jsx_runtime24 = __toESM(require_jsx_runtime(), 1);
var import_jsx_runtime25 = __toESM(require_jsx_runtime(), 1);
var import_react12 = __toESM(require_react(), 1);
var import_jsx_runtime26 = __toESM(require_jsx_runtime(), 1);
var import_jsx_runtime27 = __toESM(require_jsx_runtime(), 1);
var __defProp2 = Object.defineProperty;
var __export2 = (target, all) => {
  for (var name in all)
    __defProp2(target, name, { get: all[name], enumerable: true });
};
var ERROR_TYPE = {
  ACCOUNT: "account",
  AUTHENTICATION: "authentication",
  INITIALIZATION: "initialization",
  PLAYBACK: "playback",
  PLAYER: "player"
};
var SPOTIFY_CONTENT_TYPE = {
  ALBUM: "album",
  ARTIST: "artist",
  PLAYLIST: "playlist",
  SHOW: "show",
  TRACK: "track"
};
var STATUS = {
  ERROR: "ERROR",
  IDLE: "IDLE",
  INITIALIZING: "INITIALIZING",
  READY: "READY",
  RUNNING: "RUNNING",
  UNSUPPORTED: "UNSUPPORTED"
};
var TRANSPARENT_COLOR = "rgba(0, 0, 0, 0)";
var TYPE = {
  DEVICE: "device_update",
  FAVORITE: "favorite_update",
  PLAYER: "player_update",
  PRELOAD: "preload_update",
  PROGRESS: "progress_update",
  STATUS: "status_update",
  TRACK: "track_update"
};
function isNumber3(value) {
  return typeof value === "number";
}
function loadSpotifyPlayer() {
  return new Promise((resolve, reject) => {
    const scriptTag = document.getElementById("spotify-player");
    if (!scriptTag) {
      const script = document.createElement("script");
      script.id = "spotify-player";
      script.type = "text/javascript";
      script.async = false;
      script.defer = true;
      script.src = "https://sdk.scdn.co/spotify-player.js";
      script.onload = () => resolve();
      script.onerror = (error) => reject(new Error(`loadScript: ${error.message}`));
      document.head.appendChild(script);
    } else {
      resolve();
    }
  });
}
function millisecondsToTime(input) {
  const seconds = Math.floor(input / 1e3 % 60);
  const minutes = Math.floor(input / (1e3 * 60) % 60);
  const hours = Math.floor(input / (1e3 * 60 * 60) % 24);
  const parts = [];
  if (hours > 0) {
    parts.push(
      `${hours}`.padStart(2, "0"),
      `${minutes}`.padStart(2, "0"),
      `${seconds}`.padStart(2, "0")
    );
  } else {
    parts.push(`${minutes}`, `${seconds}`.padStart(2, "0"));
  }
  return parts.join(":");
}
function parseIds(ids) {
  if (!ids) {
    return [];
  }
  return Array.isArray(ids) ? ids : [ids];
}
function parseVolume(value) {
  if (!isNumber3(value)) {
    return 1;
  }
  if (value > 1) {
    return value / 100;
  }
  return value;
}
function round3(number, digits = 2) {
  const factor = 10 ** digits;
  return Math.round(number * factor) / factor;
}
function validateURI(input) {
  if (input && input.indexOf(":") > -1) {
    const [key, type, id] = input.split(":");
    if (key === "spotify" && Object.values(SPOTIFY_CONTENT_TYPE).includes(type) && id.length === 22) {
      return true;
    }
  }
  return false;
}
var spotify_exports = {};
__export2(spotify_exports, {
  checkTracksStatus: () => checkTracksStatus,
  getAlbumTracks: () => getAlbumTracks,
  getArtistTopTracks: () => getArtistTopTracks,
  getDevices: () => getDevices,
  getPlaybackState: () => getPlaybackState,
  getPlaylistTracks: () => getPlaylistTracks,
  getQueue: () => getQueue,
  getShow: () => getShow,
  getShowEpisodes: () => getShowEpisodes,
  getTrack: () => getTrack,
  next: () => next,
  pause: () => pause,
  play: () => play,
  previous: () => previous,
  removeTracks: () => removeTracks,
  repeat: () => repeat,
  saveTracks: () => saveTracks,
  seek: () => seek,
  setDevice: () => setDevice,
  setVolume: () => setVolume,
  shuffle: () => shuffle
});
async function checkTracksStatus(token, tracks) {
  return fetch(`https://api.spotify.com/v1/me/tracks/contains?ids=${parseIds(tracks)}`, {
    headers: {
      Authorization: `Bearer ${token}`,
      "Content-Type": "application/json"
    },
    method: "GET"
  }).then((d) => d.json());
}
async function getAlbumTracks(token, id) {
  return fetch(`https://api.spotify.com/v1/albums/${id}/tracks`, {
    headers: {
      Authorization: `Bearer ${token}`,
      "Content-Type": "application/json"
    },
    method: "GET"
  }).then((d) => d.json());
}
async function getArtistTopTracks(token, id) {
  return fetch(`https://api.spotify.com/v1/artists/${id}/top-tracks`, {
    headers: {
      Authorization: `Bearer ${token}`,
      "Content-Type": "application/json"
    },
    method: "GET"
  }).then((d) => d.json());
}
async function getDevices(token) {
  return fetch(`https://api.spotify.com/v1/me/player/devices`, {
    headers: {
      Authorization: `Bearer ${token}`,
      "Content-Type": "application/json"
    },
    method: "GET"
  }).then((d) => d.json());
}
async function getPlaybackState(token) {
  return fetch(`https://api.spotify.com/v1/me/player`, {
    headers: {
      Authorization: `Bearer ${token}`,
      "Content-Type": "application/json"
    },
    method: "GET"
  }).then((d) => {
    if (d.status === 204) {
      return null;
    }
    return d.json();
  });
}
async function getPlaylistTracks(token, id) {
  return fetch(`https://api.spotify.com/v1/playlists/${id}/tracks`, {
    headers: {
      Authorization: `Bearer ${token}`,
      "Content-Type": "application/json"
    },
    method: "GET"
  }).then((d) => d.json());
}
async function getQueue(token) {
  return fetch(`https://api.spotify.com/v1/me/player/queue`, {
    headers: {
      Authorization: `Bearer ${token}`,
      "Content-Type": "application/json"
    },
    method: "GET"
  }).then((d) => d.json());
}
async function getShow(token, id) {
  return fetch(`https://api.spotify.com/v1/shows/${id}`, {
    headers: {
      Authorization: `Bearer ${token}`,
      "Content-Type": "application/json"
    },
    method: "GET"
  }).then((d) => d.json());
}
async function getShowEpisodes(token, id, offset = 0) {
  return fetch(`https://api.spotify.com/v1/shows/${id}/episodes?offset=${offset}`, {
    headers: {
      Authorization: `Bearer ${token}`,
      "Content-Type": "application/json"
    },
    method: "GET"
  }).then((d) => d.json());
}
async function getTrack(token, id) {
  return fetch(`https://api.spotify.com/v1/tracks/${id}`, {
    headers: {
      Authorization: `Bearer ${token}`,
      "Content-Type": "application/json"
    },
    method: "GET"
  }).then((d) => d.json());
}
async function next(token, deviceId) {
  let query = "";
  if (deviceId) {
    query += `?device_id=${deviceId}`;
  }
  await fetch(`https://api.spotify.com/v1/me/player/next${query}`, {
    headers: {
      Authorization: `Bearer ${token}`,
      "Content-Type": "application/json"
    },
    method: "POST"
  });
}
async function pause(token, deviceId) {
  let query = "";
  if (deviceId) {
    query += `?device_id=${deviceId}`;
  }
  await fetch(`https://api.spotify.com/v1/me/player/pause${query}`, {
    headers: {
      Authorization: `Bearer ${token}`,
      "Content-Type": "application/json"
    },
    method: "PUT"
  });
}
async function play(token, { context_uri, deviceId, offset = 0, uris }) {
  let body;
  if (context_uri) {
    const isArtist = context_uri.indexOf("artist") >= 0;
    let position;
    if (!isArtist) {
      position = { position: offset };
    }
    body = JSON.stringify({ context_uri, offset: position });
  } else if (Array.isArray(uris) && uris.length) {
    body = JSON.stringify({ uris, offset: { position: offset } });
  }
  await fetch(`https://api.spotify.com/v1/me/player/play?device_id=${deviceId}`, {
    body,
    headers: {
      Authorization: `Bearer ${token}`,
      "Content-Type": "application/json"
    },
    method: "PUT"
  });
}
async function previous(token, deviceId) {
  let query = "";
  if (deviceId) {
    query += `?device_id=${deviceId}`;
  }
  await fetch(`https://api.spotify.com/v1/me/player/previous${query}`, {
    headers: {
      Authorization: `Bearer ${token}`,
      "Content-Type": "application/json"
    },
    method: "POST"
  });
}
async function removeTracks(token, tracks) {
  await fetch(`https://api.spotify.com/v1/me/tracks`, {
    body: JSON.stringify({ ids: parseIds(tracks) }),
    headers: {
      Authorization: `Bearer ${token}`,
      "Content-Type": "application/json"
    },
    method: "DELETE"
  });
}
async function repeat(token, state, deviceId) {
  let query = `?state=${state}`;
  if (deviceId) {
    query += `&device_id=${deviceId}`;
  }
  await fetch(`https://api.spotify.com/v1/me/player/repeat${query}`, {
    headers: {
      Authorization: `Bearer ${token}`,
      "Content-Type": "application/json"
    },
    method: "PUT"
  });
}
async function saveTracks(token, tracks) {
  await fetch(`https://api.spotify.com/v1/me/tracks`, {
    body: JSON.stringify({ ids: parseIds(tracks) }),
    headers: {
      Authorization: `Bearer ${token}`,
      "Content-Type": "application/json"
    },
    method: "PUT"
  });
}
async function seek(token, position, deviceId) {
  let query = `?position_ms=${position}`;
  if (deviceId) {
    query += `&device_id=${deviceId}`;
  }
  await fetch(`https://api.spotify.com/v1/me/player/seek${query}`, {
    headers: {
      Authorization: `Bearer ${token}`,
      "Content-Type": "application/json"
    },
    method: "PUT"
  });
}
async function setDevice(token, deviceId, shouldPlay) {
  await fetch(`https://api.spotify.com/v1/me/player`, {
    body: JSON.stringify({ device_ids: [deviceId], play: shouldPlay }),
    headers: {
      Authorization: `Bearer ${token}`,
      "Content-Type": "application/json"
    },
    method: "PUT"
  });
}
async function setVolume(token, volume, deviceId) {
  let query = `?volume_percent=${volume}`;
  if (deviceId) {
    query += `&device_id=${deviceId}`;
  }
  await fetch(`https://api.spotify.com/v1/me/player/volume${query}`, {
    headers: {
      Authorization: `Bearer ${token}`,
      "Content-Type": "application/json"
    },
    method: "PUT"
  });
}
async function shuffle(token, state, deviceId) {
  let query = `?state=${state}`;
  if (deviceId) {
    query += `&device_id=${deviceId}`;
  }
  await fetch(`https://api.spotify.com/v1/me/player/shuffle${query}`, {
    headers: {
      Authorization: `Bearer ${token}`,
      "Content-Type": "application/json"
    },
    method: "PUT"
  });
}
function getItemImage(item) {
  var _a2;
  const maxWidth = Math.max(...item.images.map((d) => d.width ?? 0));
  return ((_a2 = item.images.find((d) => d.width === maxWidth)) == null ? void 0 : _a2.url) ?? "";
}
function getBgColor(bgColor, fallbackColor) {
  if (fallbackColor) {
    return bgColor === TRANSPARENT_COLOR ? fallbackColor : bgColor;
  }
  return bgColor === "transparent" ? TRANSPARENT_COLOR : bgColor;
}
function getLocale(locale) {
  return {
    currentDevice: "Current device",
    devices: "Devices",
    next: "Next",
    otherDevices: "Select other device",
    pause: "Pause",
    play: "Play",
    previous: "Previous",
    removeTrack: "Remove from your favorites",
    saveTrack: "Save to your favorites",
    title: "{name} on SPOTIFY",
    volume: "Volume",
    ...locale
  };
}
function getMergedStyles(styles) {
  const mergedStyles = {
    activeColor: "#1cb954",
    bgColor: "#fff",
    color: "#333",
    errorColor: "#ff0026",
    height: 80,
    loaderColor: "#ccc",
    loaderSize: 32,
    sliderColor: "#666",
    sliderHandleBorderRadius: "50%",
    sliderHandleColor: "#000",
    sliderHeight: 4,
    sliderTrackBorderRadius: 4,
    sliderTrackColor: "#ccc",
    trackArtistColor: "#666",
    trackNameColor: "#333",
    ...styles
  };
  mergedStyles.bgColor = getBgColor(mergedStyles.bgColor);
  return mergedStyles;
}
async function getPreloadData(token, uris, offset) {
  var _a2, _b;
  const parsedURIs = parseIds(uris);
  const uri = parsedURIs[offset];
  if (!validateURI(uri)) {
    if (true) {
      console.error("PreloadData: Invalid URI", parsedURIs[offset]);
    }
    return null;
  }
  const [, type, id] = uri.split(":");
  try {
    switch (type) {
      case SPOTIFY_CONTENT_TYPE.ALBUM: {
        const { items } = await getAlbumTracks(token, id);
        const track = await getTrack(token, items[offset].id);
        return getTrackInfo(track);
      }
      case SPOTIFY_CONTENT_TYPE.ARTIST: {
        const { tracks } = await getArtistTopTracks(token, id);
        return getTrackInfo(tracks[offset]);
      }
      case SPOTIFY_CONTENT_TYPE.PLAYLIST: {
        const { items } = await getPlaylistTracks(token, id);
        if ((_a2 = items[offset]) == null ? void 0 : _a2.track) {
          return getTrackInfo((_b = items[offset]) == null ? void 0 : _b.track);
        }
        return null;
      }
      case SPOTIFY_CONTENT_TYPE.SHOW: {
        const show = await getShow(token, id);
        const { items } = await getShowEpisodes(
          token,
          id,
          show.total_episodes ? show.total_episodes - 1 : 0
        );
        const episode = (items == null ? void 0 : items[0]) ?? {
          duration_ms: 0,
          id: show.id,
          images: show.images,
          name: show.name,
          uri: show.uri
        };
        return {
          artists: [{ name: show.name, uri: show.uri }],
          durationMs: episode.duration_ms,
          id: episode.id,
          image: getItemImage(episode),
          name: episode.name,
          uri: episode.uri
        };
      }
      default: {
        const track = await getTrack(token, id);
        return getTrackInfo(track);
      }
    }
  } catch (error) {
    console.error("PreloadData:", error);
    return null;
  }
}
function getRepeatState(mode) {
  switch (mode) {
    case 1:
      return "context";
    case 2:
      return "track";
    case 0:
    default:
      return "off";
  }
}
function getSpotifyLink(uri) {
  const [, type = "", id = ""] = uri.split(":");
  return `https://open.spotify.com/${type}/${id}`;
}
function getSpotifyLinkTitle(name, locale) {
  return locale.replace("{name}", name);
}
function getSpotifyURIType(uri) {
  const [, type = ""] = uri.split(":");
  return type;
}
function getTrackInfo(track) {
  const { album, artists, duration_ms, id, name, uri } = track;
  return {
    artists,
    durationMs: duration_ms,
    id: id ?? "",
    image: getItemImage(album),
    name,
    uri
  };
}
var nano = (0, import_nano_css.create)({ h: import_react2.createElement });
(0, import_rule.addon)(nano);
(0, import_keyframes.addon)(nano);
(0, import_jsx.addon)(nano);
(0, import_style.addon)(nano);
(0, import_styled.addon)(nano);
(0, import_nesting.addon)(nano);
var { keyframes, put, styled } = nano;
var px = (value) => typeof value === "number" ? `${value}px` : value;
var Wrapper = styled("div")(
  {
    alignItems: "center",
    display: "flex",
    justifyContent: "flex-end",
    "pointer-events": "none"
  },
  ({ style }) => {
    let styles = {
      bottom: 0,
      position: "absolute",
      right: 0,
      width: "auto"
    };
    if (style.layout === "responsive") {
      styles = {
        "@media (max-width: 767px)": styles,
        "@media (min-width: 768px)": {
          height: px(style.h)
        }
      };
    }
    return {
      height: px(32),
      ...styles
    };
  },
  "ActionsRSWP"
);
function Actions(props) {
  const { children, layout, styles } = props;
  return (0, import_jsx_runtime.jsx)(Wrapper, { "data-component-name": "Actions", style: { h: styles.height, layout }, children });
}
var Actions_default = (0, import_react3.memo)(Actions);
function Next(props) {
  return (0, import_jsx_runtime2.jsx)("svg", { height: "1em", preserveAspectRatio: "xMidYMid", viewBox: "0 0 64 64", width: "1em", ...props, children: (0, import_jsx_runtime2.jsx)(
    "path",
    {
      d: "M53.486 0a3.2 3.2 0 0 0-3.2 3.2v23.543L4.8.489A3.2 3.2 0 0 0 0 3.255V60.74a3.2 3.2 0 0 0 4.8 2.774l45.486-26.262V60.8a3.2 3.2 0 0 0 3.2 3.2H60.8a3.2 3.2 0 0 0 3.2-3.2V3.2A3.2 3.2 0 0 0 60.8 0h-7.314Z",
      fill: "currentColor"
    }
  ) });
}
function Pause(props) {
  return (0, import_jsx_runtime3.jsx)("svg", { height: "1em", preserveAspectRatio: "xMidYMid", viewBox: "0 0 64 64", width: "1em", ...props, children: (0, import_jsx_runtime3.jsx)(
    "path",
    {
      d: "M32 0c17.673 0 32 14.327 32 32 0 17.673-14.327 32-32 32C14.327 64 0 49.673 0 32 0 14.327 14.327 0 32 0Zm-5.4 18h-5.2a1.4 1.4 0 0 0-1.4 1.4v25.2a1.4 1.4 0 0 0 1.4 1.4h5.2a1.4 1.4 0 0 0 1.4-1.4V19.4a1.4 1.4 0 0 0-1.4-1.4Zm16 0h-5.2a1.4 1.4 0 0 0-1.4 1.4v25.2a1.4 1.4 0 0 0 1.4 1.4h5.2a1.4 1.4 0 0 0 1.4-1.4V19.4a1.4 1.4 0 0 0-1.4-1.4Z",
      fill: "currentColor"
    }
  ) });
}
function Play(props) {
  return (0, import_jsx_runtime4.jsx)("svg", { height: "1em", preserveAspectRatio: "xMidYMid", viewBox: "0 0 64 64", width: "1em", ...props, children: (0, import_jsx_runtime4.jsx)(
    "path",
    {
      d: "M32 0c17.673 0 32 14.327 32 32 0 17.673-14.327 32-32 32C14.327 64 0 49.673 0 32 0 14.327 14.327 0 32 0Zm-7.61 18.188c-.435.251-.702.715-.701 1.216v25.194a1.402 1.402 0 0 0 2.104 1.214L47.61 33.214a1.402 1.402 0 0 0 0-2.428L25.793 18.188c-.435-.25-.97-.25-1.404 0Z",
      fill: "currentColor"
    }
  ) });
}
function Previous(props) {
  return (0, import_jsx_runtime5.jsx)("svg", { height: "1em", preserveAspectRatio: "xMidYMid", viewBox: "0 0 64 64", width: "1em", ...props, children: (0, import_jsx_runtime5.jsx)(
    "path",
    {
      d: "M10.514 0a3.2 3.2 0 0 1 3.2 3.2v23.543L59.2.489A3.2 3.2 0 0 1 64 3.255V60.74a3.2 3.2 0 0 1-4.8 2.774L13.714 37.253V60.8a3.2 3.2 0 0 1-3.2 3.2H3.2A3.2 3.2 0 0 1 0 60.8V3.2A3.2 3.2 0 0 1 3.2 0h7.314Z",
      fill: "currentColor"
    }
  ) });
}
var Wrapper2 = styled("div")(
  {
    alignItems: "center",
    display: "flex",
    fontSize: px(12),
    transition: "height 0.3s",
    zIndex: 10
  },
  ({ style }) => ({
    '[class^="rswp_"]': {
      color: style.c,
      lineHeight: 1,
      minWidth: px(32)
    },
    ".rswp_progress": {
      marginRight: px(style.sliderHeight + 6),
      textAlign: "right"
    },
    ".rswp_duration": {
      marginLeft: px(style.sliderHeight + 6),
      textAlign: "left"
    }
  }),
  "SliderRSWP"
);
function Slider(props) {
  const { durationMs, isMagnified, onChangeRange, onToggleMagnify, position, progressMs, styles } = props;
  const handleChangeRange = async ({ x }) => {
    onChangeRange(x);
  };
  const handleSize = styles.sliderHeight + 6;
  return (0, import_jsx_runtime6.jsxs)(
    Wrapper2,
    {
      "data-component-name": "Slider",
      "data-position": position,
      onMouseEnter: onToggleMagnify,
      onMouseLeave: onToggleMagnify,
      style: {
        c: styles.color,
        sliderHeight: styles.sliderHeight
      },
      children: [
        (0, import_jsx_runtime6.jsx)("div", { className: "rswp_progress", children: millisecondsToTime(progressMs) }),
        (0, import_jsx_runtime6.jsx)(
          esm_default,
          {
            axis: "x",
            className: "slider",
            "data-component-name": "progress-bar",
            onChange: handleChangeRange,
            styles: {
              options: {
                thumbBorder: 0,
                thumbBorderRadius: styles.sliderHandleBorderRadius,
                thumbColor: styles.sliderHandleColor,
                thumbSize: isMagnified ? handleSize + 4 : handleSize,
                height: isMagnified ? styles.sliderHeight + 4 : styles.sliderHeight,
                padding: 0,
                rangeColor: styles.sliderColor,
                trackBorderRadius: styles.sliderTrackBorderRadius,
                trackColor: styles.sliderTrackColor
              }
            },
            x: position,
            xMax: 100,
            xMin: 0,
            xStep: 0.1
          }
        ),
        (0, import_jsx_runtime6.jsx)("div", { className: "rswp_duration", children: millisecondsToTime(durationMs) })
      ]
    }
  );
}
var Slider_default = (0, import_react5.memo)(Slider);
var Wrapper3 = styled("div")(
  {
    ".rswp__volume": {
      position: "absolute",
      right: 0,
      top: 0
    },
    ".rswp__devices": {
      position: "absolute",
      left: 0,
      top: 0
    }
  },
  ({ style }) => {
    const isCompactLayout = style.layout === "compact";
    const styles = {};
    if (isCompactLayout) {
      styles.padding = px(8);
    } else {
      styles.padding = `${px(4)} 0`;
      styles["@media (max-width: 767px)"] = {
        padding: px(8)
      };
    }
    return styles;
  },
  "ControlsRSWP"
);
var Buttons = styled("div")(
  {
    alignItems: "center",
    display: "flex",
    justifyContent: "center",
    marginBottom: px(8),
    position: "relative",
    "> div": {
      alignItems: "center",
      display: "flex",
      minWidth: px(32),
      textAlign: "center"
    }
  },
  ({ style }) => ({
    color: style.c
  }),
  "ControlsButtonsRSWP"
);
var Button = styled("button")(
  {
    alignItems: "center",
    display: "inline-flex",
    fontSize: px(16),
    height: px(32),
    justifyContent: "center",
    width: px(32),
    "&:disabled": {
      cursor: "default",
      opacity: 0.6
    },
    "&.rswp__toggle": {
      fontSize: px(32),
      width: px(48)
    }
  },
  () => ({}),
  "ControlsButtonRSWP"
);
function Controls(props) {
  const {
    components: { leftButton, rightButton } = {},
    devices,
    durationMs,
    isActive,
    isExternalDevice,
    isMagnified,
    isPlaying,
    layout,
    locale,
    nextTracks,
    onChangeRange,
    onClickNext,
    onClickPrevious,
    onClickTogglePlay,
    onToggleMagnify,
    position,
    progressMs,
    styles,
    volume
  } = props;
  const { color } = styles;
  return (0, import_jsx_runtime7.jsxs)(Wrapper3, { "data-component-name": "Controls", "data-playing": isPlaying, style: { layout }, children: [
    (0, import_jsx_runtime7.jsxs)(Buttons, { style: { c: color }, children: [
      devices && (0, import_jsx_runtime7.jsx)("div", { className: "rswp__devices", children: devices }),
      (0, import_jsx_runtime7.jsx)("div", { children: leftButton }),
      (0, import_jsx_runtime7.jsx)("div", { children: (0, import_jsx_runtime7.jsx)(
        Button,
        {
          "aria-label": locale.previous,
          className: "ButtonRSWP",
          disabled: !isActive && !isExternalDevice,
          onClick: onClickPrevious,
          title: locale.previous,
          type: "button",
          children: (0, import_jsx_runtime7.jsx)(Previous, {})
        }
      ) }),
      (0, import_jsx_runtime7.jsx)("div", { children: (0, import_jsx_runtime7.jsx)(
        Button,
        {
          "aria-label": isPlaying ? locale.pause : locale.play,
          className: "ButtonRSWP rswp__toggle",
          onClick: onClickTogglePlay,
          title: isPlaying ? locale.pause : locale.play,
          type: "button",
          children: isPlaying ? (0, import_jsx_runtime7.jsx)(Pause, {}) : (0, import_jsx_runtime7.jsx)(Play, {})
        }
      ) }),
      (0, import_jsx_runtime7.jsx)("div", { children: (0, import_jsx_runtime7.jsx)(
        Button,
        {
          "aria-label": locale.next,
          className: "ButtonRSWP",
          disabled: !nextTracks.length && !isActive && !isExternalDevice,
          onClick: onClickNext,
          title: locale.next,
          type: "button",
          children: (0, import_jsx_runtime7.jsx)(Next, {})
        }
      ) }),
      (0, import_jsx_runtime7.jsx)("div", { children: rightButton }),
      volume && (0, import_jsx_runtime7.jsx)("div", { className: "rswp__volume", children: volume })
    ] }),
    (0, import_jsx_runtime7.jsx)(
      Slider_default,
      {
        durationMs,
        isMagnified,
        onChangeRange,
        onToggleMagnify,
        position,
        progressMs,
        styles
      }
    )
  ] });
}
var Controls_default = (0, import_react4.memo)(Controls);
function ClickOutside(props) {
  const { children, isActive, onClick, ...rest } = props;
  const containerRef = (0, import_react7.useRef)(null);
  const isTouch = (0, import_react7.useRef)(false);
  const handleClick = (0, import_react7.useRef)((event) => {
    const container = containerRef.current;
    if (event.type === "touchend") {
      isTouch.current = true;
    }
    if (event.type === "click" && isTouch.current) {
      return;
    }
    if (container && !container.contains(event.target)) {
      onClick();
    }
  });
  (0, import_react7.useEffect)(() => {
    const { current } = handleClick;
    if (isActive) {
      document.addEventListener("touchend", current, true);
      document.addEventListener("click", current, true);
    }
    return () => {
      document.removeEventListener("touchend", current, true);
      document.removeEventListener("click", current, true);
    };
  }, [isActive]);
  return (0, import_jsx_runtime8.jsx)("div", { ref: containerRef, ...rest, children });
}
var ClickOutside_default = (0, import_react7.memo)(ClickOutside);
function DevicesIcon(props) {
  return (0, import_jsx_runtime9.jsx)("svg", { height: "1em", preserveAspectRatio: "xMidYMid", viewBox: "0 0 64 64", width: "1em", ...props, children: (0, import_jsx_runtime9.jsx)(
    "path",
    {
      d: "M57 4c3.864 0 7 3.136 7 7v42a7 7 0 0 1-7 7H31a7 7 0 0 1-7-7V11c0-3.864 3.136-7 7-7h26ZM16 54v6H8v-6h8Zm41-44H31a1 1 0 0 0-1 1v42a1 1 0 0 0 1 1h26a1 1 0 0 0 1-1V11a1 1 0 0 0-1-1ZM44 32a8 8 0 1 1 0 16 8 8 0 0 1 0-16ZM16 4v6H7a1 1 0 0 0-1 1v26a1 1 0 0 0 1 1h9v6H7a7 7 0 0 1-7-7V11c0-3.864 3.136-7 7-7h9Zm28 12a4 4 0 1 1 0 8 4 4 0 0 1 0-8Z",
      fill: "currentColor"
    }
  ) });
}
function DevicesComputerIcon(props) {
  return (0, import_jsx_runtime10.jsx)("svg", { height: "1em", preserveAspectRatio: "xMidYMid", viewBox: "0 0 64 64", width: "1em", ...props, children: (0, import_jsx_runtime10.jsx)(
    "path",
    {
      d: "M7.226 10.323a7.228 7.228 0 0 1 7.226-7.226h35.096a7.228 7.228 0 0 1 7.226 7.226V37.16a7.226 7.226 0 0 1-7.226 7.226H14.452a7.226 7.226 0 0 1-7.226-7.226V10.323Zm7.226-1.033c-.57 0-1.033.462-1.033 1.033V37.16c0 .57.463 1.033 1.033 1.033h35.096c.57 0 1.033-.463 1.033-1.033V10.323c0-.57-.463-1.033-1.033-1.033H14.452ZM0 57.806a3.097 3.097 0 0 1 3.097-3.096h57.806a3.097 3.097 0 0 1 0 6.193H3.097A3.097 3.097 0 0 1 0 57.806Z",
      fill: "currentColor"
    }
  ) });
}
function DevicesMobileIcon(props) {
  return (0, import_jsx_runtime11.jsx)("svg", { height: "1em", preserveAspectRatio: "xMidYMid", viewBox: "0 0 64 64", width: "1em", ...props, children: (0, import_jsx_runtime11.jsx)(
    "path",
    {
      d: "M44.8 0a9.6 9.6 0 0 1 9.6 9.6v44.8a9.6 9.6 0 0 1-9.6 9.6H19.2a9.6 9.6 0 0 1-9.6-9.6V9.6A9.6 9.6 0 0 1 19.2 0h25.6Zm0 6.4H19.2A3.2 3.2 0 0 0 16 9.6v44.8a3.2 3.2 0 0 0 3.2 3.2h25.6a3.2 3.2 0 0 0 3.2-3.2V9.6a3.2 3.2 0 0 0-3.2-3.2ZM32 43.2a4 4 0 1 1 0 8 4 4 0 0 1 0-8Z",
      fill: "currentColor"
    }
  ) });
}
function DevicesSpeakerIcon(props) {
  return (0, import_jsx_runtime12.jsx)("svg", { height: "1em", preserveAspectRatio: "xMidYMid", viewBox: "0 0 64 64", width: "1em", ...props, children: (0, import_jsx_runtime12.jsx)(
    "path",
    {
      d: "M45 4c3.864 0 7 3.136 7 7v42a7 7 0 0 1-7 7H19a7 7 0 0 1-7-7V11c0-3.864 3.136-7 7-7h26Zm0 6H19a1 1 0 0 0-1 1v42a1 1 0 0 0 1 1h26a1 1 0 0 0 1-1V11a1 1 0 0 0-1-1ZM32 32a8 8 0 1 1 0 16 8 8 0 0 1 0-16Zm0-16a4 4 0 1 1 0 8 4 4 0 0 1 0-8Z",
      fill: "currentColor"
    }
  ) });
}
var Wrapper4 = styled("div")(
  {
    "pointer-events": "all",
    alignItems: "center",
    display: "flex",
    justifyContent: "center",
    position: "relative",
    zIndex: 20,
    "> div": {
      backgroundColor: "#000",
      borderRadius: px(8),
      color: "#fff",
      filter: "drop-shadow(1px 1px 6px rgba(0, 0, 0, 0.5))",
      fontSize: px(14),
      padding: px(16),
      position: "absolute",
      textAlign: "left",
      "> p": {
        fontWeight: "bold",
        marginBottom: px(8),
        marginTop: px(16),
        whiteSpace: "nowrap"
      },
      button: {
        alignItems: "center",
        display: "flex",
        whiteSpace: "nowrap",
        width: "100%",
        "&:not(:last-of-type)": {
          marginBottom: px(12)
        },
        span: {
          display: "inline-block",
          marginLeft: px(4)
        }
      },
      "> span": {
        background: "transparent",
        borderLeft: `6px solid transparent`,
        borderRight: `6px solid transparent`,
        content: '""',
        display: "block",
        height: 0,
        position: "absolute",
        width: 0
      }
    },
    "> button": {
      alignItems: "center",
      display: "flex",
      fontSize: px(24),
      height: px(32),
      justifyContent: "center",
      width: px(32)
    }
  },
  ({ style }) => {
    const isCompact = style.layout === "compact";
    const divStyles = isCompact ? {
      bottom: "120%",
      left: 0
    } : {
      [style.p]: "120%",
      left: 0,
      "@media (min-width: 768px)": {
        left: "auto",
        right: 0
      }
    };
    const spanStyles = isCompact ? {
      bottom: `-${px(6)}`,
      borderTop: `6px solid #000`,
      left: px(10)
    } : {
      [style.p === "top" ? "border-bottom" : "border-top"]: `6px solid #000`,
      [style.p]: "-6px",
      left: px(10),
      "@media (min-width: 768px)": {
        left: "auto",
        right: px(10)
      }
    };
    return {
      "> button": {
        color: style.c
      },
      "> div": {
        ...divStyles,
        "> span": spanStyles
      }
    };
  },
  "DevicesRSWP"
);
var ListHeader = styled("div")({
  p: {
    whiteSpace: "nowrap",
    "&:nth-of-type(1)": {
      fontWeight: "bold",
      marginBottom: px(8)
    },
    "&:nth-of-type(2)": {
      alignItems: "center",
      display: "flex",
      span: {
        display: "inline-block",
        marginLeft: px(4)
      }
    }
  }
});
function getDeviceIcon(type) {
  if (type.toLowerCase().includes("speaker")) {
    return (0, import_jsx_runtime13.jsx)(DevicesSpeakerIcon, {});
  }
  if (type.toLowerCase().includes("computer")) {
    return (0, import_jsx_runtime13.jsx)(DevicesComputerIcon, {});
  }
  return (0, import_jsx_runtime13.jsx)(DevicesMobileIcon, {});
}
function Devices(props) {
  const {
    currentDeviceId,
    deviceId,
    devices = [],
    layout,
    locale,
    onClickDevice,
    open,
    playerPosition,
    styles: { color }
  } = props;
  const [isOpen, setOpen] = (0, import_react6.useState)(open);
  const handleClickSetDevice = (event) => {
    const { dataset } = event.currentTarget;
    if (dataset.id) {
      onClickDevice(dataset.id);
      setOpen(false);
    }
  };
  const handleClickToggleList = (0, import_react6.useCallback)(() => {
    setOpen((s) => !s);
  }, []);
  const { currentDevice, otherDevices } = devices.reduce(
    (acc, device) => {
      if (device.id === currentDeviceId) {
        acc.currentDevice = device;
      } else {
        acc.otherDevices.push(device);
      }
      return acc;
    },
    { currentDevice: null, otherDevices: [] }
  );
  let icon = (0, import_jsx_runtime13.jsx)(DevicesIcon, {});
  if (deviceId && currentDevice && currentDevice.id !== deviceId) {
    icon = getDeviceIcon(currentDevice.type);
  }
  return (0, import_jsx_runtime13.jsx)(ClickOutside_default, { isActive: isOpen, onClick: handleClickToggleList, children: (0, import_jsx_runtime13.jsx)(
    Wrapper4,
    {
      "data-component-name": "Devices",
      "data-device-id": currentDeviceId,
      style: {
        c: color,
        layout,
        p: playerPosition
      },
      children: !!devices.length && (0, import_jsx_runtime13.jsxs)(import_jsx_runtime13.Fragment, { children: [
        isOpen && (0, import_jsx_runtime13.jsxs)("div", { children: [
          currentDevice && (0, import_jsx_runtime13.jsxs)(ListHeader, { children: [
            (0, import_jsx_runtime13.jsx)("p", { children: locale.currentDevice }),
            (0, import_jsx_runtime13.jsxs)("p", { children: [
              getDeviceIcon(currentDevice.type),
              (0, import_jsx_runtime13.jsx)("span", { children: currentDevice.name })
            ] })
          ] }),
          !!otherDevices.length && (0, import_jsx_runtime13.jsxs)(import_jsx_runtime13.Fragment, { children: [
            (0, import_jsx_runtime13.jsx)("p", { children: locale.otherDevices }),
            otherDevices.map((device) => (0, import_jsx_runtime13.jsxs)(
              "button",
              {
                "aria-label": device.name,
                className: "ButtonRSWP",
                "data-id": device.id,
                onClick: handleClickSetDevice,
                type: "button",
                children: [
                  getDeviceIcon(device.type),
                  (0, import_jsx_runtime13.jsx)("span", { children: device.name })
                ]
              },
              device.id
            ))
          ] }),
          (0, import_jsx_runtime13.jsx)("span", {})
        ] }),
        (0, import_jsx_runtime13.jsx)(
          "button",
          {
            "aria-label": locale.devices,
            className: "ButtonRSWP",
            onClick: handleClickToggleList,
            title: locale.devices,
            type: "button",
            children: icon
          }
        )
      ] })
    }
  ) });
}
var Wrapper5 = styled("div")(
  {
    alignItems: "center",
    display: "flex",
    justifyContent: "center",
    textAlign: "center",
    width: "100%"
  },
  ({ style }) => ({
    backgroundColor: style.bgColor,
    borderTop: `1px solid ${style.errorColor}`,
    color: style.errorColor,
    height: px(style.h)
  }),
  "ErrorRSWP"
);
function ErrorMessage({
  children,
  styles: { bgColor, errorColor, height }
}) {
  return (0, import_jsx_runtime14.jsx)(Wrapper5, { "data-component-name": "ErrorMessage", style: { bgColor, errorColor, h: height }, children });
}
function useMediaQuery(input) {
  const getMatches = (query) => {
    return window.matchMedia(query).matches;
  };
  const [matches, setMatches] = (0, import_react9.useState)(getMatches(input));
  function handleChange() {
    setMatches(getMatches(input));
  }
  (0, import_react9.useEffect)(() => {
    const matchMedia = window.matchMedia(input);
    handleChange();
    try {
      matchMedia.addEventListener("change", handleChange);
    } catch {
      matchMedia.addListener(handleChange);
    }
    return () => {
      try {
        matchMedia.removeEventListener("change", handleChange);
      } catch {
        matchMedia.removeListener(handleChange);
      }
    };
  }, [input]);
  return matches;
}
function usePrevious(value) {
  const ref = (0, import_react9.useRef)();
  (0, import_react9.useEffect)(() => {
    ref.current = value;
  }, [value]);
  return ref.current;
}
function Favorite(props) {
  return (0, import_jsx_runtime15.jsx)("svg", { height: "1em", preserveAspectRatio: "xMidYMid", viewBox: "0 0 64 64", width: "1em", ...props, children: (0, import_jsx_runtime15.jsx)(
    "path",
    {
      d: "M63.673 16.52A17.676 17.676 0 0 0 49.197 2.563c-5.4-.861-10.891.852-14.844 4.63a3.43 3.43 0 0 1-4.672 0C22.956.689 12.305.62 5.498 7.039c-6.808 6.419-7.366 17.055-1.268 24.15l24.246 28.894a4.623 4.623 0 0 0 7.078 0L59.8 31.19a17.328 17.328 0 0 0 3.873-14.66v-.008Z",
      fill: "currentColor"
    }
  ) });
}
function FavoriteOutline(props) {
  return (0, import_jsx_runtime16.jsx)("svg", { height: "1em", preserveAspectRatio: "xMidYMid", viewBox: "0 0 64 64", width: "1em", ...props, children: (0, import_jsx_runtime16.jsx)(
    "path",
    {
      d: "M5.944 7.206C13.271.3 24.723.34 31.999 7.3A18.924 18.924 0 0 1 48.02 2.32h.008a19.068 19.068 0 0 1 15.617 15.071v.013A18.759 18.759 0 0 1 59.47 33.26L37.573 59.353a7.288 7.288 0 0 1-8.642 1.916 7.276 7.276 0 0 1-2.498-1.912l-21.901-26.1c-6.55-7.671-5.93-19.131 1.408-26.051h.004Zm13.04 1.04a12.726 12.726 0 0 0-9.737 20.997l.021.02 21.905 26.105c.316.372.84.488 1.284.285.143-.066.27-.164.372-.285l21.934-26.137a12.565 12.565 0 0 0 2.808-10.625 12.875 12.875 0 0 0-10.534-10.17 12.714 12.714 0 0 0-10.785 3.37l-.029.029a6.198 6.198 0 0 1-8.444 0l-.037-.033a12.727 12.727 0 0 0-8.758-3.556Z",
      fill: "currentColor"
    }
  ) });
}
function SpotifyLogo({ bgColor, ...rest }) {
  return (0, import_jsx_runtime17.jsx)("svg", { height: "1em", preserveAspectRatio: "xMidYMid", viewBox: "0 0 512 160", width: "3.2em", ...rest, children: (0, import_jsx_runtime17.jsx)(
    "path",
    {
      d: "M79.655 0C35.664 0 0 35.663 0 79.654c0 43.993 35.664 79.653 79.655 79.653 43.996 0 79.656-35.66 79.656-79.653 0-43.988-35.66-79.65-79.657-79.65L79.655 0Zm36.53 114.884a4.963 4.963 0 0 1-6.83 1.646c-18.702-11.424-42.246-14.011-69.973-7.676a4.967 4.967 0 0 1-5.944-3.738 4.958 4.958 0 0 1 3.734-5.945c30.343-6.933 56.37-3.948 77.367 8.884a4.965 4.965 0 0 1 1.645 6.83Zm9.75-21.689c-1.799 2.922-5.622 3.845-8.543 2.047-21.41-13.16-54.049-16.972-79.374-9.284a6.219 6.219 0 0 1-7.75-4.138 6.22 6.22 0 0 1 4.141-7.745c28.929-8.778 64.892-4.526 89.48 10.583 2.92 1.798 3.843 5.622 2.045 8.538Zm.836-22.585C101.1 55.362 58.742 53.96 34.231 61.4c-3.936 1.194-8.098-1.028-9.29-4.964a7.453 7.453 0 0 1 4.965-9.294c28.137-8.542 74.912-6.892 104.469 10.655a7.441 7.441 0 0 1 2.606 10.209c-2.092 3.54-6.677 4.707-10.206 2.605h-.004Zm89.944 2.922c-13.754-3.28-16.198-5.581-16.198-10.418 0-4.57 4.299-7.645 10.7-7.645 6.202 0 12.347 2.336 18.796 7.143.19.145.437.203.675.165a.888.888 0 0 0 .6-.367l6.715-9.466a.903.903 0 0 0-.171-1.225c-7.676-6.157-16.313-9.15-26.415-9.15-14.848 0-25.225 8.911-25.225 21.662 0 13.673 8.95 18.515 24.417 22.252 13.155 3.031 15.38 5.57 15.38 10.11 0 5.032-4.49 8.161-11.718 8.161-8.028 0-14.582-2.71-21.906-9.046a.932.932 0 0 0-.656-.218.89.89 0 0 0-.619.313l-7.533 8.96a.906.906 0 0 0 .086 1.256c8.522 7.61 19.004 11.624 30.323 11.624 16 0 26.339-8.742 26.339-22.277.028-11.421-6.81-17.746-23.561-21.821l-.029-.013Zm59.792-13.564c-6.934 0-12.622 2.732-17.321 8.33v-6.3c0-.498-.4-.903-.894-.903h-12.318a.899.899 0 0 0-.894.902v70.009c0 .494.4.903.894.903h12.318a.901.901 0 0 0 .894-.903v-22.097c4.699 5.26 10.387 7.838 17.32 7.838 12.89 0 25.94-9.92 25.94-28.886.019-18.97-13.032-28.894-25.93-28.894l-.01.001Zm11.614 28.893c0 9.653-5.945 16.397-14.468 16.397-8.418 0-14.772-7.048-14.772-16.397 0-9.35 6.354-16.397 14.772-16.397 8.38 0 14.468 6.893 14.468 16.396Zm47.759-28.893c-16.598 0-29.601 12.78-29.601 29.1 0 16.143 12.917 28.784 29.401 28.784 16.655 0 29.696-12.736 29.696-28.991 0-16.2-12.955-28.89-29.496-28.89v-.003Zm0 45.385c-8.827 0-15.485-7.096-15.485-16.497 0-9.444 6.43-16.298 15.285-16.298 8.884 0 15.58 7.093 15.58 16.504 0 9.443-6.468 16.291-15.38 16.291Zm64.937-44.258h-13.554V47.24c0-.497-.4-.902-.894-.902H374.05a.906.906 0 0 0-.904.902v13.855h-5.916a.899.899 0 0 0-.894.902v10.584a.9.9 0 0 0 .894.903h5.916v27.39c0 11.062 5.508 16.674 16.38 16.674 4.413 0 8.075-.914 11.528-2.873a.88.88 0 0 0 .457-.78v-10.083a.896.896 0 0 0-.428-.76.873.873 0 0 0-.876-.039c-2.368 1.19-4.66 1.741-7.229 1.741-3.947 0-5.716-1.798-5.716-5.812V73.49h13.554a.899.899 0 0 0 .894-.903V62.003a.873.873 0 0 0-.884-.903l-.01-.005Zm47.217.054v-1.702c0-5.006 1.921-7.238 6.22-7.238 2.57 0 4.633.51 6.945 1.28a.895.895 0 0 0 1.18-.858l-.001-10.377a.891.891 0 0 0-.637-.865c-2.435-.726-5.555-1.47-10.235-1.47-11.367 0-17.388 6.405-17.388 18.516v2.606h-5.916a.906.906 0 0 0-.904.902v10.638c0 .497.41.903.904.903h5.916v42.237c0 .504.41.904.904.904h12.308c.504 0 .904-.4.904-.904V73.487h11.5l17.616 42.234c-1.998 4.433-3.967 5.317-6.65 5.317-2.168 0-4.46-.646-6.79-1.93a.98.98 0 0 0-.714-.067.896.896 0 0 0-.533.485l-4.175 9.16a.9.9 0 0 0 .39 1.17c4.356 2.359 8.284 3.367 13.145 3.367 9.093 0 14.125-4.242 18.548-15.637l21.364-55.204a.88.88 0 0 0-.095-.838.878.878 0 0 0-.733-.392h-12.822a.901.901 0 0 0-.856.605l-13.136 37.509-14.382-37.534a.898.898 0 0 0-.837-.58h-21.04v-.003Zm-27.375-.054h-12.318a.907.907 0 0 0-.903.902v53.724c0 .504.409.904.903.904h12.318c.495 0 .904-.4.904-.904v-53.72a.9.9 0 0 0-.904-.903v-.003Zm-6.088-24.464c-4.88 0-8.836 3.95-8.836 8.828a8.835 8.835 0 0 0 8.836 8.836c4.88 0 8.827-3.954 8.827-8.836a8.83 8.83 0 0 0-8.827-8.828Z",
      fill: textColor(bgColor)
    }
  ) });
}
var imageSize = 64;
var iconSize = 32;
var Wrapper6 = styled("div")(
  {
    textAlign: "left",
    "> a": {
      display: "inline-flex",
      textDecoration: "none",
      minHeight: px(64),
      minWidth: px(64),
      "&:hover": {
        textDecoration: "underline"
      }
    },
    button: {
      alignItems: "center",
      display: "flex",
      fontSize: px(16),
      height: px(iconSize + 8),
      justifyContent: "center",
      width: px(iconSize)
    }
  },
  ({ style }) => {
    const isCompactLayout = style.layout === "compact";
    const styles = {};
    if (isCompactLayout) {
      styles.borderBottom = `1px solid ${opacify(style.c, 0.6)}`;
      styles["> a"] = {
        display: "flex",
        margin: "0 auto",
        maxWidth: px(640),
        paddingBottom: "100%",
        position: "relative",
        img: {
          display: "block",
          bottom: 0,
          left: 0,
          maxWidth: "100%",
          position: "absolute",
          right: 0,
          top: 0
        }
      };
    } else {
      styles.alignItems = "center";
      styles.display = "flex";
      styles.minHeight = px(80);
      styles["@media (max-width: 767px)"] = {
        borderBottom: `1px solid ${opacify(style.c, 0.6)}`,
        paddingLeft: px(8),
        display: "none",
        width: "100%"
      };
      styles.img = {
        height: px(imageSize),
        width: px(imageSize)
      };
      styles["&.rswp__active"] = {
        "@media (max-width: 767px)": {
          display: "flex"
        }
      };
    }
    return {
      button: {
        color: style.c,
        "&.rswp__active": {
          color: style.activeColor
        }
      },
      ...styles
    };
  },
  "InfoRSWP"
);
var ContentWrapper = styled("div")(
  {
    display: "flex",
    flexDirection: "column",
    justifyContent: "center",
    "> a": {
      fontSize: px(22),
      marginTop: px(4)
    }
  },
  ({ style }) => {
    const isCompactLayout = style.layout === "compact";
    const styles = {};
    if (isCompactLayout) {
      styles.padding = px(8);
      styles.width = "100%";
    } else {
      styles.minHeight = px(imageSize);
      if (!style.hideCoverArt) {
        styles.marginLeft = px(8);
        styles.width = `calc(100% - ${px(imageSize + 8)})`;
      } else {
        styles.width = "100%";
      }
    }
    return styles;
  },
  "ContentWrapperRSWP"
);
var Content = styled("div")(
  {
    display: "flex",
    justifyContent: "start",
    '[data-type="title-artist-wrapper"]': {
      overflow: "hidden",
      div: {
        marginLeft: `-${px(8)}`,
        whiteSpace: "nowrap"
      }
    },
    p: {
      fontSize: px(14),
      lineHeight: 1.3,
      paddingLeft: px(8),
      paddingRight: px(8),
      width: "100%",
      "&:nth-of-type(1)": {
        alignItems: "center",
        display: "inline-flex"
      },
      "&:nth-of-type(2)": {
        fontSize: px(12)
      }
    },
    span: {
      display: "inline-block"
    }
  },
  ({ style }) => {
    const maskImageColor = getBgColor(style.bgColor, style.trackNameColor);
    return {
      '[data-type="title-artist-wrapper"]': {
        color: style.trackNameColor,
        maxWidth: `calc(100% - ${px(style.showSaveIcon ? iconSize : 0)})`,
        div: {
          "-webkit-mask-image": `linear-gradient(90deg,transparent 0, ${maskImageColor} 6px, ${maskImageColor} calc(100% - 12px),transparent)`
        }
      },
      p: {
        "&:nth-of-type(1)": {
          color: style.trackNameColor,
          a: {
            color: style.trackNameColor
          }
        },
        "&:nth-of-type(2)": {
          color: style.trackArtistColor,
          a: {
            color: style.trackArtistColor
          }
        }
      }
    };
  },
  "ContentRSWP"
);
function Info(props) {
  const {
    hideAttribution,
    hideCoverArt,
    isActive,
    layout,
    locale,
    onFavoriteStatusChange,
    showSaveIcon,
    styles: { activeColor, bgColor, color, height, trackArtistColor, trackNameColor },
    token,
    track: { artists = [], id, image, name, uri },
    updateSavedStatus
  } = props;
  const [isSaved, setIsSaved] = (0, import_react8.useState)(false);
  const isMounted = (0, import_react8.useRef)(false);
  const previousId = usePrevious(id);
  const isCompactLayout = layout === "compact";
  const updateState = (state) => {
    if (!isMounted.current) {
      return;
    }
    setIsSaved(state);
  };
  const setStatus = async () => {
    if (!isMounted.current) {
      return;
    }
    if (updateSavedStatus && id) {
      updateSavedStatus((newStatus) => {
        updateState(newStatus);
      });
    }
    const status = await checkTracksStatus(token, id);
    const [isFavorite] = status || [false];
    updateState(isFavorite);
    onFavoriteStatusChange(isSaved);
  };
  (0, import_react8.useEffect)(() => {
    isMounted.current = true;
    if (showSaveIcon && id) {
      setStatus();
    }
    return () => {
      isMounted.current = false;
    };
  }, []);
  (0, import_react8.useEffect)(() => {
    if (showSaveIcon && previousId !== id && id) {
      updateState(false);
      setStatus();
    }
  });
  const handleClickIcon = async () => {
    if (isSaved) {
      await removeTracks(token, id);
      updateState(false);
    } else {
      await saveTracks(token, id);
      updateState(true);
    }
    onFavoriteStatusChange(!isSaved);
  };
  const title = getSpotifyLinkTitle(name, locale.title);
  let favorite;
  if (showSaveIcon && id) {
    favorite = (0, import_jsx_runtime18.jsx)(
      "button",
      {
        "aria-label": isSaved ? locale.removeTrack : locale.saveTrack,
        className: `ButtonRSWP${isSaved ? " rswp__active" : ""}`,
        onClick: handleClickIcon,
        title: isSaved ? locale.removeTrack : locale.saveTrack,
        type: "button",
        children: isSaved ? (0, import_jsx_runtime18.jsx)(Favorite, {}) : (0, import_jsx_runtime18.jsx)(FavoriteOutline, {})
      }
    );
  }
  const content = {};
  const classes = [];
  if (isActive) {
    classes.push("rswp__active");
  }
  if (isCompactLayout) {
    content.image = (0, import_jsx_runtime18.jsx)("img", { alt: name, src: image });
  }
  if (!id) {
    return (0, import_jsx_runtime18.jsx)("div", {});
  }
  return (0, import_jsx_runtime18.jsxs)(
    Wrapper6,
    {
      className: classes.join(" "),
      "data-component-name": "Info",
      style: {
        activeColor,
        c: color,
        h: height,
        layout,
        showSaveIcon
      },
      children: [
        !hideCoverArt && (0, import_jsx_runtime18.jsx)(
          "a",
          {
            "aria-label": title,
            href: getSpotifyLink(uri),
            rel: "noreferrer",
            target: "_blank",
            title,
            children: (0, import_jsx_runtime18.jsx)("img", { alt: name, src: image })
          }
        ),
        (0, import_jsx_runtime18.jsxs)(
          ContentWrapper,
          {
            style: {
              hideCoverArt,
              layout,
              showSaveIcon
            },
            children: [
              !!name && (0, import_jsx_runtime18.jsxs)(
                Content,
                {
                  style: {
                    bgColor,
                    layout,
                    showSaveIcon,
                    trackArtistColor,
                    trackNameColor
                  },
                  children: [
                    (0, import_jsx_runtime18.jsx)("div", { "data-type": "title-artist-wrapper", children: (0, import_jsx_runtime18.jsxs)("div", { children: [
                      (0, import_jsx_runtime18.jsx)("p", { children: (0, import_jsx_runtime18.jsx)("span", { children: (0, import_jsx_runtime18.jsx)(
                        "a",
                        {
                          "aria-label": title,
                          href: getSpotifyLink(uri),
                          rel: "noreferrer",
                          target: "_blank",
                          title,
                          children: name
                        }
                      ) }) }),
                      (0, import_jsx_runtime18.jsx)("p", { title: artists.map((d) => d.name).join(", "), children: artists.map((artist, index) => {
                        const artistTitle = getSpotifyLinkTitle(artist.name, locale.title);
                        return (0, import_jsx_runtime18.jsxs)("span", { children: [
                          index ? ", " : "",
                          (0, import_jsx_runtime18.jsx)(
                            "a",
                            {
                              "aria-label": artistTitle,
                              href: getSpotifyLink(artist.uri),
                              rel: "noreferrer",
                              target: "_blank",
                              title: artistTitle,
                              children: artist.name
                            }
                          )
                        ] }, artist.uri);
                      }) })
                    ] }) }),
                    favorite
                  ]
                }
              ),
              !hideAttribution && (0, import_jsx_runtime18.jsx)(
                "a",
                {
                  "aria-label": "Play on Spotify",
                  href: getSpotifyLink(uri),
                  rel: "noreferrer",
                  target: "_blank",
                  children: (0, import_jsx_runtime18.jsx)(SpotifyLogo, { bgColor })
                }
              )
            ]
          }
        )
      ]
    }
  );
}
var Info_default = (0, import_react8.memo)(Info);
var Wrapper7 = styled("div")(
  {
    alignItems: "center",
    display: "flex",
    jsutifyContent: "center",
    position: "relative",
    "> div": {
      borderRadius: "50%",
      borderStyle: "solid",
      borderWidth: 0,
      boxSizing: "border-box",
      height: 0,
      left: "50%",
      position: "absolute",
      top: "50%",
      transform: "translate(-50%, -50%)",
      width: 0
    }
  },
  ({ style }) => {
    const pulse = keyframes({
      "0%": {
        height: 0,
        width: 0
      },
      "30%": {
        borderWidth: px(8),
        height: px(style.loaderSize),
        opacity: 1,
        width: px(style.loaderSize)
      },
      "100%": {
        borderWidth: 0,
        height: px(style.loaderSize),
        opacity: 0,
        width: px(style.loaderSize)
      }
    });
    return {
      height: px(style.h),
      "> div": {
        animation: `${pulse} 1.15s infinite cubic-bezier(0.215, 0.61, 0.355, 1)`,
        borderColor: style.loaderColor,
        height: px(style.loaderSize),
        width: px(style.loaderSize)
      }
    };
  },
  "LoaderRSWP"
);
function Loader({ styles: { height, loaderColor, loaderSize } }) {
  return (0, import_jsx_runtime19.jsx)(Wrapper7, { "data-component-name": "Loader", style: { h: height, loaderColor, loaderSize }, children: (0, import_jsx_runtime19.jsx)("div", {}) });
}
var Player = (0, import_react10.forwardRef)((props, ref) => {
  const {
    children,
    styles: { bgColor, height },
    ...rest
  } = props;
  return (0, import_jsx_runtime20.jsx)(
    "div",
    {
      ref,
      className: "PlayerRSWP",
      "data-component-name": "Player",
      style: { background: bgColor, minHeight: px(height) },
      ...rest,
      children
    }
  );
});
var Player_default = Player;
function VolumeHigh(props) {
  return (0, import_jsx_runtime21.jsx)(
    "svg",
    {
      "data-component-name": "VolumeHigh",
      height: "1em",
      preserveAspectRatio: "xMidYMid",
      viewBox: "0 0 64 64",
      width: "1em",
      ...props,
      children: (0, import_jsx_runtime21.jsx)(
        "path",
        {
          d: "M37.963 3.402a2.989 2.989 0 0 1 1.5 2.596v52a3 3 0 0 1-4.5 2.6l-27.7-16C.32 40.572-2.06 31.688 1.943 24.73a14.556 14.556 0 0 1 5.32-5.328l27.7-16a3 3 0 0 1 3 0ZM45 9.542a23.008 23.008 0 0 1 0 44.912V48.25a17.008 17.008 0 0 0 0-32.508Zm-11.532 1.656-23.2 13.4a8.556 8.556 0 0 0 0 14.8l23.2 13.4v-41.6ZM45 22.238a11 11 0 0 1 0 19.52v-19.52Z",
          fill: "currentColor"
        }
      )
    }
  );
}
function VolumeLow(props) {
  return (0, import_jsx_runtime22.jsx)(
    "svg",
    {
      "data-component-name": "VolumeLow",
      height: "1em",
      preserveAspectRatio: "xMidYMid",
      viewBox: "0 0 64 64",
      width: "1em",
      ...props,
      children: (0, import_jsx_runtime22.jsx)(
        "path",
        {
          d: "M37.963 3.398a3 3 0 0 1 1.5 2.6v52a3 3 0 0 1-4.5 2.6l-27.7-16C.32 40.572-2.06 31.688 1.943 24.73a14.556 14.556 0 0 1 5.32-5.328l27.7-16a3 3 0 0 1 3 0v-.004Zm-27.696 21.2a8.556 8.556 0 0 0 0 14.8l23.2 13.4v-41.6l-23.2 13.4ZM45 41.758v-19.52a11 11 0 0 1 0 19.52Z",
          fill: "currentColor"
        }
      )
    }
  );
}
function VolumeHigh2(props) {
  return (0, import_jsx_runtime23.jsx)(
    "svg",
    {
      "data-component-name": "VolumeMid",
      height: "1em",
      preserveAspectRatio: "xMidYMid",
      viewBox: "0 0 64 64",
      width: "1em",
      ...props,
      children: (0, import_jsx_runtime23.jsx)(
        "path",
        {
          d: "M37.963 3.398a3 3 0 0 1 1.5 2.6v52a3 3 0 0 1-4.5 2.6l-27.7-16C.32 40.572-2.06 31.688 1.943 24.73a14.556 14.556 0 0 1 5.32-5.328l27.7-16a3 3 0 0 1 3 0v-.004Zm-27.696 21.2a8.556 8.556 0 0 0 0 14.8l23.2 13.4v-41.6l-23.2 13.4ZM45 48.946a18.008 18.008 0 0 0 0-33.896v6.6a11.996 11.996 0 0 1 0 20.7v6.596Z",
          fill: "currentColor"
        }
      )
    }
  );
}
function VolumeMute(props) {
  return (0, import_jsx_runtime24.jsx)(
    "svg",
    {
      "data-component-name": "VolumeMute",
      height: "1em",
      preserveAspectRatio: "xMidYMid",
      viewBox: "0 0 64 64",
      width: "1em",
      ...props,
      children: (0, import_jsx_runtime24.jsx)(
        "path",
        {
          d: "M34.963 3.402a3 3 0 0 1 4.5 2.6v7.624a19.03 19.03 0 0 0-6 2.776v-5.2l-23.2 13.4a8.57 8.57 0 0 0-3.12 3.128 8.564 8.564 0 0 0 3.124 11.68l23.196 13.392v-5.2a18.92 18.92 0 0 0 6 2.776v7.624a3 3 0 0 1-4.5 2.596l-27.7-16a14.556 14.556 0 0 1-5.32-5.328C-2.06 32.313.32 23.428 7.263 19.402l27.7-16Zm17.354 17.6a3 3 0 0 1 2.122 5.12l-5.88 5.88 5.876 5.88a3 3 0 0 1-4.24 4.24l-5.88-5.88-5.88 5.88a3 3 0 1 1-4.385-4.095l6.025-6.025-5.876-5.88a3 3 0 0 1 4.236-4.24l5.88 5.88 5.88-5.88a3 3 0 0 1 2.122-.88Z",
          fill: "currentColor"
        }
      )
    }
  );
}
var WrapperWithToggle = styled("div")(
  {
    display: "none",
    "pointer-events": "all",
    position: "relative",
    zIndex: 20,
    "> div": {
      alignItems: "center",
      backgroundColor: "#000",
      borderRadius: px(4),
      color: "#fff",
      display: "flex",
      filter: "drop-shadow(1px 1px 6px rgba(0, 0, 0, 0.5))",
      flexDirection: "column",
      left: "-4px",
      padding: px(16),
      position: "absolute",
      "> span": {
        background: "transparent",
        borderLeft: `6px solid transparent`,
        borderRight: `6px solid transparent`,
        content: '""',
        display: "block",
        height: 0,
        position: "absolute",
        width: 0
      }
    },
    "> button": {
      alignItems: "center",
      display: "flex",
      fontSize: px(24),
      height: px(32),
      justifyContent: "center",
      width: px(32)
    },
    "@media (any-pointer: fine)": {
      display: "block"
    }
  },
  ({ style }) => {
    const isCompact = style.layout === "compact";
    const spanStyles = isCompact ? {
      bottom: `-${px(6)}`,
      borderTop: `6px solid #000`
    } : {
      [style.p === "top" ? "border-bottom" : "border-top"]: `6px solid #000`,
      [style.p]: "-6px"
    };
    return {
      "> button": {
        color: style.c
      },
      "> div": {
        [isCompact ? "bottom" : style.p]: "130%",
        "> span": spanStyles
      }
    };
  },
  "VolumeRSWP"
);
var WrapperInline = styled("div")(
  {
    display: "none",
    padding: `0 ${px(8)}`,
    "pointer-events": "all",
    "> div": {
      display: "flex",
      padding: `0 ${px(5)}`,
      width: px(100)
    },
    "> span": {
      display: "flex",
      fontSize: px(24)
    },
    "@media (any-pointer: fine)": {
      alignItems: "center",
      display: "flex"
    }
  },
  ({ style }) => ({
    color: style.c
  }),
  "VolumeInlineRSWP"
);
function Volume(props) {
  const { inlineVolume, layout, locale, playerPosition, setVolume: setVolume2, styles, volume } = props;
  const [isOpen, setIsOpen] = (0, import_react11.useState)(false);
  const [volumeState, setVolumeState] = (0, import_react11.useState)(volume);
  const timeoutRef = (0, import_react11.useRef)();
  const previousVolume = usePrevious(volume);
  const isMediumScreen = useMediaQuery("(min-width: 768px)");
  const isInline = layout === "responsive" && inlineVolume && isMediumScreen;
  (0, import_react11.useEffect)(() => {
    if (previousVolume !== volume && volume !== volumeState) {
      setVolumeState(volume);
    }
  }, [previousVolume, volume, volumeState]);
  const handleClickToggleList = (0, import_react11.useCallback)(() => {
    setIsOpen((s) => !s);
  }, []);
  const handleChangeSlider = ({ x, y }) => {
    const value = isInline ? x : y;
    const currentvolume = Math.round(value) / 100;
    clearTimeout(timeoutRef.current);
    timeoutRef.current = window.setTimeout(() => {
      setVolume2(currentvolume);
    }, 250);
    setVolumeState(currentvolume);
  };
  const handleAfterEnd = () => {
    setTimeout(() => {
      setIsOpen(false);
    }, 100);
  };
  let icon = (0, import_jsx_runtime25.jsx)(VolumeHigh, {});
  if (volume === 0) {
    icon = (0, import_jsx_runtime25.jsx)(VolumeMute, {});
  } else if (volume <= 0.4) {
    icon = (0, import_jsx_runtime25.jsx)(VolumeLow, {});
  } else if (volume <= 0.7) {
    icon = (0, import_jsx_runtime25.jsx)(VolumeHigh2, {});
  }
  if (isInline) {
    return (0, import_jsx_runtime25.jsxs)(WrapperInline, { "data-component-name": "Volume", "data-value": volume, style: { c: styles.color }, children: [
      (0, import_jsx_runtime25.jsx)("span", { children: icon }),
      (0, import_jsx_runtime25.jsx)("div", { children: (0, import_jsx_runtime25.jsx)(
        esm_default,
        {
          axis: "x",
          className: "volume",
          "data-component-name": "volume-bar",
          onAfterEnd: handleAfterEnd,
          onChange: handleChangeSlider,
          styles: {
            options: {
              thumbBorder: 0,
              thumbBorderRadius: styles.sliderHandleBorderRadius,
              thumbColor: styles.sliderHandleColor,
              height: 4,
              padding: 0,
              rangeColor: styles.sliderColor,
              trackBorderRadius: styles.sliderTrackBorderRadius,
              trackColor: styles.sliderTrackColor
            }
          },
          x: volume * 100,
          xMax: 100,
          xMin: 0
        }
      ) })
    ] });
  }
  return (0, import_jsx_runtime25.jsx)(ClickOutside_default, { isActive: isOpen, onClick: handleClickToggleList, children: (0, import_jsx_runtime25.jsxs)(
    WrapperWithToggle,
    {
      "data-component-name": "Volume",
      "data-value": volume,
      style: { c: styles.color, layout, p: playerPosition },
      children: [
        isOpen && (0, import_jsx_runtime25.jsxs)("div", { children: [
          (0, import_jsx_runtime25.jsx)(
            esm_default,
            {
              axis: "y",
              className: "volume",
              "data-component-name": "volume-bar",
              onAfterEnd: handleAfterEnd,
              onChange: handleChangeSlider,
              styles: {
                options: {
                  padding: 0,
                  rangeColor: "#fff",
                  thumbBorder: 0,
                  thumbBorderRadius: 12,
                  thumbColor: "#fff",
                  thumbSize: 12,
                  trackColor: "rgba(255, 255, 255, 0.5)",
                  width: 6
                }
              },
              y: volume * 100,
              yMax: 100,
              yMin: 0
            }
          ),
          (0, import_jsx_runtime25.jsx)("span", {})
        ] }),
        (0, import_jsx_runtime25.jsx)(
          "button",
          {
            "aria-label": locale.volume,
            className: "ButtonRSWP",
            onClick: handleClickToggleList,
            title: locale.volume,
            type: "button",
            children: icon
          }
        )
      ]
    }
  ) });
}
var StyledWrapper = styled("div")(
  {
    alignItems: "center",
    display: "flex",
    flexDirection: "column",
    flexWrap: "wrap",
    justifyContent: "center",
    position: "relative",
    "> *": {
      width: "100%"
    }
  },
  ({ style }) => {
    let styles = {};
    if (style.layout === "responsive") {
      styles = {
        "> *": {
          "@media (min-width: 768px)": {
            width: "33.3333%"
          }
        },
        "@media (min-width: 768px)": {
          flexDirection: "row",
          padding: `0 ${px(8)}`
        }
      };
    }
    return {
      minHeight: px(style.h),
      ...styles
    };
  },
  "WrapperRSWP"
);
function Wrapper8(props) {
  const { children, layout, styles } = props;
  return (0, import_jsx_runtime26.jsx)(StyledWrapper, { "data-component-name": "Wrapper", style: { h: styles.height, layout }, children });
}
var Wrapper_default = (0, import_react12.memo)(Wrapper8);
put(".PlayerRSWP", {
  boxSizing: "border-box",
  fontSize: "inherit",
  width: "100%",
  "*": {
    boxSizing: "border-box"
  },
  p: {
    margin: 0
  }
});
put(".ButtonRSWP", {
  appearance: "none",
  background: "transparent",
  border: 0,
  borderRadius: 0,
  color: "inherit",
  cursor: "pointer",
  display: "inline-flex",
  lineHeight: 1,
  padding: 0,
  ":focus": {
    outlineColor: "#000",
    outlineOffset: 3
  }
});
var _a;
var SpotifyWebPlayer = (_a = class extends import_react.PureComponent {
  constructor(props) {
    super(props);
    __publicField(this, "isMounted", false);
    __publicField(this, "emptyTrack", {
      artists: [],
      durationMs: 0,
      id: "",
      image: "",
      name: "",
      uri: ""
    });
    __publicField(this, "locale");
    __publicField(this, "player");
    __publicField(this, "playerProgressInterval");
    __publicField(this, "playerSyncInterval");
    __publicField(this, "ref", (0, import_react.createRef)());
    __publicField(this, "renderInlineActions", false);
    __publicField(this, "resizeTimeout");
    __publicField(this, "seekUpdateInterval", 100);
    __publicField(this, "styles");
    __publicField(this, "syncTimeout");
    __publicField(this, "getPlayOptions", memoizeOne((ids) => {
      const playOptions = {
        context_uri: void 0,
        uris: void 0
      };
      if (ids) {
        if (!ids.every((d) => validateURI(d))) {
          return playOptions;
        }
        if (ids.some((d) => getSpotifyURIType(d) === "track")) {
          if (!ids.every((d) => getSpotifyURIType(d) === "track")) {
            console.warn("You can't mix tracks URIs with other types");
          }
          playOptions.uris = ids.filter((d) => validateURI(d) && getSpotifyURIType(d) === "track");
        } else {
          if (ids.length > 1) {
            console.warn("Albums, Artists, Playlists and Podcasts can't have multiple URIs");
          }
          playOptions.context_uri = ids[0];
        }
      }
      return playOptions;
    }));
    __publicField(this, "handleChangeRange", async (position) => {
      const { track } = this.state;
      const { callback } = this.props;
      let progress = 0;
      try {
        const percentage = position / 100;
        let stateChanges = {};
        if (this.isExternalPlayer) {
          progress = Math.round(track.durationMs * percentage);
          await seek(this.token, progress);
          stateChanges = {
            position,
            progressMs: progress
          };
        } else if (this.player) {
          const state = await this.player.getCurrentState();
          if (state) {
            progress = Math.round(state.track_window.current_track.duration_ms * percentage);
            await this.player.seek(progress);
            stateChanges = {
              position,
              progressMs: progress
            };
          } else {
            stateChanges = { position: 0 };
          }
        }
        this.updateState(stateChanges);
        if (callback) {
          callback({
            ...this.state,
            ...stateChanges,
            type: TYPE.PROGRESS
          });
        }
      } catch (error) {
        console.error(error);
      }
    });
    __publicField(this, "handleClickTogglePlay", async () => {
      const { isActive } = this.state;
      try {
        await this.togglePlay(!this.isExternalPlayer && !isActive);
      } catch (error) {
        console.error(error);
      }
    });
    __publicField(this, "handleClickPrevious", async () => {
      try {
        if (this.isExternalPlayer) {
          await previous(this.token);
          this.syncTimeout = window.setTimeout(() => {
            this.syncDevice();
          }, 300);
        } else if (this.player) {
          await this.player.previousTrack();
        }
      } catch (error) {
        console.error(error);
      }
    });
    __publicField(this, "handleClickNext", async () => {
      try {
        if (this.isExternalPlayer) {
          await next(this.token);
          this.syncTimeout = window.setTimeout(() => {
            this.syncDevice();
          }, 300);
        } else if (this.player) {
          await this.player.nextTrack();
        }
      } catch (error) {
        console.error(error);
      }
    });
    __publicField(this, "handleClickDevice", async (deviceId) => {
      const { isUnsupported } = this.state;
      const { autoPlay, persistDeviceSelection } = this.props;
      this.updateState({ currentDeviceId: deviceId });
      try {
        await setDevice(this.token, deviceId);
        if (persistDeviceSelection) {
          sessionStorage.setItem("rswpDeviceId", deviceId);
        }
        if (isUnsupported) {
          await this.syncDevice();
          const playerState = await getPlaybackState(this.token);
          if (playerState && !playerState.is_playing && autoPlay) {
            await this.togglePlay(true);
          }
        }
      } catch (error) {
        console.error(error);
      }
    });
    __publicField(this, "handleFavoriteStatusChange", (status) => {
      const { isSaved } = this.state;
      this.updateState({ isSaved: status });
      if (isSaved !== status) {
        this.handleCallback({
          ...this.state,
          isSaved: status,
          type: TYPE.FAVORITE
        });
      }
    });
    __publicField(this, "handlePlayerErrors", async (type, message) => {
      const { status } = this.state;
      const isPlaybackError = type === ERROR_TYPE.PLAYBACK;
      const isInitializationError = type === ERROR_TYPE.INITIALIZATION;
      let nextStatus = status;
      let devices = [];
      if (this.player && !isPlaybackError) {
        this.player.disconnect();
        this.player = void 0;
      }
      if (isInitializationError) {
        nextStatus = STATUS.UNSUPPORTED;
        ({ devices = [] } = await getDevices(this.token));
      } else if (!isPlaybackError) {
        nextStatus = STATUS.ERROR;
      }
      this.updateState({
        devices,
        error: message,
        errorType: type,
        isInitializing: false,
        isUnsupported: isInitializationError,
        status: nextStatus
      });
    });
    __publicField(this, "handlePlayerStateChanges", async (state) => {
      var _a2;
      const { currentURI } = this.state;
      try {
        if (state) {
          const {
            paused,
            position,
            repeat_mode,
            shuffle: shuffle2,
            track_window: { current_track, next_tracks, previous_tracks }
          } = state;
          const isPlaying = !paused;
          const volume = await ((_a2 = this.player) == null ? void 0 : _a2.getVolume()) ?? 100;
          let trackState = {};
          if ((!currentURI || currentURI !== current_track.uri) && current_track) {
            trackState = {
              currentURI: current_track.uri,
              nextTracks: next_tracks.map(getTrackInfo),
              position: 0,
              previousTracks: previous_tracks.map(getTrackInfo),
              track: getTrackInfo(current_track)
            };
          }
          this.updateState({
            error: "",
            errorType: null,
            isActive: true,
            isPlaying,
            progressMs: position,
            repeat: getRepeatState(repeat_mode),
            shuffle: shuffle2,
            volume: round3(volume),
            ...trackState
          });
        } else if (this.isExternalPlayer) {
          await this.syncDevice();
        } else {
          this.updateState({
            isActive: false,
            isPlaying: false,
            nextTracks: [],
            position: 0,
            previousTracks: [],
            track: {
              artists: [],
              durationMs: 0,
              id: "",
              image: "",
              name: "",
              uri: ""
            }
          });
        }
      } catch (error) {
        console.error(error);
      }
    });
    __publicField(this, "handlePlayerStatus", async ({ device_id }) => {
      const { currentDeviceId, devices } = await this.initializeDevices(device_id);
      this.updateState({
        currentDeviceId,
        deviceId: device_id,
        devices,
        isInitializing: false,
        status: device_id ? STATUS.READY : STATUS.IDLE
      });
      if (device_id) {
        await this.preload();
      }
    });
    __publicField(this, "handleResize", () => {
      const { layout = "responsive" } = this.props;
      clearTimeout(this.resizeTimeout);
      this.resizeTimeout = window.setTimeout(() => {
        this.renderInlineActions = window.innerWidth >= 768 && layout === "responsive";
        this.forceUpdate();
      }, 100);
    });
    __publicField(this, "handleToggleMagnify", () => {
      const { magnifySliderOnHover } = this.props;
      if (magnifySliderOnHover) {
        this.updateState((previousState) => {
          return { isMagnified: !previousState.isMagnified };
        });
      }
    });
    __publicField(this, "initializePlayer", () => {
      const { volume } = this.state;
      const {
        getOAuthToken = (callback) => {
          callback(this.token);
        },
        getPlayer,
        name = "Spotify Web Player"
      } = this.props;
      if (!window.Spotify) {
        return;
      }
      this.updateState({
        error: "",
        errorType: null,
        isInitializing: true
      });
      this.player = new window.Spotify.Player({
        getOAuthToken,
        name,
        volume
      });
      this.player.addListener("ready", this.handlePlayerStatus);
      this.player.addListener("not_ready", this.handlePlayerStatus);
      this.player.addListener("player_state_changed", this.handlePlayerStateChanges);
      this.player.addListener(
        "initialization_error",
        (error) => this.handlePlayerErrors(ERROR_TYPE.INITIALIZATION, error.message)
      );
      this.player.addListener(
        "authentication_error",
        (error) => this.handlePlayerErrors(ERROR_TYPE.AUTHENTICATION, error.message)
      );
      this.player.addListener(
        "account_error",
        (error) => this.handlePlayerErrors(ERROR_TYPE.ACCOUNT, error.message)
      );
      this.player.addListener(
        "playback_error",
        (error) => this.handlePlayerErrors(ERROR_TYPE.PLAYBACK, error.message)
      );
      this.player.addListener("autoplay_failed", async () => {
        console.log("Autoplay is not allowed by the browser autoplay rules");
      });
      this.player.connect();
      if (getPlayer) {
        getPlayer(this.player);
      }
    });
    __publicField(this, "preload", async () => {
      const { offset = 0, preloadData, uris } = this.props;
      if (!preloadData) {
        return;
      }
      const track = await getPreloadData(this.token, uris, offset);
      if (track) {
        this.updateState({ track }, () => {
          this.handleCallback({
            ...this.state,
            type: TYPE.PRELOAD
          });
        });
      }
    });
    __publicField(this, "setExternalDevice", (id) => {
      this.updateState({ currentDeviceId: id, isPlaying: true });
    });
    __publicField(this, "setVolume", async (volume) => {
      if (this.isExternalPlayer) {
        await setVolume(this.token, Math.round(volume * 100));
        await this.syncDevice();
      } else if (this.player) {
        await this.player.setVolume(volume);
      }
      this.updateState({ volume });
    });
    __publicField(this, "syncDevice", async () => {
      if (!this.isMounted) {
        return;
      }
      const { deviceId } = this.state;
      try {
        const playerState = await getPlaybackState(this.token);
        let track = this.emptyTrack;
        if (!playerState) {
          throw new Error("No player");
        }
        if (playerState.item) {
          track = {
            artists: "artists" in playerState.item ? playerState.item.artists : [],
            durationMs: playerState.item.duration_ms,
            id: playerState.item.id,
            image: "album" in playerState.item ? getItemImage(playerState.item.album) : "",
            name: playerState.item.name,
            uri: playerState.item.uri
          };
        }
        this.updateState({
          error: "",
          errorType: null,
          isActive: true,
          isPlaying: playerState.is_playing,
          nextTracks: [],
          previousTracks: [],
          progressMs: playerState.item ? playerState.progress_ms ?? 0 : 0,
          status: STATUS.READY,
          track,
          volume: parseVolume(playerState.device.volume_percent)
        });
      } catch (error) {
        const state = {
          isActive: false,
          isPlaying: false,
          position: 0,
          track: this.emptyTrack
        };
        if (deviceId) {
          this.updateState({
            currentDeviceId: deviceId,
            ...state
          });
          return;
        }
        this.updateState({
          error: error.message,
          errorType: ERROR_TYPE.PLAYER,
          status: STATUS.ERROR,
          ...state
        });
      }
    });
    __publicField(this, "toggleOffset", async () => {
      const { currentDeviceId } = this.state;
      const { offset, uris } = this.props;
      const playOptions = this.getPlayOptions(parseIds(uris));
      if (typeof offset === "number") {
        await play(this.token, { deviceId: currentDeviceId, offset, ...playOptions });
      }
    });
    __publicField(this, "togglePlay", async (force = false) => {
      const { currentDeviceId, isPlaying, needsUpdate } = this.state;
      const { offset, uris } = this.props;
      const shouldInitialize = force || needsUpdate;
      const playOptions = this.getPlayOptions(parseIds(uris));
      try {
        if (this.isExternalPlayer) {
          if (!isPlaying) {
            await play(this.token, {
              deviceId: currentDeviceId,
              offset,
              ...shouldInitialize ? playOptions : void 0
            });
          } else {
            await pause(this.token);
            this.updateState({ isPlaying: false });
          }
          this.syncTimeout = window.setTimeout(() => {
            this.syncDevice();
          }, 300);
        } else if (this.player) {
          await this.player.activateElement();
          const playerState = await this.player.getCurrentState();
          const shouldPlay = !playerState && !!(playOptions.context_uri ?? playOptions.uris);
          if (shouldPlay || shouldInitialize) {
            await play(this.token, {
              deviceId: currentDeviceId,
              offset,
              ...shouldInitialize ? playOptions : void 0
            });
            await this.player.togglePlay();
          } else {
            await this.player.togglePlay();
          }
        }
        if (needsUpdate) {
          this.updateState({ needsUpdate: false });
        }
      } catch (error) {
        console.error(error);
      }
    });
    __publicField(this, "updateSeekBar", async () => {
      if (!this.isMounted) {
        return;
      }
      const { progressMs, track } = this.state;
      try {
        if (this.isExternalPlayer) {
          let position = progressMs / track.durationMs;
          position = Number(((Number.isFinite(position) ? position : 0) * 100).toFixed(1));
          this.updateState({
            position,
            progressMs: progressMs + this.seekUpdateInterval
          });
        } else if (this.player) {
          const state = await this.player.getCurrentState();
          if (state) {
            const progress = state.position;
            const position = Number(
              (progress / state.track_window.current_track.duration_ms * 100).toFixed(1)
            );
            this.updateState({
              position,
              progressMs: progress + this.seekUpdateInterval
            });
          }
        }
      } catch (error) {
        console.error(error);
      }
    });
    __publicField(this, "updateState", (state, callback) => {
      if (!this.isMounted) {
        return;
      }
      this.setState(state, callback);
    });
    this.state = {
      currentDeviceId: "",
      currentURI: "",
      deviceId: "",
      devices: [],
      error: "",
      errorType: null,
      isActive: false,
      isInitializing: false,
      isMagnified: false,
      isPlaying: false,
      isSaved: false,
      isUnsupported: false,
      needsUpdate: false,
      nextTracks: [],
      playerPosition: "bottom",
      position: 0,
      previousTracks: [],
      progressMs: 0,
      repeat: "off",
      shuffle: false,
      status: STATUS.IDLE,
      track: this.emptyTrack,
      volume: parseVolume(props.initialVolume) || 1
    };
    this.locale = getLocale(props.locale);
    this.styles = getMergedStyles(props.styles);
  }
  async componentDidMount() {
    var _a2;
    this.isMounted = true;
    const { top = 0 } = ((_a2 = this.ref.current) == null ? void 0 : _a2.getBoundingClientRect()) ?? {};
    this.updateState({
      playerPosition: top > window.innerHeight / 2 ? "bottom" : "top",
      status: STATUS.INITIALIZING
    });
    if (!window.onSpotifyWebPlaybackSDKReady) {
      window.onSpotifyWebPlaybackSDKReady = this.initializePlayer;
    } else {
      this.initializePlayer();
    }
    await loadSpotifyPlayer();
    window.addEventListener("resize", this.handleResize);
    this.handleResize();
  }
  async componentDidUpdate(previousProps, previousState) {
    const { currentDeviceId, deviceId, isInitializing, isPlaying, repeat: repeat2, shuffle: shuffle2, status, track } = this.state;
    const {
      autoPlay,
      layout,
      locale,
      offset,
      play: playProp,
      showSaveIcon,
      styles,
      syncExternalDevice,
      uris
    } = this.props;
    const isReady = previousState.status !== STATUS.READY && status === STATUS.READY;
    const playOptions = this.getPlayOptions(parseIds(uris));
    const canPlay = !!currentDeviceId && !!(playOptions.context_uri ?? playOptions.uris);
    const shouldPlay = isReady && (autoPlay || playProp);
    if (canPlay && shouldPlay) {
      await this.togglePlay(true);
      if (!isPlaying) {
        this.updateState({ isPlaying: true });
      }
      if (this.isExternalPlayer) {
        this.syncTimeout = window.setTimeout(() => {
          this.syncDevice();
        }, 600);
      }
    } else if (!equal(previousProps.uris, uris)) {
      if (isPlaying || playProp) {
        await this.togglePlay(true);
      } else {
        this.updateState({ needsUpdate: true });
      }
    } else if (previousProps.play !== playProp && playProp !== isPlaying) {
      await this.togglePlay(!track.id);
    }
    if (previousState.status !== status) {
      this.handleCallback({
        ...this.state,
        type: TYPE.STATUS
      });
    }
    if (previousState.currentDeviceId !== currentDeviceId && currentDeviceId) {
      if (!isReady) {
        this.handleCallback({
          ...this.state,
          type: TYPE.DEVICE
        });
      }
      await this.toggleSyncInterval(this.isExternalPlayer);
      await this.updateSeekBar();
    }
    if (track.id && previousState.track.id !== track.id) {
      this.handleCallback({
        ...this.state,
        type: TYPE.TRACK
      });
      if (showSaveIcon) {
        this.updateState({ isSaved: false });
      }
    }
    if (previousState.isPlaying !== isPlaying) {
      this.toggleProgressBar();
      await this.toggleSyncInterval(this.isExternalPlayer);
      this.handleCallback({
        ...this.state,
        type: TYPE.PLAYER
      });
    }
    if (previousState.repeat !== repeat2 || previousState.shuffle !== shuffle2) {
      this.handleCallback({
        ...this.state,
        type: TYPE.PLAYER
      });
    }
    if (previousProps.offset !== offset) {
      await this.toggleOffset();
    }
    if (previousState.isInitializing && !isInitializing) {
      if (syncExternalDevice && !uris) {
        const playerState = await getPlaybackState(this.token);
        if ((playerState == null ? void 0 : playerState.is_playing) && playerState.device.id !== deviceId) {
          this.setExternalDevice(playerState.device.id ?? "");
        }
      }
    }
    if (previousProps.layout !== layout) {
      this.handleResize();
    }
    if (!equal(previousProps.locale, locale)) {
      this.locale = getLocale(locale);
    }
    if (!equal(previousProps.styles, styles)) {
      this.styles = getMergedStyles(styles);
    }
  }
  async componentWillUnmount() {
    this.isMounted = false;
    if (this.player) {
      this.player.disconnect();
    }
    clearInterval(this.playerSyncInterval);
    clearInterval(this.playerProgressInterval);
    clearTimeout(this.syncTimeout);
    window.removeEventListener("resize", this.handleResize);
  }
  handleCallback(state) {
    const { callback } = this.props;
    if (callback) {
      callback(state);
    }
  }
  get token() {
    const { token } = this.props;
    return token;
  }
  async initializeDevices(id) {
    const { persistDeviceSelection } = this.props;
    const { devices } = await getDevices(this.token);
    let currentDeviceId = id;
    if (persistDeviceSelection) {
      const savedDeviceId = sessionStorage.getItem("rswpDeviceId");
      if (!savedDeviceId || !devices.some((d) => d.id === savedDeviceId)) {
        sessionStorage.setItem("rswpDeviceId", currentDeviceId);
      } else {
        currentDeviceId = savedDeviceId;
      }
    }
    return { currentDeviceId, devices };
  }
  get isExternalPlayer() {
    const { currentDeviceId, deviceId, status } = this.state;
    return currentDeviceId && currentDeviceId !== deviceId || status === STATUS.UNSUPPORTED;
  }
  async toggleSyncInterval(shouldSync) {
    const { syncExternalDeviceInterval } = this.props;
    try {
      if (this.isExternalPlayer && shouldSync && !this.playerSyncInterval) {
        await this.syncDevice();
        clearInterval(this.playerSyncInterval);
        this.playerSyncInterval = window.setInterval(
          this.syncDevice,
          syncExternalDeviceInterval * 1e3
        );
      }
      if ((!shouldSync || !this.isExternalPlayer) && this.playerSyncInterval) {
        clearInterval(this.playerSyncInterval);
        this.playerSyncInterval = void 0;
      }
    } catch (error) {
      console.error(error);
    }
  }
  toggleProgressBar() {
    const { isPlaying } = this.state;
    if (isPlaying) {
      if (!this.playerProgressInterval) {
        this.playerProgressInterval = window.setInterval(
          this.updateSeekBar,
          this.seekUpdateInterval
        );
      }
    } else if (this.playerProgressInterval) {
      clearInterval(this.playerProgressInterval);
      this.playerProgressInterval = void 0;
    }
  }
  render() {
    const {
      currentDeviceId,
      deviceId,
      devices,
      error,
      isActive,
      isMagnified,
      isPlaying,
      isUnsupported,
      nextTracks,
      playerPosition,
      position,
      progressMs,
      status,
      track,
      volume
    } = this.state;
    const {
      components,
      hideAttribution = false,
      hideCoverArt = false,
      inlineVolume = true,
      layout = "responsive",
      showSaveIcon,
      updateSavedStatus
    } = this.props;
    const isReady = [STATUS.READY, STATUS.UNSUPPORTED].includes(status);
    const output = {
      main: (0, import_jsx_runtime27.jsx)(Loader, { styles: this.styles })
    };
    if (isReady) {
      if (!output.info) {
        output.info = (0, import_jsx_runtime27.jsx)(
          Info_default,
          {
            hideAttribution,
            hideCoverArt,
            isActive,
            layout,
            locale: this.locale,
            onFavoriteStatusChange: this.handleFavoriteStatusChange,
            showSaveIcon,
            styles: this.styles,
            token: this.token,
            track,
            updateSavedStatus
          }
        );
      }
      output.devices = (0, import_jsx_runtime27.jsx)(
        Devices,
        {
          currentDeviceId,
          deviceId,
          devices,
          layout,
          locale: this.locale,
          onClickDevice: this.handleClickDevice,
          open: isUnsupported && !deviceId,
          playerPosition,
          styles: this.styles
        }
      );
      output.volume = currentDeviceId ? (0, import_jsx_runtime27.jsx)(
        Volume,
        {
          inlineVolume,
          layout,
          locale: this.locale,
          playerPosition,
          setVolume: this.setVolume,
          styles: this.styles,
          volume
        }
      ) : null;
      if (this.renderInlineActions) {
        output.actions = (0, import_jsx_runtime27.jsxs)(Actions_default, { layout, styles: this.styles, children: [
          output.devices,
          output.volume
        ] });
      }
      output.controls = (0, import_jsx_runtime27.jsx)(
        Controls_default,
        {
          components,
          devices: this.renderInlineActions ? null : output.devices,
          durationMs: track.durationMs,
          isActive,
          isExternalDevice: this.isExternalPlayer,
          isMagnified,
          isPlaying,
          layout,
          locale: this.locale,
          nextTracks,
          onChangeRange: this.handleChangeRange,
          onClickNext: this.handleClickNext,
          onClickPrevious: this.handleClickPrevious,
          onClickTogglePlay: this.handleClickTogglePlay,
          onToggleMagnify: this.handleToggleMagnify,
          position,
          progressMs,
          styles: this.styles,
          volume: this.renderInlineActions ? null : output.volume
        }
      );
      output.main = (0, import_jsx_runtime27.jsxs)(Wrapper_default, { layout, styles: this.styles, children: [
        output.info,
        output.controls,
        output.actions
      ] });
    } else if (output.info) {
      output.main = output.info;
    }
    if (status === STATUS.ERROR) {
      output.main = (0, import_jsx_runtime27.jsx)(ErrorMessage, { styles: this.styles, children: error });
    }
    return (0, import_jsx_runtime27.jsx)(Player_default, { ref: this.ref, "data-ready": isReady, styles: this.styles, children: output.main });
  }
}, __publicField(_a, "defaultProps", {
  autoPlay: false,
  initialVolume: 1,
  magnifySliderOnHover: false,
  name: "Spotify Web Player",
  persistDeviceSelection: false,
  showSaveIcon: false,
  syncExternalDeviceInterval: 5,
  syncExternalDevice: false
}), _a);
var src_default = SpotifyWebPlayer;
export {
  ERROR_TYPE,
  STATUS,
  TYPE,
  src_default as default,
  spotify_exports as spotifyApi
};
//# sourceMappingURL=react-spotify-web-playback.js.map
