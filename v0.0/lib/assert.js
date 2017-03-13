/**
 * Created by Administrator on 2017/3/10.
 */

var v1 = {};
v1.assert = function (predicate) {
    if (predicate) {
        try {
            throw new Error();
        } catch (e) {
            var loc = e.stack.replace(/Error\n/).split(/\n/)[1].replace(/^\s+|\s+$/, "");
            console.info("assert passed:" + loc);
        }
    }
    else {
        try {
            throw new Error();
        } catch (e) {
            console.log("Stack:" + e.stack);
            loc = e.stack.replace(/Error\n/).split(/\n/)[1].replace(/^\s+|\s+$/, "");
            console.error("assert failed:" + loc);
        }
    }
};


var v2 = {};
v2.assert = function (predicate, msg) {
    try {
        throw new Error();
    } catch (e) {
        var loc = '';
        var r = predicate ? '通过' : '失败';
        // No stack property in IE9-
        if (e.stack) {
            loc = e.stack.replace(/Error\n/).split(/\n/)[1].replace(/^\s+|\s+$/, "");
        }
        if (predicate)
            console.info(r, msg, loc);
        else
            console.error(r, msg, loc);
    }
};
