var app;

function moduleDetails(module) {
    moduleLookups = {
        /* Sample Modules
        'component_icons' : { layout: 'basic', message: 'Icons', newitem: function(itemnumber) { return { title: ('Icon ' + itemnumber) }; } },

        'component_quicklinks' : { layout: 'basic', message: 'Quicklinks', newitem: function(itemnumber) { return { title: ('Link ' + itemnumber) }; } },
        */
        'component_photoboxes' : { layout: 'basic', message: 'Photo Quicklinks', newitem: function(itemnumber) { return { title: ('Photo Quicklink ' + itemnumber), direction: 'vertical', colorOptions: '' }; } },
        'default' : { layout: 'basic', message: 'Repeat Items', newitem: function(itemnumber) { return { title: ('Item ' + itemnumber) }; } },
    }
    return (moduleLookups[module] || moduleLookups['default']);
}


function initVueManager(dataField,prerenderField,itemtemplate) {
    var loadData = [];
    var loadSettings = [{title: 'settings'}];
    if ($('#'+dataField).length && $('#'+dataField).val().length > 1 ) { loadData = $.parseJSON($('#'+dataField).val()); } else { console.log('No items loaded!'); }

    if ($('#attr__vue_load_settings').length && $('#attr__vue_load_settings').val().length > 1 ) { loadSettings = $.parseJSON($('#attr__vue_load_settings').val()); } else { console.log('No Settings loaded!'); }

    $.get('index.php?src=directory&view=' + itemtemplate + '&srctype=' + itemtemplate + '_lister&direct=json', function(data) {
        $('#vueManager').html(data);

        // ------------------ Basic Templates ---------------------------
        if (moduleDetails(itemtemplate).layout == 'basic') {
            app = new Vue({
                el: '#vueManager',
                // Data Stored in Module Item
                data: {
                    message: moduleDetails(itemtemplate).message,
                    appsettings: loadSettings,
                    appitems:  loadData,
                    uivars: { replaceImage: false, replaceImageField: false, replaceLink: false }
                },
                methods: {
                    additem: function(event) {
                        if (event) event.preventDefault();
                        app.appitems.push(moduleDetails(itemtemplate).newitem((app.appitems.length + 1)));
                    },
                    deleteitem: function(event,index) {
                        if (event) event.preventDefault();
                        this.$delete(app.appitems, index);
                    },
                    moveitemup: function(event,index) {
                        if (event) event.preventDefault();
                        if (index > 0) {
                            var itemToMove = app.appitems.splice(index, 1);
                            app.appitems.splice(( index - 1), 0, itemToMove[0]);
                        }
                    },
                    moveitemdown: function(event,index) {
                        if (event) event.preventDefault();
                        if ((index + 1) < app.appitems.length) {
                            var itemToMove = app.appitems.splice(index, 1);
                            app.appitems.splice(( index + 1), 0, itemToMove[0]);
                        }
                    },
                    imageSize: function(url, size){
                        var url = url || '';
                        return url.replace(/\.([a-zA-Z]{3,4})$/, '_'+size+'.$1').replace('clientuploads', 'images');
                    },
                    descriptionBreaks: function(text){
                        var text = text || '';

                        return text.replace(/\n/g, '<br>');
                    },
                    openImagefinder: function(event,index,field, root) {
                        if (event) event.preventDefault();
                        if(root === true) {

                        }
                        $('#attr__image_finder').val('');
                        Freedom.UI.elfinderPopup('attr__image_finder', '');
                        app.$set( app.uivars, 'replaceImage', index );
                        if ( !!field ) {
                            app.$set( app.uivars, 'replaceImageField', field );
                        }
                    },
                    openImagefinder: function(event,index,field) {
                        if (event) event.preventDefault();
                        $('#attr__image_finder').val('');
                        Freedom.UI.elfinderPopup('attr__image_finder', '');
                        app.$set( app.uivars, 'replaceImage', index );
                        if ( !!field ) {
                            app.$set( app.uivars, 'replaceImageField', field );
                        }
                    },
                    checkImageFinder: function() {
                        setInterval( function(){
                            if ( $('#attr__image_finder').val().length > 1 && app.uivars.replaceImage !== false ) {
                                app.$set( app.appitems[app.uivars.replaceImage], ((app.uivars.replaceImageField !== false) ? app.uivars.replaceImageField : 'image' ), 'clientuploads/directory/' + itemtemplate + '/' + $('#attr__image_finder').val() );
                                app.$set( app.uivars, 'replaceImage', false );
                                app.$set( app.uivars, 'replaceImageField', false );
                                $('#attr__image_finder').val('');
                            }
                        }, 250);
                    },
                    openLinkfinder: function(event,index) {
                        if (event) event.preventDefault();
                        $('#attr__link_finder').val('');
                        set_url_init('attr__link_finder');
                        app.$set( app.uivars, 'replaceLink', index );
                    },
                    checkLinkFinder: function() {
                        setInterval( function(){
                            if ( $('#attr__link_finder').val().length > 1 && app.uivars.replaceLink !== false ) {
                                app.$set( app.appitems[app.uivars.replaceLink], 'link', $('#attr__link_finder').val() );
                                app.$set( app.uivars, 'replaceLink', false );
                                $('#attr__link_finder').val('');
                            }
                        }, 250);
                    },
                    openFontAwesomeFinder: function(event, index){
                        if (event) event.preventDefault();
                        window.open('https://fontawesome.com/icons?d=gallery&m=free', 'font_previews',"scrollbars=no,resizable=no,status=no,location=no,toolbar=no,menubar=no,width=600,height=600,left=100,top=100");

                    },
                    openIconFinder: function(event, index){
                        if (event) event.preventDefault();
                        if( $('#previewIcons').length == 0 ){
                            $('#vueManager').before('<div id="previewIcons"><iframe  class="customIconIFrame" src="graphics/custom-icons/demo.html?v='+ (Math.floor(Math.random() * 100) )+'" style="border:none; width: 600px; height: 400px"></iframe></div>');
                            $('#previewIcons').dialog({ autoOpen: false,  width: "600", height: "400" });
                        }
                        app.$set( app.uivars, 'replaceIcon', index );
                        $('#previewIcons').dialog("open");
                    },
                    saveData: function() {
                        $('#'+dataField).val( JSON.stringify(app.appitems) );
                        if ($('#attr__vue_load_settings').length) {
                            $('#attr__vue_load_settings').val( JSON.stringify(app.appsettings) );
                        }
                        $('#'+prerenderField).val($('#PreRender').html());
                    }
                },
                mounted: function () {
                    this.$nextTick(function () {
                        this.saveData();
                        this.checkImageFinder();
                        this.checkLinkFinder();
                    });
                },
                updated: function () {
                    this.$nextTick(function () {
                        this.saveData();
                    });
                }

            });
        } // End of Basic





    });

}
//needs to be global for child iframe to call it
//used for custom icomoon.io font pack picker
function insertIcon(userPickedIcon){
    console.log(userPickedIcon);
    if(app.uivars.replaceIcon !== false){
        app.$set(app.appitems[app.uivars.replaceIcon], 'icon', userPickedIcon)
        $('#previewIcons').dialog("close");
    }
}