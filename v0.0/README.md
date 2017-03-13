# 这是diy.js前端框架的第零步。

在这一步中，将对较低版本的IE提供三个基础构件/工具：

1. console
2. utest
3. JSON


console
=======

IE6-9 都没有`console`，需要补一个。

首先想到的是使用第三方的库，例如 [fauxconsole](https://github.com/csanquer/fauxconsole) 。
编写一个测试页，fauxconsole.html，注意到要用 `console1` 而非 `console`。结果报错：

    Uncaught ReferenceError: show is not defined
      at Object.log (fauxconsole.js:51)
      at fauxconsole.html?_ijt=6fk83a6o5du03hj57pu92pi6d5:13

把 `log()` 方法中的 `show()` 改为 `this.show()`，在标准浏览器中正常了。但是在IE6中，页面上仍然看不到输出。
用 DebugBar 查看DOM，根本没有添加节点上去。心中哼哼两声，这样的代码也拿得出手？好像自己整一个也不是难事儿。


信手拈来的模拟console：

    /* lib/console_v1.js */
    
    (function () {
        var consoleName = 'console1';  // use a name other than 'console' for debugging
    
        if (typeof window[consoleName] !== 'undefined')
            return;
    
        window[consoleName] = {
            log: function () {
                var text = [].slice.call(arguments).join(' ');
                var el = document.createElement('div');
                el.innerText = text;
                el.className = 'console log';
                document.body.appendChild(el);
                return el;
            }
        };
    
    })();


HTML页面：

    /* console_v1.html */
    
    <!DOCTYPE html>
    <html lang="en">
    <head>
        <meta charset="UTF-8">
        <meta name="viewport" content="initial-scale=1, maximum-scale=1, user-scalable=yes, width=device-width">
        <title>跨浏览器的 console </title>
        <script src="lib/console_v1.js"></script>
        <script>
            console1.log('在 head 中输出会报错！');
        </script>
    </head>
    <body>
    <div>请在IE6-9中查看此页面。</div>
    <script>
        console1.log('我也能用 console.log() 了！');
    </script>
    </body>
    </html>

body中的输出正常，但是head中的会报错：

    Uncaught TypeError: Cannot read property 'appendChild' of null
        at Object.log (console_v1.js:17)
        at console_v1.html?_ijt=4frs30crea1261c084qcf6v4vs:9


需要改进。思路是：若还没有 `document.body`，则挂一个收集器到 `window` 上，把 `log()` 的文本收集起来，
等到 `document` 就绪了再一并输出。详见 lib\console.js 和 console.html。


单元测试框架
==========

首先想到的自然是Jasmine，当然也可以用mocha，或者别的。

不过，试了一下Jasmine，发现它不支持IE6、7。详见JasminRunner.html。
又试了一下mocha，它甚至不支持IE8。详见mocha-runner.html。

失望之余，只有撸起袖子自己造轮子。

首先确定基本目标：
* 能 `assert()`；
* 兼容 IE6+
* 最好能输出失败用例所在文件名及行号。

对于assert()，套用之前 console 的实现即可。

对于文件名和行号，上网找到一段代码：

    function assert(predicate) {
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
    }


但是，IE6-9 的 Error 没有 stack 属性，所以得改：

    /* 文件：lib/assert.js */
    
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

结果请看 assert.html。


有了 assert()，接下来要稍微扩展一下，也算是个简陋的测试框架。实现代码位于 lib/utest.js、lib/utest.scss。有了它，以后就可以这样做实验了：


        var ut = new Utest();
        ut.print('描述性的一行文本。');
        ut.assert(true, '这一行通过了！');
        ut.assert(false, '这一行没通过！');


完整示例位于 utest.html。


JSON
====

IE6-7 没有 JSON 对象，我们的简陋测试框架如果要输出对象内容就不方便了，所以需要补上。

首先找到现成的 [JSON-js](https://github.com/douglascrockford/JSON-js)，试验后发现，它没有解决IE6-8 for-in 的问题。

关于 IE6-8 for-in 的问题，见于 for-in.html。简单来说，如果一个自定义对象是这样的：

    var o = {
        x: 1,
        y: 2,
        toString: '(x: 1, y: 2)'
    };

那么， `for(var i in o)` 将只会枚举出 x 和 y, 而不会遇见 toString 。

JSON-js 的测试，见于 json2.html，输出如下：

    JSON.stringify 结果：{"x":10,"y":20}

打了补丁后的 JSON-js 见于 lib/json2.js。测试文件是 json2_patched.html，输出如下：

    JSON.stringify 结果：{"x":10,"y":20,"toString":"(x: 1, y: 2)"}

