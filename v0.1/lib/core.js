/**
 * Created by Administrator on 2017/3/13.
 */

(function () {

    var $ = window.$;
    if (typeof $ === 'undefined')
        $ = window.$ = {};

    var W3C = typeof window.dispatchEvent !== 'undefined';
    var head = document.head || document.getElementsByTagName('head')[0];


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

    /**
     * 数组化
     * @param {ArrayLike} nodes 要处理的类数组对象
     * @param {Number} start 可选。要抽取的片断的起始下标。如果是负数，从后面取起
     * @param {Number} end  可选。规定从何处结束选取
     * @return {Array}
     * @api public
     */
    $.slice = W3C ? function (nodes, start, end) {
        return [].slice.call(nodes, start, end);
    } : _slice;

    function _slice(nodes, start, end) {
        var ret = [],
            n = nodes.length;
        if (end === void 0 || typeof end === "number" && isFinite(end)) {
            start = parseInt(start, 10) || 0;
            end = end == void 0 ? n : parseInt(end, 10);
            if (start < 0) {
                start += n;
            }
            if (end > n) {
                end = n;
            }
            if (end < 0) {
                end += n;
            }
            for (var i = start; i < end; ++i) {
                ret[i - start] = nodes[i];
            }
        }
        return ret;
    }

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

    //<editor-fold desc="Module loader">
    var MODULE_CLASS = "xlib" + (new Date - 0);
    var STATE_LOADING = 1, STATE_LOADED = 2;
    var modules = {};   // 定义的模块列表
    var loadings = [];  // 正在加载的模块

    function loadJS(url, cb) {
        var node = document.createElement('script');
        // IE8 及更早版本不支持<script>元素上的 load 事件，而是提供了onreadystatechange
        node[W3C ? 'onload' : 'onreadystatechange'] = function () {
            // console.log('readyState:', node.readyState);
            // IE9- 有 loading 和 loaded 两次触发
            // IE10  有 complete 一次触发
            // IE11+ 及其它浏览器 无 readyState 属性
            if (node.readyState && node.readyState !== 'loaded' && node.readyState !== 'complete')
                return;

            console.log('已成功加载：', url);

            if (cb)
                cb();
        };
        node.onerror = function () {
            console.log('加载时出错：', url);
        };
        node.src = url;
        node.className = MODULE_CLASS;
        head.appendChild(node);
        console.log('正准备加载：', url);
    }

    $._loadJS = loadJS;

    function loadExternal(url) {
        // TODO: 路径补全；别名转换
        var src = url.replace(/[?#].*/, ""); // 清除尾上的 ? # 等串

        // 该依赖项还从未加载过吗？
        if (!modules[src]) {
            modules[src] = {
                id: src,
                exports: {}
            };
            loadJS(src);
        }

        return src;
    }

    $.require = function (list, factory, parent) {
        var deps = {};
        var i;
        var dn = 0; // 需安装的依赖项个数
        var cn = 0; // 已安装的依赖项个数
        // parent = parent || basepath;
        // 起个没什么意义的名字，但不能重复
        var loc = String(document.location).replace(/[?#].*/, "");
        var id = parent || loc + '_cb' + setTimeout(function () { });
        //var name = id.

        // 对每一个依赖项
        for (i = 0; i < list.length; ++i) {
            var url = loadExternal(list[i]);
            if (url) {
                ++dn;
                if (modules[url] && modules[url].state === STATE_LOADED) {
                    console.log('真快！已加载：', url);
                    ++cn;
                }
            }

            if (!deps[url]) {
                deps[url] = '肖雪峰';
            }

        }

        //记录本模块的加载情况与其他信息
        modules[id] = {
            id: id,
            factory: factory,
            deps: deps,
            state: STATE_LOADING
        };


        if (dn === 0 || cn === dn) {
            if (dn === 0)
                console.log(id + ' 没有依赖项。');
            else
                console.log(id + ' 完全安装了依赖项，共计 ' + cn);
            fireFactory(id, factory);
        }
        else {
            console.log(id + ' 有依赖项尚未安装，计 ' + (dn - cn) + '/' + dn);
            // 放入检测队列，待 checkDeps() 处理
            loadings.unshift(id);
        }
        checkDeps(id + ' 发起依赖检测');
    };

    /**
     * 定义模块
     * @param {string} name - 暂时无实际意义，给开发人员自己看而已
     * @param {Array<string>} deps - 依赖项ID的列表
     * @param {Function} factory - 模块工厂回调函数
     */
    $.define = function (name, deps, factory) {
        // define 本质上就是 require
        var id = getCurrentScript();
        console.log('【定义模块】：name=' + name + ', file=' + id);
        $.require(deps, factory, id);
    };

    function checkDeps(msg) {
        for (var i = loadings.length, id; id = loadings[--i]; i >= 0) {
            //检测此JS模块的依赖是否都已安装完毕,是则安装自身
            var obj = modules[id],
                deps = obj.deps,
                allLoaded = true;
            for (var key in deps) {
                if (Object.prototype.hasOwnProperty.call(deps, key) && modules[key].state !== STATE_LOADED) {
                    allLoaded = false;
                    break;
                }
            }

            if (allLoaded && obj.state !== STATE_LOADED) {
                console.log('模块加载成功：', obj.id);
                loadings.splice(i, 1); //必须先移除再安装，防止在IE下DOM树建完后手动刷新页面，会多次执行它
                fireFactory(obj.id, obj.factory);
                checkDeps(obj.id + ' 已安装成功,但再执行一次');//如果成功,则再执行一次,以防有些模块就差本模块没有安装好
            }
        }
    }

    /**
     * @summary 安装模块#id
     * @description 请求模块从modules对象取得依赖列表中的各模块的返回值，执行factory, 完成模块的安装
     * @param {String} id  模块ID
     * @param {Function} factory 模块工厂
     * @api private
     */
    function fireFactory(id, factory) {
        var mod = modules[id];
        factory();
/*
        var deps = mod.deps;
        var args = [];
        // 取各依赖项的导出值
        for (var key in deps) {
            if (deps.hasOwnProperty(key)) {
                args.push(modules[key].exports);
            }
        }
        var ret = factory.apply(window, args);
        if (ret !== void 0) {
            mod.exports = ret;  // 本模块导出值
            console.log(id + '模块导出值：', ret);
        }
*/
        mod.state = STATE_LOADED;
        //return ret;
    }

    function getCurrentScript(base) {
        // 参考 https://github.com/samyk/jiagra/blob/master/jiagra.js
        var stack;
        try {
            a.b.c(); //强制报错,以便捕获e.stack
        } catch (e) { //safari的错误对象只有line,sourceId,sourceURL
            stack = e.stack;
            if (!stack && window.opera) {
                //opera 9没有e.stack,但有e.Backtrace,但不能直接取得,需要对e对象转字符串进行抽取
                stack = (String(e).match(/of linked script \S+/g) || []).join(" ");
            }
        }
        if (stack) {
            stack = stack.split(/[@ ]/g).pop(); //取得最后一行,最后一个空格或@之后的部分
            stack = stack[0] === "(" ? stack.slice(1, -1) : stack.replace(/\s/, ""); //去掉换行符
            return stack.replace(/(:\d+)?:\d+$/i, ""); //去掉行号与或许存在的出错字符起始位置
        }
        // else {
        //     console.log('NO Stack!');
        // }
        var nodes = (base ? document : head).getElementsByTagName("script"); //只在head标签中寻找
        for (var i = nodes.length, node; node = nodes[--i];) {
            if ((base || node.className === MODULE_CLASS) && node.readyState === "interactive") {
                return node.className = node.src;  // 替换掉class，防止以后被误伤
            }
        }

        return $.slice(document.scripts).pop().src;
    }

    $._getCurrentScript = getCurrentScript;

    //</editor-fold>

})();
