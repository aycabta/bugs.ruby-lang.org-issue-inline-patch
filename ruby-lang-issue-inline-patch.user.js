// ==UserScript==
// @name       bugs.ruby-lang.org issue inline patch
// @namespace  http://aycabta.github.io/
// @version    0.1.2
// @include    /^https:\/\/bugs\.ruby-lang\.org\/issues\/\d+/
// @copyright  2016+, Code Ass
// ==/UserScript==

(function() {
    var processResponse = function(response, downarrow) {
        var parser = new DOMParser();
        doc = parser.parseFromString(response.responseText, 'text/html');
        var container = doc.getElementById('content'); // TODO: hook "View differences"
        container.classList.add('patch-container');
        container.style.minHeight = '0';
        var link = document.createElement('link');
        link.setAttribute('rel', 'stylesheet');
        link.setAttribute('media', 'screen');
        link.setAttribute('href', '/stylesheets/scm.css');
        var head = document.getElementsByTagName('head')[0];
        head.appendChild(link);
        downarrow.parentNode.appendChild(container);
        downarrow.style.backgroundImage = 'url(../images/1downarrow.png)';
        downarrow.addEventListener('click', hidePatch);
    }

    var loadPatch = function(downarrow) {
        var xhr = new XMLHttpRequest();
        xhr.addEventListener('load', function() { processResponse(this, downarrow); });
        xhr.open('GET', link.href, true);
        xhr.send();
    }

    var firstClick = function() {
        this.removeEventListener('click', firstClick);
        loadPatch(this);
    }

    var displayPatch = function() {
        this.removeEventListener('click', displayPatch);
        this.parentNode.getElementsByClassName('patch-container')[0].style.display = 'inline';
        this.addEventListener('click', hidePatch);
    }

    var hidePatch = function() {
        this.removeEventListener('click', hidePatch);
        this.parentNode.getElementsByClassName('patch-container')[0].style.display = 'none';
        this.addEventListener('click', displayPatch);
    }

    var links = document.querySelectorAll("a.icon-magnifier");
    for (var i = 0; i < links.length; i++) {
        link = links[i];
        if (link.href.match(/\d+\/.+\.(patch|diff)(\?|$)/)) {
            var downarrow = document.createElement('span');
            downarrow.classList.add('icon-only');
            downarrow.style.backgroundImage = 'url(../images/arrow_expanded.png)';
            var attachmentsInfo = link.parentNode;
            downarrow.addEventListener('click', firstClick);
            attachmentsInfo.appendChild(downarrow);
        }
    }
})();
