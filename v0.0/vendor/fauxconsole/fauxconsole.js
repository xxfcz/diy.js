/*! fauxconsole originally by by Chris Heilmann (http://wait-till-i.com);
 * forked by Charles Sanquer (https://github.com/csanquer/fauxconsole);
 * re-written by Roland Hummel (https://github.com/defaude/fauxconsole).
 */
(function (window) {
    "use strict"; // mostly for me and my IDE :)

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

    var consoleDiv, consoleContent;
    
    //check existence of console
    if (true ) {
        consoleDiv = createElement('div', { className: 'fauxconsole' });

        consoleDiv.appendChild(createElement('a', { href: 'javascript:console.hide()' }, 'hide'));
        consoleDiv.appendChild(createElement('a', { href: 'javascript:console.show()' }, 'show'));
        consoleDiv.appendChild(createElement('a', { href: 'javascript:console.clear()' }, 'clear'));

        consoleContent = createElement('pre');
        consoleDiv.appendChild(consoleContent);

        (document.body || document.documentElement).appendChild(consoleDiv);

        window.console1 = {
            show: function show() { 
                consoleDiv.style.display = 'block'; 
            },
            hide: function hide() { 
                consoleDiv.style.display = 'none'; 
            },
            clear: function clear () {
                consoleContent.innerHTML = '';
            },
            log: function log() {
                for (var i = 0, l = arguments.length; i < l; ++i) {
                    consoleContent.innerHTML += '<br/><br/>' + arguments[i];
                }
                show();
            }
            
        };
        window.console1.hide();
    }
    
}(window));
