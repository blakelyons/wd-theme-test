/**
 * Mobile Menu Functions
 */
function initMobileNav() {
    //trigger, accordian, and append top bar
    var mobileNavTriggers = $('[data-mobile-nav-trigger]');
    var mobileNavOverlay = document.querySelector('[data-mobile-nav-overlay]');
    // Mobile nav button open/close
    mobileNavTriggers.each(function(i,trigger) {
        $(trigger).on('click', function() {
            mobileNavTriggers.each(function(i,trigger) {  $(trigger).toggleClass('is-active'); });
            document.body.classList.toggle('is-mobilenav-open');
        });
    });
    // Mobile nav overlay close
    if(mobileNavOverlay) {
        mobileNavOverlay.addEventListener('click', function () {
            mobileNavTriggers.each(function (i, trigger) {
                trigger.classList.remove('is-active');
            });
            document.body.classList.remove('is-mobilenav-open');
        });

    }

}

var checkMobileTrigger = function() {

    var header = document.querySelector('[data-header]');
    if(header) {
        var nav = header.querySelector('[data-nav]');
        //header.classList.toggle('has-mobile-trigger', isOverflown(nav));

        //option 2 - for top level with dropdowns
        var topLi = nav.children;
        var testOffset = topLi[0].offsetTop;
        var found = false
        for( var i = topLi.length-1; i >=0; i--){
            if(topLi[i].offsetTop > testOffset ){

                topLi[i].classList.add('is-overflown');
                found = true;
            } else {
                topLi[i].classList.remove('is-overflown');
                // the rest should be fine
            }
        }
        header.classList.toggle('has-mobile-trigger', found);

    }
};

window.addEventListener('resize', debounce(checkMobileTrigger, 250));

$(function(){
    checkMobileTrigger();
    initMobileNav();
})