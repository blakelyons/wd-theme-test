var app;
var menuName = 'main_menu';
function initVueMenuManager(dataField, submenuTextField, submenuIdField, topmenuField) {

    var loadData = [];
    if ($('#' + dataField).length && $('#' + dataField).val().length > 1) {
        loadData = $.parseJSON($('#' + dataField).val());
        console.log(loadData)
    } else {
        console.log('No items loaded!');
    }


    app = new Vue({
        el: '#vueManager',
// Data Stored in Module Item
        data: function () {
            return {
                baseUrl: "admin.php?src=menu&ajax=menu&operation=get_children&group="+menuName+"&id=",
                submenuId: '',
                menuItems: [],
                currentItems: loadData,
                loaded: false,
                error: '',
                topItems: [],
                selectedTopItem: null,
                subItems: [],
                selectedSubItem: null,

            }
        },
        methods: {
            saveData: function () {
                console.log('save Data');
                $('#' + dataField).val(JSON.stringify(this.menuItems));

            },
            setError: function (error) {
                this.error = error;
            },
            selectMenu: function(){
                //reset?
                var _this = this;
                this.getMenuChildren(0).then(resp =>{
                    _this.topItems = _this.ajaxDataToOptions(resp);

                });
            },
            setSubItems: function (event) {
                console.log(event.target);
                console.log(event.target.value);
                var text = event.target.options[event.target.selectedIndex].text;
                var value = event.target.value;
                $('#'+topmenuField).val(text);
                var _this = this;
                this.getMenuChildren(value).then(resp =>{
                    _this.subItems = _this.ajaxDataToOptions(resp);

                });

            },
            setMenuItems: function (event) {
                var text = event.target.options[event.target.selectedIndex].text;
                this.submenuId = event.target.value;

                $('#'+submenuTextField).val(text);
                $('#'+submenuIdField).val(this.submenuId);
                this.setError('');
                this.get3rdLevelData(this.submenuId);

            },
            checkExistingDescription: function (menuText) {
                console.log(menuText);
                for (var item of this.currentItems) {
                    if (item.title == menuText) {
                        return item.desc;
                    }
                }
                return 'New';
            },
            ajaxDataToOptions: function (data) {
                var options = [];
                for (var value of data) {
                    options.push({
                        "text": value.data,
                        "value": value.attr.id.replace('node_', '')
                    });
                }
                return options;
            },
            getMenuChildren: function (menuId) {
                const _this = this;
                return new Promise(function (resolve, reject) {

                    var itemsUrl = _this.baseUrl + menuId;
                    $.ajax({url: itemsUrl, dataType: 'json'}).done(function (data, textStatus, jqXHR) {
                        if (data) {
                            return resolve(data);
                        } else {
                            console.log('no data', menuId);
                        }
                    }).fail(function (jqXHR, textStatus, errorThrown) {
                        _this.loaded = false;
                        return reject();
                    });

                });
            },
            get3rdLevelData: function (submenuId) {
                var _this = this;
                this.getMenuChildren(submenuId).then(resp => {
                    console.log(resp, 'response');
                    var tmp = [];
                    for (var value of resp) {
                        tmp.push({"title": value.data, "desc": _this.checkExistingDescription(value.data)});
                    }
                    this.menuItems = tmp;
                    if (_this.menuItems.length == 0) {
                        _this.error = 'No 3rd Level Menu Items Found'
                    }
                    _this.loaded = true;
                })
            }
        },
        watch: {
            menuItems: {
                deep: true,
                handler() {
                    this.saveData();
                }
            }
        },
        beforeMount: function () {
            this.submenuId = $('#'+submenuIdField).val();
        },
        mounted: function () {

            if(this.submenuId !== '') {
                var _this = this;
                this.getMenuChildren(this.submenuId).then(function (resp) {
                    var tmp = [];
                    for (var value of resp) {
                        tmp.push({"title": value.data, "desc": _this.checkExistingDescription(value.data)});
                    }
                    _this.menuItems = tmp;
                    if (_this.menuItems.length == 0) {
                        _this.error = 'No 3rd Level Menu Items Found'
                    }
                    _this.loaded = true;
                })
            }

        },
        updated: function () {
            // this.$nextTick(function () {
            //     this.saveData();
            // });
        }

    });

}