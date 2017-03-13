/**
 * Created by Administrator on 2017/3/13.
 */

(function () {

    var $ = window.$;
    if (typeof $ === 'undefined')
        $ = window.$ = {};

    var W3C = typeof window.dispatchEvent !== 'undefined';


    $.extend = (function () {
        // Assign the return value of this function
        // This is the list of special-case properties we check for
        var protoprops = ["toString", "valueOf", "constructor", "hasOwnProperty",
            "isPrototypeOf", "propertyIsEnumerable", "toLocaleString"];

        // First check for the presence of the bug before patching it.
        for (var p in { toString: null }) {
            // If we get here, then the for/in loop works correctly and we return
            // a simple version of the extend() function
            return function extend(o) {
                for (var i = 1; i < arguments.length; i++) {
                    var source = arguments[i];
                    for (var prop in source) o[prop] = source[prop];
                }
                return o;
            };
        }
        // If we get here, it means that the for/in loop did not enumerate
        // the toString property of the test object. So return a version
        // of the extend() function that explicitly tests for the nonenumerable
        // properties of Object.prototype.
        return function patched_extend(o) {
            for (var i = 1; i < arguments.length; i++) {
                var source = arguments[i];
                // Copy all the enumerable properties
                for (var prop in source) o[prop] = source[prop];

                // And now check the special-case properties
                for (var j = 0; j < protoprops.length; j++) {
                    prop = protoprops[j];
                    if (source.hasOwnProperty(prop)) o[prop] = source[prop];
                }
            }
            return o;
        };
    }());

    // <editor-fold desc="Type checking">

    $.isNull = function (o) {
        return o === null;
    };

    $.isUndefined = function (o) {
        return o === void 0;
    };

    $.isNaN = function (o) {
        return o !== o;
    };

    $.isArray = function (o) {
        return Object.prototype.toString.call(o) === '[object Array]';
    };

    $.isNumber = function (o) {
        return Object.prototype.toString.call(o) === '[object Number]'
            && !$.isNaN(o) && isFinite(o);
    };

    $.isBoolean = function (o) {
        return (typeof o === 'boolean') || Object.prototype.toString.call(o) === '[object Boolean]';
    };

    $.isString = function (o) {
        return (typeof o === 'string') || Object.prototype.toString.call(o) === '[object String]';
    };

    $.isFunction = function (o) {
        return Object.prototype.toString.call(o) === '[object Function]';
    };

    $.isRegExp = function (o) {
        return Object.prototype.toString.call(o) === '[object RegExp]';
    };

    $.isWindow = function (o) {
        var s = Object.prototype.toString.call(o);
        if (s === '[object Window]')
            return true;
        return (o == document) && !(document == o);  // IE6-8
    };

    $.isDate = function (o) {
        var s = o.toString();
        return Object.prototype.toString.call(o) === '[object Date]' && s !== 'Invalid Date'
            && s !== 'NaN'; // IE6
    };

    // 用 Document 指示 HTMLDocument
    $.isDocument = function (o) {
        // document.nodeType === 9
        return Object.prototype.toString.call(o) === '[object HTMLDocument]' || o.nodeType === 9;
    };

    $.isArguments = function (o) {
        // arguments.callee !== 'undefined'
        return Object.prototype.toString.call(o) === '[object Arguments]' || o.callee;
    };

    // HTMLCollection 并入 NodeList
    $.isNodeList = function (o) {
        var s = Object.prototype.toString.call(o);
        return (s === '[object NodeList]') || (s === '[object HTMLCollection]') ||
            (isFinite(o.length) && o.item);
    };

    $.isArrayLike = function (o) {
        var type = $.type(o);
        if (/Array|NodeList|Arguments|CSSRuleList/.test(type))
            return true;

        if (type === 'Object') {
            var n = o.length;
            if (+n === n && !(n % 1) && n >= 0)
                return true;
        }

        return false;
    };

    var class2types = {
        '[object Object]': 'Object',
        '[object Boolean]': 'Boolean',
        '[object Number]': 'Number',
        '[object String]': 'String',
        '[object Date]': 'Date',
        '[object RegExp]': 'RegExp',
        '[object Array]': 'Array',
        '[object Function]': 'Function',
        '[object Null]': 'Null',
        '[object Undefined]': 'Undefined',
        '[object Document]': 'Document',
        '[object HTMLDocument]': 'Document',
        '[object Window]': 'Window',
        '[object Arguments]': 'Arguments',
        '[object NodeList]': 'NodeList',
        '[object HTMLCollection]': 'NodeList',
        '[object StaticNodeList]': 'NodeList'
    };

    $.type = function (o, str) {
        var result, s;
        if (o === null) {
            result = 'Null';
        }
        else if (o !== o) {
            result = 'NaN';
        }
        else if (o === void 0) {
            result = 'Undefined'
        }
        else {
            result = class2types[Object.prototype.toString.call(o)] || '#';
            switch (result) {
                case 'Date':
                    s = o.toString();
                    if (s === 'Invalid Date' || s === 'NaN') {
                        result = 'Undefined';
                    }
                    break;
                case 'Object':  // IE6-8
                    // window?
                    if ((o == document) && !(document == o))
                        result = 'Window';
                    // document?
                    else if (o.nodeType === 9)
                        result = 'Document';
                    // NodeList?
                    else if (isFinite(o.length) && o.item)
                        result = 'NodeList';
                    else if (o.callee)
                        result = 'Arguments';
                    break;
                default:
                    break;
            }
        }

        if (str) {
            return result == str;
        }
        return result;
    };

//</editor-fold>

    //<editor-fold desc="DOM ready">

    var readyList = [];

    $.ready = function (fn) {
        readyList.push(fn);
    };


    // @w	window reference
    // @fn	function reference
    function IEContentLoaded(w, fn) {
        var d = w.document, done = false,
            // only fire once
            init = function () {
                if (!done) {
                    done = true;
                    fn();
                }
            };
        // polling for no errors
        (function () {
            try {
                // throws errors until after ondocumentready
                d.documentElement.doScroll('left');
            } catch (e) {
                setTimeout(arguments.callee, 50);
                return;
            }
            // no errors, fire
            init();
        })();
        // trying to always fire before onload
        d.onreadystatechange = function () {
            if (d.readyState == 'complete') {
                d.onreadystatechange = null;
                init();
            }
        };
    }


    function fireReady() {
        var i;
        for (i = 0; i < readyList.length; ++i) {
            readyList[i]();
        }
    }

    if (W3C) {
        document.addEventListener('DOMContentLoaded', fireReady)
    }
    else {
        IEContentLoaded(window, fireReady);
    }

    //</editor-fold>

})();
