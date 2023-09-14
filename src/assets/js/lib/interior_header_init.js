/**
 * Set Up interior header banner ad image and move h1.pageTitle into header
 * @note - needs parameters / improvement
 *
 */
function interiorHeaderBanner() {
    var header = document.getElementById('interiorHeaderBanner');
    if(header) {
        var bannerImageTarget = header.querySelector('.pageHeader-imageBg');//remove this div if the site wont use banner images
        if(bannerImageTarget) {
            //use template tags to prevent scripts and  images from loading
            var bannerSrcEl = document.getElementById('interiorHeaderSource');
            var bannerOverrideEl = document.getElementById('interiorHeaderOverride');

            var bannerImgSrc = false;
            if (bannerOverrideEl != null) {
                bannerImgSrc = bannerOverrideEl.querySelector('img').src
            } else if (bannerSrcEl && bannerSrcEl.querySelector('img')) {
                bannerImgSrc = bannerSrcEl.querySelector('img').src
            }

            if (bannerImgSrc) {
                bannerImageTarget.style.backgroundImage = 'url(' + bannerImgSrc + ')';
                header.classList.add('pageHeader--hasImage');

            } else {
                bannerImageTarget.classList.add('noImage');
            }
        }

        //Move Page Titles
        //first look for full .pageHeader
        if ($('.js-moveToPageHeader').length) {
            $('#interiorHeaderBanner .pageHeader-content').html($('.js-moveToPageHeader').html());
            $('.js-moveToPageHeader').remove();
        } else if ($('#contentControl h1.pageTitle').length) {
            //then look for just .pageTitle and move to h1.heroTitle
            var headerTextComponent = $('#contentControl  h1.pageTitle').remove().text();
            $('#interiorHeaderBanner  h1').text(headerTextComponent);
        }
        $('#interiorHeaderBanner .pageHeader-content').removeClass('loading');
    }
}
//init on doc ready
$(interiorHeaderBanner);