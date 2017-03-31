/**
 * Created by Administrator on 2017/3/29.
 */


$.define('tests', [], function () {

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
    }

    return run;
});