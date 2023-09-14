/**
 * Tiny MCE reference: http://www.tinymce.com/wiki.php/Configuration
 */
if( typeof ConfigEditor == 'function' ){

    var _ConfigEditor = ConfigEditor; // original function


    //overwrite function
    ConfigEditor = function()
    {
        var freedom_config = _ConfigEditor.apply(this, arguments);


        //replace all commas with %2C in font_css
        var font_css = "https://fonts.googleapis.com/css2?family=Merriweather:ital@1&family=Nunito:wght@400;700&family=Poppins:wght@400;600;700&display=swap";

        freedom_config.content_css = font_css+',foundation_custom.css,stylesheet.css?v4, graphics/custom-icons/style.css';

        freedom_config.font_formats = 'Merriweather=Merriweather,serif;Poppins=Poppins,sans-serif;Nunito=Nunito, sans-serif';

        freedom_config.toolbar1 = freedom_config.toolbar1.replace('freedom_embed', 'media freedom_embed');
        freedom_config.plugins.push('media');



        // Example: add specific src / srctype config
        var src = freedom_config.freedomSrc; //also can use arguments[0];
        var srctype = freedom_config.freedomSrctype; //also can use arguments[1];


        return freedom_config;
    };


    function addCSSFile(filename){
        var cssLink=document.createElement("link");
        cssLink.setAttribute("rel", "stylesheet");
        cssLink.setAttribute("type", "text/css");
        cssLink.setAttribute("href", filename);

        var head  = document.getElementsByTagName('head')[0];
        head.appendChild(cssLink);
    }

}