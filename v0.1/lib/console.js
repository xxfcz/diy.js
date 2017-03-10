/**
 * Created by Administrator on 2017/2/27.
 */

(function () {
    var consoleName = 'console';   // use a name other than 'console' for debugging

    if (typeof window[consoleName] !== 'undefined')
        return;

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
        error: function () {
            logs.push({
                type: 'error',
                text: [].slice.call(arguments).join(' ')
            });
        }
        // TODO: 有没有嗅到 bad smile?
    };

    // 正本
    var console2 = {
        log: function () {
            var text = [].slice.call(arguments).join(' ');
            var el = document.createElement('div');
            el.innerText = text;
            el.className = 'console log';
            document.body.appendChild(el);
            return el;
        },

        info: function () {
            var text = [].slice.call(arguments).join(' ');
            var el = document.createElement('div');
            el.innerText = text;
            el.className = 'console info';
            document.body.appendChild(el);
            return el;
        },
        error: function () {
            var text = [].slice.call(arguments).join(' ');
            var el = document.createElement('div');
            el.innerText = text;
            el.className = 'console error';
            document.body.appendChild(el);
            return el;
        }
        // TODO: 有没有嗅到 bad smile?
    };

    // 还没有 body
    if (!document.body) {
        // 使用暂存版console
        window[consoleName] = collector;
    }

    var setup = function () {
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
                    case 'error':
                        console2.error(log.text);
                        break;
                    // TODO: 有没有嗅到 bad smile?
                    default:
                        break;
                }
            }
        }
    };

    if (window.addEventListener)
        window.addEventListener('DOMContentLoaded', setup);
    else
        window.attachEvent('onload', setup);
})();