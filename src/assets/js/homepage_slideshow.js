// ------------------------------------------------------------
// Homepage Slideshow With YouTube & Local Videos Support Begin
// ------------------------------------------------------------

// Get YouTube API Ready
// This code loads the IFrame Player API code asynchronously.
var tag = document.createElement("script");
tag.src = "https://www.youtube.com/iframe_api";
var firstScriptTag = document.getElementsByTagName("script")[0];
firstScriptTag.parentNode.insertBefore(tag, firstScriptTag);

// List of Videos from Slides
var playerInfoList = [];

function getPlayerList() {
    $(".youTubePlayer").each(function () {
        playerInfoList.push({id: $(this).attr("id"), videoId: $(this).data("youtube-id")});
    });
}

async function onYouTubeIframeAPIReady() {
    await getPlayerList();
    //console.log("onYouTubeIframeAPIReady");

    if (typeof playerInfoList === "undefined") return;

    for (var i = 0; i < playerInfoList.length; i++) {
        var curplayer = createPlayer(playerInfoList[i]);
        players[i] = curplayer;
    }
    if (window.innerWidth < 780) {
        pauseVideos("youtube");
        pauseVideos("localVideo");
    }
}

// Build the List of Players
var players = new Array();

// Create the YouTUbe API Player
function createPlayer(playerInfo) {
    return new YT.Player(playerInfo.id, {
        videoId: playerInfo.videoId,
        playerVars: {
            showinfo: 0,
            playsInline: 1,
            loop: 1,
            controls: 0,
            disablekb: 1,
            mute: 1,
        },
    });
}

function createVimeoVideoPlayer(playerInfo) {
    return new Vimeo.Player(playerInfo.id, {
        id: playerInfo.videoId,
        muted: true,
        autoplay: false, // Autoplay is initially set to false
        controls: false,
    });
}

// Pause All Videos on Slide Change
function pauseVideos(type) {
    if (type == "youtube" && $(".slide.has-video.has-video-youtube").length) {
        //console.log("YouTube Video Stop");
        players.forEach(function (el) {
            el.pauseVideo();
        });
    }
    if (type == "localVideo" && $(".slide.has-video.has-video-local video").length) {
        //console.log("Local Video Stop");
        $(".slide.has-video.has-video-local.is-selected video").each(function () {
            let localVideo = $(this).get(0);
            localVideo.pause();
        });
    }
}

// Play Video of Matching Slide ID
async function playVideo(playerID, type) {
    if (type == "youtube" && $(".slide.has-video.has-video-youtube").length) {
        //console.log("YouTube Video Play");
        players.forEach(function (el) {
            console.log(el);
            if (el.g.id == playerID) {
                el.playVideo();
            }
        });
    }
    if (type == "localVideo" && $(".slide.has-video.has-video-local video").length) {
        //console.log("Local Video Play");
        playerID.play();
    }
}

$(window).on("load", function () {
    // Animate First Slide's Content In
    setTimeout(() => {
        $(".slideshow-hero-flickity .slide.is-selected .slideContent").removeClass("slide-animate-content-in").addClass("slide-animate-content-in");
    }, 1000);
});

// Homepage Slideshow
async function homepageSlideshow() {
    console.log("Init Homepage Slideshow");
    let $carousel = $(".slideshow-hero-flickity");
    var currentIndex = 0;
    var slides = $(".slideshow-hero-flickity .slide");
    var activeSlide = $(".slideshow-hero-flickity .slide.is-selected");
    var playerID;

    // Initialize Vimeo players for video slides

    if ($(".slide.first-slide.has-video.has-video-vimeo").length) {
        $(".vimeo-video-container").each(function () {
            var videoId = $(this).data("video-id");
            var player = new Vimeo.Player(this, {
                id: videoId,
                muted: true,
                autoplay: false, // Autoplay is initially set to false
                controls: false,
            });

            // Store the player instance in a data attribute
            $(this).data("vimeo-player", player);
        });
    }

    // Add image backgrounds to slideshow navigation
    $(".slideshow-hero-flickity .slide").each(function (index) {
        let $image = $(this).data("slide-image");
        let $video = $(this).data("slide-video");
        let $theme = $(this).data("theme");

        $('.slideNavButton[data-slide="' + index + '"]').addClass($theme);

        if ($image !== "") {
            $('.slideNavButton[data-slide="' + index + '"] .image').css("background-image", 'url("' + $image + '")');
        }

        if ($image === "" && $video !== false) {
            $('.slideNavButton[data-slide="2"] .image').replaceWith(
                '<video class="slideBackground video" muted="" loop="" style="width:100%;height:100%;object-fit:cover;z-index:2;"><source src="' +
                    $video +
                    '"></video>'
            );
        }
    });

    $carousel.on("ready.flickity", function () {
        console.log("Slideshow Ready");

        // Slide Active Arrow
        $('.slideshow-navigation .slideNavButton[data-slide="0"] .activeSlideArrow').addClass("active");

        // Slide Navigation Text
        $(".slideshow .slide .slideTitle").each(function (index) {
            //console.log("This Navbutton Text");
            //console.log($(this).text());
            $('.slideshow-navigation .slideNavButton[data-slide="' + index + '"] .text').text($(this).text());
        });

        // If the first slide is a video play it
        if ($(".slideshow-hero-flickity .slide.first-slide").length) {
            if ($(".slide.first-slide.has-video.has-video-youtube.is-selected").length) {
                playerID = $(".slide.first-slide.has-video.is-selected iframe").attr("id");
                $(".slideshowLoader").fadeOut(200);
                playVideo(playerID, "youtube");
            }
            if ($(".slide.first-slide.has-video.has-video-vimeo.is-selected").length) {
                // Play video if the slide has a video
                console.log("Ready to Play Vimeo Video");
                var $currentSlide = $(".slide.first-slide.has-video.has-video-vimeo.is-selected");
                var currentPlayer = $currentSlide.find(".vimeo-video-container").data("vimeo-player");
                if (currentPlayer) {
                    currentPlayer.play();
                }
            }
        }
    });

    $carousel.on("change.flickity", function (event, index) {
        console.log("Slideshow Change");

        if ($(".youTubePlayer").length) {
            pauseVideos("youtube");
        }
        if ($(".localVideoPlayer").length) {
            pauseVideos("localVideo");
        }
        if ($(".vimeo-video-container").length) {
            // Pause all videos when slide changes
            $(".vimeo-video-container").each(function () {
                var player = $(this).data("vimeo-player");
                if (player) {
                    player.pause();
                }
            });
        }
    });

    $carousel.on("settle.flickity", function (event, index) {
        console.log("Slideshow Settle");

        $(".slideshow-navigation .slideNavButton").removeClass("active");
        $('.slideshow-navigation .slideNavButton[data-slide="' + index + '"]').addClass("active");

        if ($(".slideshow-hero-flickity .slide.is-selected").hasClass("has-video")) {
            if ($(".slide.has-video.has-video-youtube.is-selected").length) {
                playerID = $(".slideshow-hero-flickity .slide.is-selected.has-video iframe").attr("id");
                playVideo(playerID, "youtube");
            } else if ($(".slide.has-video.has-video-local.is-selected").length) {
                playerID = $(".slideshow-hero-flickity .slide.is-selected.has-video video").get(0);
                playVideo(playerID, "localVideo");
            } else if ($(".slide.has-video.has-video-vimeo.is-selected").length) {
                // Play video if the slide has a video
                var $currentSlide = $(".slide.has-video.has-video-vimeo.is-selected");
                var currentPlayer = $currentSlide.find(".vimeo-video-container").data("vimeo-player");
                if (currentPlayer) {
                    currentPlayer.play();
                }
            }
        }
    });

    $carousel.flickity({
        contain: false,
        groupCells: false,
        setGallerySize: false,
        autoPlay: false,
        fade: true,
        cellSelector: ".slide",
        pageDots: false,
        prevNextButtons: true,
        wrapAround: true,
    });

    $(".slideshow-navigation").on("click", ".slideNavButton", function (e) {
        e.preventDefault();
        var index = $(this).index();
        $carousel.flickity("select", index);
    });
}

$(function () {
    homepageSlideshow();
});

$(window).on("resize", function () {
    if (window.innerWidth < 780 && $(".slide.has-video.is-selected").length) {
        //pauseVideos("youtube");
        //pauseVideos("localVideo");
    } else {
        if ($(".slide.has-video.is-selected").length) {
            const activeSlideVideoPlayerId = $(".slide.has-video.is-selected iframe").attr("id");
            playVideo(activeSlideVideoPlayerId, "youtube");
        }
    }
});

$(window).on("load", function () {
    if ($("#view_live_cart").length) {
        $("#view_live_cart").text("View Programs Cart");
        $("#view_live_cart").fadeIn(200);
    }
    $(".slide.has-video.has-video-vimeo .vimeo-video-container").each(function () {
        let id = $(this).data("video-id");

        var player = new Vimeo.Player(this, {
            id: id,
            muted: true,
            autoplay: false, // Autoplay is initially set to false
            controls: false,
        });

        // Store the player instance in a data attribute
        $(this).data("vimeo-player", player);
    });
});

// ------------------------------------------------------------
// Homepage Slideshow End
// ------------------------------------------------------------
