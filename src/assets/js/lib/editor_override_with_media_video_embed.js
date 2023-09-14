/**
 *
 * Accrisoft makes no guarantee that this will work for versions in the future.
 * By using this or other custom editor configuration files
 * 'Editor Toolbar Icons'  options will no longer apply and must be removed manually if required. (see below)
 *
 * Developed for freedom version 9.4.x+ and tinymce version 4.1.x+.
 *
 * @author: Lea Rickert <developer@learickert.com>
 * @version 1.2
 *
 * Modified by: Blake Lyons
 *
 * Updated: August, 2021
 *
 * Tiny MCE reference: http://www.tinymce.com/wiki.php/Configuration
 */
if( typeof ConfigEditor == 'function' ){

    var _ConfigEditor = ConfigEditor; // original function

    //overwrite function
    ConfigEditor = function()
    {
        var freedom_config = _ConfigEditor.apply(this, arguments);

        freedom_config.content_css = 'https://fonts.googleapis.com/css2?family=Fira+Sans:wght@400;500;700;800&family=Poppins:wght@400;500;600;700;800;&display=swap,foundation_custom.css,stylesheet.css?v1';
        addCSSFile('https://fonts.googleapis.com/css2?family=Fira+Sans:wght@400;500;700;800&family=Poppins:wght@400;500;600;700;800&display=swap'); // so previews work
        /* End:: google fonts  */

        // Custom Font Formats
        //freedom_config.font_formats = "Fire Sans='Fira Sans';Helvetica Neue='Helvetica Neue', Helvetica;Roboto=Roboto, Arial, sans-serif;";

        // Custom Font Sizes
        //freedom_config.fontsize_formats = '1em 1.2em 1.5em 1.75em 2em 2.75em 3.75em';

        // Upload Formats
        freedom_config.file_picker_types = 'file image media';

        // Adding Media (Video) Plugin with Defaults
        freedom_config.plugins = [
            "advlist autolink lists link image media charmap preview hr anchor pagebreak contextmenu",
            "searchreplace wordcount visualblocks visualchars code fullscreen",
            "nonbreaking save table directionality paste textcolor colorpicker",
            "freedom_textcolor freedom_link freedom_image freedom_pagebreak freedom_tag freedom_call2action freedom_embed"
        ];

        //freedom_config.toolbar1 = "undo redo | pastetext freedom_link unlink anchor freedom_image freedom_embed | hr freedom_pagebreak charmap | table numlist bullist | freedom_forecolor freedom_backcolor removeformat | code fullscreen ",
        freedom_config.toolbar1 = "undo redo | pastetext freedom_link unlink anchor freedom_image media | hr freedom_pagebreak charmap | table numlist bullist | freedom_forecolor freedom_backcolor removeformat | code fullscreen ";


        // Testing
        //freedom_config.menubar = false;



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