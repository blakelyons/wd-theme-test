function initSubMenusHovers() {

    var timeout;
    var $currentAnchor;
    var $currentSubmenu;
    var $originalAnchor;

    var $elements = $('.header-nav .header-mega-wrapper');
    var $anchors = $('.header-nav>li>a');
    $originalAnchor = $anchors.filter('.current');
    _setCurrentAnchor($originalAnchor);

    $anchors.off('mouseenter.menuItem mouseleave.menuItem')
        .on('mouseenter.menuItem', function () {
            _setCurrentAnchor(this);

            clearTimeout(timeout);
            timeout = setTimeout(function () {
                open();
                $anchors.data('hover', true);
            }, 250);

        }).on('mouseleave.menuItem', function () {
        clearTimeout(timeout);
        //console.log('mouseout anchor',this);

        timeout = setTimeout(function () {
            //console.log('mouseout anchor close');

            close();
            $anchors.data('hover', false);
        }, 1000);
    });

//submenu
    $elements.off('mouseenter.menuItem mouseleave.menuItem')
        .on('mouseenter.menuItem', function () {

            clearTimeout(timeout);
        }).on('mouseleave.menuItem', function () {
        clearTimeout(timeout);
        //console.log('mouseout',this);
        timeout = setTimeout(function () {
            close($currentSubmenu);
            $anchors.data('hover', false);
        }, 250);
    });



    function close() {

        if (!$currentSubmenu.hasClass('is-open')) {
            return false;
        }
        $elements.removeClass('is-open')
            .attr({'aria-hidden': true});

        $anchors.removeClass('current')
            .attr('aria-expanded', false);

        $originalAnchor.addClass('current');

    }

    function _setCurrentAnchor(el) {
        $currentAnchor = $(el);
        $currentSubmenu = $currentAnchor.next('.header-mega-wrapper');
        //console.log($currentSubmenu)
    }

    function open() {
        // close others
        $elements.not($currentSubmenu).removeClass('is-open')
            .attr({'aria-hidden': true}).fadeOut('slow');

        $anchors.removeClass('current')
            .attr('aria-expanded', false);

        $currentAnchor.addClass('current')
            .attr({'aria-expanded': true});

        $currentSubmenu.addClass('is-open').attr({'aria-hidden': false}).fadeIn('fast');
        // $('.headerSubNavInner').fadeOut('fast', function(){ $(this).html($currentAnchor.parent().find('ul.hidden').clone()).fadeIn('fast');})

    }

}


$(function(){
    var hasMegaMenu = false;
    $('.header-nav[data-mega-menu]>li').each(function(idx, el){
        var menuText =  $(this).children('a').text().toString();

        if($(this).children('ul').length){
            $(this).children('ul').wrap('<div class="header-mega-wrapper" id="mega-menu-'+idx+'"></div>');
            $(this).find('li.sponsor a')
                .addClass('mega-menu-sponsor').prependTo('#mega-menu-'+idx);

            hasMegaMenu = true;
        }

    });

    //subnavigation icons
    $('.menu[data-check-icons] li[class*=menu-icon-]').each(function(){
        var icon = this.className.match(/menu-icon-([a-z-]+)\s?/);
        if(icon && icon[1]) {
            $(this).prepend('<i class="af-icon icon-'+icon[1]+'"></i>');
        }

    });
    $('.menuItemHighlight').parentsUntil('main_menu', 'li').addClass('active-item');
    if ( hasMegaMenu) {
        initSubMenusHovers();
    }
});