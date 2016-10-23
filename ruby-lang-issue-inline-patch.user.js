// ==UserScript==
// @name       bugs.ruby-lang.org issue inline patch
// @namespace  http://aycabta.github.io/
// @version    0.1.4
// @description  Names and natures often agree.
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
        downarrow.parentNode.appendChild(container);
        downarrow.style.backgroundImage = 'url(../images/1downarrow.png)';
        downarrow.addEventListener('click', hidePatch);
    }

    var loadPatch = function(downarrow) {
        var xhr = new XMLHttpRequest();
        xhr.addEventListener('load', function() { processResponse(this, downarrow); });
        xhr.open('GET', downarrow.dataset.href, true);
        downarrow.style.backgroundImage = 'url(../images/loading.gif)';
        xhr.send();
        if (!document.getElementById('scm-css')) {
            var cssLink = document.createElement('link');
            cssLink.id = 'scm-css';
            cssLink.setAttribute('rel', 'stylesheet');
            cssLink.setAttribute('media', 'screen');
            cssLink.setAttribute('href', '/stylesheets/scm.css');
            var head = document.getElementsByTagName('head')[0];
            head.appendChild(cssLink);
        }
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

    document.getElementById('footer').style.height = '100vh';

    var images = ['../images/arrow_expanded.png', '../images/loading.gif', '../images/1downarrow.png'];
    var preloadImages = [];
    images.forEach(function(image) {
        var preImage = new Image();
        preImage.src = image;
        preloadImages.push(preImage);
    });

    var links = document.querySelectorAll("a.icon-magnifier");
    [].forEach.call(links, function(link) {
        if (link.href.match(/\d+\/.+\.(patch|diff|rb)(\?|$)/)) {
            var downarrow = document.createElement('span');
            downarrow.classList.add('icon-only');
            downarrow.style.backgroundImage = 'url(../images/arrow_expanded.png)';
            var attachmentsInfo = link.parentNode;
            downarrow.dataset.href = link.href;
            downarrow.addEventListener('click', firstClick);
            attachmentsInfo.appendChild(downarrow);
        }
    });
})();
