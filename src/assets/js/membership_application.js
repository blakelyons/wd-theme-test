// Global Variables
var app
var charSpecials = '!@#$%'
var charLowercase = 'abcdefghijklmnopqrstuvwxyz'
var charUppercase = 'ABCDEFGHIJKLMNOPQRSTUVWXYZ'
var charNumbers = '0123456789'
var charAll = charSpecials + charLowercase + charUppercase + charNumbers
var stepNum = 1; // Used for Previous Button goBackStep();
var join_fee = 0; // Default Set to 0
var valid = true;
var errors = [];

// Debugging
var bypass = false;
var debugButtons = true;
var showConsoleLogs = false;

var memberTypeFieldName = 'membership_type';
var caregiverFieldName = 'add_nanny';

// Custom Directory IDs for the Unit and Person Details Meta Tabs
// Remember that the fieldMap object will need to be manually adjusted for the Unit and Person Details Meta Tabs
var unit_directory_id = 'add_info_unit';

/*-------------------------------------------------------------------*/
// Pricing Variables
/*-------------------------------------------------------------------*/

// Lockers
var lockers_total = 0;

var locker_couple = {
  price: 65,
  desc: 'None'
}

var locker_individual = {
  price: 45,
  desc: ''
};

var child_locker = {
  price: 45,
  desc: ''
}

var ageRanges = {
  'YoungMin': 22,
  'YoungMax': 29,
  'TeenMin': 14,
  'TeenMax': 21,
  'SeniorMin': 65
}

var aLevelDescriptions = {
  'Family': {
    'Young': 'Young Family',
    'Default': 'Family'
  },
  'Couple': {
    'Young': 'Young Couple',
    'Default': 'Couple',
    'Senior': 'Senior Couple'
  },
  'Individual': {
    'Teen': 'Single Teen/College',
    'Default': 'Single Adult',
    'Senior': 'Senior Single',
    'Young': 'Young Single'
  },
  'Single_Parent': {
    'Default': 'Single Parent',
  }
}

var aMonthlyPrices = {
  'Family': {
    'Young': 100.00,
    'Default': 120.00
  },
  'Couple': {
    'Young': 85.00,
    'Default': 110.00,
    'Senior': 75.00
  },
  'Individual': {
    'Teen': 38.00,
    'Default': 70.00,
    'Senior': 45.00,
    'Young': 48.00
  },
  'Single_Parent': {
    'Default': 80.00
  }
}

var aAnnualPrices = {
  'Family': {
    'Young': 1200,
    'Default': 1440.00
  },
  'Couple': {
    'Young': 1020.00,
    'Default': 1320.00,
    'Senior': 900.00
  },
  'Individual': {
    'Teen': 456.00,
    'Default': 840.00,
    'Senior': 540.00,
    'Young': 576.00
  },
  'Single_Parent': {
    'Default': 970
  }
}

// Join Fee
var join_fees = {
  'Family': {
    join_fee: {
      'Default': 100.00
    }
  },
  'Couple': {
    join_fee: {
      'Default': 100.00,
      'Senior': 75.00
    }
  },
  'Individual': {
    join_fee: {
      'Default': 100.00,
      'Teen': 50.00,
      'Senior': 50.00,
      'Young': 50.00
    }
  },
  'Single_Parent': {
    join_fee: {
      'Default': 75.00
    }
  }
}

/*-------------------------------------------------------------------*/
// Helper Functions
/*-------------------------------------------------------------------*/

// TODO
function duesLevelsLookup(level) {
  console.log("Dues Levels Lookup: " + level);

  if (Object.keys(FreedomDuesCalculatorConfig).indexOf(level) !== -1) {
    //console.log(FreedomDuesCalculatorConfig[level].base_price);
    $('#member_amount').text('$'+parseInt(FreedomDuesCalculatorConfig[level].base_price).toFixed(2));
    return parseInt(FreedomDuesCalculatorConfig[level].base_price);
  }
}

function membershipType() {
  $('[name="formField_membership_type"]').on('change', function() {
    let $membershipType = $(this).val();
    $("#IDFormField_add_locker_0 option[value='2']").attr('disabled',false);
    if ( ($membershipType === 'Couple' || $membershipType === 'Family')  ) {
      $('[name="formField_add_locker"]').val('no') ;
      $('[name="formSecurity_'+unit_directory_id+'_locker_one"]').parent().css('opacity','0').css('visibility','hidden');
      $('[name="formSecurity_'+unit_directory_id+'_locker_one"]').val('');
      $('[name="formSecurity_'+unit_directory_id+'_locker_two"]').parent().css('opacity','0').css('visibility','hidden');
      $('[name="formSecurity_'+unit_directory_id+'_locker_two"]').val('');
    } else {
      $('[name="formField_add_locker"]').val('no') ;
      $('[name="formSecurity_'+unit_directory_id+'_locker_one"]').parent().css('opacity','0').css('visibility','hidden');
      $('[name="formSecurity_'+unit_directory_id+'_locker_one"]').val('');
      $('[name="formSecurity_'+unit_directory_id+'_locker_two"]').parent().css('opacity','0').css('visibility','hidden');
      $('[name="formSecurity_'+unit_directory_id+'_locker_two"]').val('');
      $("#IDFormField_add_locker_0 option[value='2']").attr('disabled','disabled');
    }
    $('[name*="formField_rpt_birthdate"]').addClass('rpt_birthdate');
  });
}

// Creates Repeat Fields
function onCountFieldsChange (e) {
  var count = 0

  $('select[name$=children_count]').prop('disabled', false)

  var typeMap = []
  switch ($('select[name$='+memberTypeFieldName+']').val()) {
    case 'Couple':
      $('select[name$=children_count]').val(0)
      $('select[name$=children_count]').prop('disabled', true)
    case 'Family':
      count += 2
      typeMap.push('Adult')
      typeMap.push('Adult')
      break;
    case 'Individual':
      $('select[name$=children_count]').val(0);
      $('select[name$=children_count]').prop('disabled', true);
      count += 1;
      typeMap.push('Adult');
      break;
    case 'Single_Parent':
      count += 1
      typeMap.push('Adult');
      break;
  }

  var children = (parseInt($('select[name$=children_count]').val()) || 0)
  for (var i = 0; i < children; i++) {
    typeMap.push('Child')
  }
  count += children

  if ($('select[name$='+caregiverFieldName+']').val().toLowerCase() == 'yes') {
    count += 1
    typeMap.push('Nanny')
  }
  FormsRepeatToolkit.setTypeMap(typeMap)
  $('#IDFormField_Repeat_Quantity_0').val(count).trigger('change')

}

function paymentMethodChanged() {
  var method = $('#IDFormField_method_0 option:selected').val()
  if (method == 'credit card') {
    $('#IDFormField_save_billing_info_0_group').show();
    $('#sectionCreditCard').toggle(true);
    $('#sectionCheck').toggle(false);
  } else if (method == 'echeck') {
    $('#IDFormField_save_billing_info_0_group').show();
    $('#sectionCreditCard').toggle(false);
    $('#sectionCheck').toggle(true);
  } else {
    $('#IDFormField_save_billing_info_0_group').hide();
    $('#sectionCreditCard').toggle(false);
    $('#sectionCheck').toggle(false);
  }
}

// Previous Button
function goBackStep(button) {
  let $section = $(button).parents('.formSectionContent');

  $section.slideUp().prev('.formSectionHeading').prev('.formSectionContent').slideDown();

  // Track Step Number
  stepNum -= 1;
  console.log("Prev Step # " + stepNum);
  setTimeout(function() {
    console.log("Scrolling");
    $([document.documentElement, document.body]).animate({
      scrollTop: $('.formSectionHeading[data-step="'+stepNum+'"]').offset().top - 100
    }, 200);
  }, 500);
}

function maskPhoneNumbers() {
  var mask1 = Maska.create('#IDFormField_phone_0', {
    mask: '(###) ###-####'
  })
  var mask2 = Maska.create('#IDFormField_add_info_emergency_phone_0', {
    mask: '(###) ###-####'
  })

  var mask3 = Maska.create('[name*="phone"]', {
    mask: '(###) ###-####'
  })

  // Maska Only Works on Dynamically Added Fields if you target the document.on
  $(document).on('keyup', '[name*="phone"]', function () {
    Maska.create('[name*="phone"]', {
      mask: '(###) ###-####'
    })
  });
}

function addressSameAs() {
  //init home address hide / show
  $('input[name$=address_same_as]').on('change', function () {

    var bDisabled = false
    if ($(this).is(':checked')) {
      bDisabled = true
    }

    $('#sectionHomeAddress').toggle(!bDisabled)

    $.each(['address', 'address2', 'city', 'state', 'province', 'zip'],
      function (idx, fieldName) {
        $(':input[ name$="' + fieldName + '" ]').prop('disabled', bDisabled);
      })

  }).triggerHandler('change');
}

function initlockers() {
  // Update Locker Price in Locker Information Section
  $('.lockerPrice--individual').text(locker_individual.price);
  $('.lockerPrice--couples').text(locker_couple.price);

  $('#IDFormField_add_locker_0').on('change', function() {
    if ($('[name=formField_add_locker]').val() !== 'no') {
      $('#locker_amount_row').show();
    } else {
      $('#locker_amount_row').hide();
    }
    CalculateLockers();
  });

  $('[name="formField_add_locker"]').on('change', function() {
    let $locker = $(this).val();
    if ( $locker === '2' && ($('[name="formField_membership_type"]').val() === 'Couple' || $('[name="formField_membership_type"]').val() === 'Family') ) {

      $('[name="formSecurity_'+unit_directory_id+'_locker_one"], [name="formSecurity_'+unit_directory_id+'_locker_two"]').parent().css('visibility','visible').css('opacity','1');

      if ( $('[name="formSecurity_'+unit_directory_id+'_locker_two"]').prop('disabled') === true ) {
        $('[name="formSecurity_'+unit_directory_id+'_locker_two"]').prop('disabled',false);
      }

    } else if ( $locker === '1' && ($('[name="formField_membership_type"]').val() === 'Couple' || $('[name="formField_membership_type"]').val() === 'Family') ) {

      $('[name="formSecurity_'+unit_directory_id+'_locker_one"]').parent().css('visibility','visible').css('opacity','1');
      $('[name="formSecurity_'+unit_directory_id+'_locker_two"]').parent().css('visibility','hidden').css('opacity','0');

    } else if ( $locker === '1' && ($('[name="formField_membership_type"]').val() !== 'Couple' || $('[name="formField_membership_type"]').val() !== 'Family') ) {

      $('[name="formSecurity_'+unit_directory_id+'_locker_one"]').parent().css('visibility','visible').css('opacity','1');
      $('[name="formSecurity_'+unit_directory_id+'_locker_two"]').parent().css('visibility','hidden').css('opacity','0');

    } else {
      $('[name="formSecurity_'+unit_directory_id+'_locker_one"], [name="formSecurity_'+unit_directory_id+'_locker_two"]').parent().css('visibility','hidden').css('opacity','0');
    }

  });
}

function ChildLockers() {
  $('.repeatSectionWrap').each(function() {
    let individualType = $(this).find('[name*="rpt_type"]').val();
    if (individualType === 'Child') {
      console.log("Child Locker");
      $(this).find('[name*="rpt_locker"]').fadeIn(200);
    } else {
      $(this).find('[name*="rpt_locker"]').hide();
    }
  });
}

function CalculateLockers(paymentOption) {
  lockers_total = 0;

  console.log("Calculate Lockers Payment Option: " + paymentOption);
  console.log("Lockers Total: " + lockers_total);
  let membership_type = $('#IDFormField_membership_type_0').val();
  if ( membership_type === 'Couple' || membership_type === 'Family' ) {
    $('.lockerCouple').fadeIn(200);

    if ($('#IDFormField_add_locker_0').val() === '1') {
      $('#IDFormField_'+unit_directory_id+'_locker_two_0').val('no').prop('disabled',true);

      if ( $('[name="formSecurity_'+unit_directory_id+'_locker_one').val() !== '' ) {
        ( paymentOption == 'annual' ) ? lockers_total = locker_individual.price * 12 : lockers_total = locker_individual.price;
      }

      if ( $('[name="formSecurity_'+unit_directory_id+'_locker_two').val() !== '' ) {
        ( paymentOption == 'annual' ) ? lockers_total = locker_individual.price * 12 : lockers_total = locker_individual.price;
      }
    }

    if ($('#IDFormField_add_locker_0').val() === '2') {
      ( paymentOption == 'annual' ) ? lockers_total = locker_couple.price * 12 : lockers_total = locker_couple.price;
    }

    //lockers_total = locker_couple.price;
    console.log("Lockers Total: " + lockers_total);
  } else {
    $('.lockerCouple').fadeOut(200);

    if ( $('#IDFormField_membership_type_0').val() === 'Individual' || $('#IDFormField_membership_type_0').val() === 'Single_Parent') {
      lockers_total = locker_individual.price;
    }

    if ( $('[name="formSecurity_'+unit_directory_id+'_locker_one').val() !== '' ) {
      ( paymentOption == 'annual' ) ? lockers_total = locker_individual.price * 12 : lockers_total = locker_individual.price;
    }

    if ( $('[name="formSecurity_'+unit_directory_id+'_locker_two').val() !== '' ) {
      ( paymentOption == 'annual' ) ? lockers_total = locker_individual.price * 12 : lockers_total = locker_individual.price;
    }

    $('#locker_amount_row').show();

    console.log("Lockers Total:" + lockers_total);

    var child_lockers_total = 0;
    if ($('[name*="formField_rpt_locker"]').length) {
      $('[name*="formField_rpt_locker"]').each(function() {
        let childLocker = $(this).val();
        if (childLocker === 'yes') {
          child_lockers_total += ( paymentOption == 'annual' ) ? child_lockers_total = child_locker.price * 12 : child_lockers_total = child_locker.price;
        }
      });
      console.log("Child Lockers Total: " + child_lockers_total);
      lockers_total = lockers_total + child_lockers_total;
    }
  }
  // Update Locker Price in Summary Table
  $('#locker_amount').text(formatPrice(lockers_total));
  let lockerOne = $('#IDFormField_'+unit_directory_id+'_locker_one_0').val();
  let lockerTwo = $('#IDFormField_'+unit_directory_id+'_locker_two_0').val();
  (lockerOne !== '' || lockerTwo !== '') ? $('.lockerDescriptions').show() : $('.lockerDescriptions').hide();
  if (lockerOne !== '') $('.lockerOneDesc').html("<b>Locker #1:</b> " + lockerOne);
  if (lockerTwo !== '') $('.lockerTwoDesc').html("<b>Locker #2:</b> " + lockerTwo);
  return lockers_total;
}

$(document).on('change','.rpt_child .rpt_birthdate', function() {
  let birthday = +new Date($(this).val());
  let compareDate = Date.now();
  let age = parseFloat(((compareDate - birthday) / (31536000000)).toFixed(2));
  console.log("Birthday: " + age);

  if ( age > 18 ) {
    $(this).parent().parent().find('.rpt_locker_row').fadeIn(200);
    $(this).parent().parent().find('.rpt_locker_row input[name*="rpt_locker"]').removeAttr('disabled');
  } else {
    $(this).parent().parent().find('.rpt_locker_row').fadeOut(200);
    $(this).parent().parent().find('.rpt_locker_row input[name*="rpt_locker"]').attr('disabled');
  }
});

function formatPrice (price, prefix) {
  if (typeof prefix == 'undefined') {
    prefix = '$'
  }
  return prefix + price.toFixed(2).replace(/\B(?=(\d{3})+(?!\d))/g, ',');
}

function calcAge (dateString) {
  var birthday = +new Date(dateString);
  var compareDate = Date.now();
  return parseFloat(((compareDate - birthday) / (31536000000)).toFixed(2));
}

function CalculateFamilyCoupleRate(adult1, adult2, memberType) {
  if (memberType == 'Couple') {
    // Senior Rate
    if (calcAge(adult1) > ageRanges.SeniorMin || calcAge(adult2) > ageRanges.SeniorMin) {
      subtype = 'Senior';
      join_fee = join_fees.Couple.join_fee.Senior;
    } else {
      subtype = 'Default';
      join_fee = join_fees.Couple.join_fee.Default;
    }
  } else if (memberType == 'Family') {
    join_fee = join_fees.Family.join_fee.Default;
  }
}

function CalculateIndividualRate(adult1) {
  console.log("Calculate Individual Rate adult1: " + adult1);
  if (calcAge(adult1) > ageRanges.SeniorMin) {
    subtype = 'Senior';
    description = 'Senior Single';
    join_fee = join_fees.Individual.join_fee.Senior;
  } else if (calcAge(adult1) > ageRanges.TeenMin && calcAge(adult1) < ageRanges.TeenMax) {
    subtype = 'Teen';
    join_fee = join_fees.Individual.join_fee.Teen;
  } else if (calcAge(adult1) > ageRanges.YoungMin && calcAge(adult1) < ageRanges.YoungMax) {
    subtype = 'Young';
    join_fee = join_fees.Individual.join_fee.Young;
  } else {
    join_fee = join_fees.Individual.join_fee.Default;
  }
}

function setAgeRangeGroup(ageGroup) {
  $('[name=formField_designated_age_group]').val(ageGroup);
}

function CalculateEstimatedTotal() {
  var paymentOption = $('input[name=formField_payment_option]:checked').val();

  // Member Type
  var memberType = $('#IDFormField_membership_type_0').val();
  var subtype = 'Default'; // Default Subtype

  switch (memberType) {
    case 'Couple':
    case 'Family':
      // Ages of Adults of the Family
      var adult1 = document.getElementById('IDFormField_rpt_birthdate_0_1').value;
      var adult2 = document.getElementById('IDFormField_rpt_birthdate_0_2').value;

      (memberType == 'Couple') ? CalculateFamilyCoupleRate(adult1, adult2, 'Couple') : CalculateFamilyCoupleRate(adult1, adult2, 'Family');
      break
    case 'Individual':
      var adult1 = document.getElementById('IDFormField_rpt_birthdate_0_1').value;

      CalculateIndividualRate(adult1);
      break
    case 'Single_Parent':
      join_fee = join_fees.Single_Parent.join_fee.Default;
      setAgeRangeGroup('Single Parent');
      break
  }

  console.log("Member Type: " + memberType);
  console.log("Member Subtype: " + subtype);

  // Monthly/Annual Rates
  if (paymentOption == 'annual' && memberType !== undefined && subtype !== undefined) {
    var member_total = aAnnualPrices[memberType][subtype];
  } else {
    var member_total = aMonthlyPrices[memberType][subtype];
  }

  // Update Member Total
  $('#member_amount').text(formatPrice(member_total));
  $('#member_amount_row').find('.add_desc').text(aLevelDescriptions[memberType][subtype]);

  $('#join_amount').text(formatPrice(join_fee));

  // Caregiver
  $('#nanny_amount_row').hide();
  var nanny_total = 0;

  if ($('#IDFormField_add_nanny_0').val().toLowerCase() == 'yes') {
    if ( paymentOption == 'annual' ) {
      nanny_total = 25 * 12;
      console.log("Nanny Total: " + nanny_total);
    } else {
      nanny_total = 25;
      console.log("Nanny Total: " + nanny_total);
    }
    $('#nanny_amount').text(formatPrice(nanny_total));
    $('#nanny_amount_row').show()
  }

  // Lockers
  ChildLockers();
  console.log("Lockers Total " + lockers_total);

  //discounts
  var discount_total = 0
  var discount_words = ''
  var recurring_total = member_total;
  $('#discount_amount_row').find('.add_desc').text($('input[name$=formField_discounts]:checked').val())

  switch ($('input[name$=formField_discounts]:checked').val()) {
    case 'Civil Servant':
      discount_total = 70.00
      discount_words = '-' + formatPrice(discount_total)
      break
    case 'Shalom Park Staff':
      discount_total = recurring_total * .25
      discount_words = '25% off (-' + formatPrice(discount_total) + ')'
      break
    case 'Moishe House':
      discount_words = 'TBD'
      break
  }

  var lockers = CalculateLockers(paymentOption);

  recurring_total = (recurring_total - discount_total) + nanny_total + lockers;

  if (paymentOption == 'month') {
    preferredView = 'Monthly'
  } else {
    preferredView = 'Annually'
  }

  $('#recurring_amount_row').find('.add_desc').html(preferredView)
  $('#recurring_amount').html(formatPrice(recurring_total))

  var total = recurring_total + join_fee
  console.log(total, recurring_total)
  $('#total_amount, .reviewTotal').text(formatPrice(total))

  $('.reviewTotal').text(formatPrice(total) + ' ('+preferredView+')');

  $('input[name$=estimated_total]').val(total)
}

function showHideHeardFields() {
  $('[name="formField_we_heard_about_jcc_through[]').each(function() {
    $(this).on('change', function() {
      let referrer = $(this).val();
      console.log("Refferrer: " + referrer);
      if ( $(this).prop('checked') && referrer != 'JCC_Stamford_Former_Member' ) {
        $('[data-referrer="'+referrer+'"]').fadeIn(200);
      } else if ($(this).prop('checked') && referrer === 'JCC_Stamford_Former_Member') {
        $('[data-referrer="'+referrer+'"]').fadeIn(200);
        $('[data-referrer="JCC_Stamford_Former_Member_Where"]').fadeIn(200);
        $('[data-referrer="JCC_Stamford_Former_Member_Where"]').fadeIn(200);
      } else {
        $('[data-referrer="'+referrer+'"]').hide();
        $('[data-referrer="JCC_Stamford_Former_Member_Where"]').hide();
        $('[data-referrer="JCC_Stamford_Former_Member_Where"]').hide();
      }
    });
  });
}

function showHideFields(controlField, controlFieldType, showHideFields, condition) {

}

/*-------------------------------------------------------------------*/
// Create Unit & Person Login Credentials
/*-------------------------------------------------------------------*/

function createRandomSuffix () {
  return ((Math.random() * 10000) + 80000).toFixed(0) // Creates Random Suffix in Range of 80000 to 90000
}

function pickCharacters (typeVar, numberVar) {
  chars = ''
  for (var i = 0; i < numberVar; i++) { chars += typeVar.charAt(Math.floor(Math.random() * typeVar.length)) }
  return chars
}

function shuffleCharacters (charVar) {
  var array = charVar.split('')
  var tmp, current, top = array.length
  if (top) while (--top) {
    current = Math.floor(Math.random() * (top + 1))
    tmp = array[current]
    array[current] = array[top]
    array[top] = tmp
  }
  return array.join('')
}

function createRandomPassword () {
  var password = ''

  password += getPasswordWord(7)
  password += pickCharacters(charNumbers, getRandomInt(1, 2))
  password += pickCharacters(charSpecials, 1)

  return password
}

function getRandomInt (min, max) {
  return Math.floor(Math.random() * (max - min + 1)) + min
}

function getPasswordWord (n) {
  let data1 = ['a', 'e', 'i', 'o', 'u']
  let data2 = ['b', 'c', 'd', 'f', 'g', 'h', 'j', 'k', 'l', 'm', 'n', 'p', 'q', 'r', 's', 't', 'v', 'w', 'x', 'y', 'z']
  let data3 = ['bl', 'br', 'cl', 'cr', 'dr', 'dw', 'fl', 'fr', 'gl', 'gr', 'gw', 'kn', 'kr', 'kw', 'mr', 'ph', 'pl', 'pn', 'pr', 'ps', 'sc', 'sh', 'sk', 'sl', 'sm', 'sn', 'sp', 'st', 'sv', 'sw', 'tr', 'ts', 'wh']

  let str = ''
  let last = null
  for (var i = 0; i < n; i++) {
    var type = getRandomInt(1, 10)
    //avoiding some cases
    if (last === 3)
      type = 1
    if (last === 2)
      type = 1
    if (last === 1 && getRandomInt(1, 2) === 1)
      type = 2
    //generate
    if (type < 4) { //40%
      str += data1[getRandomInt(0, data1.length - 1)]
      last = 1
    } else if (type < 8) {  //40%
      str += data2[getRandomInt(0, data2.length - 1)]
      last = 2
    } else { //20%
      str += data3[getRandomInt(0, data3.length - 1)]
      last = 3
    }
  }
  str = str.charAt(0).toUpperCase() + str.slice(1)
  return str
}

/*-------------------------------------------------------------------*/
// Member App Toolkit - Creates Units & People
/*-------------------------------------------------------------------*/

function MemberAppToolkit () {

  var self = this

  self.g_memberid = 0//82529
  self.registrationProcess = []

  var data = {
    g_suffix: createRandomSuffix(),
    g_password: createRandomPassword()
  }

  function init () {
    $('input[name$="password"]').val(data.g_password)
  }

  init();

  function getUserName() {
    return $('#IDFormField_userid_0').val();;
  }

  function getFormValues () {
    return $('#form').serializeArray()
  }

  function getJewishStatus () {
    return $('#IDFormField_'+unit_directory_id+'_misc1_0').val()
  }

  this.createIndividualSubmission = function (rptId) {
    // For Creating Members within Group
    var formValues = getFormValues()

    function rptval (key) {
      var fullkey = 'formField_' + key + '_' + rptId;
      var field = formValues.find(el => el.name == fullkey);

      if (key === 'rpt_birthdate') {
        var dob = field.value;
        const dob_regex = /^(\d{2})\/(\d{2})\/(\d{4})$/;
        dob = dob.match(dob_regex);
        const MM = dob[1];
        const DD = dob[2];
        const YYYY = dob[3];
        const sqlDate = YYYY + "-" + MM + "-" + DD;
        return sqlDate ? field.value : '';
      } else {
        console.log("rptval: " + (field ? field.value : ''));
        return field ? field.value : '';
      }
    }

    function formval (key) {
      var field = formValues.find(el => el.name == key)
      return field ? field.value : ''
    }

    var bHasOwnAddress = (rptval('rpt_address_same_as') !== 1);

    console.log("User ID: " + rptval('rpt_fname').toLowerCase() + rptval('rpt_lname').toLowerCase() + data.g_suffix);

    var fieldMap = {
      'formSecurity_display_name': rptval('rpt_fname') + ' ' + rptval('rpt_lname')
      , 'formSecurity_userid': rptval('rpt_fname').toLowerCase() + rptval('rpt_lname').toLowerCase() + data.g_suffix
      , 'formSecurity_password': data.g_password
      , 'formSecurity_company': formval('formSecurity_company')
      , 'formSecurity_add_info_unit_email': formval('formField_Email')
      , 'formSecurity_phone': formval('formSecurity_phone')
      , 'formField_formal_addressee': formval('formSecurity_add_info_unit_formal_addressee')
      , 'formSecurity_add_info_unit_misc2': formval('formSecurity_add_info_unit_misc2')
      , 'formSecurity_address': bHasOwnAddress ? rptval('rpt_address') : ''
      , 'formSecurity_address2': bHasOwnAddress ? rptval('rpt_address2') : ''
      , 'formSecurity_city': bHasOwnAddress ? rptval('rpt_city') : ''
      , 'formSecurity_state': bHasOwnAddress ? rptval('rpt_state') : ''
      , 'formSecurity_zip': bHasOwnAddress ? rptval('rpt_zip') : ''
      , 'formSecurity_add_info_unit_misc1': formval('formSecurity_add_info_unit_misc1')
      , 'formSecurity_add_info_unit_congregation_affiliation': formval('formSecurity_add_info_unit_congregation_affiliation')
      , 'formField_we_heard_about_jcc_through[]': formval('formField_we_heard_about_jcc_through[]')
      , 'formSecurity_add_info_unit_misc6': formval('formSecurity_add_info_unit_misc6')
      , 'formSecurity_add_info_unit_misc5': formval('formSecurity_add_info_unit_misc5')
      , 'formSecurity_add_info_unit_misc9': formval('formSecurity_add_info_unit_misc9')
      , 'formSecurity_add_info_unit_realtor_referral': formval('formSecurity_add_info_unit_realtor_referral')
      , 'formSecurity_add_info_unit_misc8': formval('formSecurity_add_info_unit_misc8')
      , 'formSecurity_add_info_emergency_contact': formval('formSecurity_add_info_unit_emergency_contact')
      , 'formSecurity_add_info_emergency_phone': formval('formSecurity_add_info_unit_emergency_phone')
      , 'formSecurity_add_info_emergency_relation': formval('formSecurity_add_info_unit_emergency_relation')

      , 'formSecurity_person_details_individual_type': rptval('rpt_type')
      , 'formSecurity_first_name': rptval('rpt_fname')
      , 'formSecurity_last_name': rptval('rpt_lname')
      , 'formSecurity_prefix': rptval('rpt_prefix')
      , 'formSecurity_suffix': rptval('rpt_suffix')
      , 'formSecurity_contact_fname': rptval('rpt_fname')
      , 'formSecurity_contact_lname': rptval('rpt_lname')
      , 'formSecurity_contact_prefix': rptval('rpt_prefix')
      , 'formSecurity_contact_suffix': rptval('rpt_suffix')
      , 'formSecurity_person_details_name': formval('formSecurity_name')
      , 'formSecurity_person_details_nickname': rptval('rpt_nickname')
      , 'formSecurity_person_details_misc9': rptval('rpt_gender')
    }

    $('#IDFormField_userid_0').val(rptval('rpt_fname').toLowerCase() + rptval('rpt_lname').toLowerCase() + data.g_suffix);

    var formExtra = '&formSecurity_group=Pending%20Members&formSecurity_expiration_days=1&formSecurity_usertype=Person&edit_id=0&module=&src=forms&srctype=process&id=membership_application_person_submission&fs_id=membership_application_person_submission'

    return $.param(fieldMap) + formExtra
  }
  this.submitRegistration = function (event) {
    if (event) event.preventDefault()


    // enable the repeat type field so it can be submitted
    var objIds = FormsRepeatToolkit.getCopyIds('IDFormField_rpt_type_0__rpt00');

    while (obj = document.getElementById(objIds.shift())) {
      if (obj != null && obj.disabled) {
        obj.disabled = false
      }
    }

    $('#IDFormField_company_0').val($('#IDFormField_company_0').val() + ' Account')
    $('#IDFormField_display_name_0').val($('#IDFormField_company_0').val())

    $('#reviewInfo').slideUp();
    $('#progressInfo').show();
    // Progress Bar
    showProgressBarStatus();
    setRegistrationProgress('Preparing Application...')
    $('.formSectionHeading').addClass('locked')

    // var $formData = $('#form').serializeArray();

    // Build Out Process Array - Group Submission
    var processBuilder = [

      // Log Out of Any Current Account
      {
        p_name: 'Preparing Application', p_status: 0, p_complete: false, p_function: function () {
          setTimeout(function () {
            setRegistrationProgress('Working... 0%');
            setProgressBarStatus(0);
            self.logOutMember(true);
          }, 1000)
        }
      },

      // Create Family Unit
      {
        p_name: 'Creating Unit', p_status: 0, p_complete: false, p_function: function () {
          self.submitMainAccount(true)
        }
      },

      // Log In
      {
        p_name: 'Logging In', p_status: 0, p_complete: false, p_function: function () {
          setTimeout(function () {
            self.logInMember(true)
          }, 1000)
        }
      },

      // Retrieve User ID
      {
        p_name: 'Retreiving Family Membership ID', p_status: 0, p_complete: false, p_function: function () {
          setTimeout(function () {
            self.getMemberID(true)
          }, 1000)
        }
      }
    ]

    // Push in Step for Each Family Member
    for (var irecord = 1; irecord <= FormsRepeatToolkit.getCount(); irecord++) {
      var recordIndex = irecord
      processBuilder.push(
        {
          p_name: 'Creating Family Member: ' + recordIndex,
          p_query: self.createIndividualSubmission(irecord),
          p_status: 0,
          p_complete: false,
          p_function: function () {
            self.submitToGroupEndpoint(this.p_query, 'individual', true)
          }
        }
      )
    }
    // End of Group Submission Process

    // Move process to app, initialize after short delay
    self.registrationProcess = processBuilder
    setTimeout(self.nextProcess, 500)

  },
    this.submitMainAccount = function (nextStep) {
      $.ajax({
        url: 'index.php',
        type: 'POST',
        data: $('#form').serialize() + '&displaytype=Ajax',
      }).done(function (rsp) {
        //next step
        if ($(rsp).find('.freedomFormError').length) {
          let errorMessage = $(rsp).find('.freedomFormError').html();
          console.log("rsp error message: " + errorMessage);
          //refresh tokens for resubmittal
          $('#form').find('input[name="hash"]').val($(rsp).find('input[name="hash"]').val())
          $('#form').find('input[name="csrfToken"]').val($(rsp).find('input[name="csrfToken"]').val())

          self.terminateProcessing(errorMessage);
        } else {
          //successful submission
          $('#progressInfo').after($(rsp).find('.content-body').addClass('formSectionContent thankyouInfo'))
          if (typeof nextStep != 'undefined' && nextStep === true) {
            self.completeProcess()
            self.nextProcess()
          }
        }
      });
    }
  this.submitToGroupEndpoint = function (submissionString, submissionType, nextStep) {
    if (submissionType == 'individual') { console.log('memberid: ' + self.g_memberid) }
    $.ajax({
      cache: false,
      url: 'index.php?src=forms&ref=membership_application_person_submission',
      dataType: 'html',
      success: function (response) {
        $.ajax({
          url: 'index.php',
          type: 'POST',
          data: submissionString + '&hash=' + $(response).find('input[name="hash"]').val() + '&csrfToken=' + $(response).find('input[name="csrfToken"]').val() + ((submissionType == 'individual') ? '&formSecurity_add_to_parent=' + self.g_memberid : ''),
          success: function (data, textStatus, jqXHR) {
            //todo better errorhandling
            console.log('Successfully Submitted Member to Contact Database!');
            setProgressBarStatus(100);
            $('#progressBar').fadeOut(200);
            if (typeof nextStep != 'undefined' && nextStep === true) {
              self.completeProcess()
              self.nextProcess()
            }
          },
          error: function (jqXHR, textStatus, errorThrown) {
            console.log('Failure Submitting Member!');
          }
        })
      }
    })
  }
  this.logOutMember = function (nextStep) {

    $.get({
      cache: false,
      url: 'api/web/authenticate.logout',
      success: function (response) {
        console.log('Log Out Member Success! Response: ', response)
        if (typeof nextStep != 'undefined' && nextStep === true) {
          self.completeProcess()
          self.nextProcess()
        }
      }
    })
  }
  this.logInMember = function (nextStep) {
    var params = {
      'username': getUserName(),
      'password': $('#IDFormField_password_0').val(),
      'returnToken': 1
    }

    console.log('params: ' + params)

    $.ajax({
      cache: false,
      url: 'api/web/authenticate.login',
      type: 'POST',
      data: JSON.stringify(params),
      dataType: 'json',
      success: function (response, XMLHttpRequest, textStatus, errorThrown) {
        console.log('Response Status: ' + response.status)
        console.log('XMLHttpRequest: ' + XMLHttpRequest)

        if (response.status === 'ok') {
          console.log('Log In Member Success! Response: ', response)
          if (typeof nextStep != 'undefined' && nextStep === true) {
            self.completeProcess()
            self.nextProcess()
          }
        } else {
          console.log('Response Status Again: ' + response.status)
          self.terminateProcessing()
        }

        if (response.status == 'error') {
          console.log('Response Status Again: ' + response.status)
          self.terminateProcessing()
        } else {
          console.log('Log In Member Success! Response: ', response)
          if (typeof nextStep != 'undefined' && nextStep === true) {
            self.completeProcess()
            self.nextProcess()
          }
        }
      }
    })
  }
  this.checkLoginStatus = function (nextStep) {
    $.ajax({
      cache: false,
      url: 'index.php?src=membership&srctype=membership_registration_login_check_url&direct=json',
      dataType: 'html',
      success: function (response) {
        console.log('Check Login Success! Response: ' + response)
        if (typeof nextStep != 'undefined' && nextStep === true) {
          self.completeProcess()
          self.nextProcess()
        }
      }
    })
  }
  this.getMemberID = function (nextStep) {
    $.ajax({
      cache: false,
      url: 'api/account/me.info',
      success: function (response) {
        console.log('Get User ID Response: ', response)
        if (response.status == 'ok') {
          console.log('Valid Member ID! - "' + response.data.id + '"')
          self.g_memberid = response.data.id
          if (typeof nextStep != 'undefined' && nextStep === true) {
            self.completeProcess()
            self.nextProcess()
          }
        } else {
          self.terminateProcessing();
        }

      }
    })
  }
  this.completeProcess = function () {
    if (self.registrationProcess.length) {
      for (var rprocess = 0; rprocess < self.registrationProcess.length; rprocess++) {
        if (!self.registrationProcess[rprocess].p_complete) {
          self.registrationProcess[rprocess]['p_status'] = 2
          self.registrationProcess[rprocess]['p_complete'] = true
          return false
        }
      }

    }
  }
  this.nextProcess = function () {
    if (self.registrationProcess.length) {
      var completedActions = 0
      for (var rprocess = 0; rprocess < self.registrationProcess.length; rprocess++) {
        if (self.registrationProcess[rprocess].p_complete === false) {
          self.registrationProcess[rprocess]['p_status'] = 1
          console.log('Starting' + self.registrationProcess[rprocess]['p_name'])
          setRegistrationProgress('Working... ' + ((100 * completedActions / self.registrationProcess.length).toFixed(0)) + '%')
          setProgressBarStatus((100 * completedActions / self.registrationProcess.length).toFixed(0));
          self.registrationProcess[rprocess].p_function()
          return false
        } else { completedActions++ }
      }
      setRegistrationProgress('Working... ' + ((100 * completedActions / self.registrationProcess.length).toFixed(0)) + '%');
      if (self.registrationProcess.length == completedActions) {
        console.log('All ' + completedActions + ' Actions Complete, go to Success Page!')
        setTimeout(function () {
          $('.formSectionHeading').hide();
          $('#progressInfo').hide();
          $('.thankyouInfo').show();
        }, 700)
      }

    }
  }

  $([document.documentElement, document.body]).animate({
    scrollTop: $('body').offset().top
  }, 200);

  this.terminateProcessing = function (errorMessage) {
    // TODO - Better Error Messages
    console.log('Process Terminated');
    console.log("Error Message" + errorMessage);
    if ( errorMessage !== undefined && errorMessage.indexOf('Gateway') ) {
      setRegistrationProgress(errorMessage + ' Please try again.');
      $('#progressInfo').css('color','red');

      setProgressBarStatus(0);
      $('.formSectionHeading').removeClass('locked')
      setTimeout(function() {
        $('#billingInfo').slideDown(200);
        $('#progressInfo').html('');
        $('#progressBar').remove();
        $('#progressInfo').css('color','inherit');
      }, 3000)
    } else {
      setRegistrationProgress('Submission Stopped - Error. Please correct errors or contact support for help. ' + errorMessage);
    }
  }

  function setRegistrationProgress (statusString) {
    $('#progressStatus').html(statusString);
  }

}

function showProgressBarStatus() {
  //$('#progressInfo').before('<div id="progressBar"><div id="percentage"></div></div>');

  $('#progressInfo').before('<div id="progressBar">\n' +
    '  <div class="cube-wrapper">\n' +
    '    <div class="cube-folding">\n' +
    '      <span class="cube1"></span>\n' +
    '      <span class="cube2"></span>\n' +
    '      <span class="cube3"></span>\n' +
    '      <span class="cube4"></span>\n' +
    '    </div>\n' +
    '    <div class="loadingProgress" data-name="Loading" id="progressStatus"></div>\n' +
    '  </div>\n' +
    '</div>');

  $('#progressBar').fadeIn(200);
  window.scrollTo(0, 0);
}

function setProgressBarStatus(percent) {
  //var a = document.getElementById("percentage");
  if ( percent < 100 ) {
    console.log("Percentage Done: " + percent);
    //a.style.width = percent + "%";
    $('#progressBarPercentage').html(percent + '%');
  }
}

/*-------------------------------------------------------------------*/
// Validation
/*-------------------------------------------------------------------*/

function resetValidationMessages(section) {
  section.find('.validationErrorsContainer').css('visibility', 'hidden').css('opacity', 0);
  section.find('.validationErrors li').remove('');
  section.find('.invalid').removeClass('invalid');
  section.find('.validationMessage');
  errors = [];
}

var exceptions = [];

// Master Validation
function initValidation(section) {
  console.log("Init Validation Started");
  let $section = section;

  $('.formLabel--required').each(function() {
    $(this).parent().find('input[type="text"], select').addClass('required');
    $(this).parent().find('input[type="checkbox"]').addClass('required');
    $(this).parent().find('input[type="radio"]').addClass('required');
    $(this).parent().find('select').addClass('required');
  });

  $section.find('.required').each(function() {

    //console.log("Field Name: " + this.name);

    if (this.disabled == false && exceptions.indexOf(this.name) < 0 && this.value == '' && this.type && $section.attr('id') !== 'accountInfo') {
      this.classList.add('invalid');
      errors.push('You must provide a value for <strong>' + $(this).parent().find('.formLabel--required').text() + '</strong>');
      //console.log("Errors: " + errors);
      updateErrorList($section);
    } else if ((this.name == 'formField_Email' || this.name.indexOf('rpt_email') > 0) && this.value !== '') {
      var emailReg = /^([A-Za-z0-9_\-\.])+\@([A-Za-z0-9_\-\.])+\.([A-Za-z]{2,4})$/
      if (emailReg.test(this.value) == false) {
        this.classList.add('invalid');
        if (valid == true) {
          errors.push('You must provide a value for <strong>' + $(this).parent().find('.formLabel--required').text() + '</strong> -- Invalid Email Address');
        }
        valid = false
      }
    }

    if (errors.length > 0) {
      console.log("Errors:" + errors);
      valid = false;
    } else {
      valid = true;
    }

    if (valid == true) {
      console.log("valid == true");
    }
  });
  //let sectionDebug = JSON.stringify($section);
  //console.log("Section: " + sectionDebug);
}

// Repeat Fields Validation
function validateRepeatFields (fieldID, errorMessage) {
  var objIds = FormsRepeatToolkit.getCopyIds(fieldID)

  while (obj = document.getElementById(objIds.shift())) {
    if (obj != null) {
      if (obj.type == 'checkbox') {
        if (!obj.checked) {
          errors.push(errorMessage)
          obj.classList.add('invalid')
        }
      } else {
        if (obj.value == '') {
          errors.push(errorMessage)
          obj.classList.add('invalid')
        }
      }
    }
  }
}

function bypassValidation(bypass) {
  if (bypass == true) {
    console.log("Validation Bypassed");
    $section.slideUp().next('.formSectionHeading').addClass('active').next('.formSectionContent').slideDown();
    stepNum += 1;
    console.log("Continue Step # " + stepNum);
    console.log('.formSectionHeading[data-step="'+stepNum+'"]');
    setTimeout(function() {
      console.log("Scrolling");
      $([document.documentElement, document.body]).animate({
        scrollTop: $('.formSectionHeading[data-step="'+stepNum+'"]').offset().top - 100
      }, 200);
    }, 500);
    return true
  }
}

for (var i=0; i < aMonthlyPrices.length; i++) {
  console.log(aMonthlyPrices[i])
}

function validateLevelsConfig(level) {
  if ( Object.keys(FreedomDuesCalculatorConfig).indexOf(level) !== -1 ) {
    alert("Configuration Error: Please Contact the website administrator");
    return false;
  } else {
    return true;
  }
}

function validateEmail(email) {
  var emailReg = /^([A-Za-z0-9_\-\.])+\@([A-Za-z0-9_\-\.])+\.([A-Za-z]{2,4})$/
  if (emailReg.test(this.value) == false) {
    this.classList.add('invalid');
    if (valid == true) {
      errors.push('Invalid Email Address');
    }
    valid = false;
  }
}

function validateSection(button) {
  bypassValidation(bypass);

  console.log("Section Button: " + button);

  var $section = $(button).parents('.formSectionContent');

  //clear old validation
  resetValidationMessages($section);

  console.log("VALID: " + valid);
  initValidation($section);
  switch ($section.attr('id')) {
    case 'accountInfo':
      // Account Section Validation
      var adultType = $('select[name$=membership_type]').val();
      var children = (parseInt($('select[name$=children_count]').val()) || 0);

      if (adultType == '') {
        errors.push('You must select a Membership Type');
        $('select[name$=membership_type]').addClass('invalid');
        valid = false;
      }

      if ((adultType == 'Family' || adultType == 'Single_Parent') && children == 0) {
        errors.push('You must have at least one Child for Selected Membership.');
        $('select[name$=formField_children_count]').addClass('invalid');
        valid = false;
      }

      if ( $('[name="formField_add_locker"]').val() === '2' && ($('[name="formSecurity_'+unit_directory_id+'_locker_one"]').val() === '' || $('[name="formSecurity_'+unit_directory_id+'_locker_two"]').val() === '' ) ) {
        errors.push('You must select a locker for Locker #1 and Locker #2.');
        $('select[name$=formSecurity_'+unit_directory_id+'_locker_one]').addClass('invalid');
        $('select[name$=formSecurity_'+unit_directory_id+'_locker_two]').addClass('invalid');
        valid = false;
      }

      if ( $('[name="formField_add_locker"]').val() === '1' && $('[name="formSecurity_'+unit_directory_id+'_locker_one"]').val() === '' ) {
        errors.push('You must select a locker for Locker #1.');
        $('select[name$=formSecurity_'+unit_directory_id+'_locker_one]').addClass('invalid');
        valid = false;
      }

      if (errors.length <= 0) {
        valid = true;
        nextSection(valid);
      }

      console.log('Valid: ' + valid);
      console.log("errors: " + errors);
      nextSection(valid);

      break
    case 'accountDetails':
      // Account Details Section Validation
      nextSection(valid);
      break
    case 'IndividualInfo':
      // Individual Info Custom Validation
      if (errors.length) {
        valid = false
      } else {
        CalculateEstimatedTotal();
      }
      nextSection(valid);
      break
    case 'billingInfo':
      // Billing Information Section Validation

      var aRequiredIds = []
      var method = $('#IDFormField_method_0').val()
      if (method == 'credit card') {
        aRequiredIds = ['IDFormField_card_0', 'IDFormField_owner_0', 'IDFormField_number_0', 'IDFormField_cvv_0', 'IDFormField_expiration_0', 'IDFormField_expiration_0_year']
      } else if (method == 'echeck') {
        aRequiredIds = ['IDFormField_bank_aba_code_0', 'IDFormField_bank_name_0', 'IDFormField_bank_acct_name_0', 'IDFormField_bank_acct_num_0']
      } else if (method == '') {
        valid = false
        errors.push('Please Select a Payment Method')
      }
      if (aRequiredIds.length) {
        while (obj = document.getElementById(aRequiredIds.shift())) {
          if (obj != null && obj.value == '') {
            obj.classList.add('invalid')
            if (valid == true) {
              errors.push('Required fields missing values')
            }
            valid = false
          }
        }
      }
      nextSection(valid);
      break
    case 'reviewInfo':
      // Review Information Section Validation
      if ($('input[name=sigpad_output]').val() == '') {
        errors.push('Signature is Required')
        valid = false;
      }

      if (errors.length) {
        valid = false
      } else {
        CalculateEstimatedTotal();
      }

      // Submit Registration
      if (valid) {
        //kick off the whole processing
        app.submitRegistration()
        return
      }
      nextSection(valid);
      break
  }

  function nextSection(valid) {
    //open next section
    if (valid) {
      console.log("Let's go to the next section");
      $section.slideUp().next('.formSectionHeading').addClass('active').next('.formSectionContent').slideDown();
      setTimeout(function() {
        $([document.documentElement, document.body]).animate({
          scrollTop: $('.formSectionHeading[data-step="'+stepNum+'"]').offset().top - 100
        }, 200);
      }, 500);
    } else {
      updateErrorList($section);
    }
  }

}

function updateErrorList($section) {
  var s = '';
  if (errors) {
    if (errors.length > 1) s = 's';
    var message = errors === 1
      ? 'Error: You missed 1 field.'
      : 'Error: You missed ' + errors.length + ' field'+s+':'
  }
  $('.validationMessage').text(message);
  $section.find('.validationErrorsContainer').css('visibility', 'visible').css('opacity', 1);
  //$section.find('button').attr('disabled','disabled');
  var errorList = '';
  for (let i = 0; i < errors.length; i++) {
    errorList += '<li>'+errors[i]+'</li>';
  }

  console.log("Error List:" + errorList);

  $section.find('.validationErrors').html(errorList);
  return false;
}

/*-------------------------------------------------------------------*/
// Document Ready
/*-------------------------------------------------------------------*/

$(function() {
  // Step 1 Membership Type
  membershipType();

  // Hide Submit Button Until it's Ready
  $('.formNavigation').hide();
  $('.goBackStep').on('click', function() {
    goBackStep();
  });

  // Init Lockers
  initlockers();

  // Repeat Address Same As
  addressSameAs();
  $('.addressSameAsAccountFields').hide();

  $('#form').on('change', '.addressSameAsAccountInput', function () {
    $(this).parents('.addressSameAsAccountGroup').next().toggle(!this.checked)
  });

  $('select[name$=membership_type],select[name$=children_count],select[name$=add_nanny]').on('change', onCountFieldsChange);

  onCountFieldsChange();
  FormsRepeatToolkit.init();

  $('#IDFormField_method_0').change(paymentMethodChanged);
  paymentMethodChanged();

  $('#IDFormField_save_billing_info_0').on('input', function (e) {
    if (this.checked === false) {
      this.checked = true
      //TODO better message
      console.log('This field is required')
    }
  });

  $('input[name$=company]').on('input', function () {
    var account = $(this).val()
    var username = account.replace(/[^a-zA-Z0-9]/gi, '').toLowerCase() + createRandomSuffix()
    $('input[name$="userid"]').val(username)
    $('input[name$="display_name"]').val(account)
  });

  // Mask Phone Numbers
  maskPhoneNumbers();

  // Referral Fields
  showHideHeardFields();

  $('.formSectionContent').each(function (index) {

    //console.log("Form Section Content Index" + index);

    if ($(this).attr('id') == 'progressInfo') {
      return true
    }
    var buttonwords = 'Continue <i class="fa fa-chevron-right"></i>'
    var backwords = '<i class="fa fa-chevron-left"></i> Go Back'
    var extrabuttonclasses = ''
    if ($(this).attr('id') == 'reviewInfo') {
      var buttonwords = 'Submit Application'
      extrabuttonclasses = 'large secondary submitApplication'
    }

    if ( index === 0 ) {
      $(this).append('<div class="sectionContinue" style="display:flex; justify-content:space-between;">' +
        '<div class="validationErrorsContainer" style="display:block;transition:all .2s ease-in-out;-webkit-transition:all .2s ease-in-out;visibility:hidden;opacity:0;margin-bottom:2rem;width:100%;max-width:850px;box-sizing:border-box;padding:1rem;border:1px solid red;"><div class="validationMessage" style="font-size:1.125rem;color:red;margin-bottom:1rem;font-weight:bold">Error<span class="pluralErrors" style="display: none;">s</span>:</div><ul class="validationErrors"></ul></div><div><button data-section-index="'+index+'" type="button" class="button ' + extrabuttonclasses + '" onclick="validateSection(this)">' + buttonwords + '</button></div>' +
        '</div>');
    } else {
      $(this).append('<div class="sectionContinue" style="display:flex; justify-content:space-between;">' +
        '<div class="validationErrorsContainer" style="display:block;transition:all .2s ease-in-out;-webkit-transition:all .2s ease-in-out;visibility:hidden;opacity:0;margin-bottom:2rem;width:100%;max-width:850px;box-sizing:border-box;padding:1rem;border:1px solid red;"><div class="validationMessage" style="font-size:1.125rem;color:red;margin-bottom:1rem;font-weight:bold">Error<span class="pluralErrors" style="display: none;">s</span>:</div><ul class="validationErrors"></ul></div><div><button data-section-index="'+index+'" type="button" class="button ' + extrabuttonclasses + '" onclick="goBackStep(this)">' + backwords + '</button> <button type="button" class="button ' + extrabuttonclasses + '" onclick="validateSection(this)">' + buttonwords + '</button></div>' +
        '</div>');
    }
  });

  $('.formSectionContent').first().show()
  $('.formSectionHeading').first().addClass('active')

  $('.formSectionHeading').on('click', function () {

    if ($(this).hasClass('locked')) {
      return false
    }
    if ($(this).hasClass('active')) {
      $(this).addClass('active').next('.formSectionContent').slideDown()
      return true
    }

  });

  $('[name*="formSecurity_'+unit_directory_id+'_classification_Heard_about_the_JCC_through[]"]').on('change', function () {
    $('#IDFormField_'+unit_directory_id+'_misc5_0_group').toggle($(this).val() == 'Referral by Non-Member' || $(this).val() == 'Referred by JCC member/friend')
  }).trigger('change')

  // Hide Tour Fields if Have you been a member in the past = No
  $('#IDFormField_add_info_misc2_0').on('change', function () {
    if ($(this).val() === 'no') $('#IDFormField_add_info_tour_taken_date_0, #IDFormField_add_info_have_taken_tour_of_facility_0').parent().css('visibility', 'hidden').css('opacity', '0')
  }).trigger('change')

  //calculate total when you switch payment type
  $('input[name=formField_payment_option]').on('input', function() {
    CalculateEstimatedTotal();
    CalculateLockers($(this).val());
  });

  //$('.sectionContinue .button').on('click', function(e) {
  //  CalculateEstimatedTotal();
  //});

  // Don't let the form submit with the Enter Key
  $(window).keydown(function(event){
    if(event.keyCode == 13) {
      event.preventDefault();
      return false;
    }
  });

  // Run Member App Toolkit on Form Submission
  app = new MemberAppToolkit();
  $('#form').on('submit', app.submitRegistration);
});

/*----------------
Debugging
 ----------------*/

if (showConsoleLogs) {
  console.log("Level: " + level);
  console.log("Has Own Address: " + bHasOwnAddress);
  console.log("Calculated Age:" + calcAge(adult1));
  console.log("adult1: " + calcAge(adult1));
  console.log("adult2: " + calcAge(adult2));
  console.log("member_total: " + member_total);

  console.log("YoungMin: " + ageRanges['YoungMin']);
  console.log("YoungMax: " + ageRanges['YoungMax']);
  console.log("Senior: " + ageRanges['SeniorMin']);
  console.log("TeenMin: " + ageRanges['TeenMin']);
  console.log("TeenMax: " + ageRanges['TeenMin']);

  console.log("adult1: " + calcAge(adult1));
  console.log("adult2: " + calcAge(adult2));
  console.log("Member Type: " + memberType);
  console.log("Member Subtype: " + subtype);
  console.log("Join Fee: " + join_fee);
}

// Quickly Fill Out Fields For Testing
function fillOutFakeUnitData() {
  $('#IDFormField_company_0').val('Blake Lyons Account Test');
  $('[name*="phone"]').val('(123) 123-1234');
  $('[name*="Email"], [name*="email"]').val('test@test.com');
  $('#IDFormField_'+unit_directory_id+'_formal_addressee_0').val('Blake Lyons');
  $('#IDFormField_Address_0').val('123 Street Dr.');
  $('#IDFormField_City_0').val('Sarasota');
  $('#IDFormField_Zip_0').val('34231');
  $('#IDFormField_'+unit_directory_id+'_emergency_contact_0').val('Emergency Name');
  $('#IDFormField_'+unit_directory_id+'_emergency_relation_0').val('Parent');
}

function fillOutFakePeopleData() {
  $('#IDFormField_rpt_fname_0_1').val('Blake');
  $('#IDFormField_rpt_lname_0_1').val('Lyons')
  $('#IDFormField_rpt_gender_0_1').val('M');
  $('#IDFormField_rpt_birthdate_0_1').val('09/30/1982');

  $('#IDFormField_rpt_fname_0_2').val('Jackson');
  $('#IDFormField_rpt_lname_0_2').val('Lyons')
  $('#IDFormField_rpt_gender_0_2').val('M');
  $('#IDFormField_rpt_birthdate_0_2').val('09/30/1982');

  $('#IDFormField_rpt_fname_0_3').val('Grace');
  $('#IDFormField_rpt_lname_0_3').val('Lyons')
  $('#IDFormField_rpt_gender_0_3').val('M');
  $('#IDFormField_rpt_birthdate_0_3').val('09/30/1982');
}

function fillOutNannyData() {
  $('#IDFormField_rpt_fname_0_4').val('Grace');
  $('#IDFormField_rpt_lname_0_4').val('Lyons')
  $('#IDFormField_rpt_gender_0_4').val('M');
  $('#IDFormField_rpt_birthdate_0_4').val('09/30/1982');
}

function openAllSections() {
  $('.formSectionContent').each(function() {
    $(this).slideDown()
  });
}

function fillCreditCardFields() {
  $('#IDFormField_method_0').val('credit card').trigger('change');
  $('[name="formPayment_card"]').val('Visa');
  $('[name="formPayment_owner"]').val('John Doe');
  $('[name="formPayment_number"]').val('4111111111111111');
  $('#IDFormField_cvv_0').val('123');
  $('#IDFormField_expiration_0').val('01');
  $('#IDFormField_expiration_0_year').val('2027');
}

function generateCCError() {
  $('#IDFormField_Zip_0').val('46282');
}

if (debugButtons) {
  console.log("Auto Fill Fields Active");
  $('body').append('<div style="display:flex;flex-flow:column;position:fixed;z-index:999;top:0;right:0;background:#000;padding:1rem;border:1px solid red;"><button class="button" id="unitData" style="margin-bottom:1rem;">Fill Unit Fields</button><button class="button" id="peopleData">Fill People Fields</button><button class="button" id="openAllSections">Open All Sections</button><button class="button" id="fillCreditCardFields">Fill CC Fields</button><button class="button" id="generateCCError">Generate CC Error</button></div>');
  $(document).on('click', '#unitData', function(e) {
    e.preventDefault();
    fillOutFakeUnitData();
  });
  $(document).on('click', '#peopleData', function(e) {
    e.preventDefault();
    fillOutFakePeopleData();

    $('[name*="formField_rpt_type"]').each(function() {
      if ( $(this).val() == 'Nanny' ) {
        fillOutNannyData();
      }
    });
  });
  $(document).on('click', '#openAllSections', function(e) {
    e.preventDefault();
    openAllSections();
  });
  $(document).on('click', '#fillCreditCardFields', function(e) {
    e.preventDefault();
    fillCreditCardFields();
  });
  $(document).on('click', '#generateCCError', function(e) {
    generateCCError();
  });
}