/**
 *  call this function on document ready
 */
function initDisplayTypeOverride() {
  var fileExceptions = [ 'html', 'php' ];
  // Change out for your display type
  var displayTypes = {
    'pages': 'Pages',
    'interior': 'Interior', // only one really used
    'home': 'Home',

    //not used by default but if you have logic that needs other types add them here
    'sidebar': 'InteriorSidebar',
    'fullwidth': 'Full',
  };


  $('a').each(function() {
    let href = $(this).attr('href');

    let parsed = parseURL(href);
    var validUrl = href && href.length > 0 && href[ 0 ] !== '#';
    if (!validUrl) {
      console.log('not valid' + href);
      return true;
    }

    let match = href.match(/\.([a-z]{3,4})$/);
    if (( match !== null && fileExceptions.indexOf(match[ 1 ]) === -1 ) || href.indexOf('http') === 0 || href.indexOf('javascript') === 0) {
      if (href.indexOf('javascript') === 0) {
        return true;
      }
      $(this).addClass('external');
    } else {
      // Check pages and other things like layouts with _rd that should be skipped.
      // We assume the display type is set in backend
      // console.log(href);
      if (href.indexOf('pages\/') === 0 ||
          href.indexOf('src=pages') > 0 ||
          href.match(/_rd($|&)/) > 0
      ) {
        return true;
      } else if (parsed.protocol.indexOf('http') === 0) {
        // add the interior display type.
        $(this).attr('href', appendDisplayType(href, 'interior'));
      }


    }

  });

  $('form').each(function(idx, form) {

    var formDisplayType = displayTypes['interior'];

    if (form.method === 'post') {
      var joinchar = ( form.action.indexOf('?') > -1 ) ? '&' : '?';

      form.action = form.action + joinchar + 'displaytype=' + formDisplayType;
      console.log('added form action ' + form.action);
    } else {
      if (form.elements.displaytype == undefined) {
        var dthidden = document.createElement('input');
        dthidden.type = 'hidden';
        dthidden.value = formDisplayType;
        dthidden.name = 'displaytype';
        form.appendChild(dthidden);
      }
    }

  });

  function appendDisplayType(url, displaytype) {
    if (typeof displayTypes[ displaytype ] !== 'undefined') {
      displaytype = displayTypes[ displaytype ];
    }
    if (url && url.indexOf('displaytype') < 0 && url.indexOf('http') !== 0 && url.indexOf('#') < 0 && url.indexOf('javascript') !== 0) {
      var joinchar = ( url.indexOf('?') > -1 ) ? '&' : '?';
      url += joinchar + 'displaytype=' + displaytype;
    }
    return url;
  }

  function parseURL(url) {
    var parser = document.createElement('a'),
        searchObject = {},
        queries, split, i;
    // Let the browser do the work
    parser.href = url;
    // Convert query string to object
    queries = parser.search.replace(/^\?/, '').split('&');
    for (i = 0; i < queries.length; i++) {
      split = queries[ i ].split('=');
      searchObject[ split[ 0 ] ] = split[ 1 ];
    }
    return {
      protocol: parser.protocol,
      host: parser.host,
      hostname: parser.hostname,
      port: parser.port,
      pathname: parser.pathname,
      search: parser.search,
      searchObject: searchObject,
      hash: parser.hash,
    };
  }

}