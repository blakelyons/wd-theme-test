/**
 * White Comment Functions
 * @note All these comments functions are really old and should be redone
 * @preserve
 *
 */
function SaveComment(id, rspHandler) {
    var url = 'src=comments&cmd=set';
    url += MakeTag('comment_id', id);
    url += MakeTagFromID('public', 'yes');
    url += MakeTagFromID('user_alias', '', true);
    url += MakeTagFromID('user_email', '', true);
    url += MakeTagFromID('notify_blogger', 'no');

    if($('#captchaStatus').length > 0) {
        url += MakeTagFromID('recaptcha_challenge_field', '');
        url += MakeTagFromID('recaptcha_response_field', '');
    }

    if( $('#g-recaptcha-response').length > 0 ) {
        url += MakeTagFromID('g-recaptcha-response', '');
    }

    url += MakeTag('comment_text', encodeURIComponent($('#comment_text').val()));

    rspHandler = IsValid(rspHandler) ? rspHandler: function() { window.location.reload(); }

    $.ajax({url: MakeURL(url),
        dataType: 'html',
        success:rspHandler});

}

function MakeTagFromID(id, defaultValue, escapeValue) {
    var val = defaultValue;
    var obj = document.getElementById(id);
    if (IsValid(obj)) {
        if ((obj.type == 'checkbox') || (obj.type == 'radio')) val = obj.checked ? 'yes': 'no';
        else if (IsValid(obj.value)) val = IsValid(escapeValue) ? encodeURIComponent(obj.value) : obj.value;
    }
    return MakeTag(id, val);
}

/**
 * used white
 */
function InitializeAjaxLogin(classLogin, classContent) {
    var selLogin = '.' + classLogin;
    var selContent = '.' + classContent;
    if(IsValid($.cookie('USERAUTH')) && $.cookie('USERAUTH').length > 20) {
        $(selLogin).hide();
        $(selContent).show();
        return;
    }

    $(selContent).hide();

    $(document).keypress(function(e) {
        var key = e.charCode ? e.charCode : e.keyCode ? e.keyCode : 0;
        if(key == 13 && $(selLogin).is(':visible')) $('#login_submit').trigger('click');
    });

    $('#login_submit').click(function(e) {
        var uid = $('#uid').val();
        var pwd = $('#pwd').val();
        $.ajax({
            type: 'GET',
            url: MakeURL('src=comments&cmd=login&uid=' + uid + '&pwd=' + pwd),
            dataType: 'json',
            success: function(rsp) {

                if(rsp.status == 'ok') {
                    $(selContent).show();
                    $(selLogin).hide();

                    var userData = rsp.data;

                    $('#user_alias').val(userData['user_alias']);
                    $('#user_email').val(userData['user_email']);
                }
                else {
                    $('#loginStatus').text(rsp.message);
                }
            }
        });
    });
}

function FreedomComments(node){

    var self = this;
    var $commentListerWrapper = $(node);
    self.init = function(){
        $commentListerWrapper.find('.prevnext a').each(function(i, el) {
            if (!IsValid($(this).data('oldHREF'))) $(this).data('oldHREF', $(this).attr('href')).attr('href', 'javascript:void(0);');
        }).click(function() {
            $.ajax({
                url: $(this).data('oldHREF'),
                data: {direct: 'y'},
                success: refreshCommentsLister,
                dataType: 'html'

            })
        });
    };

    function refreshCommentsLister(response, status, xhr){
        $commentListerWrapper.empty();
        $commentListerWrapper.html(response);
        self.init();

    }
}

jQuery(document).ready(function($) {
    //white facing only
    if( String(window.location).indexOf('admin.php') == -1 ) {

        if($('.comments_lister').length > 0){

            $('.comments_lister').each(function(i, element){
                var fc1 = new FreedomComments(element);
                fc1.init();

            });

        }
    }
});