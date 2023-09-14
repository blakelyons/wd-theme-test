"use strict";
// todo incldue this function
// <script src="https://www.youtube.com/iframe_api"></script>

// Most commonly used scripts are minified into the library scripts file. Use local repository to edit or built custom libraries
function onYouTubeIframeAPIReady() {
    $('.slide.has-video').each(function (index, slide) {
        // Get the `.video` element inside each `.slide`
        var iframe = $(slide).find('.slideBackground')[0]
        // Create a new YT.Player from the iFrame, and store it on the `.slide` DOM object
        slide.video = new YT.Player(iframe)
    })
}
// Hero Slideshow Addons - its initialized in the data-flickity attribute
$(function(){

    if ( $('.slideshow-hero-flickity .slide.has-video').length ) {

        var currentIndex = 0;
        var carousel = document.querySelector('.slideshow-hero-flickity');
        var flkty = Flickity.data( carousel )
        var slides = $('.slideshow-hero-flickity .slide');

        flkty.on( 'ready', function(){  console.log('Slideshow is Ready', arguments) } );
        flkty.on( 'change',  function(index){ console.log('Slide Changed to', arguments);

            if(slides[currentIndex].video != undefined){
                slides[currentIndex].video.stopVideo();
            }
            if(slides[index].video != undefined){
                var  newVideo = slides[index].video;
                newVideo.playVideo();
                flkty.pausePlayer();
                setTimeout(function(){
                    flkty.unpausePlayer()
                }, newVideo.getDuration()*1000)


            }
            currentIndex = index;

            console.log(slides[index], slides[index].video);
        });
        flkty.on( 'settle', function(index){ console.log('Settled to '+ index) } );



    }


});


$(function(){

    initCountOnScroll('.stat .number');
    initCountOnScroll('.editorStatCounter');

});