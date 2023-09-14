var aMonths = ['January','February','March','April','May','June','July','August','September','October','November','December'];
function getMonthNumber(monthName) { return aMonths.indexOf(monthName) + 1 || '';}
function getMonthName(monthNumber){  return aMonths[parseInt(monthNumber) - 1] || ''; }

/**
 * news or blog module
 */
function initTagAndArchiveFilters(module)
{
    let $form = null;
    if(module === 'blog'){
        $form = $('#blogForm');
    } else if(module === 'news'){
        $form = $('#newsForm');
    } else {
        return;
    }

    let curParams = Freedom.getQueryParameters();
    let currentYear = curParams.year || '';
    let currentMonth = curParams.month || '';
    let currentCategory = curParams.category || '';
    let currentMrkrs = curParams.mrkrs || '';
    if(currentMrkrs.indexOf('+') > 0){
        currentMrkrs = currentMrkrs.replace('+', ' ');
    }


    $('.clearFilters').toggle( ( currentYear !== '' || currentMonth !== '' || currentMrkrs !== '' || currentCategory !== '') );


    //set current information from url and move around the fields
    $form.append('<input type="hidden" id="year" name="year" value="'+currentYear+'" />');
    $form.append('<input type="hidden" id="month" name="month" value="'+currentMonth+'" />');

    $form.prepend( $('#archiveFilterContainer') );
    $form.prepend( $('#tagsFilterContainer') );
    $('#'+module+'CategoryFilter .freedomFilterLabel').text('Filter by Category:');

    $('#archiveFilter').val(getMonthName(currentMonth) + currentYear).on('change', function(){
        var selectedElement = this.options[this.selectedIndex];
        var month = getMonthNumber(selectedElement.dataset.month);
        $('#month').val(month);
        $('#year').val(selectedElement.dataset.year || '');

        $form.submit();
    });

    $('#tagsFilter').val(currentMrkrs).on('change', function(){
        $form.submit();
    });
}