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
    $.curry = function(fn) {
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


    $.pureEmptyObject = Object.create(null);

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


    $._ = undefined;

    try {
        $._ = Object.create(null);
    }
    catch (ex) {
        $._ = getPureEmptyObjectIE();
    }


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