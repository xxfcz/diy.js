/**
 * Created by Administrator on 2017/3/9.
 */

(function () {
    var consoleName = 'console1';   // use a name other than 'console' for debugging

    if (typeof window[consoleName] !== 'undefined')
        return;

    window[consoleName] = {
        log: function () {
            var text = [].slice.call(arguments).join(' ');
            var el = document.createElement('div');
            el.innerText = text;
            el.className = 'console log';
            document.body.appendChild(el);
            return el;
        }
    };

})();