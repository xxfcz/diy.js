/**
 * Created by 肖雪峰 on 2017/2/27.
 */

/**
 * You can use an alias other than 'console' (which is default, of course):
 *
 *      <script src="js/console.js" data-alias="myConsole" data-forced="true"></script>
 *
 *
 * You can also force the browser to use our own implementation, with the default name of 'console':
 *
 *      <script src="js/console.js" data-forced="true"></script>
 */

(function () {
    var script = getCurrentScriptNode();
    var consoleName = script.getAttribute('data-alias') || 'console';
    var forced = script.getAttribute('data-forced') == 'true';
    if (!forced && (typeof window[consoleName] !== 'undefined')) {
        return;
    }

    var logs = [];

    // log 收集器
    var collector = {
        log: function () {
            logs.push({
                type: 'log',
                text: [].slice.call(arguments).join(' ')
            });
        },
        info: function () {
            logs.push({
                type: 'info',
                text: [].slice.call(arguments).join(' ')
            });
        },
        warn: function () {
            logs.push({
                type: 'warn',
                text: [].slice.call(arguments).join(' ')
            });
        },
        error: function () {
            logs.push({
                type: 'error',
                text: [].slice.call(arguments).join(' ')
            });
        }
    };


    // 还没有 body
    if (!document.body) {
        // 使用暂存版console
        window[consoleName] = collector;
    }


    /*!
    * contentloaded.js
    *
    * Author: Diego Perini (diego.perini at gmail.com)
    * Summary: cross-browser wrapper for DOMContentLoaded
    * Updated: 20101020
    * License: MIT
    * Version: 1.2
    *
    * URL:
    * http://javascript.nwbox.com/ContentLoaded/
    * http://javascript.nwbox.com/ContentLoaded/MIT-LICENSE
    *
    */
    // @win window reference
    // @fn function reference
    function contentLoaded(win, fn) {

        var done = false, top = true,

            doc = win.document, root = doc.documentElement,

            add = doc.addEventListener ? 'addEventListener' : 'attachEvent',
            rem = doc.addEventListener ? 'removeEventListener' : 'detachEvent',
            pre = doc.addEventListener ? '' : 'on',

            init = function (e) {
                if (e.type == 'readystatechange' && doc.readyState != 'complete') return;
                (e.type == 'load' ? win : doc)[rem](pre + e.type, init, false);
                if (!done && (done = true)) fn.call(win, e.type || e);
            },

            poll = function () {
                try {
                    root.doScroll('left');
                } catch (e) {
                    setTimeout(poll, 50);
                    return;
                }
                init('poll');
            };

        if (doc.readyState == 'complete') fn.call(win, 'lazy');
        else {
            if (doc.createEventObject && root.doScroll) {
                try {
                    top = !win.frameElement;
                } catch (e) {
                }
                if (top) poll();
            }
            doc[add](pre + 'DOMContentLoaded', init, false);
            doc[add](pre + 'readystatechange', init, false);
            win[add](pre + 'load', init, false);
        }

    }

    var util = {};

    util.text = function (el, str) {
        var prop;
        if (typeof el.textContent !== 'undefined')
            prop = 'textContent';
        else
            prop = 'innerText';
        if (typeof str === 'undefined')
            return el[prop];
        el[prop] = str;
    };

    util.createElement = function (tag, attrs, text) {
        var element = document.createElement(tag);
        for (var attr in attrs) {
            if (attrs.hasOwnProperty(attr)) {
                element[attr] = attrs[attr];
            }
        }
        if (text) {
            util.text(element, text);
        }
        return element;
    };

    function getCurrentScriptNode() {
        var nodes = document.head.getElementsByTagName("script"); //只在head标签中寻找
        for (var i = nodes.length, node; node = nodes[--i];) {
            if (node.readyState === "interactive") {
                return node;
            }
        }
        return document.scripts[document.scripts.length - 1];
    }

    var setup = function () {
        var consoleRoot = util.createElement('div', { className: 'console' });
        document.body.appendChild(consoleRoot);

        // 工具条
        consoleRoot.appendChild(util.createElement('a', { href: 'javascript:' + consoleName + '.hide()' }, 'hide'));
        consoleRoot.appendChild(util.createElement('a', { href: 'javascript:' + consoleName + '.show()' }, 'show'));
        consoleRoot.appendChild(util.createElement('a', { href: 'javascript:' + consoleName + '.clear()' }, 'clear'));
        consoleRoot.appendChild(util.createElement('a', {
            href: 'javascript:' + consoleName + '.close()',
            className: 'close'
        }, 'close'));

        var consoleContent = util.createElement('div', { className: 'console-content' });
        consoleRoot.appendChild(consoleContent);


        var output = function (items, type) {
            var text = [].slice.call(items).join(' ');
            var el = util.createElement('div', { className: type }, text);
            consoleContent.appendChild(el);
            return el;
        };

        // 正本
        var console2 = {
            hide: function () {
                consoleContent.style.display = 'none';
            },

            show: function () {
                consoleContent.style.display = 'block';
            },

            clear: function () {
                util.text(consoleContent, '');
            },

            close: function () {
                if (confirm('Are you sure to close the console?'))
                    consoleRoot.style.display = 'none';
            },

            log: function () {
                return output(arguments, 'log');
            },

            info: function () {
                return output(arguments, 'info');
            },

            warn: function () {
                return output(arguments, 'warn');
            },

            error: function () {
                return output(arguments, 'error');
            }
        };

        window[consoleName] = console2;
        // flush logs
        if (logs.length > 0) {
            for (var i = 0; i < logs.length; ++i) {
                var log = logs[i];
                switch (log.type) {
                    case 'log':
                        console2.log(log.text);
                        break;
                    case 'info':
                        console2.info(log.text);
                        break;
                    case 'warn':
                        console2.warn(log.text);
                        break;
                    case 'error':
                        console2.error(log.text);
                        break;
                    // TODO: 有没有嗅到 bad smell?
                    default:
                        break;
                }
            }
        }
    };

    contentLoaded(window, setup);
})();
