# 这是diy.js框架的第零步。

IE6-9都没有 console，需要补一个。

首先想到的是使用第三方的库，例如 [fauxconsole](https://github.com/csanquer/fauxconsole) 。编写一个测试页，fauxconsole.html，结果报错：

    Uncaught ReferenceError: show is not defined
      at Object.log (fauxconsole.js:51)
      at fauxconsole.html?_ijt=6fk83a6o5du03hj57pu92pi6d5:13

所以需要修理一下。