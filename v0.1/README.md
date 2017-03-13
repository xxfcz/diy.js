# 核心模块

此diy.js框架基本上是按照司徒正美的《JavaScript框架设计》一书逐步打造。第一个模块是种子模块，也叫核心模块。

命名空间
======

使用IIEF方式定义命名空间$：

    (function () {
    
        var $ = window.$;
        if (typeof $ === 'undefined')
            $ = window.$ = {};
    
    })();

$是个好东西，大家都喜欢:-)。

关于$的无冲突处理后面再实现了。


对象扩展机制
==========

即 extend()或 mix()函数，用于对已有对象扩展新功能。简单的实现为：

    function extend(o) {
        for (var i = 1; i < arguments.length; i++) {
            var source = arguments[i];
            for (var prop in source) o[prop] = source[prop];
        }
        return o;
    };


但是，IE6-8 的 for-in 循环有个问题，如果自定义对象的属性名称是 toString、valueOf 等特殊名字，会被忽略掉。见于 for-in.html。

对于这种情况，需要打个补丁，把特殊名称的属性逐一显式地复制过去。

extend()的完整实现见于 lib/core.js 的 `$.extend()` 。注意，我借用了 Nicholas C. Zakas 《Professional JavaScript for Web Developers》（中译名：JavaScript高级程序设计）中的实现。

