/**
 * Created by Administrator on 2017/3/29.
 */

$.define('lang_fix', ['es5-shim.js', 'es5-sham.js'], function () {
    /**
     * Array#unshift()返回数组长度。IE6-7违例。
     */
    if ([].unshift(3) !== 1) {
        var _unshift = Array.prototype.unshift;
        Array.prototype.unshift = function () {
            _unshift.apply(this, arguments);
            return this.length;
        }
    }

    /**
     * Array#splice()第2个参数默认值是数组长度。IE6-8违例。
     */
    if ([1, 2, 3].splice(0) !== 3) {
        var _splice = Array.prototype.splice;
        Array.prototype.splice = function () {
            if (arguments.length == 1) {
                return _splice.call(this, arguments[0], this.length);
            }
            else {
                return _splice.apply(this, arguments);
            }
        }
    }

    /**
     * Number#toFixed()要四舍五入。IE6-8违例。
     * http://stackoverflow.com/questions/10470810/javascript-tofixed-bug-in-ie6
     */
    if (0.9.toFixed(0) !== '1') {
        Number.prototype.toFixed = function (n) {
            var power = Math.pow(10, n);
            var fixed = (Math.round(this * power) / power).toString();
            if (n == 0) return fixed;
            if (fixed.indexOf('.') < 0) fixed += '.';
            var padding = n + 1 - (fixed.length - fixed.indexOf('.'));
            for (var i = 0; i < padding; i++) fixed += '0';
            return fixed;
        };
    }

    /**
     * Date#getYear() 是 Date#getFullYear()-1900 的结果。IE6-8违例。
     */
    (function () {
        var d = new Date();
        if (d.getYear() + 1900 !== d.getFullYear()) {
            Date.prototype.getYear = function () {
                return this.getFullYear() - 1900;
            }
        }
    })();

});
