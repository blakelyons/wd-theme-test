'use strict';

/**
 * Collection of javascript functions used by commerce_checkout form
 * @param init
 * @preserve
 *
 */
function CommerceToolkit( init ){

    //private global vars
    var g_jsonUrl        = 'index.php?src=commerce&srctype=ajax';
    var g_fieldPrefix    = 'formField_';
    var g_multipageId    = $( 'input[ name$="multipage_id" ]' ).val();
    var g_postedVars     = '';
    var g_resetState     = true;
    var g_hiddenShipping = false;
    var g_useFormData    = false;
    var self = this;


    $.ajaxSetup( { url: g_jsonUrl, type : 'GET', dataType: 'json' } );

    requestJson( 'set_form_id', { multipage_id: g_multipageId } );

    if( init == undefined || init == true ){
        g_postedVars = requestJson( 'get_posted_vars', { multipage_id: g_multipageId } );
    }

    //private requestJson synchronous requests,
    function requestJson( cmd, data ){

        if( data == undefined ){
            data  = {};
        }

        data.cmd = cmd;
        let jqXHR  = $.ajax( { data: data, async: false } );

        if (jqXHR) {
            try {
                return JSON.parse(jqXHR.responseText);
            } catch (e) {
                console.error('JSON Parse error');
            }
        } else {
            return { status: -1, data: {} };
        }

    }//requestJson


    //private
    function setInnerHtmlById( elementId, html ){

        $( "#" + elementId).html(html);
    }

    function setInputValue( fieldName, value ){

        $('input[ name$="' + fieldName + '" ]').val(value);
    }

    function getInputValue( fieldName ){

        return $('input[ name$="' + fieldName + '" ]').val();
    }

    //private
    function setOption( fieldName, value ){

        $('select[ name$="' + fieldName + '" ]').val('').val(value);

    }

    //private
    function ajaxSelectOptions( fieldName, commerceFunc, defaultVal, alwaysCallback ){

        if( alwaysCallback == undefined ){
            alwaysCallback = function(){};
        }


        var data = {};
        data.cmd = commerceFunc;

        var jqXHR = $.ajax( { data: data } )
            .done( function( data  ) {

                setSelectOptions( fieldName, data, defaultVal );

            })//done
            .fail( function() {
                data = '<option>Request failed to fetch options</option>';
                setSelectOptions( fieldName, data, '' );

            })//fail
            .always ( alwaysCallback );


    }//ajaxSelectOptions


    function setSelectOptions( fieldName, data, defaultVal ){

        $('select[ name$="' + fieldName + '" ]').html(data);
        var postedVal = getPostedValue( fieldName );
        setOption( fieldName, postedVal );

        setDefaultOption( fieldName, defaultVal );
    }


    function setDefaultOption( fieldName, defaultVal ){

        if( $('select[ name$="' + fieldName + '" ]').val() == '' ){
            setOption( fieldName, defaultVal );
        }

    }//setDefaultOption


    //private
    function getPostedValue( fieldName ){

        var prefixedFieldName = g_fieldPrefix + fieldName;

        return g_postedVars[ prefixedFieldName ] || '';

    }

    function disableInput( fieldName ){

        $(':input[ name$="' + fieldName + '" ]').attr('disabled', 'disabled');
    }

    function enableInput( fieldName ){

        $(':input[ name$="' + fieldName + '" ]').removeAttr('disabled');
    }



    function addHiddenField( objParent, fieldName, value ){

        objParent.append( '<input type="hidden" value="' + value + '" name="' + g_fieldPrefix + fieldName + '" id="hiddenField_' + fieldName + '" >' );

    }


    function togglePaymentType( total ){

        if( total == 0 ){
            //if final price is 0 disable payment option
            setOption( 'payment_type' , '' );
            //fire change event
            $('select[ name$="payment_type" ]').change();
            //disable payment
            disableInput( 'payment_type' );

        } else {
            enableInput( 'payment_type' );
        }
    }


    ///////////////////////  PUBLIC  ///////////////////////



    /**
     * SetFinalTotal
     */
    this.SetFinalTotal = function ( inputName ){

        if( inputName == undefined ){
            inputName  = 'cart_final_total';
        }

        var data = {};
        data.cmd = 'get_final_total';

        $.ajax( { data: data } )
            . done( function( data  ) {
                setInputValue( inputName, data );

                togglePaymentType( data );

            });//done

    };//SetTotal

    /**
     * SetSubTotal
     */
    this.SetSubTotal = function ( inputName ){

        if( inputName == undefined ){
            inputName  = 'cart_subtotal';
        }

        var data = {};
        data.cmd = 'get_subtotal';

        $.ajax( { data: data } )
            . done( function( data  ) {
                setInputValue( inputName, data );
            });//done
    };//SetSubTotal

    /**
     * SetSurcharge
     */
    this.SetSurcharge = function ( inputName ){

        if( inputName == undefined ){
            inputName  = 'cart_surcharge';
        }

        var data = {};
        data.cmd = 'get_surcharge';

        $.ajax( { data: data } )
            . done( function( data  ) {
                setInputValue( inputName, data );
            });//done

    };//SetSurcharge

    /**
     * SetShippingPrice
     */
    this.SetShippingPrice = function ( inputName ){

        if( inputName == undefined ){
            inputName  = 'cart_shipping';
        }

        var data = {};
        data.cmd = 'get_shipping_price';

        $.ajax( { data: data } )
            . done( function( data  ) {
                setInputValue( inputName, data );
            });//done

    };//SetShippingPrice

    /**
     * SetTax
     */
    this.SetTax = function ( inputName ){

        if( inputName == undefined ){
            inputName  = 'cart_tax';
        }

        var data = {};
        data.cmd = 'get_tax';

        $.ajax( { data: data } )
            . done( function( data  ) {
                setInputValue( inputName, data );
            });//done

    };//SetTax


    /**
     * EstimateTax
     */
    this.EstimateTax = function( state ){

        var data = {};
        data.state = state;

        return requestJson( 'get_estimated_tax', data );

    };


    /**
     * SetSummary
     */
    this.SetSummary = function(){

        var data = {};
        data.cmd = 'get_summary';


        $.ajax( { data: data } )
            . done( function( data  ) {
                setInnerHtmlById( 'cart_subtotal'   , data.subtotal );

                if( data.coupon_amuont != '' ){
                    $('#cart_coupon_row').show();
                    setInnerHtmlById( 'cart_coupon'     , data.coupon_amuont );
                }else{
                    $('#cart_coupon_row').hide();
                }

                setInnerHtmlById( 'cart_surcharge'  , data.surcharge );
                setInnerHtmlById( 'cart_shipping'   , data.shipping );

                if( data.tax_1 != '' && data.tax_2 != '' ){

                    $('#cart_tax_total_row').hide();
                    $('#cart_tax_inc_row').hide();

                    $('#cart_tax_1_row').show();
                    setInnerHtmlById( 'cart_tax_1'        , data.tax_1 );

                    $('#cart_tax_2_row').show();
                    setInnerHtmlById( 'cart_tax_2'        , data.tax_2 );


                } else{

                    $('#cart_tax_1_row').hide();
                    $('#cart_tax_2_row').hide();
                    $('#cart_tax_total_row').hide();
                    $('#cart_tax_inc_row').hide();

                    if( data.tax_total != '' ) {

                        $('#cart_tax_total_row').show();
                        setInnerHtmlById( 'cart_tax_total'        , data.tax_total );
                    }else if( data.tax_inc != '' ){

                        $('#cart_tax_inc_row').show();
                        setInnerHtmlById( 'cart_tax_inc'        , data.tax_inc );

                    }


                }



                setInnerHtmlById( 'cart_total'      , data.total );

                if( data.giftcard_amuont != '' ){
                    $('#cart_giftcard_row').show();
                    $('#cart_final_total_row').show();
                    setInnerHtmlById( 'cart_giftcard'   , data.giftcard_amuont );
                    setInnerHtmlById( 'cart_final_total', data.final_total );
                } else {
                    $('#cart_giftcard_row').hide();
                    $('#cart_final_total_row').hide();
                }

                //this will set any hidden fields on the form
                setInputValue( 'cart_subtotal'   , data.subtotal );
                setInputValue( 'cart_coupon'     , data.coupon_amuont );
                setInputValue( 'cart_surcharge'  , data.surcharge );
                setInputValue( 'cart_shipping'   , data.shipping );
                setInputValue( 'cart_tax_1'      , data.tax_1 );
                setInputValue( 'cart_tax_2'      , data.tax_2 );
                setInputValue( 'cart_total'      , data.total );
                setInputValue( 'cart_giftcard'   , data.giftcard_amuont );
                setInputValue( 'cart_final_total', data.final_total_raw );

                togglePaymentType( data.final_total_raw );

                CommerceToolkit.HideChargesSummary( '' );

            })//done
            . fail(function(){
                var naVal = 'N/A';
                setInnerHtmlById( 'cart_subtotal'   , naVal );
                setInnerHtmlById( 'cart_coupon'     , naVal );
                setInnerHtmlById( 'cart_surcharge'  , naVal );
                setInnerHtmlById( 'cart_shipping'   , naVal );
                setInnerHtmlById( 'cart_tax_total'  , naVal);
                setInnerHtmlById( 'cart_total'      , naVal );
                setInnerHtmlById( 'cart_giftcard'   , naVal );
                setInnerHtmlById( 'cart_final_total', naVal );

            });//fail

    };


    /**
     * SetPayments
     */
    this.SetPayments = function (loadOptions){

        var fieldName = 'payment_type';

        var elementPaymentType = $( 'select[ name$="'+fieldName+'" ]');

        elementPaymentType.prepend('<option value="">-- Select -- </option>');

        if(loadOptions === true) {
            var jqXHR = ajaxSelectOptions(fieldName, 'get_payments', null, function () {
                elementPaymentType.change();
            });
        }

        //event handler
        elementPaymentType . change( function(){
            CommerceToolkit.HidePaymentSections();

            var selectedValue = $(this).val();

            if (selectedValue === '' && CommerceToolkit.GetValue( 'cart_final_total' ) == 0 ){
                selectedValue = 'free';
            }

            $('#commerceCheckoutSection_' + selectedValue).show();
            $('#commerceCheckoutSection_' + selectedValue + ':input').removeAttr('disabled');

        });

    };//SetPayments

    /**
     * SetCreditCards
     */
    this.SetCreditCards = function (){

        var fieldName = 'card_type';

        var elementPaymentType = $( 'select[ name$="'+fieldName+'" ]');

        var jqXHR = ajaxSelectOptions( fieldName, 'get_credit_cards', null, function(){ elementPaymentType.change(); } );

    };//SetCreditCards
    /**
     * SetCreditCards
     */
    this.SetAutoCardType = function (){

        $( 'input[name$=card_number]' ).on('keyup', function () {
            var $cardType = _creditCardTypeFromNumber( $(this).val()  );
            $( 'select[name$=card_type]' ).val( $cardType );
        } );
    };//SetCreditCards

    function _creditCardTypeFromNumber( num ) {
        // first, sanitize the number by removing all non-digit characters.
        num = num.replace( /[^\d]/g, '' );
        // now test the number against some regexes to figure out the card type.
        if ( num.match( /^5[1-5]\d{0,14}$/ ) ) {
            return 'mastercard';
        } else if ( num.match( /^4\d{0,15}$/ ) ) {
            return 'visa';
        } else if ( num.match( /^3[47]\d{0,13}$/ ) ) {
            return 'amex';
        } else if ( num.match( /^6011\d{0,12}$/ ) ) {
            return 'discover';
        }
        return '';
    }

    /**
     * SetCountries
     */
    this.SetCountries = function ( defaultVal ){


        if( defaultVal == undefined ){
            defaultVal = '';
        }


        var billCountryObj = $('select[ name$="bill_country" ]');
        var shipCountryObj = $('select[ name$="ship_country" ]');

        billCountryObj . change( function(){
            var country = $(this).val();
            countriesOnChangeEventHandler( 'bill_state', country );
        });

        shipCountryObj . change( function(){
            var country = $(this).val();
            countriesOnChangeEventHandler( 'ship_state', country );
        });

        var data = {};
        data.cmd = 'get_countries';

        $.ajax( { data: data } )
            . done( function( data  ) {

                if( data == 'United States' ){

                    //if United States only turn country selects into hidden fields

                    var billCountryParent = billCountryObj.parent();

                    billCountryParent.html( '<span class="unitedStatesValue">' +data +'</span>');
                    addHiddenField( billCountryParent.parent(), 'bill_country', data );

                    var shipCountryParent = shipCountryObj.parent();

                    shipCountryParent.html( data );
                    addHiddenField( shipCountryParent, 'ship_country', data );

                }else{
                    setSelectOptions( 'bill_country', data, defaultVal );
                    setSelectOptions( 'ship_country', data, defaultVal );

                }

            })//done
            .fail( function() {

                data = '<option>Request failed to fetch country options</option>';

                setSelectOptions( 'bill_country', data, defaultVal );
                setSelectOptions( 'ship_country', data, defaultVal );

            })//fail;
            .always ( function(){

                g_resetState = false;
                billCountryObj.change();

                g_resetState = false;
                shipCountryObj.change();

                //if shiping as billing, hide shipping inputs
                toggleShippingInputs();
            });


        //private event handler
        function countriesOnChangeEventHandler( stateFieldName, country ){

            var stateSelectObj = $('select[ name$="' + stateFieldName + '"]');
            var stateInputObj  = $('#textField_' + stateFieldName + '');

            if( country == 'Canada' || country == 'United States' ){
                //set state/province
                stateSelectObj.show();
                stateSelectObj.removeAttr( 'disabled' );

                stateInputObj.hide();
                stateInputObj.attr( 'disabled', 'disabled' );

                $( stateSelectObj ).find( 'optgroup[ label!="' + country + '"]' ).hide();
                $( stateSelectObj ).find( 'optgroup[ label="' + country + '"]' ).show();

                if( g_resetState == true ){
                    setOption( stateFieldName, '' );
                }

            } else {

                stateSelectObj.hide();
                stateSelectObj.attr( 'disabled', 'disabled' );

                stateInputObj.show();
                stateInputObj.removeAttr( 'disabled' );

                if( g_resetState == true ){
                    stateInputObj.val( '' );
                }
            }

            g_resetState = true;


        }//countriesOnChangeEventHandler



        function toggleShippingInputs(){

            var elementContext = $( 'input[ name$="bill_same_as" ]' );

            //attach event handler
            elementContext.on('change', _toggleShippingInputStates ).triggerHandler('change');

            //when refreshed or posted back
            // if( elementContext.is(':checked') ){
            // 	elementContext.click();//fire the event to disable inputs, will uncheck
            // 	elementContext.attr( 'checked','checked' );//make it checked after click event
            // }

        }

        function _toggleShippingInputStates() {

            var elementContext = $( 'input[ name$="bill_same_as" ]' );

            if( elementContext.is(':checked') ){

                disableInput( 'ship_firstname' );
                disableInput( 'ship_lastname' );
                disableInput( 'ship_companyname' );
                disableInput( 'ship_address1' );
                disableInput( 'ship_address2' );
                disableInput( 'ship_city' );
                disableInput( 'ship_state' );
                disableInput( 'ship_province' );
                disableInput( 'ship_zip' );
                disableInput( 'ship_country' );

            } else {
                enableInput( 'ship_firstname' );
                enableInput( 'ship_lastname' );
                enableInput( 'ship_companyname' );
                enableInput( 'ship_address1' );
                enableInput( 'ship_address2' );
                enableInput( 'ship_city' );
                enableInput( 'ship_state' );
                enableInput( 'ship_province' );
                enableInput( 'ship_zip' );
                enableInput( 'ship_country' );

            }
        }

        window.f_commerce_tsi = _toggleShippingInputStates;

    };//SetCountries


    /**
     * SetStates
     */
    this.SetStates = function ( defaultVal ){

        if( defaultVal == undefined ){
            defaultVal = '';
        }

        var data = {};
        data.cmd = 'get_states';

        addStateInputField( 'bill_state' );
        addStateInputField( 'ship_state' );


        var JqXHR = $.ajax( { data: data } )
            . done( function( data  ) {
                setSelectOptions( 'bill_state', data, defaultVal );
                setSelectOptions( 'ship_state', data, defaultVal );
            })//done
            . fail( function() {
                data = '<option>Request failed to fetch state options</option>';

                setSelectOptions( 'bill_state', data, defaultVal );
                setSelectOptions( 'ship_state', data, defaultVal );
            });//fail;


        //private
        //if selected country is not US or Canada allow to type in state/province
        function addStateInputField( fieldName ){

            var objParent = $('select[ name$="' + fieldName + '"]' ) . parent();

            var postedVal = getPostedValue( fieldName );
            if( postedVal == undefined ){
                postedVal = '';
            }

            objParent.append( '<input type="text" value="' + postedVal + '" name="' + g_fieldPrefix + fieldName + '" id="textField_' + fieldName + '" >' );
            $('#textField_' + fieldName ).attr( 'disabled', 'disabled' ).hide();
        }

        return JqXHR;

    };//SetStates


    /**
     * SetExpiration
     */
    this.SetExpirationField = function (){

        var $input = $('#IDFormField_card_year_0');
        var today = new Date();
        var year = parseInt(today.getFullYear());

        $input.html('');
        $input.append("<option value=''> </option>");

        for (i=0; i<25; i++){
            value = year + i;
            $input.append("<option value='"+value+"'>"+value+"</option>");
        }

    }

    /**
     * SetShipping
     */
    this.SetShipping = function (bindChangeEvent, bUseFormData)
    {
        _setShipping(bindChangeEvent, bUseFormData);
    }

    //private
    function _setShipping( bindChangeEvent, bUseFormData ){


        if( bindChangeEvent == undefined ){
            bindChangeEvent = true;
        }

        if( typeof( bUseFormData ) == "undefined" ){
            g_useFormData = false;
        } else {
            g_useFormData = bUseFormData;
        }

        var fieldName = 'shipping_type';

        var data = loadData( g_useFormData );

        data.cmd         = 'get_shipping';

        var shippingElement = $( 'select[ name$="'+fieldName+'" ]');


        $.ajax( { data: data } )
            . done( function( data  ) {

                if( data == '*' ){ //free shipping
                    if( g_hiddenShipping == false ){
                        createFreeShippingSpan( data );
                        g_hiddenShipping = true;
                    }

                    toggleShippingElement( true );

                    shippingElement . html(  new Option( 'FREE', data  ) ).val( data );

                } else {
                    if( g_hiddenShipping == true ){
                        toggleShippingElement( false );
                    }

                    var defaultVal = '';
                    if( g_useFormData == true ){
                        defaultVal = shippingElement.val();
                    } else {
                        defaultVal = getPostedValue( fieldName );
                    }

                    shippingElement . html( data );
                    setOption( fieldName, defaultVal );

                }

                //fire event for reload or posting back
                shippingElement.change();

            })//done
            . fail( function() {
                shippingElement . html( '<option>Request failed to fetch shipping options</option>' );
            });//fail


        if( bindChangeEvent == true ){
            //event handler
            shippingElement . change( function(){

                var shippingType = $(this).val();

                var data = loadData( g_useFormData );

                data.cmd           = 'set_shipping_info';
                data.shipping_type = shippingType;

                $.ajax( { data: data } )
                    . done( function(){

                        //refresh totals
                        self.SetSummary();
                    });//done


            });//change

        }//if

        function createFreeShippingSpan( value ){

            var parent = shippingElement.parent();

            parent.append( '<span id="freeShippingSpan">FREE</span>' );

        }


        function toggleShippingElement( enableHidden ){

            if( enableHidden == true ){

                $('#freeShippingSpan').show();

                shippingElement.hide();

            }else{

                $('#freeShippingSpan').hide();

                shippingElement.show();

            }
        }


        function loadData( bUseForm ){

            var data = {};


            var fieldPrefix = g_fieldPrefix;
            var billSameAs = false;

            if( bUseForm == false ){
                if( g_postedVars[ fieldPrefix + 'bill_same_as' ] == 1 ){
                    billSameAs = true;
                }
            } else {
                billSameAs = $('[ name$="' + fieldPrefix + 'bill_same_as" ]' ).prop( 'checked' );
            }


            if( billSameAs == true ){
                fieldPrefix = fieldPrefix + 'bill_';
            } else {
                fieldPrefix = fieldPrefix + 'ship_';
            }

            if( bUseForm == false ){

                data.city    = g_postedVars[ fieldPrefix + 'city'];
                data.zip     = g_postedVars[ fieldPrefix + 'zip'];
                data.state   = g_postedVars[ fieldPrefix + 'state'];
                data.country = g_postedVars[ fieldPrefix + 'country'];

            } else {

                data.city    = $( '[ name$="' + fieldPrefix + 'city" ]' ).val();
                data.zip     = $( '[ name$="' + fieldPrefix + 'zip" ]' ).val();
                data.state   = $( '[ name$="' + fieldPrefix + 'state" ]' ).val();
                data.country = $( '[ name$="' + fieldPrefix + 'country" ]' ).val();

            }

            return data;
        }

    };//SetShipping

    /**
     * AddRefreshShippingButton
     */
    this.AddRefreshShippingButton = function( value ){

        if( value == undefined ){
            value  = 'Refresh';
        }

        var data = {};

        var objShippingCombo = $( ':input[ name$="shipping_type" ]' );


        var objContainer = objShippingCombo.parent();

        objContainer.append( '<input type="button" class="button" value="' + value + '" id="refreshShippingBtn" >' );


        var objRefreshBtn = $("#refreshShippingBtn");

        objRefreshBtn . click( function(){
            _setShipping( false, true );
        });

        /*on submit recalculate shipping in case some data changed*/
        $('#refreshShippingBtn')
            . closest( 'form' )
            . submit( function(){

                $.ajaxSetup( { async: false } );//need to wait for the call to finish before submitting
                _setShipping( false, true );

            });

    };


    /**
     * SetMiniCartHtml
     */
    this.SetMiniCartHtml = function ( elementId, hideTotals ){

        if( hideTotals == undefined ){
            hideTotals  = false;
        }

        var data = {};
        data.cmd = 'get_cart';

        $.ajax( { data: data } )
            . done( function( data  ) {
                setInnerHtmlById( elementId, data );

                if( hideTotals == true ){
                    $('#shoppingCartCheckoutSummary').hide();
                }
            })//done
            . fail( function() {
                setInnerHtmlById( elementId, 'Mini cart failed to load.' );
            });//fail;

    };//SetMiniCartHtml



    /**
     * AddApplyGiftCardButton
     */
    this.AddApplyGiftCardButton = function( value, hideMessage ){

        if( value == undefined ){
            value  = 'Apply';
        }

        var hideMessageDuration = 1800;

        if( hideMessage == undefined || hideMessage !== false ){
            hideMessage = true;
        }

        if( $.isNumeric( hideMessage ) ){
            hideMessageDuration = hideMessage;
            hideMessage = true;
        }

        var data = {};

        var objGiftCard = $( ':input[ name$="giftcard_code" ]' );

        //check if gift card already applied to the cart
        //show it in the input box, don't rely on POST
        data.cmd = 'get_applied_giftcard';
        $.ajax( { data: data } )
            . done( function( data  ) {
                objGiftCard.val( data );
            });//done



        var objContainer = objGiftCard.parent();

        objContainer.append( '<input type="button" class="button" value="' + value + '" id="applyGiftCardBtn" ><br /><span id="applyGiftCardMessage"></span>' );

        var objApplyBtn = $( '#applyGiftCardBtn' );

        objApplyBtn . click( function(){

            data.cmd           = 'apply_giftcard';
            data.giftcard_code = objGiftCard.val();

            $.ajax( { data: data } )
                . done( function( data  ) {

                    if( data.applied == 0 ){
                        objGiftCard.val( '' );
                    }

                    $( '#applyGiftCardMessage' ).html( data.giftcard ).fadeIn();

                    if( hideMessage == true ) {
                        $( '#applyGiftCardMessage' ).delay( hideMessageDuration ).fadeOut();
                    }
                    //refresh totals
                    self.SetSummary();
                });//done

        });


    };

    /**
     * AddApplyCouponButton
     */
    this.AddApplyCouponButton = function( value, hideMessage ){

        if( value == undefined ){
            value  = 'Apply';
        }

        var hideMessageDuration = 1800;

        if( hideMessage == undefined || hideMessage !== false ){
            hideMessage = true;
        }

        if( $.isNumeric( hideMessage ) ){
            hideMessageDuration = hideMessage;
            hideMessage = true;
        }

        var data = {};

        var objCouponTxt = $( ':input[ name$="coupon_code" ]' );


        //check if coupon already applied to the cart
        //show it in the input box, don't rely on POST
        data.cmd = 'get_applied_coupon';
        $.ajax( { data: data } )
            . done( function( data  ) {
                objCouponTxt.val( data );
            });//done



        var objContainer = objCouponTxt.parent();

        objContainer.append( '<input type="button"  class="button" value="' + value + '" id="applyCouponBtn" ><br /><span id="applyCouponMessage"></span>' );

        var objApplyBtn = $( '#applyCouponBtn' );

        objApplyBtn . click( function(){

            data.cmd = 'apply_coupon';
            data.coupon_code = objCouponTxt.val();

            $.ajax( { data: data } )
                . done( function( data  ) {

                    if( data.applied == 0 ){
                        objCouponTxt.val( '' );
                    }

                    $( '#applyCouponMessage' ).html( data.coupon ).fadeIn();
                    if( hideMessage == true ) {
                        $( '#applyCouponMessage' ).delay( hideMessageDuration ).fadeOut();
                    }

                    if( data.refresh_shipping == 1 ){
                        //refresh Shipping
                        _setShipping( false );
                    }
                    else{
                        //refresh totals
                        self.SetSummary();
                    }
                });//done

        });

    }

}//CommerceToolkit

/**
 * Static Fetch States - for estimaters and such
 */
CommerceToolkit.FetchStates = function(defaultVal, fieldName){

    if( defaultVal == undefined ){
        defaultVal = '';
    }

    var data = {};
    data.cmd = 'get_states';

    var JqXHR = $.ajax( { data: data } )
        . done( function( data  ) {
            setSelectOptions( fieldName, data, defaultVal );
        })//done
        . fail( function() {
            data = '<option value="'+defaultVal+'">'+defaultVal+'</option>';

            setSelectOptions( fieldName, data, defaultVal );
        });//fail;

    function setSelectOptions(fieldName, data, defaultVal)
    {
        $( 'select[ name$="'+fieldName+'" ]').html( data ).val(defaultVal);

    }
}

/**
 * Static HidePaymentSections
 */
CommerceToolkit.HidePaymentSections = function(){

    $('#commerceCheckoutSection_creditcard').hide();
    $('#commerceCheckoutSection_creditcard:input').attr( 'disabled', 'disabled' );

    $('#commerceCheckoutSection_echeck').hide();
    $('#commerceCheckoutSection_echeck:input').attr( 'disabled', 'disabled' );

    $('#commerceCheckoutSection_check').hide();
    $('#commerceCheckoutSection_check:input').attr( 'disabled', 'disabled' );

    $('#commerceCheckoutSection_purchaseorder').hide();
    $('#commerceCheckoutSection_purchaseorder:input').attr( 'disabled', 'disabled' );

    $('#commerceCheckoutSection_bill').hide();

    $('#commerceCheckoutSection_cod').hide();

    $('#commerceCheckoutSection_creditcard_external').hide();

    $('#commerceCheckoutSection_free').hide();

};

CommerceToolkit.AddPayPalToPaymentTypes = function( paypalOption ){

    if( paypalOption == undefined  ){
        paypalOption = 'paypal';
    }

    $('select[ name$="payment_type" ]').append( new Option( 'PayPal', paypalOption ) ).val( paypalOption );
};

/**
 * Static HideChargesSummary
 */
CommerceToolkit.HideChargesSummary = function( visibility ){

    if( visibility == undefined ){
        visibility = 'hidden';
    }
    $('#cart_charges_summary').css('visibility', visibility );
};

/**
 * Static HideNewUserSection
 */
CommerceToolkit.HideNewUserSection = function( sectionId ){

    if( sectionId == undefined ){
        sectionId = 'commerceCheckoutSection_newuser';
    }

    if( CommerceToolkit.GetValue( 'user_authenticated' ) == 'true' ){
        $('#' + sectionId ).hide();
        $('#' + sectionId + ' :input').prop( 'disabled', true ).prop('autocomplete', false);
    }
};


/**
 * Static GetValue
 */
CommerceToolkit.GetValue = function( fieldName ){

    return $('[name*="' + fieldName + '"]:enabled') . val();
};

/**
 * Static ValidateShipping
 */
CommerceToolkit.ValidateShipping = function( arrErrorMessage ){

    if( arrErrorMessage == undefined ){
        arrErrorMessage = [];
        arrErrorMessage['shipping_type'] = "Select shipping \n";
    }

    if( CommerceToolkit.GetValue( 'shipping_type' ) == '' ){
        alert( arrErrorMessage['shipping_type'] );
        $('[name*="shipping_type"]').focus();
        return false;
    }

    return true;
};

/**
 * Static ValidatePayment
 */
CommerceToolkit.ValidatePayment = function( arrErrorMessage ){

    var error = '';

    if( arrErrorMessage == undefined ){
        arrErrorMessage = [];

        arrErrorMessage['card_name'  ] = "Enter name on card \n";
        arrErrorMessage['card_type'  ] = "Select card type \n";
        arrErrorMessage['card_number'] = "Enter card number \n";
        arrErrorMessage['card_cvv'   ] = "Enter card cvv number \n";
        arrErrorMessage['card_month' ] = "Select expiration month \n";
        arrErrorMessage['card_year'  ] = "Select expiration year \n";

        arrErrorMessage['bank_name'     ] = "Enter bank name \n";
        arrErrorMessage['bank_acct_name'] = "Enter account name \n";
        arrErrorMessage['bank_aba_code' ] = "Enter ABA code \n";
        arrErrorMessage['bank_acct_num' ] = "Enter account number \n";
        arrErrorMessage['bank_acct_type'] = "Enter account type \n";

        arrErrorMessage['po_company'] = "Enter company name \n";
        arrErrorMessage['po_agent'  ] = "Enter agent name \n";
        arrErrorMessage['po_number' ] = "Enter PO number \n";

        arrErrorMessage['check_type'          ] = "Select check type \n";
        arrErrorMessage['check_bank_name'     ] = "Enter bank name \n";
        arrErrorMessage['check_number'        ] = "Enter check number \n";
        arrErrorMessage['check_routing_number'] = "Enter routing number \n";
        arrErrorMessage['check_account_number'] = "Enter account number \n";
        arrErrorMessage['id_type'             ] = "Enter ID type \n";
        arrErrorMessage['id_number'           ] = "Enter ID number \n";
        arrErrorMessage['id_exp_month'        ] = "Select ID expiration month \n";
        arrErrorMessage['id_exp_year'         ] = "Select ID expiration year \n";

    }

    //payment validation
    if( CommerceToolkit.GetValue( 'cart_final_total' ) > 0 ){

        if( CommerceToolkit.GetValue( 'payment_type' ) == '' ){
            error += "Select payment type \n";
            $('[name*="payment_type"]').focus();
        } else {


            switch( CommerceToolkit.GetValue( 'payment_type' ) ) {
                case 'creditcard':
                    var cardnumber = CommerceToolkit.GetValue( 'card_number' );
                    var cardtype   = CommerceToolkit.GetValue( 'card_type' );

                    if( CommerceToolkit.GetValue( 'card_name'   ) == '' ){ error += arrErrorMessage['card_name'  ]; }
                    if( cardtype == ''   ){ error += arrErrorMessage['card_type'  ]; }
                    if( cardnumber == '' ){
                        error += arrErrorMessage['card_number'];
                    } else {
                        var ccValidation = CommerceCreditCard.ValidateCreditCard( cardnumber , cardtype );
                        if( ccValidation != 'OK' ){
                            error += ccValidation;
                        }
                    }
                    if( CommerceToolkit.GetValue( 'card_cvv'    ) == '' ){ error += arrErrorMessage['card_cvv'   ]; }
                    if( CommerceToolkit.GetValue( 'card_month'  ) == '' ){ error += arrErrorMessage['card_month' ]; }
                    if( CommerceToolkit.GetValue( 'card_year'   ) == '' ){ error += arrErrorMessage['card_year'  ]; }

                    break;
                case 'echeck':
                    if( CommerceToolkit.GetValue( 'bank_name'      ) == '' ){ error += arrErrorMessage['bank_name'     ]; }
                    if( CommerceToolkit.GetValue( 'bank_acct_name' ) == '' ){ error += arrErrorMessage['bank_acct_name']; }
                    if( CommerceToolkit.GetValue( 'bank_aba_code'  ) == '' ){ error += arrErrorMessage['bank_aba_code' ]; }
                    if( CommerceToolkit.GetValue( 'bank_acct_num'  ) == '' ){ error += arrErrorMessage['bank_acct_num' ]; }
                    if( CommerceToolkit.GetValue( 'bank_acct_type' ) == '' ){ error += arrErrorMessage['bank_acct_type']; }

                    break;
                case 'purchaseorder':
                    if( CommerceToolkit.GetValue( 'po_company'  ) == '' ){ error += arrErrorMessage['po_company']; }
                    if( CommerceToolkit.GetValue( 'po_agent'    ) == '' ){ error += arrErrorMessage['po_agent'  ]; }
                    if( CommerceToolkit.GetValue( 'po_number'   ) == '' ){ error += arrErrorMessage['po_number' ]; }

                    break;
                case 'check':
                    if( CommerceToolkit.GetValue( 'check_type'           ) == '' ){ error += arrErrorMessage['check_type'          ]; }
                    if( CommerceToolkit.GetValue( 'check_bank_name'      ) == '' ){ error += arrErrorMessage['check_bank_name'     ]; }
                    if( CommerceToolkit.GetValue( 'check_number'         ) == '' ){ error += arrErrorMessage['check_number'        ]; }
                    if( CommerceToolkit.GetValue( 'check_routing_number' ) == '' ){ error += arrErrorMessage['check_routing_number']; }
                    if( CommerceToolkit.GetValue( 'check_account_number' ) == '' ){ error += arrErrorMessage['check_account_number']; }
                    if( CommerceToolkit.GetValue( 'id_type'              ) == '' ){ error += arrErrorMessage['id_type'             ]; }
                    if( CommerceToolkit.GetValue( 'id_number'            ) == '' ){ error += arrErrorMessage['id_number'           ]; }
                    if( CommerceToolkit.GetValue( 'id_exp_month'         ) == '' ){ error += arrErrorMessage['id_exp_month'        ]; }
                    if( CommerceToolkit.GetValue( 'id_exp_year'          ) == '' ){ error += arrErroMessage['id_exp_year'         ]; }

                    break;
                default:

            }//switch

        }


        if( error != '' ){
            alert( error );
            return false;
        }
    }

    return true;
};



/**
 * Static ValidateAddress
 */
CommerceToolkit.ValidateAddress = function( prefix, arrErrorMessage ){

    var error = '';

    if( arrErrorMessage == undefined ){
        arrErrorMessage = [];

        arrErrorMessage[ prefix + 'address1'   ] = "Enter address line 1 \n";
        arrErrorMessage[ prefix + 'state'      ] = "Select or enter state \n";
        arrErrorMessage[ prefix + 'zip'        ] = "Enter zip/postal code \n";
        arrErrorMessage[ prefix + 'zip_format' ] = "Enter zip/postal code in correct format ( US:NNNNN or NNNNN-NNNN, CA:ANA NAN )  \n";
        arrErrorMessage[ prefix + 'country'    ] = "Select country \n";
    }

    if( CommerceToolkit.GetValue( prefix + 'address1' ) == '' ){ error += arrErrorMessage[ prefix + 'address1' ]; }

    var billcountry = CommerceToolkit.GetValue( prefix + 'country' );

    if( billcountry == '' ){ error += arrErrorMessage[ prefix + 'country' ]; }
    else {
        if( billcountry == 'United States' || billcountry == 'Canada' ){

            if( CommerceToolkit.GetValue( prefix + 'state' ) == '' ){ error += arrErrorMessage[ prefix + 'state' ]; }

            var billzip = CommerceToolkit.GetValue( prefix + 'zip' );
            if( billzip == '' ){ error += arrErrorMessage[ prefix + 'zip' ]; }
            else{
                if( billcountry == 'United States' ){
                    var REGEX_zip =  /(^\d{5}$)|(^\d{5}-\d{4}$)/;//NNNNN or NNNNN-NNNN
                } else if( billcountry == 'Canada' ){
                    var REGEX_zip =  /(^[a-zA-Z]\d{1}[a-zA-Z](\-| |)\d{1}[a-zA-Z]\d{1}$)/;//ANA NAN
                }

                if( !REGEX_zip.test( billzip ) ){
                    error += arrErrorMessage[ prefix + 'zip_format' ];
                }
            }

        } else {

            if( CommerceToolkit.GetValue( prefix + 'zip' ) == '' ){ error += arrErrorMessage[ prefix + 'zip' ]; }
        }
    }

    if( error != '' ){
        alert( error );
        return false;
    }

    return true;

};


/**
 * Static ValidateBillingAddress
 */
CommerceToolkit.ValidateBillingAddress = function( arrErrorMessage ){

    var error = '';

    if( arrErrorMessage == undefined ){
        arrErrorMessage = [];

        arrErrorMessage['bill_address1'   ] = "Enter billing address line 1 \n";
        arrErrorMessage['bill_state'      ] = "Select or enter billing state \n";
        arrErrorMessage['bill_zip'        ] = "Enter billing zip/postal code \n";
        arrErrorMessage['bill_zip_format' ] = "Enter billing zip/postal code in correct format ( US:NNNNN or NNNNN-NNNN, CA:ANA NAN )\n";
        arrErrorMessage['bill_country'    ] = "Select billing country \n";
    }


    return CommerceToolkit.ValidateAddress( 'bill_', arrErrorMessage );
};

/**
 * Static ValidateShippingAddress
 */
CommerceToolkit.ValidateShippingAddress = function( arrErrorMessage ){

    var error = '';

    if( arrErrorMessage == undefined ){
        arrErrorMessage = new Array();

        arrErrorMessage['ship_address1'   ] = "Enter shipping address line 1 \n";
        arrErrorMessage['ship_state'      ] = "Select or enter shipping state \n";
        arrErrorMessage['ship_zip'        ] = "Enter shipping zip/postal code \n";
        arrErrorMessage['ship_zip_format' ] = "Enter shipping zip/postal code in correct format ( US:NNNNN or NNNNN-NNNN, CA:ANA NAN )\n";
        arrErrorMessage['ship_country'    ] = "Select shipping country \n";
    }

    return CommerceToolkit.ValidateAddress( 'ship_', arrErrorMessage );
};


function CommerceAjaxCart(settings){


    var self = this,
        opts = {
            cartLayout: '',
            beforeUpdate: function(data, cmd){},
            afterUpdate: function(cart, cmd){
                if(opts.cartLayout != '') {
                    $('.'+opts.cartLayout).replaceWith(cart);
                }
            },

        };

    opts = $.extend(true, opts, settings);

    self.initAdd =  function _initAdd()
    {
        //console.log('init add');
        $(document).on('submit', 'form.cart_add', function(e){
            e.preventDefault();
            // before send callback
            var data = {
                sku : encodeURIComponent($(this).find('input[name="sku"]').val()),
                quantity: $(this).find('input[name="quantity"]').val(),
                refno: $(this).attr('relid'),

            }
            if(data.sku == 'undefined') {
                delete data.sku;
                getChoices.call(this, data);
            }

            sendRequest('add', data);
            return false;
        });
    }

    self.initDel = function _initDel(selector)
    {
        //console.log('init del');
        $(document).on('click', selector, function(e){
            e.preventDefault();

            var sku = $(this).data('itemsku');

            var data = {sku: sku}
            sendRequest('del', data)
            return false;
        } );
    };

    self.initSet = function(selector, event)
    {
        //console.log('init set');
        var _event = event || 'click';
        $(document).on(_event, selector, function(e){

            e.preventDefault();
            var data = $(this).closest( 'form').find('.shoppingFormQuantity').serialize();

            sendRequest('set', data);

            return false;
        });

    };

    self.initClear = function(selector)
    {
        //console.log('init clear');
        $(document).on('click', selector, function(e){

            e.preventDefault();

            sendRequest('clear', {});

            return false;
        });
    };

    function sendRequest(action, data)
    {

        if(opts.beforeUpdate.call(this, data, action) === false ){
            return false;
        }
        var base_url = 'index.php?src=commerce&srctype=ajax&cmd=update_cart'

        var _data = {}, senddata =  '';

        _data.cart_cmd = action;

        if(opts.cartLayout != ''){
            _data.cart_view = opts.cartLayout;
        }

        if(typeof(data) == 'object'){
            senddata = $.extend(data, _data);
        } else {
            senddata = data + '&'+ $.param(_data);
        }

        $.ajax({
            url: base_url,
            type: 'GET',
            data: senddata,
            dataType: 'json',
            success: function(rsp) {
                opts.afterUpdate.call(this, rsp.data, action);
            },
        });
    }

    function getChoices(data){

        var choice1 = $(this).find('select[name="choice"]');
        if (choice1.length) {
            data.choice = choice1.val();
        }

        var choice2 = $(this).find('select[name="choice_2"]');
        if (choice2.length) {
            data.choice_2 = choice2.val();
        }

        var choice3 = $(this).find('select[name="choice_3"]');
        if (choice3.length) {
            data.choice_3 = choice3.val();
        }

    }

}

function CommerceCreditCard(){}/*Namespace*/

/**
 * @return {string}
 */
CommerceCreditCard.ValidateCreditCard = function(cardnumber, cardname){
    /**
     * This code was taken from http://www.braemoor.co.uk/software/creditcard.shtml
     * Author:     John Gardner
     * Modifications: Accrisoft
     */
    var ccErrorNo = 0;
    var ccErrors = [];

    ccErrors [0] = "Unknown card type";
    ccErrors [1] = "No card number provided";
    ccErrors [2] = "Credit card number is in invalid format";
    ccErrors [3] = "Credit card number is invalid";
    ccErrors [4] = "Credit card number has an inappropriate number of digits";
    ccErrors [5] = "Warning! This credit card number is associated with a scam attempt";
    ccErrors [6] = "Card type does not match credit card number";


    // Array to hold the permitted card characteristics
    var cards = [];

    // Define the cards we support. You may add addtional card types as follows.

    //  Name:         As in the selection box of the form - must be same as user's
    //  Length:       List of possible valid lengths of the card number for the card
    //  prefixes:     List of possible prefixes for the card
    //  checkdigit:   Boolean to say whether there is a check digit

    cards [0] = {name: "Visa",
        length: "13,16",
        prefixes: "4",
        checkdigit: true};
    cards [1] = {name: "MasterCard",
        length: "16",
        prefixes: "51,52,53,54,55",
        checkdigit: true};
    cards [2] = {name: "DinersClub",
        length: "14,16",
        prefixes: "30,36,54,55",
        checkdigit: true};
    cards [3] = {name: "AmEx",
        length: "15",
        prefixes: "34,37",
        checkdigit: true};
    cards [4] = {name: "Discover",
        length: "16",
        prefixes: "6011,622,64,65",
        checkdigit: true};
    cards [5] = {name: "JCB",
        length: "16",
        prefixes: "35",
        checkdigit: true};

    function identifyCardType( cardNo ){

        for(var  c = 0; c < cards.length - 1; c++ ){

            var prefix = cards[c].prefixes.split(",");

            for (var i = 0; i < prefix.length; i++ ) {
                var exp = new RegExp ("^" + prefix[i]);
                if (exp.test ( cardNo ) ){
                    return cards[c].name;
                }
            }
        }
        return '';
    }

    function checkCreditCard(cardnumber, cardname) {


        // Establish card type
        var cardType = -1;
        for (var i=0; i<cards.length; i++) {

            // See if it is this card (ignoring the case of the string)
            if (cardname.toLowerCase () == cards[i].name.toLowerCase()) {
                cardType = i;
                break;
            }
        }

        // If card type not found, report an error
        if (cardType == -1) {
            ccErrorNo = 0;
            return false;
        }

        // Ensure that the user has provided a credit card number
        if (cardnumber.length == 0)  {
            ccErrorNo = 1;
            return false;
        }

        // Now remove any spaces from the credit card number
        cardnumber = cardnumber.replace (/\s/g, "");

        // Check that the number is numeric
        var cardNo = cardnumber;
        var cardexp = /^[0-9]{13,19}$/;
        if (!cardexp.exec(cardNo))  {
            ccErrorNo = 2;
            return false;
        }

        //identify card type by number and check against cardname
        var cardTypeFromNumber = identifyCardType( cardNo );

        if( cardTypeFromNumber.toLowerCase() !=  cardname.toLowerCase() ){
            ccErrorNo = 6;
            return false;
        }


        // Now check the modulus 10 check digit - if required
        if (cards[cardType].checkdigit) {
            var checksum = 0;                                  // running checksum total
            var mychar = "";                                   // next char to process
            var j = 1;                                         // takes value of 1 or 2

            // Process each digit one by one starting at the right
            var calc;
            for (i = cardNo.length - 1; i >= 0; i--) {

                // Extract the next digit and multiply by 1 or 2 on alternative digits.
                calc = Number(cardNo.charAt(i)) * j;

                // If the result is in two digits add 1 to the checksum total
                if (calc > 9) {
                    checksum = checksum + 1;
                    calc = calc - 10;
                }

                // Add the units element to the checksum total
                checksum = checksum + calc;

                // Switch the value of j
                if (j ==1) {j = 2} else {j = 1};
            }

            // All done - if checksum is divisible by 10, it is a valid modulus 10.
            // If not, report an error.
            if (checksum % 10 != 0)  {
                ccErrorNo = 3;
                return false;
            }
        }

        // Check it's not a spam number
        if (cardNo == '5490997771092064') {
            ccErrorNo = 5;
            return false;
        }

        // The following are the card-specific checks we undertake.
        var LengthValid = false;
        var PrefixValid = false;

        // We use these for holding the valid lengths and prefixes of a card type
        var lengths = [];

        // Load an array with the valid prefixes for this card
        var prefix = cards[cardType].prefixes.split(",");

        // Now see if any of them match what we have in the card number
        for (i=0; i<prefix.length; i++) {
            var exp = new RegExp ("^" + prefix[i]);
            if (exp.test (cardNo)) PrefixValid = true;
        }

        // If it isn't a valid prefix there's no point at looking at the length
        if (!PrefixValid) {
            ccErrorNo = 3;
            return false;
        }

        // See if the length is valid for this card
        lengths = cards[cardType].length.split(",");
        for (j=0; j<lengths.length; j++) {
            if (cardNo.length == lengths[j]) LengthValid = true;
        }

        // See if all is OK by seeing if the length was valid. We only check the length if all else was
        // hunky dory.
        if (!LengthValid) {
            ccErrorNo = 4;
            return false;
        }

        // The credit card is in the required format.
        return true;
    }


    if( checkCreditCard( cardnumber, cardname ) == false ){
        return  ccErrors[ ccErrorNo ];
    } else {
        return 'OK';
    }


};//CommerceCreditCard


/**
 * @desc Commerce options
 * @author zmart
 */

window.jQuery || document.write('<s' + 'cript type="text/javascript" src="/freedom_html/common/jquery/jquery.min.js"><\/s' + 'cript>');

//poetry


(function($, window, document, undefined) {

    var optcon = {};

    $.extend( optcon, {

        bInitiated   : false,

        aOptionForms : [],
        aOptionSets  : [],

        dLastForm    : null,

        fAddOptionSet : function(oOptionSet){ return this.aOptionSets.push(oOptionSet); },

        fAddOptionForm : function(dFormEntity) {
            if(!dFormEntity)
                return false;

            if( this.bInitiated == false )
                this.pf_init();

            if( dFormEntity.find('#shoppingOption1').length )
                this.aOptionForms.push(dFormEntity);

            if( $(dFormEntity).attr('id') == this.dLastForm.attr('id') )
                this.pf_done();

            return true;
        },

        pf_init : function() {
            this.bInitiated = true;
            this.dLastForm  = $('form[id^="item_"]:last');
        },

        pf_done : function() {

            for (var x in this.aOptionForms)
            {
                var $f      = $(this.aOptionForms[x]);
                var optSet  = this.aOptionSets[x];

                CommerceOptions.setSKUPriceViaForm($f, optSet);

                var $optSelects = $f.find('div[id^="shoppingOption"] select')
                    .change({combos: optSet, coform: $f}, function(e){
                        var comboData  = e.data.combos;
                        var parentForm = e.data.coform;
                        CommerceOptions.setSKUPriceViaForm(parentForm, comboData);
                    });

            }

        },

        setSKUPriceViaForm : function(dFormEntity, aComboData) {

            var sValString = CommerceOptions.getOptionValuesFromForm(dFormEntity);

            if( typeof aComboData[sValString] !== 'undefined' && aComboData[sValString].price ){

                var dPriceEntity = $('#item_price_'+dFormEntity.attr('relid') );

                if( aComboData[sValString].status == 'discontinued' ){
                    dPriceEntity.html( 'Item discontinued' );
                    $( ':submit', dFormEntity ).prop( 'disabled' , true );//addToCart btn
                    return;
                }

                $( ':submit', dFormEntity ).prop( 'disabled' , false );

                var sPrice = aComboData[sValString].price;

                if(  sPrice != '' && sPrice != '0.00' ) {
                    dPriceEntity.html(sPrice);
                } else {
                    dPriceEntity.html( dPriceEntity.attr('origprice') );
                }
            }
        },

        getOptionValuesFromForm : function(dFormEntity){

            var co_sels = dFormEntity.find('div[id^="shoppingOption"] select');

            var joinAnd = '', comboVal = '';

            for( var co_x = 0; co_x < co_sels.length; co_x++ )
            {
                comboVal += joinAnd + $(co_sels[co_x]).val();
                joinAnd = ',';
            }

            return comboVal;
        }

    });

    window.CommerceOptions = optcon;

})(jQuery, window, document);