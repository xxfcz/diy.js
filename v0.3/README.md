# 语言模块

主要处理语言缺陷修复及标准化（ES5、ES6、ES7等等）。

# Number

* Number#toFixed()要四舍五入。IE6-8违例。

# Array

* Array#unshift() 返回数组长度。IE6-7违例。
* Array#splice() 第2个参数默认值是数组长度。IE6-8违例。
* shims for ES5 Array# indexOf, lastIndexOf, forEach, every, filter, some, map, reduce, reduceRight
