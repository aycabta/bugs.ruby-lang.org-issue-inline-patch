// ==UserScript==
// @name       bugs.ruby-lang.org issue inline patch
// @namespace  http://aycabta.github.io/
// @version    0.1.1
// @include    /^https:\/\/bugs\.ruby-lang\.org\/issues\/\d+/
// @copyright  2016+, Code Ass
// ==/UserScript==

(function() {
    var container = null;

    var processResponse = function(that, downarrow) {
        var parser = new DOMParser();
        doc = parser.parseFromString(that.responseText, 'text/html');
        container = doc.getElementById('content'); // TODO: hook "View differences"
        container.style.minHeight = '0';
        var attachments = document.getElementsByClassName('attachments')[0];
        var link = document.createElement('link');
        link.setAttribute('rel', 'stylesheet');
        link.setAttribute('media', 'screen');
        link.setAttribute('href', '/stylesheets/scm.css');
        var head = document.getElementsByTagName('head')[0];
        head.appendChild(link);
        attachments.appendChild(container);
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
        container.style.display = 'inline';
        this.addEventListener('click', hidePatch);
    }

    var hidePatch = function() {
        this.removeEventListener('click', hidePatch);
        container.style.display = 'none';
        this.addEventListener('click', displayPatch);
    }

    var links = document.querySelectorAll("a.icon-magnifier");
    console.log(links.length);
    for (var i = 0; i < links.length; i++) {
        link = links[i];
        console.log(link);
        if (link.href.match(/\d+\/.+\.(patch|diff)(\?|$)/)) {
            var downarrow = document.createElement('span');
            downarrow.classList.add('icon-only');
            downarrow.style.backgroundImage = 'url(../images/1downarrow.png)';
            var attachmentsInfo = link.parentNode;
            downarrow.addEventListener('click', firstClick);
            attachmentsInfo.appendChild(downarrow);
        }
    }
})();
