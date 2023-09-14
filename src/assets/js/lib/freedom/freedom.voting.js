/**
 * Whtie Voting functions
 * @note All these voting functions are really old and should be redone
 * @preserve
 */
function ViewVotesReq(id)
{
    var url = 'src=voting&cmd=vote_get';
    url += MakeTag('id', id);
//    SendVotingReq(url, ViewVotesRsp);
    $.ajax({url: MakeURL(url),  dataType: 'json', success:ViewVotesRsp});
}
function ViewVotesRsp(rsp)
{
    var jsonRsp = rsp.data;

    ShowFreedomDialog('', jsonRsp);
    $('#vote_popup').freedomTable( rsp.data.configuration );

}

function ClickStarReq(id)
{
    var url = 'src=voting&cmd=vote_set';
    url += MakeTag('addonid', id);
    SendVotingReq(url, ClickStarRsp);
}
function ClickStarRsp(rsp)
{
    eval(rsp);  //Creates the ajaxRspObj object
    for(var key in ajaxRspObj)
        ajaxRspObj[key] = unescape(decodeURI(ajaxRspObj[key]));

    var id = ajaxRspObj['id'];
    $('#voteAvg'+id).text( ajaxRspObj['voteAvg'] );
    $('#voteCount'+id).text( ajaxRspObj['voteCount'] );
}
function SendVotingReq(url, fn)
{
    if( fn == RefreshVotingLister )
        $('#voting_lister').spin();

    votingReqHandle = GetReqObjHandle();
    SendRequest(votingReqHandle, url, fn);
}
function RefreshVotingLister(html)
{
    $('#voting_lister').unspin();
    var $parent = $('#voting_lister').parent();
    $('#voting_lister').remove();
    $parent.append('<div id="voting_lister">' + unescape(decodeURI(html)) + '</div>');
    AdminListerPagingInit();
}

function AdminListerPagingInit(){

    $('#voting_lister .prevnext a')
        .each(function() {
            if( !IsValid($(this).data('oldHREF')) )
                $(this).data('oldHREF', $(this).attr('href')).attr('href', 'javascript:void(0);');
        })
        .click(function() {
            var url = 'src=voting&cmd=vote_scroll';
            var parts = $(this).data('oldHREF').split('&');
            for( var i = 0; i < parts.length; i++ )
            {
                var pair = parts[i].split('=');
                if( pair[0] == 'addonid' )
                    url += MakeTag('addonid', pair[1]);
                else if( pair[0] == 'pos' )
                    url += MakeTag('addonpos', pair[1]);
                else if( pair[0] == 'inline' )
                    url += MakeTag('inline', pair[1]);
            }
            SendVotingReq(url, RefreshVotingLister);
        });
}


(function( $ ) {
    $.fn.voting = function(options) {
        options = options || {};

        var defaults = {
            starOn: '/freedom_html/common/jquery/images/star_on.gif',
            starOff: '/freedom_html/common/jquery/images/star_off.gif',
            maxStarCount: 5
        };

        options = $.extend(defaults, options);

        //Initialize admin lister paging links
        AdminListerPagingInit();

        var lastMousePos = { pageX: -1, pageY: -1 };
        $(document).on('mousemove', function(e) {
            if( Math.abs(e.pageX - lastMousePos.pageX) > 4 || Math.abs(e.pageY - lastMousePos.pageY) > 4 )
            {
                $('.votingOdd').hide();
                $('.votingEven').show();
            }
        });

        return this.each(function() {
            var $container = $(this);
            if( $container.data('has-stars') ){
                return true;
            }
            $container.data('has-stars', true);
            for( var i = 0; i < options.maxStarCount * 2; ++i )
                $('<img />').appendTo( $container );                //Add IMG tags for the voting stars

            var id = $container.attr( 'id' );

            var lastVoteid = id.substring(2, id.length);
            lastVoteid = 'voteAvg_' + lastVoteid;

            var lastVote = parseInt( $('#'+lastVoteid).text() ) * 2;

            var inx = 0;
            $container.children('img').each(function() {
                if( (inx % 2) == 0 )
                {   //Even
                    $(this)
                        .attr( 'src', (lastVote > 0 && inx < lastVote) ? options.starOn : options.starOff )
                        .addClass( 'votingEven' )
                        .css({ display: 'inline' })
                        .on('mouseover', function(e) {
                            var len = $container.children('img:even').index(e.target) + 1;
                            $container.children('img:even').slice(0, len).hide();
                            $container.children('img:odd').slice(0, len).show();
                            lastMousePos.pageX = e.pageX;
                            lastMousePos.pageY = e.pageY;
                        });
                }
                else
                {   //Odd
                    $(this)
                        .attr( 'src', options.starOn )
                        .addClass( 'votingOdd' )
                        .css( {display: 'none'} )
                        .click( function(e) {
                            var len = ($container.children('img').index(e.target) + 1) / 2;
                            $container.children('img').unbind('mouseover').unbind('mouseout').unbind('click');
                            $container.children('img:odd').removeClass('votingOdd').slice(0, len).show();
                            $container.children('img:even').removeClass('votingEven').attr('src', options.starOff).slice(len, options.maxStarCount).show();

                            var a = id.split( '_' );
                            a[0] = len;
                            ClickStarReq( a.join('_') );
                        });
                }
                ++inx;
            });
        });
    }
})( jQuery );



$(document).ready(function() {

    if( typeof( jQuery().voting ) !== 'undefined' ){
        $('.votingStars').voting();
    }
});
