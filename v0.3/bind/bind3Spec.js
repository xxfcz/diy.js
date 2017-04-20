describe('bind3，我的实现 >', function () {

    it('Creating a bound function', function () {
        (function () {
            this.x = 9;    // this refers to global "window" object here in the browser
            var module = {
                x: 81,
                getX: function () { return this.x; },
                add: function (y) {
                    return this.x + y;
                }
            };

            var r = module.getX(); // 81
            expect(r).toBe(81);

            var retrieveX = module.getX;
            r = retrieveX();    // returns 9 - The function gets invoked at the global scope
            expect(r).toBe(9);

            var boundGetX = retrieveX.bind3(module);
            r = boundGetX(); // 81
            expect(r).toBe(81);

            var add = module.add.bind3(module);
            expect(add(9)).toBe(90);
        })();
    });

    it('Partially applied functions', function () {
        function list() {
            return Array.prototype.slice.call(arguments);
        }

        var list1 = list(1, 2, 3); // [1, 2, 3]
        expect(list1).toEqual([1, 2, 3]);
        // Create a function with a preset leading argument
        var leadingThirtysevenList = list.bind3(null, 37);

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
            window.setTimeout(this.declare.bind3(this), 1000);
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
        var YAxisPoint = Point.bind2(null, 0/*x*/);


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

        it('【父类的实例不再是子类的实例】', function () {
            var p = new Point(17, 42);
            expect(p instanceof YAxisPoint).toBe(false); // true
        });

    });

    it('Bound functions *DO* have a prototype property', function () {
        function f() { }

        var g = f.bind3({});
        expect(g.prototype).not.toBeUndefined();
    })

});