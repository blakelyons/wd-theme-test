module.exports = {
    // Javascript
    JS_BUNDLE_NAMESPACE: "__MT_EXTERNAL__",

    JS_ENTRIES: [
        "src/assets/js/sitescripts.js",
        "src/assets/js/rets.js",
        "src/assets/js/homepage_slideshow.js",
        "src/assets/js/autoplay-inline-embedded-videos-on-scroll.js",
        "src/assets/js/autoplay-inline-embedded-videos-on-scroll.min.js",
    ],

    JS_LIBRARY: [
        "src/assets/js/lib/freedom/freedom.common.js",
        "src/assets/js/lib/freedom/freedom.commerce.js",
        "src/assets/js/lib/jquery/jquery.cookie.js",
        // "src/assets/js/lib/freedom/freedom.ajaxsearch.js", //include if site uses
        // "src/assets/js/lib/freedom/freedom.comments.js",// only use if necessary - needs to be rewritten
        // "src/assets/js/lib/freedom/freedom.voting.js", //only use if necessary - needs to be rewritten

        "src/assets/js/lib/collapsible_init.js",
        "src/assets/js/lib/mobile_init.js",
        "src/assets/js/lib/mega_menu.js",
        "src/assets/js/lib/myaccount_edits.js",
        "src/assets/js/lib/check_sidemenu.js",
        "src/assets/js/lib/interior_header_init.js",
        "src/assets/js/lib/responsive_glance.js",
        "src/assets/js/lib/cart_ajax_init.js",
        "src/assets/js/lib/stat_counter.js",
        "src/assets/js/lib/login_modal.js",
    ],

    SASS_PATHS: ["scss", "node_modules/motion-ui/src", "node_modules/foundation-sites/scss"],

    // Assets
    ASSETS_FILES: ["src/assets/**/*", "!src/assets/{js,scss}", "!src/assets/{js,scss}/**/*"],
};
