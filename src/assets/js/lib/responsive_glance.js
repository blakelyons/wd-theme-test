

function initMinicalClick() {
    var timer;
    var delay = 1500;

    if($('#eventsGlance').length === 0 ){
        return;
    }
    $('#eventsGlance .calendarDays td').on( 'click',function(){
        if ( $(this).closest('#eventsGlance').hasClass('smallCalendar') ) {
            var currentTd = $(this);
            clearTimeout(timer);
            if ( currentTd.hasClass('hovered') ) {
                currentTd.removeClass('hovered');
                currentTd.find('.glanceInner').hide();
            }
            else {
                $('#eventsGlance .calendarDays td').removeClass('hovered');
                $('#eventsGlance .calendarDays td .eventsInner').hide();
                var currentInner = currentTd.find('.glanceInner');
                if(currentInner ) {
                    currentInner.show();
                    var halfwidth = currentInner.width() / 2;
                    if(currentInner.width() / 2 > currentInner.offset().left){
                        currentTd.addClass('left')
                    } else if ( halfwidth > (window.innerWidth - (currentTd.offset().left + currentTd.outerWidth())) ){
                        currentTd.addClass('right')

                    }
                }
                setTimeout(function () {
                    currentTd.addClass('hovered');
                    currentTd.hover(function () {
                        clearTimeout(timer);
                    }, function () {
                        timer = setTimeout(function () {
                            $('#eventsGlance .calendarDays td').removeClass('hovered');
                            $('#eventsGlance .calendarDays td .eventsInner').hide();
                        }, delay);
                    });
                }, 5);

            }
        }
    });

    $(window).on('resize', function(){
        if ( $('#eventsGlance').length > 0 ) {
            if ( window.innerWidth > 740 ) { $('#eventsGlance').removeClass('smallCalendar').addClass('largeCalendar') }
            else {
                $('#eventsGlance').addClass('smallCalendar').removeClass('largeCalendar');
            }
        }
    });
}
$(initMinicalClick);