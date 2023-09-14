/**
 * My account Tweaks
 * Auto called on doc ready
 */
function applyMyAccountEdits() {

    // Wrap contents of myaccountFormSection with h3
    $('.myaccountFormSection, td.formTextHeading').wrapInner('<h3></h3>');

    //Change image labels
    $('.tr_image_preview td').first().html('Image');
    $('.tr_image_upload td').first().html('Upload Image');

    // Apply Proper Classes to Form Buttons
    $('.myaccountButton').addClass('button');
    $('.cancelButton').addClass('hollow alert');

}
$(applyMyAccountEdits);

