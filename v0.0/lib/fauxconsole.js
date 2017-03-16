/*! fauxconsole originally by by Chris Heilmann (http://wait-till-i.com);
 * forked by Charles Sanquer (https://github.com/csanquer/fauxconsole);
 * re-written by Roland Hummel (https://github.com/defaude/fauxconsole).
 */
(function () {
    var consoleName = 'console1';   // for the convenience of debugging

    // --- some tools ---
    function createElement(tagName, attributes, innerHTML) {
        var element = document.createElement(tagName);
        for (var attr in attributes) {
            if (attributes.hasOwnProperty(attr)) {
                element[attr] = attributes[attr];
            }
        }
        if (innerHTML) {
            element.innerHTML = innerHTML;
        }
        return element;
    }

    // @w	window reference
    // @fn	function reference
    function IEContentLoaded(w, fn) {
        var d = w.document, done = false,
            // only fire once
            init = function () {
                if (!done) {
                    done = true;
                    fn();
                }
            };
        // polling for no errors
        (function () {
            try {
                // throws errors until after ondocumentready
                d.documentElement.doScroll('left');
            } catch (e) {
                setTimeout(arguments.callee, 50);
                return;
            }
            // no errors, fire
            init();
        })();
        // trying to always fire before onload
        d.onreadystatechange = function () {
            if (d.readyState == 'complete') {
                d.onreadystatechange = null;
                init();
            }
        };
    }

    function setup() {
        var consoleDiv, consoleContent;

        //check existence of console
        if (typeof window[consoleName] === 'undefined') {
            consoleDiv = createElement('div', { className: 'fauxconsole' });

            consoleDiv.appendChild(createElement('a', { href: 'javascript:' + consoleName + '.hide()' }, 'hide'));
            consoleDiv.appendChild(createElement('a', { href: 'javascript:' + consoleName + '.show()' }, 'show'));
            consoleDiv.appendChild(createElement('a', { href: 'javascript:' + consoleName + '.clear()' }, 'clear'));

            consoleContent = createElement('pre');
            consoleDiv.appendChild(consoleContent);

            (document.body || document.documentElement).appendChild(consoleDiv);

            window[consoleName] = {
                show: function show() {
                    consoleDiv.style.display = 'block';
                },
                hide: function hide() {
                    consoleDiv.style.display = 'none';
                },
                clear: function clear() {
                    consoleContent.innerHTML = '';
                },
                log: function log() {
                    for (var i = 0, l = arguments.length; i < l; ++i) {
                        consoleContent.innerHTML += '<br/><br/>' + arguments[i];
                    }
                    this.show();
                }

            };
        }
    }


    if (document.addEventListener) {
        document.addEventListener('DOMContentLoaded', setup);
    }
    else {
        IEContentLoaded(window, setup);
    }

}());
