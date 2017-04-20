$.define('lang_ext', ['lang_fix.js'], function () {

    $.bind = (function (bind) {
        return {
            bind: bind.bind(bind),
            call: bind.bind(bind.call),
            apply: bind.bind(bind.apply)
        }
    })(Function.prototype.bind);

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