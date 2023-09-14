/*** jBox Popup ***/
function openPop() {
    $('.modal').removeClass('close').removeClass('slide');
    $('body').addClass('lock');

    $('.modal .close-modal, .modal-bg').click(function(){
        $('.modal').addClass('close');
        setTimeout(closePop,700);
        $('body').removeClass('lock');
    });
}

function closePop() {
    $('.modal').addClass('slide');
}

function popupHandler(id, lastModifiedTime, type, pageLoads) {
    var clickedCookie = 'clicked'+id,
        pageCountCookie = 'pageCount'+id;
    var ex;
    if ($.cookie(clickedCookie) != lastModifiedTime) {
        if (!$.cookie(pageCountCookie)) {
            $.cookie(pageCountCookie, 1, { expires: 7, path: '/' });
        } else {
            var limit = pageLoads || 1;
            if (Number($.cookie(pageCountCookie)) >= limit) {
                switch (type) {
                    case 'load':
                        setTimeout(openPop, 2000);
                        break;
                    case 'leave':
                        $('body').mouseleave(function(){
                            if (!ex) {
                                openPop();
                                ex = true;
                            }
                        });
                        break;
                    case 'scroll-top':
                        windowObject.scroll(function(){
                            if (scrollPosition > 250 && !ex) {
                                openPop();
                                ex = true;
                            }
                        });
                        break;
                    case 'scroll-bottom':
                        windowObject.scroll(function(){
                            if ((scrollPosition + windowHeight > $(document).height() - 100) && !ex) {
                                openPop();
                                ex = true;
                            }
                        });
                        break;
                }
                $.cookie(pageCountCookie, 1, { expires: 7, path: '/' });
                $.cookie(clickedCookie, lastModifiedTime, { expires: 7, path: '/' });
            } else {
                var inc = Number($.cookie(pageCountCookie)) + 1;
                $.cookie(pageCountCookie, inc, { expires: 7, path:'/'});
            }
        }
    }
}



/*** Silent Salesman ***/

function toggleBox() {
    $('.corner-box').toggleClass('open');
    $('.corner-box .content').toggle(300);
}

function initializeSilentSalesman(delay, status, lastModifiedTime) {
    delay = delay ? delay*1000 : 0;
    // start fade
    setTimeout(function(){
        //your code to be executed after delay
        $('.corner-box').css('display','block');
        $('.corner-box').fadeTo(800 , 1); // .fadeTo( speed, opacity )
    }, delay);

    if (status == 'Open') {
        if ($.cookie('firstView') != lastModifiedTime) {
            delay += 600;
            setTimeout(function() {
                toggleBox();
                $.cookie('firstView', lastModifiedTime, {path:'/'})
            }, delay);
        }
    }

    $('.corner-box .header').click(toggleBox);
}


$(function(){

    if ( $('.jbox').length ) {
        $.get('index.php?src=popup&srctype=popup_ajax&category='+encodeURI($('.jbox').first().text())+'&direct=json', function(response){
            if ($(response).find('.modal').length ) {
                var popupElementData = $(response).find('.modal').data();
                $('body').append($(response).find('.modal'));
                popupHandler(popupElementData.id, popupElementData.lastmodifiedtime, popupElementData.misc0, popupElementData.misc1);
            }
            else {
                if($(response).find('.corner-box')){
                    $('body').append($(response).find('.corner-box'));
                } else {
                    console.log('no modal found');

                }
            }
        });

    }


});