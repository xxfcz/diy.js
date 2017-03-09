# 这是diy.js框架的第零步。

IE6-9都没有 console，需要补一个。

首先想到的是使用第三方的库，例如 [fauxconsole](https://github.com/csanquer/fauxconsole) 。
编写一个测试页，fauxconsole.html，注意到要用 console1 而非 console。结果报错：

    Uncaught ReferenceError: show is not defined
      at Object.log (fauxconsole.js:51)
      at fauxconsole.html?_ijt=6fk83a6o5du03hj57pu92pi6d5:13

把 log() 方法中的 show() 改为 this.show()，在标准浏览器中正常了。但是在IE6中，页面上仍然看不到输出。
用 DebugBar 查看DOM，根本没有添加节点上去。心中哼哼两声，这样的代码也拿得出手？好像自己整一个也不是难事儿。


信手拈来的console.js：

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
    <div>请在IE6-8中查看此页面。</div>
    <script>
        console1.log('我也能用 console.log() 了！');
    </script>
    </body>
    </html>

body中的输出正常，但是head中的会报错：

    Uncaught TypeError: Cannot read property 'appendChild' of null
        at Object.log (console_v1.js:17)
        at console_v1.html?_ijt=4frs30crea1261c084qcf6v4vs:9


需要改进。思路是：若还没有 document.body，则挂一个收集器到 window 上，把 log() 的文本收集起来，
等到 document 就绪了再一并输出。详见 lib\console.js 和 console.html。
