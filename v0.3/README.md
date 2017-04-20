# 语言模块

主要处理语言缺陷修复及标准化（ES5、ES6、ES7等等）。

# Number

* Number#toFixed()要四舍五入。IE6-8违例。

# Array

* Array#unshift() 返回数组长度。IE6-7违例。
* Array#splice() 第2个参数默认值是数组长度。IE6-8违例。
* shims for ES5 Array# indexOf, lastIndexOf, forEach, every, filter, some, map, reduce, reduceRight

# Function

* Function#bind()。IE8-没有实现。

bind()的基本用途可以这样说：

假设原来在对象 a 上定义有一函数f(x,y,z)，现在想对另一对象 b 上执行f，并预置参数x为x0，于是令

    var g = f.bind(b, x0);

希望以后执行
    
    g(y, z);

时，相当于执行

    b.f(x0, y, z);

的效果。

可以看出，这是 apply/call 的增强版。
    

手写 bind() 的最简实现：

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



但是，若要把 `bind3()` 用作构造函数，还需加上继承关系（采用原型式继承）：

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


当然，这样仍然有一些缺陷。更完整的实现参见