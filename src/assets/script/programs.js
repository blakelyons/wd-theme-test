// Begin Progrmas Module
//------------------------------------------------------------------------

// Global "Validation" Fields to Check
var globalValidationFields = {
    minAge: null,
    maxAge: null,
    minGrade: null,
    maxGrade: null,
    bypass: false,
    startDate: null,
    endDate: null
}

function loadProgramCourseDetailandValidationSettings() {

    var courseID = $('input[name="course_id"]').val();
    if(!courseID){
        if( $('input[name=fs_id]').val().indexOf('programs_') < 0 ){
            courseID = 2;
        }  else {
            return;

        }
    }
    $('#form').prepend('<div id="courseDetailJS"></div>');

    console.log('courseID' +courseID);
    var jqxhr = $.get("index.php?src=programs&srctype=programs_courses_detail_form_info&id=" + courseID + "&direct=y")
        .done(function(data, textStatus, jqXHR) {
            $('#courseDetailJS').html(data);
            var $dataObject = $('#courseDetailJS .courseDetail');
            //potential shortcut and refactor for data:
            // $.extend(globalValidationFields, $('#courseDetailJS .courseDetail').data() );

            // Use these for now
            globalValidationFields.minAge = $dataObject.data('min-age');
            globalValidationFields.maxAge = $dataObject.data('max-age');
            globalValidationFields.minGrade = $dataObject.data('min-grade');
            globalValidationFields.maxGrade = $dataObject.data('max-grade');

            var startDateRaw = $dataObject.data('start-date');
            var ageAsOfRaw = $dataObject.data('age-as-of-date');

            if(ageAsOfRaw != ''){
                startDate = new Date(ageAsOfRaw +' 00:00:00');
            } else {

                var monthNames = [ "January", "February", "March", "April", "May", "June","July", "August", "September", "October", "November", "December" ];

                var matches = startDateRaw.match(/([a-zA-Z]+)\s+(\d{1,2}),\s+(\d{4})/);

                var startDate = new Date();
                if(matches){
                    startDate.setYear(matches[3]);
                    startDate.setMonth(monthNames.indexOf(matches[1]));
                    startDate.setDate(matches[2]);
                }

            }
            globalValidationFields.startDate = startDate;

            console.log("Global Validation Fields");
            console.log(globalValidationFields);


        });
}

function programsModule() {

    $('body').addClass('programs');
    console.log('begin programs module init');


    // Separates the Attendees into <div> "rows" for better styling
    for (var i = 0; i < $('.repeatSection.first').length; i++) {
        var $trs = $('.repeatSection_' + i);
        $trs.wrapAll('<div class="group' + i + ' attendeeWrapper formContent"></div>');
        let count = i + 1;
        let classes = $trs.first().attr('class')
        console.log(classes);
        if(classes != '' && classes != undefined) {
            classes = classes.replace('formGroup formGroup--medium', 'formStaticText'); // add same classes as the first tr in group
        }
        $trs.first().before('<div class="' + classes + '"><h4>Attendee ' + count + '</h4></div>');
    }

    var objIds = FormsRepeatToolkit.getCopyIds('IDFormField_rpt_dob_0__rpt00');
    while( obj = document.getElementById(objIds.shift()) ) {
        $(obj).datepicker({'changeYear':true, changeMonth:true, yearRange: "1900:2020"});
    }


    // Move Validation Error Modal
    $("#courseDetailJS").after('<div class="errorModal"><div class="message callout">'+
        '<div><b>Error:</b> <span class="errorMessageJS"></span></div>'+
        '</div></div>');

    // Bypass Button - Charlotte does not want to allow bypass

    /*
    $("#courseDetailJS").after('<div class="errorModal"><div class="message callout">'+
          '<div><b>Error:</b> <span class="errorMessageJS"></span></div>'+
          '<div class=""><button id="YesBypass" class="button agate"><i class="fa fa-check" aria-hidden="true"></i> Yes</button> &nbsp; '+
          '<button id="NoBypass" class="button alert"><i class="fa fa-check" aria-hidden="true"></i> No</button></div>'+
      '</div></div>');
      $('#YesBypass').on('click', function(e) {
      e.preventDefault();
      console.log("Bypass Clicked");
      $('.errorModal .message').html("<p style='color: red; display: none;'><b>Note:</b> Restrictions have been bypassed.</p>");
      $('.errorModal .message > p').fadeIn(300);
      globalValidationFields.bypass = true;

      $('html, body').animate({
        scrollTop: ($('.errorModal').offset().top - 175)
      }, 500);
    });

    $('#NoBypass').on('click', function(e) {
      e.preventDefault();
      console.log("NoBypass Clicked");
      globalValidationFields.bypass = false;

      $('html, body').animate({
        scrollTop: ($('.errorModal').offset().top - 175)
      }, 500);
    });*/

    // Checking on the Age Restriction(s)
    function isValidAge(age) { return (age > 0 )? true: false; }

    // Checking on the Grade Restriction(s)
    function isValidGrade(grade) {
        return ( grade != '' && grade != "Not Applicable" ) ?  true : false;
    }

    function validateDOB(){

        var allowSubmit = true;

        if (globalValidationFields.bypass) {
            return true;
        }

        function calcAge(dateString) {
            var birthday = +new Date(dateString);
            var compareDate =  globalValidationFields.startDate ? globalValidationFields.startDate.getTime() : Date.now();

            return parseFloat( ((compareDate - birthday) / (31536000000)).toFixed(2) );
        }

        var objIds = FormsRepeatToolkit.getCopyIds('IDFormField_rpt_dob_0__rpt00');
        while( obj = document.getElementById(objIds.shift()) ) {
            if (obj !== null)  {

                var age = 0;
                if(obj.value !== ''){
                    var dob = obj.value;
                    age = calcAge(dob);
                }
                console.log(age);

                if ( (isValidAge(globalValidationFields.minAge) && age < globalValidationFields.minAge) || ( isValidAge(globalValidationFields.maxAge) && age > globalValidationFields.maxAge) ) {
                    $(obj).addClass('error');
                    allowSubmit = false;
                } else {
                    $(obj).removeClass('error');
                }
            }
        }

        return allowSubmit;


    }
    // Age "Validation"
    function validateAge() {

        var allowSubmit = true;

        if (globalValidationFields.bypass) {
            return true;
        }

        $(".repeatSection input[id*='age']").each(function() {
            let age = $(this).val();

            if ( (isValidAge(globalValidationFields.minAge) && age < globalValidationFields.minAge) || ( isValidAge(globalValidationFields.maxAge) && age > globalValidationFields.maxAge) ) {
                $(this).addClass('error');
                allowSubmit = false;
            } else {
                $(this).removeClass('error');
            }

        });

        return allowSubmit;

    }

    // Grade Validation
    function validateGrade() {

        // Allow Submit Unless We find Grades are out of the restriction range
        var allowSubmit = true;

        // Bypass Validation if Error Message was forced close and the user wants to submit anyway
        if (globalValidationFields.bypass) {
            return true;
        }

        $(".repeatSection select[id*='grade']").each(function() {
            var gradesArray = [];
            for ( var i in this.options ) {
                gradesArray.push(this.options[i].text);
            }

            let minGradeIndex = gradesArray.indexOf(globalValidationFields.minGrade);
            let maxGradeIndex = gradesArray.indexOf(globalValidationFields.maxGrade);

            // Min & Max Grades
            if ( ( isValidGrade(globalValidationFields.minGrade) && this.selectedIndex < minGradeIndex) || (isValidGrade(globalValidationFields.maxGrade) && this.selectedIndex > maxGradeIndex) ) {
                this.classList.add('error');
                allowSubmit = false;
            } else {
                this.classList.remove('error');
            }

        });

        return allowSubmit;
    }

    function setError(message, hasError){

        if (hasError || hasError === undefined) {
            $('.errorModal').addClass('active');
            if(message != ''){
                $('.errorMessageJS').html(message);
                $('html, body').animate({
                    scrollTop: ($('.errorModal').offset().top - 300)
                }, 500);
            }
            return false;
        } else {
            $('.errorModal').removeClass('active');
        }
    }

    window.validateAll = function() {

        var hasErrors = false;
        var aMessages = [];
        if(!validateDOB() || !validateAge() || !validateGrade() ){
            aMessages.push('Course age or grade restrictions do not allow this enrollment. Please contact the LJCC Customer Service Center if you have received this message in error or need assistance.');
            hasErrors = true;
        }


        if (globalValidationFields.bypass) {
            hasErrors = true;
        }

        setError(aMessages.join("\n<br>"), hasErrors);

        if(hasErrors){

            return false;
        }
        // Debugging
        console.log("Validation Passed");
        //return false;

        return true;
    }
}

$(function(){
    if($('#form').length && $('input[name=formmodule]').length && $('input[name=formmodule]').val() == 'programs'){

        loadProgramCourseDetailandValidationSettings();
    }

});

$(window).on('load', function() {
    if($('#form').length && $('input[name=formmodule]').length && $('input[name=formmodule]').val() == 'programs'){
        setTimeout(function(){
            programsModule();
            console.log('loaded');
        }, 500 );
    }
});


// END Programs