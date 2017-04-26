/**
 * Created by Administrator on 2017/3/29.
 */


$.define('lang_bugs', [], function () {

    function run(ut) {
        ut.print('==== Array ====');
        ut.assert([].unshift(3) === 1, 'Array#unshift()返回数组长度');
        ut.assert([1, 2, 3].splice(0).length === 3, 'Array#splice()第2个参数默认值是数组长度');
        ut.assert(!!Array.isArray, 'Array.isArray() in ES5');

        function test_forEach() {
            var sum = 0, sum_indices = 0, arr = [1, 2, 3], arr2;
            arr.forEach(function (e, i, a) {
                sum += e;
                sum_indices += i;
                arr2 = a;
            });
            return sum === 6 && sum_indices === 3 && arr === arr2;
        }

        ut.assert(test_forEach, 'Array#forEach() in ES5');

        ut.assert(function () {
            return [0, 1, 2].indexOf(1) == 1;
        }, 'Array#indexOf() in ES5');

        ut.assert(!![].lastIndexOf, 'Array#lastIndexOf() in ES5');
        ut.assert(!![].every, 'Array#lastIndexOf() in ES5');
        ut.assert(!![].filter, 'Array#filter() in ES5');
        ut.assert(!![].some, 'Array#some() in ES5');
        ut.assert(!![].map, 'Array#map() in ES5');
        ut.assert(!![].reduce, 'Array#reduce() in ES5');
        ut.assert(!![].reduceRight, 'Array#reduceRight() in ES5');

        ut.print('==== Number ====');
        ut.assert(0.9.toFixed(0) === '1', 'Number#toFixed() 应该四舍五入');

        ut.print('==== Function ====');
        ut.assert(!!Function.prototype.bind, 'Function#bind() 有实现');
        if (Function.prototype.bind) {
            function f1(x, y, z) {
                return x + y + z;
            }

            var g = f1.bind({}, 1, 2);
            ut.assert(g(3) === 6, 'Function#bind() 可以绑定参数');

            function f2(n) {
                return this.x + n;
            }

            var obj = { x: 10 };
            g = f2.bind(obj);
            ut.assert(g(5) === 15, 'Function#bind() 可以绑定this和参数');
        }
        ut.assert(!!Object.create, 'Object#create() 有实现');
        if (typeof Object.create === 'function') (function () {
            var peo;
            try {
                peo = Object.create(null);
                ut.assert(typeof peo.toString === 'undefined', '纯空对象 无 toString 属性');
            }
            catch (ex) {
                ut.assert(false, '可以执行 Object.create(null)');
            }
        })();
    }

    return run;
});