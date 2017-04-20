// https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/Function/bind

describe('bind >', function () {

    it('Creating a bound function', function () {
        (function () {
            this.x = 9;    // this refers to global "window" object here in the browser
            var module = {
                x: 81,
                getX: function () { return this.x; }
            };

            var r = module.getX(); // 81
            expect(r).toBe(81);

            var retrieveX = module.getX;
            r = retrieveX();    // returns 9 - The function gets invoked at the global scope
            expect(r).toBe(9);

            var boundGetX = retrieveX.bind(module);
            r = boundGetX(); // 81
            expect(r).toBe(81);
        })();
    });

    it('Partially applied functions', function () {
        function list() {
            return Array.prototype.slice.call(arguments);
        }

        var list1 = list(1, 2, 3); // [1, 2, 3]
        expect(list1).toEqual([1, 2, 3]);
        // Create a function with a preset leading argument
        var leadingThirtysevenList = list.bind(null, 37);

        var list2 = leadingThirtysevenList();
        // [37]
        expect(list2).toEqual([37]);

        var list3 = leadingThirtysevenList(1, 2, 3);
        // [37, 1, 2, 3]
        expect(list3).toEqual([37, 1, 2, 3]);
    });

    it('With setTimeout', function () {

        // Source code from MDN -----------------------------------

        function LateBloomer() {
            this.petalCount = Math.ceil(Math.random() * 12) + 1;
        }

        // Declare bloom after a delay of 1 second
        LateBloomer.prototype.bloom = function () {
            window.setTimeout(this.declare.bind(this), 1000);
        };

        LateBloomer.prototype.declare = function () {
            console.log('I am a beautiful flower with ' +
                this.petalCount + ' petals!');
        };

        // --------------------------------------------------------

        spyOn(LateBloomer.prototype, 'declare').and.callThrough();

        jasmine.clock().install();

        var flower = new LateBloomer();
        flower.bloom();

        jasmine.clock().tick(1001);
        jasmine.clock().uninstall();
        expect(LateBloomer.prototype.declare).toHaveBeenCalled();
    });

    describe('Bound functions used as constructors >', function () {

        function Point(x, y) {
            this.x = x;
            this.y = y;
        }

        Point.prototype.toString = function () {
            return this.x + ',' + this.y;
        };

        // not supported in the polyfill below,
        // works fine with native bind:
        var YAxisPoint = Point.bind(null, 0/*x*/);

        // 对于polyfill，要这样用
        /*
                var emptyObj = {};
                var YAxisPoint = Point.bind(emptyObj, 0/!*x*!/);
        */


        it('父类 Point 改写了方法 toString()', function () {
            var p = new Point(1, 2);
            var s = p.toString(); // '1,2'
            expect(s).toEqual('1,2');
        });

        it('绑定后的函数对象(子类)继承了原函数对象(父类)的属性/方法', function () {
            var axisPoint = new YAxisPoint(5);
            s = axisPoint.toString(); // '0,5'
            expect(s).toEqual('0,5');

            expect(axisPoint instanceof YAxisPoint).toBe(true); // true
        });

        it('使用 instanceof 检测子类的实例', function () {
            var axisPoint = new YAxisPoint(5);
            expect(axisPoint instanceof YAxisPoint).toBe(true); // true
        });


        it('子类的实例也是父类的实例', function () {
            var axisPoint = new YAxisPoint(5);
            expect(axisPoint instanceof Point).toBe(true); // true
        });

        it('父类的实例也是子类的实例!', function () {
            var p = new Point(17, 42);
            expect(p instanceof YAxisPoint).toBe(true); // true
        });

    });

    it('Bound functions do not have a prototype property', function () {
        function f() { }

        var g = f.bind({});
        expect(g.prototype).toBeUndefined();
    })
});
