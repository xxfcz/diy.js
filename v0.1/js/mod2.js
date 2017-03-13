/**
 * Created by Administrator on 2017/3/13.
 */

$.define('mod2', ['http://localhost:63342/diy.js/v0.1/js/mod1.js'], function (ret) {
    return '模块1的返回值："' + ret + '"；模块2自己的返回值mod2';
});
