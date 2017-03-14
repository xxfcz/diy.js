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

首先需要一个函数来动态加载指定的JavaScript文件：`loadJS(url, cb)`。其代码见 lib/core.js，测试页面是 load-js.html。


无依赖的情形
----------

接下来可以开始写最初的加载器主函数`$.require()`，只处理无依赖的情形。

测试页面是 require0.html，测试代码如下：

    $.require([], function () {
        console.log('我没有依赖任何人！');
    });

`$.require()`实现如下：

    $.require = function (list, factory) {
        // 用当前URL起个没什么意义的名字，但不能重复
        var loc = String(document.location).replace(/[?#].*/, "");
        var id = loc + '_cb' + setTimeout(function () { });

        if (factory)
            factory();
    };


仅一层依赖的情形
-------------

接下来处理有一层依赖的情形，测试页面是 require1.html，测试代码如下：

    <!-- require1.html -->
    
    $.require(['/diy.js/v0.1/js/script-1.js', '/diy.js/v0.1/js/script-2.js'], function () {
        console.log('我依赖于 script-1.js 和 script-2.js，但它们不再依赖任何人！');
    });

注意，为简单起见，目前只使用绝对路径来指定依赖项。

相应地，`$.require()`实现修改如下：

    $.require = function (list, factory) {
        var deps = {};
        var i;
        var dn = 0; // 需安装的依赖项个数
        var cn = 0; // 已安装的依赖项个数
        // 用当前URL起个没什么意义的名字，但不能重复
        var loc = String(document.location).replace(/[?#].*/, "");
        var id = loc + '_cb' + setTimeout(function () { });

        // 对每一个依赖项
        for (i = 0; i < list.length; ++i) {
            var url = loadExternal(list[i]);
            if (url) {
                ++dn;
                if (modules[url] && modules[url].state === STATE_LOADED) {
                    console.log('真快！已加载：', url);
                    ++cn;
                }
            }

            if (!deps[url]) {
                deps[url] = '肖雪峰';
            }

        }

        //记录本模块的加载情况与其他信息
        modules[id] = {
            id: id,
            factory: factory,
            deps: deps,
            state: STATE_LOADING
        };

        // 没有依赖项，或者此刻已经完全安装了所有依赖项？
        if (dn === 0 || cn === dn) {
            if (factory)
                factory();
        }
        else {
            console.log(id + ' 有依赖项尚未安装，计 ' + (dn - cn) + '/' + dn);
        }
    };
    

查看测试页面 require1.html，其输出如下：

    正准备加载： /diy.js/v0.1/js/script-1.js
    正准备加载： /diy.js/v0.1/js/script-2.js
    http://localhost:63342/diy.js/v0.1/require1.html_cb1 有依赖项尚未安装，计 2/2
    在 script-1.js 中，取到当前脚本文件为： http://localhost:63342/diy.js/v0.1/js/script-1.js
    已成功加载： /diy.js/v0.1/js/script-1.js
    在 script-2.js 中，取到当前脚本文件为： http://localhost:63342/diy.js/v0.1/js/script-2.js
    已成功加载： /diy.js/v0.1/js/script-2.js

可见，依赖项已全部加载，但没有执行页面中的回调函数。


检查依赖项
--------

现在需要及时检查各模块的各依赖项的安装状态，若某个模块的所有依赖项已经就绪，则可以安装模块自己了：

    function checkDeps(msg) {
        for (var i = loadings.length, id; id = loadings[--i]; i >= 0) {
            //检测此JS模块的依赖是否都已安装完毕,是则安装自身
            var obj = modules[id],
                deps = obj.deps,
                allLoaded = true;
            for (var key in deps) {
                if (Object.prototype.hasOwnProperty.call(deps, key) && modules[key].state !== STATE_LOADED) {
                    allLoaded = false;
                    break;
                }
            }

            if (allLoaded && obj.state !== STATE_LOADED) {
                console.log('模块加载成功：', obj.id);
                loadings.splice(i, 1); //必须先移除再安装，防止在IE下DOM树建完后手动刷新页面，会多次执行它
                fireFactory(obj.id, obj.factory);
                checkDeps(obj.id + ' 已安装成功,但再执行一次');//如果成功,则再执行一次,以防有些模块就差本模块没有安装好
            }
        }
    }


对 factory 函数的调用，抽取为新函数fireFactory()：

    function fireFactory(id, factory) {
        var mod = modules[id];
        factory();                  // 执行回调函数
        mod.state = STATE_LOADED;   // 标记该模块已安装成功
    }


安装模块自身
----------

为了安装模块自己，需要使用 define() 来定义模块。`$.define()`本质上就是`$.define()`，所以实现如下：

    $.define = function (name, deps, factory) {
        var id = getCurrentScript();
        console.log('【定义模块】：name=' + name + ', file=' + id);
        $.require(deps, factory, id);
    };

其中，为了确定当前脚本文件的URL，此处借用了 Samy Kamkar 所写的[jiagra](https://github.com/samyk/jiagra/)
中的`getCurrentScript()`函数。

另外，由于目前是用脚本完整的URL作为模块的id，所以在$.require()中引用模块时也要填写完整的URL。例如在测试页面 require2.html 中：

    <!-- require2.html -->
    
    // 暂时使用完整URL来引用模块
    $.require(['http://localhost:63342/diy.js/v0.1/js/mod1.js'], function () {
        console.log('【HTML页面】我依赖于 mod1.js，但它没有依赖项。');
    });

输出结果：

    正准备加载： http://localhost:63342/diy.js/v0.1/js/mod1.js
    http://localhost:63342/diy.js/v0.1/require1a.html_cb1 有依赖项尚未安装，计 1/1
    【定义模块】：name=mod1, file=http://localhost:63342/diy.js/v0.1/js/mod1.js
    http://localhost:63342/diy.js/v0.1/js/mod1.js 没有依赖项。
    模块加载成功： http://localhost:63342/diy.js/v0.1/require1a.html_cb1
    【HTML页面】我依赖于 mod1.js，但它没有依赖项。
    已成功加载： http://localhost:63342/diy.js/v0.1/js/mod1.js


测试多层依赖的表现
--------------

接下来增加依赖的层数，建立另一个模块 mod2.js，它依赖于 mod1.js：

    /* mod2.js */
    
    $.define('mod2', ['http://localhost:63342/diy.js/v0.1/js/mod1.js'], function () {
        return '我是模块2的返回值';
    });


测试页面 require3.html ：

    <!-- require3.html -->
    
    $.require(['http://localhost:63342/diy.js/v0.1/js/mod2.js'], function () {
        console.log('【HTML页面】我依赖 mod2.js，而它又依赖 mod1.js 。');
    });


输出结果：

    正准备加载： http://localhost:63342/diy.js/v0.1/js/mod2.js
    http://localhost:63342/diy.js/v0.1/require3.html_cb1 有依赖项尚未安装，计 1/1
    【定义模块】：name=mod2, file=http://localhost:63342/diy.js/v0.1/js/mod2.js
    正准备加载： http://localhost:63342/diy.js/v0.1/js/mod1.js
    http://localhost:63342/diy.js/v0.1/js/mod2.js 有依赖项尚未安装，计 1/1
    已成功加载： http://localhost:63342/diy.js/v0.1/js/mod2.js
    【定义模块】：name=mod1, file=http://localhost:63342/diy.js/v0.1/js/mod1.js
    http://localhost:63342/diy.js/v0.1/js/mod1.js 没有依赖项。
    模块加载成功： http://localhost:63342/diy.js/v0.1/js/mod2.js
    模块加载成功： http://localhost:63342/diy.js/v0.1/require3.html_cb1
    【HTML页面】我依赖 mod2.js，而它又依赖 mod1.js 。
    已成功加载： http://localhost:63342/diy.js/v0.1/js/mod1.js


取得依赖模块的返回值，作为回调函数的参数
--------------------------------

只要修改 fireFactory()：

    function fireFactory(id, factory) {
        var mod = modules[id];
        var deps = mod.deps;
        var args = [];
        // 取各依赖项的导出值
        for (var key in deps) {
            if (deps.hasOwnProperty(key)) {
                args.push(modules[key].exports);
            }
        }
        // 把依赖项的导出值作为本模块回调函数的参数
        var ret = factory.apply(window, args);
        if (ret !== void 0) {
            mod.exports = ret;  // 本模块导出值
            console.log(id + '模块导出值：', ret);
        }
        mod.state = STATE_LOADED;
        // 返回本模块的导出值
        return ret;
    }


再次查看测试页面 require3.html，可见输出中有：

    http://localhost:63342/diy.js/v0.1/js/mod1.js模块导出值： 我是模块1的返回值
    http://localhost:63342/diy.js/v0.1/js/mod2.js模块导出值： 我是模块2的返回值


模块 mod2 有依赖项，修改它的定义，把依赖项的结果用上（从回调函数的参数中取得）：

    $.define('mod2', ['http://localhost:63342/diy.js/v0.1/js/mod1.js'], function (ret) {
        return '模块1的返回值："' + ret + '"；模块2自己的返回值mod2';
    });

测试页面 require3.html 也把依赖项的结果用上：

    $.require(['http://localhost:63342/diy.js/v0.1/js/mod2.js'], function (ret) {
        console.log('【HTML页面】我依赖 mod2.js，而它又依赖 mod1.js。取到结果：' + ret);
    });

在页面的输出中可以看到：

    http://localhost:63342/diy.js/v0.1/js/mod1.js模块导出值： 我是模块1的返回值
    http://localhost:63342/diy.js/v0.1/js/mod2.js模块导出值： 模块1的返回值："我是模块1的返回值"；模块2自己的返回值mod2
    【HTML页面】我依赖 mod2.js，而它又依赖 mod1.js。取到结果：模块1的返回值："我是模块1的返回值"；模块2自己的返回值mod2


用不完全路径指定依赖项
------------------

希望可以使用以下方式指定依赖项：

1. js/mod1.js
2. /diy.js/js/mod2.js
3. ./mod2.js
4. ../../js/mod4.js

参见测试页面 require4.html：
    
    $.require(['/diy.js/v0.1/js/mod1.js', 'js/mod3.js'], function (ret1, ret2) {
        console.log('【HTML页面】使用不完全路径。结果：', ret1, ret2);
    });

以及测试页面 require5.html：

    $.require(['../v0.1/js/mod3.js', './js/subdir/mod4.js'], function (ret1, ret2) {
        console.log("【HTML页面】使用包含'..'、'.'的路径。结果：", ret1, ret2);
    });


对于不完整的（即没有 http://www.abc.com 这一部分的）URL，作如下附加处理：

1. 如果是'/'开头，表明是绝对路径，从当前脚本URL中提取协议和主机，加上去即可；
2. 如果不是'/'开头，表明是相对路径，从当前脚本URL中提取当前路径，再接上指定的相对路径即可；
3. 消解以上结果URL中的特殊符号'.'和'..'，结果就是正常的完全URL了。

详见 loadExternal() 的实现。


