/**
 * Created by Administrator on 2017/4/19.
 */

Function.prototype.bind3 = function (oThis) {
    // 待绑定的原函数
    var fToBind = this;
    // 被绑定的参数
    var argsBound = Array.prototype.slice.call(arguments, 1);
    // 绑定后的函数
    var fBound = function () {
        // 绑定后的函数实际被调用时额外传递的参数
        var argsCalledWith = Array.prototype.slice.call(arguments);
        // 调用原函数需要传递的所有参数
        var args = argsBound.concat(argsCalledWith);
        // 实际执行原函数
        return fToBind.apply(oThis, args);
    };
    // 返回绑定后的函数
    return fBound;
};

Function.prototype.bind3 = function (oThis) {
    // 待绑定的原函数
    var fToBind = this;
    // 被绑定的参数
    var argsBound = Array.prototype.slice.call(arguments, 1);
    // 采用原型式继承用到的过渡类
    var F = function () { };
    // 绑定后的函数
    var fBound = function () {
        // 绑定后的函数实际被调用时额外传递的参数
        var argsCalledWith = Array.prototype.slice.call(arguments);
        // 调用原函数需要传递的所有参数
        var args = argsBound.concat(argsCalledWith);
        // 若当成构造函数来调用，则 this 指向实例自身，不用替换；否则要把 this 替换为绑定对象 oThis
        var self = this instanceof F ? this : oThis;
        // 实际执行原函数
        return fToBind.apply(self, args);
    };
    // 原型式继承：使 绑定后的函数 成为 原函数 的子类（经由F过渡）
    F.prototype = this.prototype;
    fBound.prototype = new F();
    fBound.prototype.constructor = fBound;
    // 返回绑定后的函数
    return fBound;
};
