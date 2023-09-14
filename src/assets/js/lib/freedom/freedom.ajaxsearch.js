/**
 * toolkit to have ajax loaded freedom search results
 * @preserve
 *
 */
(function ($) {

    var typewatch = (function () {
        var timer = 0;
        return function (callback, ms) {
            clearTimeout(timer);
            timer = setTimeout(callback, ms);
        };
    })();

    function FreedomAjaxSearch(opts){

        var defaults = {
            resultsClass: 'ajaxResults',
            closeIcon: 'X',
            submitButton: '.searchButton',
            resultTarget: '.searchModule',//should be top level by default
            urlOptions: {
                search_id: 'search_input_interior', // find
                srctype: 'lister'
            },

            //callbacks
            beforeSend: function(){},
            afterLoad: function(){},
            afterClose: function(){}

        };
        opts = jQuery.extend(true, defaults, opts);

        opts.searchUrl = 'index.php?src=search&' + $.param(opts.urlOptions) + '&search_this=';
        this.each(function(){

            var $ajxinput = $(this);

            if( $ajxinput.data('ajxsearch') === true ){
                return;
            }
            $ajxinput.data('ajxsearch', true);

            $ajxinput.parent().append('<div id="ajxsearch-js" class="'+opts.resultsClass+'" />').append('<span class="ajxclose">'+opts.closeIcon+'</span>');
            $ajxinput.keyup(function () {

                typewatch(function () {
                    var keyterm = $ajxinput.val();
                    if ( keyterm !== '') {
                        var encodedKeyterm = encodeURIComponent(keyterm);
                        opts.beforeSend.call(this);

                        var targetedDiv = '';
                        if ( opts.resultTarget !== ''){
                            targetedDiv = ' ' + opts.resultTarget;
                        }
                        $('#ajxsearch-js').load( opts.searchUrl + encodedKeyterm + targetedDiv, function () {

                            $(this).slideDown(function () {
                                $('.ajxclose').fadeIn(function () {});
                                $(this).css('overflow', 'scroll');
                                opts.afterLoad.call(this);
                            })
                        });
                    }
                }, 200);
            });

            $('.ajxclose').click(function () {
                $(this).fadeOut(function () {
                    $('#ajxsearch-js').fadeOut('fast');
                    opts.afterClose.call(this, $ajxinput);
                });
            });

        });// end each
    }// end FreedomAjaxSearch


    $.fn.freedomAjaxSearch = FreedomAjaxSearch;

})(jQuery);