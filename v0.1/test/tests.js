var should = chai.should();
var expect = chai.expect;

describe('URL分析处理', function () {

    it('取URL中的根部分：http://www.1m1m.com', function () {
        var url = 'http://www.1m1m.com/test/path/to/somefile.html?q=李志明';
        var rgx = /^\w+:\/\/.*?(?=\/)/;
        var matches = rgx.exec(url);
        (matches.length).should.eql(1);
        matches[0].should.eql('http://www.1m1m.com');
    });

    describe('消解URL中的 . 和 ..', function () {
        it('一个 . 和 一个 .. ', function () {
            var url = 'http://www.1m1m.com/this/is/a/test/./../js/somejs.js';
            var ret = $._normalizeUrl(url);
            expect(ret).to.equal('http://www.1m1m.com/this/is/a/js/somejs.js')
        });
        it('三个 .. ', function () {
            var url = 'https://www.1m1m.com/this/is/a/../test/../../js/somejs.js';
            var ret = $._normalizeUrl(url);
            expect(ret).to.equal('https://www.1m1m.com/this/js/somejs.js')
        })

    });

});