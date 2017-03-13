/**
 * Created by Administrator on 2017/3/1.
 */


var Utest = (function () {
    var EPS = 1e-6;

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

    util.html = function (el, str) {
        var prop;
        if (typeof el.innerHtml !== 'undefined')
            prop = 'innerHtml';
        else
            prop = 'textContent';
        if (typeof str === 'undefined')
            return el[prop];
        el[prop] = str;
    };


    function Utest(el) {
        var _div;
        _div = document.createElement('div');
        _div.className = 'utest';
        document.body.appendChild(_div);
        this._div = _div;
    }


    Utest.prototype.print = function () {
        var text = [].slice.call(arguments).join(' ');
        var el = document.createElement('div');
        el.className += ' log';
        util.text(el, text);
        this._div.appendChild(el);
        return el;
    };

    Utest.prototype.assert = function (predicate, msg) {
        var el, loc;
        try {
            throw new Error();
        } catch (e) {
            // loc = e.stack.replace(/Error\n/).split(/\n/)[1].replace(/^\s+|\s+$/, "");
            el = this.print(msg || (predicate ? '通过' : '失败'));
            el.className += predicate ? ' pass' : ' fail';
            if (!predicate && typeof e.stack !== 'undefined') {
                var stack = document.createElement('div');
                stack.style.textIndent = '2em';
                util.text(stack, e.stack);
                el.appendChild(stack);
            }
        }
    };

    Utest.EPS = EPS;

    return Utest;
})();

