$.define('lang_ext', ['lang_fix.js'], function () {

    $.bind = (function (bind) {
        return {
            bind: bind.bind(bind),
            call: bind.bind(bind.call),
            apply: bind.bind(bind.apply)
        }
    })(Function.prototype.bind);


    /**
     * 函数柯里化
     * @param fn
     * @returns {*}
     * 用法：

     function sum(a,b,c) {
        return a+b+c;
     }

     var r = curry(sum)(1)(2,3);
     console.log(r); // 6

     */
    $.curry = function (fn) {
        function inner(len, args) {
            if (len === 0) {
                return fn.apply(null, args);
            }
            return function () {
                return inner(len - arguments.length, args.concat([].slice.apply(arguments)));
            }
        }

        return inner(fn.length, []);
    };


    function getPureEmptyObjectIE() {
        var doc = new ActiveXObject('htmlfile');
        doc.write('<script><\/script>');
        doc.close();
        var obj = doc.parentWindow.Object;
        if (!obj || obj === Object) {
            return;
        }

        var name, names = ['constructor', 'hasOwnProperty', 'isPrototypeOf',
            'propertyIsEnumerable', 'toLocaleString', 'toString', 'valueOf'];
        while (name = names.pop())
            delete obj.prototype[name];
        return obj;
    }


    try {
        $.pureEmptyObject = Object.create(null);
    }
    catch (ex) {
        $.pureEmptyObject = getPureEmptyObjectIE();
    }

    $._ = $.pureEmptyObject;

    /**
     * 函数参数补足
     * @param {Function} fn
     * @returns {Function}
     *
     * 用法举例：

     function sum(a, b, c, d) {
         return '' + a + ',' + b + ',' + c + ',' + d;
     }

     var fn = $.partial(sum, 1, $._, 2, $._);
     var s = fn(3, 4);  // '1,3,2,4'
     s = fn(3);  // '1,3,2,undefined'

     */
    $.partial = function (fn) {
        if (arguments.length === 1) {
            return fn;
        }
        else {
            // 先行一次性绑定的实参，包含占位符 _
            var argsBound = [].slice.call(arguments, 1);
            return function () {
                // fn 每次调用时复制一份完整的实参列表！以免稍后修改了同一份 argsBound
                var argsPerCall = argsBound.concat();
                var moreArgs = arguments;   // fn 每次实际执行时提供的更多实参
                var k = 0;
                // 用更多的实参去替换 argsBound 里的占位符 _
                argsPerCall.forEach(function (a, i) {
                    if (a === $._)
                        argsPerCall[i] = moreArgs[k++];
                });
                return fn.apply(null, argsPerCall);
            }
        }
    };


    $.equal = function (a, b) {
        var type = $.type(a);
        if (type !== $.type(b))
            return false;

        switch (type) {
            case 'Array':
                return equalArray(a, b);
                break;
            default:
                return a == b;
        }

        function equalArray(a, b) {
            if (a.length !== b.length)
                return false;
            for (var i = 0; i < a.length; ++i) {
                if (!$.equal(a[i], b[i]))
                    return false;
            }
            return true;
        }
    };

    return $;
});