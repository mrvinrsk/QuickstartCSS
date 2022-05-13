$(function () {
    /* Sidenav */
    let aside = document.querySelector('aside ul');
    document.querySelectorAll('div.content').forEach((content) => {
        if (content.id !== null && content.id !== '') {
            if (!content.id.startsWith('noaside_')) {
                let heading = content.querySelector('h4');
                aside.innerHTML += `<li class="content-link"><a href="#${content.id}">${heading.innerText}</a></li>`;
            }
        }

        // check if content is the last one
        if (content.nextElementSibling !== null) {
            content.outerHTML += '<hr/>';
        }
    });

    $.fn.isInViewport = function () {
        var elementTop = $(this).offset().top;
        var elementBottom = elementTop + $(this).outerHeight();

        var viewportTop = $(window).scrollTop();
        var viewportBottom = viewportTop + $(window).height();

        return elementBottom > viewportTop && elementTop < viewportBottom;
    };

    function fallbackCopyTextToClipboard(text) {
        var textArea = document.createElement("textarea");
        textArea.value = text;

        // Avoid scrolling to bottom
        textArea.style.top = "0";
        textArea.style.left = "0";
        textArea.style.position = "fixed";

        document.body.appendChild(textArea);
        textArea.focus();
        textArea.select();

        try {
            var successful = document.execCommand('copy');
            var msg = successful ? 'successful' : 'unsuccessful';
            console.log('Fallback: Copying text command was ' + msg);
        } catch (err) {
            console.error('Fallback: Oops, unable to copy', err);
        }

        document.body.removeChild(textArea);
    }

    function copyTextToClipboard(text) {
        if (!navigator.clipboard) {
            fallbackCopyTextToClipboard(text);
            return;
        }
        navigator.clipboard.writeText(text).then(function () {
            console.log('Async: Copying to clipboard was successful!');
        }, function (err) {
            console.error('Async: Could not copy text: ', err);
        });
    }

    const updateCurrentLink = () => {
        document.querySelectorAll('.content-link').forEach((link) => {
            if ($(link.querySelector('a').hash).isInViewport()) {
                link.classList.add('active');

            } else {
                link.classList.remove('active');
            }
        });
    }

    updateCurrentLink();
    document.addEventListener('scroll', () => {
        updateCurrentLink();
    });

    document.querySelectorAll('[data-js]').forEach((element) => {
        element.querySelector('.header').innerHTML += `<p><b>Attention:</b> This style may need JavaScript for <i>${element.dataset.js}</i>, if you want that then, <a href="#js-notice">please, include the <i>quickstart.js</i> file in your HTML</a>.</p>`;
    });

    document.querySelectorAll('[data-comment]').forEach((element) => {
        element.querySelector('.header').innerHTML += `<p style="margin-top: .5em;"><b>Comment:</b> ${element.dataset.comment}</p>`;
    });


    $(document).on('click', 'a[href^="#"]', function (event) {
        event.preventDefault();

        $('html, body').animate({
            scrollTop: $($.attr(this, 'href')).offset().top - 50
        }, 500);
    });

    document.querySelectorAll('.content .header h4').forEach(function (el) {
        el.addEventListener('mouseover', function () {
            if (el.querySelector('.hov') === null) {
                const copy = document.createElement('span');
                copy.classList.add('hov');
                copy.innerHTML = '#';
                copy.onclick = () => {
                    copyTextToClipboard(location.host + window.location.pathname + '#' + el.parentNode.parentNode.id);
                    toast('Copied anchor to clipboard', 'The anchor-link has been copied to your clipboard, now you can share it with your friends.');
                }

                el.appendChild(copy);
            }
        });

        el.addEventListener('mouseout', function () {
            if (el.querySelector('.hov') !== null) {
                el.removeChild(el.querySelector('.hov'));
            }
        });
    });
});

$(function () {
    getWrapper();
});

let wrapper = null;

function getWrapper() {
    const wrapperEle = document.createElement('div');
    wrapperEle.classList.add('toast_wrapper');

    if (document.querySelector('.toast_wrapper') !== null) {
        wrapper = document.querySelector('.toast_wrapper');
    } else {
        document.body.appendChild(wrapperEle);
        wrapper = wrapperEle;
    }
}

function toast(title, description, stay = 5000) {
    const toast = document.createElement('div');
    toast.classList.add('toast');

    const titleEl = document.createElement('h4');
    titleEl.textContent = title;
    titleEl.classList.add('toast_title');

    const descriptionEl = document.createElement('p');
    descriptionEl.textContent = description;
    descriptionEl.classList.add('toast_description');


    toast.appendChild(titleEl);
    toast.appendChild(descriptionEl);

    wrapper.appendChild(toast);

    setTimeout(() => {
        $(toast).animate({
            opacity: 0,
            right: '-100%'
        }, 500, function () {
            wrapper.removeChild(toast);
        });
    }, stay);
}