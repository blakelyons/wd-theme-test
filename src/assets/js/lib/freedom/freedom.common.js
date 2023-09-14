/**
 * Global Freedom vars and Util functions
 * @param init
 * @preserve
 *
 */
var Freedom = Freedom || {
    'config': {},
    'notifications': [],
    'UI': {},
    'ajax': {},
    'view': {}
};

Freedom.getQueryParameters = function(queryString) {
    var queryString = typeof queryString == 'string' ? queryString : location.search.substring(1);
    var queryParameters = {},
        re = /([^&=]+)=([^&]*)/g, m;

    while (m = re.exec(queryString)) {
        queryParameters[decodeURIComponent(m[1])] = decodeURIComponent(m[2]);
    }

    return queryParameters;
};

// these are old and are only for existing code. do not use
function MakeTag(tag, val) {
    return IsValid(val) ? '&' + tag + '=' + val : '';
}

function MakeURL(url) {
    var u = location.href.split('#')[0].split('&')[0];
    var j = u.indexOf('.php');
    if(j > -1) {
        var i = url.split('&')[0].indexOf('.php');
        if(i > -1) url = url.substring(i + 4);
        url = u.substring(0, j + 4) + '?' + url;
        url = url.replace('?&', '?');
        return url.replace('??', '?');
    } else {
        //hurls are on if 'php' cant be found
        if ( isWhite() ){
            //base tag should take care of the prefix
            u = 'index.php?';
        }
    }
    var c = u.charAt(u.length - 1);
    if(c != '?' && c != '&') {
        u += (u.indexOf('?') == -1) ? '?' : '&';
    }
    u += url;
    return u.replace('/?', '?');
}

function IsValid(obj) {
    return(obj != null && typeof(obj) != 'undefined');
}


/**
 * Returns a function, that, as long as it continues to be invoked, will not
 * be triggered. The function will be called after it stops being called for
 * N milliseconds. If `immediate` is passed, trigger the function on the
 * leading edge, instead of the trailing.
 *
 * @param func
 * @param wait
 * @param immediate
 * @returns {function(...[*]=)}
 */
function debounce(func, wait, immediate) {
    var timeout;

    return function() {
        var context = this,
            args = arguments;

        var callNow = immediate && !timeout;

        clearTimeout(timeout);

        timeout = setTimeout(function() {

            timeout = null;

            if (!immediate) {
                func.apply(context, args);
            }
        }, wait);

        if (callNow) func.apply(context, args);
    }
}

function setCookie(e,t,o){var n=new Date;n.setTime(n.getTime()+24*o*60*60*1e3);var r="expires="+n.toUTCString();document.cookie=e+"="+t+";"+r+";path=/"}
function getCookie(e){for(var t=e+"=",o=document.cookie.split(";"),n=0;n<o.length;n++){for(var r=o[n];" "==r.charAt(0);)r=r.substring(1);if(0==r.indexOf(t))return r.substring(t.length,r.length)}return""}


function isOverflown(_a) {
    var clientWidth = _a.clientWidth, clientHeight = _a.clientHeight, scrollWidth = _a.scrollWidth, scrollHeight = _a.scrollHeight;
    return scrollHeight > clientHeight || scrollWidth > clientWidth;
}
function goToUrl(url) {
    window.location.href = url;
    return false;
}
