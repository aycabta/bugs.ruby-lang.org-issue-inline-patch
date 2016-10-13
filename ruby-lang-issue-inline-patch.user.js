// ==UserScript==
// @name       bugs.ruby-lang.org issue inline patch
// @namespace  http://aycabta.github.io/
// @version    0.1.0
// @include    /^https:\/\/bugs\.ruby-lang\.org\/issues\/\d+/
// @copyright  2016+, Code Ass
// ==/UserScript==

(function() {
    var table = null;
    var downarrow = null;

    var processResponse = function() {
        var parser = new DOMParser();
        doc = parser.parseFromString(this.responseText, 'text/html');
        table = doc.getElementsByClassName('filecontent')[0];
        var attachments = document.getElementsByClassName('attachments')[0];
        var link = document.createElement('link');
        link.setAttribute('rel', 'stylesheet');
        link.setAttribute('media', 'screen');
        link.setAttribute('href', '/stylesheets/scm.css');
        var head = document.getElementsByTagName('head')[0];
        head.appendChild(link);
        attachments.appendChild(table);
        downarrow.addEventListener('click', hidePatch);
    }

    var loadPatch = function() {
        var xhr = new XMLHttpRequest();
        xhr.addEventListener('load', processResponse);
        xhr.open('GET', link.href, true);
        xhr.send();
    }

    var firstClick = function() {
        downarrow.removeEventListener('click', firstClick);
        loadPatch();
    }

    var displayPatch = function() {
        downarrow.removeEventListener('click', displayPatch);
        table.style.display = 'inline';
        downarrow.addEventListener('click', hidePatch);
    }

    var hidePatch = function() {
        downarrow.removeEventListener('click', hidePatch);
        table.style.display = 'none';
        downarrow.addEventListener('click', displayPatch);
    }

    var link = document.getElementsByClassName("icon-magnifier");
    if (link.length > 0) {
        link = link[0];
        if (link.href.match(/\d+\/.+\.(patch|diff)(\?|$)/)) {
            downarrow = document.createElement('span');
            downarrow.classList.add('icon-only');
            downarrow.style.backgroundImage = 'url(../images/1downarrow.png)';
            var attachmentsInfo = document.querySelector('div.attachments p');
            downarrow.addEventListener('click', firstClick);
            attachmentsInfo.appendChild(downarrow);
        }
    }
})();
