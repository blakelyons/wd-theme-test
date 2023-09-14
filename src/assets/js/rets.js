var today = new Date(),
  intRegEx = /^\d+$/,
  numRegEx = /^[0-9\.]+$/,
  dateRegEx = /^(\d{2})\D(\d{2})\D(\d{4})$/;
$thisYear = new Date().getFullYear();
//    retsNewListingsPeriod = 8;  // how many days old a "new" RETS listing can be

var urlParameters, moduleParameter, queryParameter, sortParameter, posParameter;

/*** Execute immediately ***/

storeUrlParameters();

// * ----- Search Configuration Variable ----- *
// key: form field ID
// dbField: database field name
// operator (optional): (eq | like | starts | gt | ge | le | lt | ne), default set in processPropertySearchForm() is eq
// modifyFunction (optional): the name of a function that will take the form field value, modify it somehow, and return the result; if used, the function must return '' if the value is falsy or an empty array
// pattern (optional): regular expression to match input value against
// errorMessage (optional): message to display for invalid field
var retsPropertySearchConfig = {
    'rets_res': {
        xsearch_0: { dbField:'category' },
        xsearch_1: { dbField:'Status' },
        xsearch_2: {dbField: "Style" },
        xsearch_3: {dbField: "Street_Name" },
        xsearch_4: {dbField: "address_zip" },
        xsearch_5: {dbField: "address_city" },
        xsearch_6: {dbField: "HEAT" },
        xsearch_7: {dbField: "COOL" },
        xsearch_8: {dbField: "WATR" },
        amenities: { dbField:'AMEN', operator:'like' },

        mlsId:  { dbField:'misc0', operator:'eq' },
        minYear: { dbField:'misc6', operator:'ge' },
        maxYear: { dbField:'misc6', operator:'le' },
        minPrice: { dbField:'misc3', operator:'ge' },
        maxPrice: { dbField:'misc3', operator:'le' },
        minBedrooms: { dbField:'Bedrooms', operator:'ge' },
        maxBedrooms: { dbField:'Bedrooms', operator:'le' },
        minBathrooms: { dbField:'Bathrooms', operator:'ge' },
        maxBathrooms: { dbField:'Bathrooms', operator:'le' },
        minSqFt: { dbField:'misc5', operator:'ge' },
        maxSqFt: { dbField:'misc5', operator:'le' },
        minAcreage: { dbField:'misc7', operator:'ge' },
        maxAcreage: { dbField:'misc7', operator:'le' },

        street: { dbField:'address_1', operator:'like' },
        zip: { dbField:'address_zip', pattern:intRegEx, errorMessage:'Please enter a valid 5-digit zip code.\n' },
    },
    'rets_res_rent': {
        xsearch_0: { dbField:'category' },
        xsearch_1: { dbField:'Status' },
        xsearch_2: {dbField: "Style" },
        xsearch_3: {dbField: "Street_Name" },
        xsearch_4: {dbField: "address_zip" },
        xsearch_5: {dbField: "address_city" },
        xsearch_6: {dbField: "HEAT" },
        xsearch_7: {dbField: "COOL" },
        xsearch_8: {dbField: "WATR" },
        amenities: { dbField:'AMEN', operator:'like' },

        mlsId:  { dbField:'misc0', operator:'eq' },
        minYear: { dbField:'misc6', operator:'ge' },
        maxYear: { dbField:'misc6', operator:'le' },
        minPrice: { dbField:'misc3', operator:'ge' },
        maxPrice: { dbField:'misc3', operator:'le' },
        minBedrooms: { dbField:'Bedrooms', operator:'ge' },
        maxBedrooms: { dbField:'Bedrooms', operator:'le' },
        minBathrooms: { dbField:'Bathrooms', operator:'ge' },
        maxBathrooms: { dbField:'Bathrooms', operator:'le' },
        minSqFt: { dbField:'misc5', operator:'ge' },
        maxSqFt: { dbField:'misc5', operator:'le' },
        minAcreage: { dbField:'misc7', operator:'ge' },
        maxAcreage: { dbField:'misc7', operator:'le' },

        street: { dbField:'address_1', operator:'like' },
        zip: { dbField:'address_zip', pattern:intRegEx, errorMessage:'Please enter a valid 5-digit zip code.\n' },
    },
    'rets_oh': {
        xsearch_0: { dbField:'category' },
        xsearch_1: { dbField:'Status' },
        xsearch_2: {dbField: "Style" },
        xsearch_3: {dbField: "Street_Name" },
        xsearch_4: {dbField: "address_zip" },
        xsearch_5: {dbField: "address_city" },
        xsearch_6: {dbField: "HEAT" },
        xsearch_7: {dbField: "COOL" },
        xsearch_8: {dbField: "WATR" },
        amenities: { dbField:'AMEN', operator:'like' },

        mlsId:  { dbField:'misc0', operator:'eq' },
        minYear: { dbField:'misc6', operator:'ge' },
        maxYear: { dbField:'misc6', operator:'le' },
        minPrice: { dbField:'misc3', operator:'ge' },
        maxPrice: { dbField:'misc3', operator:'le' },
        minBedrooms: { dbField:'Bedrooms', operator:'ge' },
        maxBedrooms: { dbField:'Bedrooms', operator:'le' },
        minBathrooms: { dbField:'Bathrooms', operator:'ge' },
        maxBathrooms: { dbField:'Bathrooms', operator:'le' },
        minSqFt: { dbField:'misc5', operator:'ge' },
        maxSqFt: { dbField:'misc5', operator:'le' },
        minAcreage: { dbField:'misc7', operator:'ge' },
        maxAcreage: { dbField:'misc7', operator:'le' },

        street: { dbField:'address_1', operator:'like' },
        zip: { dbField:'address_zip', pattern:intRegEx, errorMessage:'Please enter a valid 5-digit zip code.\n' },
    },
    'rets_multi': {
        xsearch_0: { dbField:'TYPE' },
        xsearch_1: { dbField:'Status' },
        xsearch_2: {dbField: "PRKD" },
        xsearch_3: {dbField: "Subdivision_Name" },
        xsearch_4: {dbField: "HEAT" },
        xsearch_5: {dbField: "COOL" },
        xsearch_6: {dbField: "WATR" },
        xsearch_7: {dbField: "SchoolDistrict" },
        xsearch_8: {dbField: "address_city" },
        amenities: { dbField:'AMEN', operator:'like' },

        mlsId:  { dbField:'misc0', operator:'eq' },
        minAge: { dbField:'misc6', operator:'le', modifyFunction:yearFromYearsAgo },
        maxAge: { dbField:'misc6', operator:'ge', modifyFunction:yearFromYearsAgo },
        minPrice: { dbField:'misc3', operator:'ge' },
        maxPrice: { dbField:'misc3', operator:'le' },
        minSqFt: { dbField:'misc5', operator:'ge' },
        maxSqFt: { dbField:'misc5', operator:'le' },
        minAcreage: { dbField:'misc7', operator:'ge' },
        maxAcreage: { dbField:'misc7', operator:'le' },

        Street_Name: { dbField:'Street_Name', operator:'like' },
        address_zip: { dbField:'address_zip', pattern:intRegEx, errorMessage:'Please enter a valid 5-digit zip code.\n' },
        street: { dbField:'address_1', operator:'like' },
        zip: { dbField:'address_zip', pattern:intRegEx, errorMessage:'Please enter a valid 5-digit zip code.\n' },
    },
    'rets_com': {
        xsearch_0: { dbField:'PROP' },
        xsearch_1: { dbField:'Status' },
        xsearch_2: {dbField: "PRKD" },
        xsearch_3: {dbField: "ZONE" },
        xsearch_4: {dbField: "HEAT" },
        xsearch_5: {dbField: "COOL" },
        xsearch_6: {dbField: "WATR" },
        xsearch_7: {dbField: "BLDT" },
        xsearch_8: {dbField: "address_city" },
        xsearch_9: {dbField: "Subdivision_Name" },

        mlsId:  { dbField:'misc0', operator:'eq' },
        minAge: { dbField:'misc6', operator:'le', modifyFunction:yearFromYearsAgo },
        maxAge: { dbField:'misc6', operator:'ge', modifyFunction:yearFromYearsAgo },
        minPrice: { dbField:'misc3', operator:'ge' },
        maxPrice: { dbField:'misc3', operator:'le' },
        minSqFt: { dbField:'misc5', operator:'ge' },
        maxSqFt: { dbField:'misc5', operator:'le' },
        minAcreage: { dbField:'misc7', operator:'ge' },
        maxAcreage: { dbField:'misc7', operator:'le' },

        Street_Name: { dbField:'Street_Name', operator:'like' },
        address_zip: { dbField:'address_zip', pattern:intRegEx, errorMessage:'Please enter a valid 5-digit zip code.\n' },
    },
    'rets_lnd': {
        xsearch_0: { dbField:'TYPE' },
        xsearch_1: { dbField:'Status' },
        xsearch_2: {dbField: "ZONE" },
        xsearch_3: {dbField: "WATR" },
        xsearch_4: {dbField: "address_city" },
        xsearch_5: {dbField: "Subdivision_Name" },
        xsearch_6: {dbField: "LOTD" },
        xsearch_7: {dbField: "misc7" },

        mlsId:  { dbField:'misc0', operator:'eq' },
        minPrice: { dbField:'misc3', operator:'ge' },
        maxPrice: { dbField:'misc3', operator:'le' },
        minSqFt: { dbField:'misc5', operator:'ge' },
        maxSqFt: { dbField:'misc5', operator:'le' },
        minAcreage: { dbField:'misc7', operator:'ge' },
        maxAcreage: { dbField:'misc7', operator:'le' },

        Street_Name: { dbField:'Street_Name', operator:'like' },
        address_zip: { dbField:'address_zip', pattern:intRegEx, errorMessage:'Please enter a valid 5-digit zip code.\n' },
    },
};

function commaSeparateNumber(n) {
    var parts = n.toString().split('.');

    if(parts[1]) parts[1] = parts[1].replace(/0+$/, '');  // remove trailing 0s after the decimal

    while(/(\d+)(\d{3})/.test(parts[0].toString())) {
        parts[0] = parts[0].toString().replace(/(\d+)(\d{3})/, '$1,$2');
    }

    if(parts[1]) return parts.join('.');
    else return parts[0];
}

function dayOfWeek(day) {
    switch(day){
        case 1: return 'Sunday';
        case 2: return 'Monday';
        case 3: return 'Tuesday';
        case 4: return 'Wednesday';
        case 5: return 'Thursday';
        case 6: return 'Friday';
        case 7: return 'Saturday';
    }
}

function yearFromYearsAgo(value) {
    if(value) return today.getFullYear() - value;
    else return '';
}

// URL handling

function storeUrlParameters() {
    urlParameters = Freedom.getQueryParameters();
    queryParameter = urlParameters.query ? '&query='+urlParameters.query : '';
    moduleParameter = urlParameters.view ? '&view='+urlParameters.view : '';
    sortParameter = urlParameters.sort ? '&sort='+urlParameters.sort : '';
    posParameter = urlParameters.pos ? '&pos='+urlParameters.pos : '';

    sessionStorage.setItem('lastSearchParams', urlParameters);
    console.log(urlParameters);
}

function serializeObject(obj) {
    var str = [];
    for(var p in obj) {
        if(obj.hasOwnProperty(p)) {
            str.push(encodeURIComponent(p) + '=' + encodeURIComponent(obj[p]));
        }
    }
    return str.join('&');
}

function updateUrlAndGo(newUrl) {
    window.history.pushState({url: newUrl}, '', newUrl);    // update URL in address bar
    storeUrlParameters();

    console.log("Inside Update URL and Go Function");
    console.log(newUrl);

    window.location.href = newUrl;
    //doPropertySearch();
}


/*----- END Utils ------ */

/*** Search function **/
// Populate the search form with values from the query parameter.
function toggleSearchForm() {
    if ( $('.retsFilterBar-advanced-search').length ) {
        $('.retsFilterBar-advanced-search').on('click', function(e) {
            e.preventDefault();
            if ( $('.retsFilterBar-advanced-search').hasClass('active') ) {
                $('.retsAdvancedSearch').slideUp(200);
                $('.retsFilterBar-advanced-search, .retsAdvancedSearch').removeClass('active');
            } else {
                $('.retsFilterBar-advanced-search').addClass('active');
                $('.retsAdvancedSearch').slideDown(200);
                setTimeout(function() { $('.retsAdvancedSearch').addClass('active'); }, 500)
            }
        });
        // Hos / Hide Search Form Reset Button if a Search is active
        console.log("Search Queries Initialize Search Form Inputs");
        let $activeSearch = Freedom.getQueryParameters()['query'];

        console.log($activeSearch);

        if ( ($activeSearch !== '' || $activeSearch !== undefined) && ($activeSearch !== '(Status.eq.Active)') ) {
            $('.retsFilterBar .retsFilterBar-reset-search').addClass('active');
            setTimeout(function() {
                $('.retsFilterBar .retsFilterBar-reset-search').css('opacity',1)
            }, 500)
        } else {
            $('.retsFilterBar .retsFilterBar-reset-search').removeClass('active').css('opacity',0);
            console.log("ERROR: No Search Active");
        }

    }
}

// Target Events to Click Submit Button on Keypress > Enter if a value has changed in an input or select
document.addEventListener("keyup", function(event) {
    if (event.key === 'Enter') {
        $('#submitSearch').click();
        $('#submitSearch').parent().html('<div class="loader loader--style6" title="5">\n' +
          '  <svg version="1.1" id="Layer_1" xmlns="http://www.w3.org/2000/svg" xmlns:xlink="http://www.w3.org/1999/xlink" x="0px" y="0px"\n' +
          '     width="24px" height="30px" viewBox="0 0 24 30" style="enable-background:new 0 0 50 50;" xml:space="preserve">\n' +
          '    <rect x="0" y="13" width="4" height="5" fill="#333">\n' +
          '      <animate attributeName="height" attributeType="XML"\n' +
          '        values="5;21;5" \n' +
          '        begin="0s" dur="0.6s" repeatCount="indefinite" />\n' +
          '      <animate attributeName="y" attributeType="XML"\n' +
          '        values="13; 5; 13"\n' +
          '        begin="0s" dur="0.6s" repeatCount="indefinite" />\n' +
          '    </rect>\n' +
          '    <rect x="10" y="13" width="4" height="5" fill="#333">\n' +
          '      <animate attributeName="height" attributeType="XML"\n' +
          '        values="5;21;5" \n' +
          '        begin="0.15s" dur="0.6s" repeatCount="indefinite" />\n' +
          '      <animate attributeName="y" attributeType="XML"\n' +
          '        values="13; 5; 13"\n' +
          '        begin="0.15s" dur="0.6s" repeatCount="indefinite" />\n' +
          '    </rect>\n' +
          '    <rect x="20" y="13" width="4" height="5" fill="#333">\n' +
          '      <animate attributeName="height" attributeType="XML"\n' +
          '        values="5;21;5" \n' +
          '        begin="0.3s" dur="0.6s" repeatCount="indefinite" />\n' +
          '      <animate attributeName="y" attributeType="XML"\n' +
          '        values="13; 5; 13"\n' +
          '        begin="0.3s" dur="0.6s" repeatCount="indefinite" />\n' +
          '    </rect>\n' +
          '  </svg>\n' +
          '</div>');
    }
});

$(function() {
    $('#submitSearch').on('click', function () {
        processPropertySearchForm();
    });
});

// Populate the search form with values from the query parameter.
function initializePropertySearchForm() {

    var retsModule = $('input[name=view]').val();

    var queryFields = [];
    var usedInQuery = false;
    var searchConfigObject;  // the object in the retsPropertySearchConfig object that corresponds to the current form field
    var searchConfigObjectOperator = 'eq';
    var $formInput;
    var queryField;

    if(urlParameters.query) {
        var conditionsArray = urlParameters.query.split('.and.');

        for(var i=0; i<conditionsArray.length; i++) {
            if(conditionsArray[i].charAt(0) == '(') {  // multiselect

                var valuesArray = conditionsArray[i].replace(/[()]/g, '').split('.or.'), // each cell of valuesArray should be of the form [db_field, operator, value]
                  dbField = valuesArray[0].split('.')[0], // get the database field
                  operator = valuesArray[0].split('.')[1];

                for(var j=0; j<valuesArray.length; j++) valuesArray[j] = valuesArray[j].split('.')[2];   // an array of the form [db_field, operator, value]; keep only the value part in the array
                queryFields.push({dbField: dbField, operator: operator, value: valuesArray});

            } else {    // input

                var condition = conditionsArray[i].split('.');   // condition will be an array of the form [db_field, operator, value]
                queryFields.push({dbField: condition[0], operator: condition[1], value: condition[2]});

            }
        }
    }

    // queryFields should now be populated with objects containing properties: db_field, operator (optional), and value (either a string or an array for multiselects).

    // For each form field, use the retsPropertySearchConfig object to set it to the corresponding URL query value or empty.
    for(var formField in retsPropertySearchConfig[retsModule]) {

        searchConfigObject = retsPropertySearchConfig[retsModule][formField];  // the object in the retsPropertySearchConfig object that corresponds to the current form field

        if ( formField !== 'garage' || $formInput !== 'pool' || $formInput !== 'water' || $formInput !== 'basement' ) {

            $formInput = $('#'+formField);

            searchConfigObjectOperator = searchConfigObject.operator || 'eq';
            usedInQuery = false;

            for(f=0; f<queryFields.length; f++) {
                queryField = queryFields[f];    // an object with properties: dbField, operator (optional), and value (either a string or array)

                //console.log("queryField in for loop");
                //console.log(queryField);

                if(queryField.dbField == searchConfigObject.dbField && queryField.operator == searchConfigObjectOperator) {
                    if($formInput.is('[type=checkbox]')) $formInput.prop('checked', true);
                    else $formInput.val(queryField.value);
                    usedInQuery = true;
                    break;
                }
            }

            // If the form field is not used in the URL query, uncheck it or make it empty.
            if(!usedInQuery) {
                if($formInput.is('[type=checkbox]')) $formInput.prop('checked', false);
                else $formInput.val('');
            }

        }
    }

    // Initialize range sliders.
    $('.rangeSlider').each(function(){
        var $this = $(this),
          prefix = $this.data('prefix') || '',
          suffix = $this.data('suffix') || '',
          min = $this.siblings('.rangeMin').val(),
          max = $this.siblings('.rangeMax').val(),
          $handles = $this.children('.ui-slider-handle');

        if($this.data('values')) {
            var sliderValues = $this.data('values').split(',');
            $this.slider('values', 0, min ? sliderValues.indexOf(min) : 0);    // set the min handle value to the array index of the cell containing the value that matches the input's min value or zero
            $this.slider('values', 1, max ? sliderValues.indexOf(max) : sliderValues.length-1);    // set the max handle value to the array index of the cell containing the value that matches the input's max value or the max index
        } else {
            $this.slider('values', 0, min ? min : ($this.data('min') ? $this.data('min') : 0));    // set the min handle value to the rangeMin input's value or the data-min or zero
            $this.slider('values', 1, max ? max : ($this.data('max') ? $this.data('max') : 100));    // set the max handle value to the rangeMax input's value or the data-max or 100
        }

        $handles[0].setAttribute('value', min > 0 ? prefix + commaSeparateNumber(min) + suffix : '');  // set min handle label
        $handles[1].setAttribute('value', max > 0 ? prefix + commaSeparateNumber(max) + suffix : '');  // set max handle label
    });

}

function resetPropertySearchForm() {

    $('#searchForm select, #searchForm input[type=text], #searchForm input[type=hidden]').val('');
    $('#searchForm input[type=checkbox]').prop('checked', false);

    // Reset range sliders.
    $('.rangeSlider').each(function(){
        var $this = $(this);

        $this.children('.ui-slider-handle').attr('value', '');

        if($this.data('values')) {
            $this.slider('values', [0, $this.data('values').split(',').length-1]);
        } else {
            $this.slider('values', [$this.data('min') || 0, $this.data('max') || 100]);
        }
    });

    processPropertySearchForm();

}

function processPropertySearchForm() {

    $('.errorField').removeClass('errorField');

    var conditionsArray = [],
      conditions = '',
      error = '';
    var retsModule = $('input[name=view]').val();
    var listerUrl = _getListerURL(sessionStorage.getItem('property_lister_type'), retsModule);

    console.log("Lister URL");
    console.log(listerUrl);

    // Add each form field value to the condition array.
    for(var formFieldID in retsPropertySearchConfig[retsModule]) {
        var searchConfigObject = retsPropertySearchConfig[retsModule][formFieldID];

        console.log("searchConfigObject");
        console.log(searchConfigObject);

        var $formField = $('#'+formFieldID),
          modifyFunction = searchConfigObject.modifyFunction,
          formFieldValue = typeof modifyFunction == 'function' ? modifyFunction($formField.val()) : $formField.val(),   // unencoded string, or array if multiselect; if a modifyFunction is used, it must return '' if the form field has no value
          dbField = searchConfigObject.dbField,
          operator = searchConfigObject.operator ? '.'+searchConfigObject.operator+'.' : '.eq.',
          pattern = searchConfigObject.pattern,
          errorMessage = searchConfigObject.errorMessage || 'Error\n';

        if($formField.is('[multiple]')) {

            if(formFieldValue[0]) {
                conditions = '(';
                for(var i=0; i<formFieldValue.length; i++){
                    if(i>0) conditions += '.or.';
                    conditions += dbField + operator + formFieldValue[i];
                }
                conditions += ')';
                conditionsArray.push(conditions);
            }

        } else if(formFieldValue) {

            if(pattern) {
                if(pattern.test(formFieldValue)) conditionsArray.push(dbField + operator + formFieldValue);
                else if(formFieldValue) {
                    error += errorMessage;
                    $formField.addClass('errorField');
                }
            } else {
                if($formField.is('[type=checkbox]')) { if($formField.is('[type=checkbox]:checked')) conditionsArray.push(dbField + operator + formFieldValue); }
                else if(formFieldValue) conditionsArray.push(dbField + operator + formFieldValue);
            }

        }
    }

    if(error) {
        window.scrollTo(0, $('.errorField').offset().top - window.innerHeight/2);  // scroll to first .error field
//            alert(error);
    } else {
        // Add current map bounds to query, if present.
        /*if(location.search.indexOf('Latitude.') > 0) {
            conditionsArray.push(urlParameters.query.split('.and.').filter(function(element, index, array){
                return (element.indexOf('Latitude') === 0 || element.indexOf('Longitude') === 0); // keep any cells pertaining to latitude and longitude
            }).join('.and.'));
        }*/
        queryParameter = conditionsArray.length ? '&query='+encodeURIComponent(conditionsArray.join('.and.')) : '';
        //todo submit

        console.log(listerUrl+queryParameter+sortParameter);

        console.log("Query Parameter");
        console.log(queryParameter.indexOf('misc0'));

        console.log("DB Field: ");
        console.log(dbField);

        if ( queryParameter.indexOf('misc0') > 0 ) {
            //updateUrlAndGo(listerUrl+'&query=misc0.eq.'+sortParameter);
        } else {
            updateUrlAndGo(listerUrl+queryParameter+sortParameter);
        }

        updateUrlAndGo(listerUrl+queryParameter+sortParameter);
    }

}

/*** Property functions ***/

function _getListerURL(listerType, moduleType){

    var srctype = (listerType == 'map' ? moduleType+'_map' : 'lister');

    return 'index.php?src=directory&view='+moduleType+'&srctype='+srctype;
}

function initializePropertyListerPage(listerType, moduleType) {

    console.log("Lister and Module Type");
    console.log(listerType);
    console.log(moduleType);

    // Set List - Map Active State
    ( listerType === 'map' ) ? $('.propertiesMapView').addClass('active') : $('.propertiesListView').addClass('active');

    // Set some variables.
    if(moduleType === undefined) {
        moduleType = urlParameters.view;
    }

    console.log("URL Parameters");
    console.log(urlParameters.view);

    sessionStorage.setItem('property_lister_type', listerType || 'list');    // default to list view
    sessionStorage.setItem('property_lister_total_items', $('#totalItems').data('total-items'));

    $('a.allResultsLink').attr('href', _getListerURL(listerType, moduleType)+sortParameter);
    $('a.searchResultsListLink').attr('href', _getListerURL('list', moduleType)+sortParameter+queryParameter+posParameter);
    $('a.searchResultsMapLink').attr('href', _getListerURL('map', moduleType)+sortParameter+queryParameter+posParameter);

    if(urlParameters.sort) {
        $('#sortField').val(urlParameters.sort.split('|')[0]);
        $('#sort').val(urlParameters.sort.split('|')[1]);
    }

    $('#sortField, #sort').on('change', function(){ // update query parameters and go
        var newUrl = location.protocol+'//'+location.host+location.pathname+'?';
        urlParameters.sort = $('#sortField').val() + '|' + $('#sort').val();
        delete urlParameters.pos;
        newUrl += serializeObject(urlParameters);
        updateUrlAndGo(newUrl);
    });

    $('.addCommas, .property-price, .price').html(function(){ return commaSeparateNumber($(this).text().replace(/(\d{3})(\d{3})(\d{4})/, "($1) $2-$3")); });

    var itemSelector = '.retsList .property';
    if(listerType == 'map'){
        itemSelector = '#propertyList .property'
    }
    _initThumbnailsAndDetailLinks(itemSelector);

    console.log("Type Of");
    console.log(typeof(updatePropertyMap));

    //if ( listerType ) updatePropertyMap();

    if(typeof(updatePropertyMap) == 'function') updatePropertyMap();    // if this is the map page, it should have a function named updatePropertyMap, which we want to run now

}

function initializePropertyDetail(module, id, photoUrls) {

    var listerUrl = _getListerURL( sessionStorage.getItem('property_lister_type'), module );
    //todo back to list link?

    // Build lister links.
    $('a.searchResultsLink').each(function(){
        this.href += queryParameter+posParameter;
    });

    // Load Address Bar below Interior Header
    if ( $('.retsDetail-property-address-bar').length ) {
        $('.retsDetail-property-address-bar').remove().insertAfter('.pageHeader');
    }

    // Load photos.
    if(photoUrls) {
        console.log("Photo URLs");
        console.log(photoUrls);

        var $photoDiv = $('#photos'),
          photoUrlArray = photoUrls.split(',');

        for(var i=0; i<photoUrlArray.length; i++){
// 			$('<a class="item" href="'+photoUrlArray[i]+'" style="background-image: url(\''+photoUrlArray[i]+'\')"></a>').appendTo($photoDiv);
            $('<image class="carousel-image" src="'+photoUrlArray[i]+'" />').appendTo($photoDiv);
        }

        $('#photos').flickity({
            imagesLoaded: true,
            cellAlign:'left',
            arrowShape: {
                x0: 15,
                x1: 60, y1: 40,
                x2: 65, y2: 35,
                x3: 25
            }
        });

    }
}

/*** Open Houses ***/
function initOHDetailPhotos(listingID) {

    const $retsResUrl = 'index.php?src=directory&src=rets_res&srctype=rets_res_photos_ajax&query=misc0.eq.'+listingID+'&direct=json';
    const $retsMultiUrl = 'index.php?src=directory&src=rets_multi&srctype=rets_multi_photos_ajax&query=misc0.eq.'+listingID+'&direct=json';
    var $url = $retsResUrl;

    //TODO If we have Open Houses in Multi-Family Properties
    //if ( $propertyType === 'res' ) {
    //  $url = $retsResUrl;
    //} else if ( $propertyType === 'multi' ) {
    //  $url = $retsMultiUrl;
    //}

    $.ajax({
        url: 'index.php?src=directory&src=rets_resi&srctype=rets_res_photos_ajax&query=misc0.eq.'+listingID+'&direct=y',
        dataType: 'json',
        type: 'get',
        async: false,
        success: function( rsp,status,xhr ){

            var $photoUrls = rsp.split(',');
            //$('#photos').hide();
            if($photoUrls.length > 1) {
                var $photoDiv = $('#photos');

                for(var i=0; i<$photoUrls.length; i++){
                    $('<image class="carousel-image" src="'+$photoUrls[i]+'" />').appendTo($photoDiv);
                }

                $('#photos').flickity({imagesLoaded: true,cellAlign:'left',cellSelector: 'img', pageDots: false});
                $('.retsListLoader').remove();

            } else {
                $('#photos').hide();
                $('.retsModule .loader').remove();
            }

        },
        error: function(){
            console.log("ERROR: Open House Photos failed to load");
        },
        complete: function() {
            // Remove Loading
            $('.retsModule .loader').remove();
        }
    });

}

function ajaxOHThumbs($propertyType, listingID) {
    const $retsResUrl = 'index.php?src=directory&src=rets_res&srctype=rets_res_photos_ajax&query=misc0.eq.'+listingID+'&direct=json';
    const $retsMultiUrl = 'index.php?src=directory&src=rets_multi&srctype=rets_multi_photos_ajax&query=misc0.eq.'+listingID+'&direct=json';
    var $url = $retsResUrl;

    //TODO If we have Open Houses in Multi-Family Properties
    //if ( $propertyType === 'res' ) {
    //  $url = $retsResUrl;
    //} else if ( $propertyType === 'multi' ) {
    //  $url = $retsMultiUrl;
    //}

    $.ajax({
        url: 'index.php?src=directory&src=rets_resi&srctype=rets_res_photos_ajax&query=misc0.eq.'+listingID+'&direct=y',
        dataType: 'html',
        method: 'get',
        async: false,
        success: function( rsp,status,xhr ){

            var $photoUrls = rsp.split(',');
            var $thumb = $photoUrls[0];

            //console.log("Photos Array");
            //console.log($photosArray);

            //console.log("$photoUrls");
            //console.log($photoUrls);

            console.log("$thumb");
            console.log($thumb);

            if ($thumb !== '') {
                $('.retsList.retsOpenHouses .property[data-listing-id="'+listingID+'"] .image').css('background-image','url("'+$thumb+'")');
                //$('.retsList.retsOpenHouses .property[data-listing-id="'+$listingID+'"] .image').fadeIn(200);
            }

        },
        error: function(){
            console.log("ERROR: Open House Photos failed to load");
        },
        complete: function() {
            // Remove Loading
            $('.retsModule .loader').remove();
        }
    });
}

function initOpenHouseListerPhotos() {
    $('.retsList .property').each(function () {
        let listingID = $(this).data('listing-id');
        //let $propertyType = $(this).data('property-type');
        // Maybe TODO if they have other property types than Residential
        ajaxOHThumbs('res', listingID);
    });
}

/*** Offices and Agenets***/
function initAgentDetailPage(agentID){
    $('a.searchResultsLink').each(function(){
        this.href += queryParameter+posParameter;
    });
    //todo loop over all kinds of properties
    $('#propertyOfAgent').load('index.php?src=directory&view=rets_res&srctype=rets_res_of_agent&direct=json&query=misc8.eq.'+agentID, function(){
    });
}

function initOfficeDetailPage(officeID){
    $('a.searchResultsLink').each(function(){
        this.href += queryParameter+posParameter;
    });

    // Load agents of office.
    $('#agentsOfOffice').load('index.php?src=directory&view=rets_agent&srctype=rets_agents_of_agency&direct=y&query=Office_MUI.eq.'+officeID, function(){
    });
}
/*** Helper shared functions ***/
function _initThumbnailsAndDetailLinks(selector){
    if(selector === undefined){
        selector =  '.media-object';
    }
    $(selector).each(function(){
        var $this = $(this);
        var $image = $this.find('.image[data-photos]');

        $this.find('.detailUrl').each(function(){ this.href += posParameter; });

        if($image.length) $image.css('background-image', "url('" + $image.data('photos').split(',')[0] + "')");  // set thumbnail
    });

}

// Sets the Range of Data for Sliders such as Years (Age of House), Price, Bedrooms, Bathrooms, etc.
function getRangeData($start,$finish,$rangeStep) {
    // $thisYear is a Global Variable ^^ look up
    var $range = [];

    for (var i = $start; i <= $finish; i += $rangeStep) {
        $range.push(i);
    }
    return $range;
}

function setAgeRangeData() {
    let $startYear = 1900;
    let $range = getRangeData($startYear,$thisYear,10).toString();
    console.log("Range Years");
    console.log($range);
    $(".rangeSlider.age").attr("data-values", "," + $range + ",");
    if ( $('.retsAdvancedSearch-form label .thisYear').length ||  $('.retsAdvancedSearch-form label .startYear').text($startYear).length ) {
        $('.retsAdvancedSearch-form label .thisYear').text($thisYear);
        $('.retsAdvancedSearch-form label .startYear').text($startYear);
    } else {
        $('.retsAdvancedSearch-form label .thisYear, .retsAdvancedSearch-form label .startYear').remove();
    }
}

function _initializeSearchFormInputs(){
    if( $('#searchForm').length === 0 ){
        return;
    }
    $('.retsAdvancedSearch-form .multiselect select').attr('multiple', 'multiple').children('option').each(function(){
        this.textContent = this.textContent.replace(/&#039;/g, "'").replace(/&amp;/g, '&');
    });

    // Deselect first option upon selecting another one (for mobile).
    $('select[multiple="multiple"]').on('change',function(){
        var curSelect = $(this);
        if( curSelect.children('option').first().is(":selected") && curSelect.val().length > 1 ) {
            curSelect.children('option').first().prop('selected', false);
        }
    });

    // Initialize range slider form elements.
    // Sets the Date Range for Years (Age of House)
    setAgeRangeData();

    $('.rangeSlider').each(function(){
        var $this = $(this);

        if( $this.data('values') ) {    // handle positions will map to an array of values

            var sliderValues = $this.data('values').split(',');
            var $valType = 'commaNumber';

            if ( $this.hasClass('age') ) {
                $valType = 'age';
            } else {
                $valType = 'commaNumber';
            }

            $this.slider({
                range: true,
                min: 0,
                max: sliderValues.length-1,
                values: [0, sliderValues.length-1],
                slide: function(event, ui) {
                    var $slider = $(event.target).closest('.rangeSlider'),
                      sliderValues = $slider.data('values').split(','),
                      prefix = $slider.data('prefix') || '',
                      suffix = $slider.data('suffix') || '';

                    // set handle label
                    ( $valType === 'age' ) ? ui.handle.setAttribute('value', sliderValues[ui.value] > 0 ? prefix + sliderValues[ui.value] + suffix : '') : ui.handle.setAttribute('value', sliderValues[ui.value] > 0 ? prefix + commaSeparateNumber(sliderValues[ui.value]) + suffix : '');

                    $slider.siblings('input.rangeMin').val(sliderValues[ui.values[0]]);
                    $slider.siblings('input.rangeMax').val(sliderValues[ui.values[1]]);
                }
            });

        } else {

            $this.slider({
                range: true,
                min: $this.data('min') || 0,
                max: $this.data('max') || 100,
                values: [$this.data('min') || 0, $this.data('max') || 100],
                step: $this.data('step') || 1,
                slide: function(event, ui) {
                    var $slider = $(event.target).closest('.rangeSlider'),
                      prefix = $slider.data('prefix') || '',
                      suffix = $slider.data('suffix') || '';
                    ui.handle.setAttribute('value', ui.value > 0 ? prefix + commaSeparateNumber(ui.value) + suffix : '');  // set handle label
                    $slider.siblings('input.rangeMin').val(ui.values[0]);
                    $slider.siblings('input.rangeMax').val(ui.values[1]);
                }
            });

        }
    });
}

function propertySearchInputUpdate() {
    // Update Freedom Search Input with Value from Search field that has Placeholder
    $('.propertySearchWidget .propAction button').on('click', function (e) {
        e.preventDefault();

        let $searchVal = $('.propertySearchWidget .searchField').val();
        $('.propertySearchWidget .freedomSearchField input[type="text"]').val($searchVal);

        console.log("Search Val");
        console.log($searchVal)
    });
}

// Property Search Widget/Component
function _initPropertySearchWidget() {
    if ( $('.propertySearchWidget').length ) {

        // Initial Load Property Search Input Update
        //propertySearchInputUpdate();

        // Property Search Type Controls
        $('.propertySearchWidget-js a').each(function() {
            let $propertyType = $(this).data('property-type');
            $(this).on('click', function (e) {
                e.preventDefault();
                console.log("Property Search Widget");
                let $searchForm = 'index.php?src=directory&view=rets_res&srctype='+$propertyType+'_search_widget&direct=y';

                $('.propertySearchWidget-js a').removeClass('active');

                if ( $(this).data('property-type') === $propertyType ) $(this).addClass('active');

                // For Go Live Remove This Comment
                /*
                $('.propertySearchWidget .propSearch-input-wrapper').load($searchForm, function() {
                    propertySearchInputUpdate();
                });
                 */

            });
        });

    }
}

$(function(){

    $('.retsModule .addCommas, .property-price, .price').html(function(){ return commaSeparateNumber($(this).text()); });  // format big numbers
    $('.retsModule .phone .value, .phone .value').text(function(){ return $(this).text().replace(/(\d{3})(\d{3})(\d{4})/, "($1) $2-$3"); });  // format phone numbers, if necessary

    _initializeSearchFormInputs();
    initializePropertySearchForm();

    toggleSearchForm();

    _initPropertySearchWidget()

});