/**
 * Side menu - show only if it has content
 */
function checkSideMenu() {

    var hasSidebarContent = false
    if ( $('.sideMenu-nav a').length > 0 ) {
        hasSidebarContent = true;
    }
    if ( $('#sideBanners a').length ) {
        hasSidebarContent = true;
    }
    if ( $('.content-body [data-sidebar-item]').length ) {
        hasSidebarContent = true
        $('.content-body [data-sidebar-item]').detach().appendTo('.content-sidebar');
    }

    if(hasSidebarContent){
        $('.content-sidebar').show();
    }
}