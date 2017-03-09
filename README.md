# diy.js
Write a front-end JavaScript framework, step by step

首先明确一下基本目标：

1、仅为学习JavaScript框架的实现技术而写；

2、兼容性要求：IE6+，以及Chrome、FireFox、Opera的最新版。

3、分阶段逐步完成，每阶段都有产出。


然后要准备工具。IE的兼容性测试需要IE6以上各个版本，可以使用 IETester 或者 IECollection，
搭配 DebugBar。也可以使用 IE11，因为其内置的 F12开发人员工具可以仿真IE5、7-10。（为什么没有IE6？）

如果对它们不放心，也可以使用虚拟机中的XP，两台，一台保留IE8，另一台卸载IE8，从而恢复为IE6。

至于Chrome、FireFox、Opera，就直接装最新版了。