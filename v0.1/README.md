# 这是diy.js框架的第零步。

IE6-9都没有 console，需要补一个。

首先想到的是使用第三方的库，例如 [fauxconsole](https://github.com/csanquer/fauxconsole) 。编写一个测试页，fauxconsole.html，结果报错：

    Uncaught ReferenceError: show is not defined
      at Object.log (fauxconsole.js:51)
      at fauxconsole.html?_ijt=6fk83a6o5du03hj57pu92pi6d5:13

把 log() 方法中的 show() 改为 this.show()，在标准浏览器中正常了。但是在IE6中，页面上仍然看不到输出。用 DebugBar 查看DOM，根本没有添加节点上去。心中哼哼两声，这样的代码也拿得出手？自己整一个也不是难事儿。




