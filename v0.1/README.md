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


类型判断
======

`typeof`、`instanceof`有严重缺陷，不宜拿来作为框架的基础。其典型缺陷如 typeof-instanceof.html 所示。主要有以下几点：

1. `typeof` 只能判断 number、boolean、string、function、object、undefined 这6种基本情形，不能对object进一步区分
（这种区分基本上可由 instanceof 完成，但如下文所述，也存在缺陷）。
2. 于是，`typeof` 会把 new Number() 、new String() 等判断为 `object`，这是正确的，但没有意义。
3. `typeof` 在某些浏览器中会误判：把&lt;embed>、&lt;object>、&lt;applet> 等 HTMLElement 类型的`object` 当成`function`。
4. `typeof` 会把 window.alert 等 `function` 判断为 `object`。
5. 在IE7－中，window、document 的 constructor 没有暴露出来，`typeof` 判断为undefined。
6. 在IE中，ActiveX 对象的 constructor 也没有暴露出来；而它们的方法会被 `typeof` 判断为object。
7. 目前各浏览器都实现了 document.all，但 `typeof` 却判断为 undefined。
8. 在IE8－中，instanceof 不认为 NodeList、HTMLCollection 等的实例是 Object。
9. 另外，在IE8－中，`window == document` 结果居然为 `true`。 


接下来，先对 $.isXXX() 系列函数挨个实现，如$.isNumber()、$.isNodeList()等等，再统一实现一个 $.type()，
详见 lib/core.js。测试页面是 isX-type.html。


DOM Ready
=========

这是 DOMContentLoaded 事件的别名。

目前采用的策略是：
1. 对于比较标准的浏览器，使用 DOMContentLoaded 事件；
2. 对于比较旧的IE，则使用 Diego Perini 发现的hack，见于 lib/core.js 中的`IEContentLoaded()`函数。

至于种子模块动态加载的情形，暂不处理了，以后再说。

实现代码见于 lib/core.js 的 `$.ready()` 。测试页面是 dom-ready.html。


模块加载器
========

首先需要一个函数来动态加载指定的JavaScript文件：`loadJS(url, cb)`。

然后需要能确定当前脚本文件的URL，此处借用 Samy Kamkar 所写的[jiagra](https://github.com/samyk/jiagra/)
中的`getCurrentScript()`函数。

接下来可以开始写加载器主函数`$.require()`：

