
/**
 * initCollapsibleSections
 * @param selector
 *
 */
function initCollapsibleSections(selector) {
    if(selector == undefined){
        selector = 'body';
    }
    var $containingElement = $(selector);

    $containingElement.find('span.collapsibleHeader').removeClass('collapsibleHeader').closest('p, div, h1, h2, h3, h4, h5, h6').addClass('collapsibleHeader');    // move class to containing block element if it's on a span
    $containingElement.find('span.collapsibleContentEnd').removeClass('collapsibleContentEnd').closest('p, div, h1, h2, h3, h4, h5, h6, table').addClass('collapsibleContentEnd');    // move class to containing block element if it's on a span
    $containingElement.find('.collapsibleHeader').on('click', function(){
        var $this = $(this);
        if($this.hasClass('active')) $this.removeClass('active').next('.collapsibleContent').slideUp();
        else {
            $this.siblings('.collapsibleHeader.active').removeClass('active').next('.collapsibleContent').slideUp();   // close other open sections
            $this.addClass('active').next().slideDown();
        }
    }).each(function(){
        $(this).nextUntil('.collapsibleHeader, .collapsibleContentEnd').wrapAll('<div class="collapsibleContent"></div>');
    });
}
//init on doc ready
$(initCollapsibleSections);