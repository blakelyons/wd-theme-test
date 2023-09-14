/* -------------------------------------- */
/* Global Variables                       */
/* -------------------------------------- */

// Get YouTube Player List
var ytPlayerList = [];
// YouTube Player API Players List for YT.Player Instances
var ytPlayers = {}; // Use an object to store player instances
var ytIframePlayerReady = false;

// Get Vimeo Player List
var vimeoPlayerList = [];
// Vimeo Player API Players List for Vimeo Player Instances
var vimeoPlayers = {}; // Use an object to store player instances
var vimeoIframePlayerReady = false;

var ytErrors = [];
var vimeoErrors = [];

/* -------------------------------------- */
/* BEGIN YouTube Player API               */
/* -------------------------------------- */

// Initialize the YouTube Player API
const initYouTubeAPI = async () => {
    var tag = document.createElement("script");
    tag.src = "https://www.youtube.com/iframe_api";
    var firstScriptTag = document.getElementsByTagName("script")[0];
    firstScriptTag.parentNode.insertBefore(tag, firstScriptTag);
};

// Creates the YouTube Player iframes
const createYouTubePlayer = (playerId) => {
    return new YT.Player(playerId, {
        videoId: playerId,
        playerVars: {
            showinfo: 0,
            playsInline: 1,
            loop: 1,
            controls: 1,
            disablekb: 1,
            mute: 1,
        },
        events: {
            onReady: checkYouTubePlayerReady,
        },
    });
};

// Check if the YouTube Player API is ready
const checkYouTubePlayerReady = () => {
    ytIframePlayerReady = true;
    startObserving(".youTubePlayerIframe");
};

async function onYouTubeIframeAPIReady() {
    await getVideoPlayersList("youtube");

    initValidation(ytPlayerList, "youtube");

    if (ytErrors.length > 0) {
        return;
    }

    ytPlayerList.forEach(async (ytPlayer) => {
        console.log(`forEach YT Player: ${ytPlayer.id}`);
        const player = createYouTubePlayer(ytPlayer.id);
        ytPlayers[ytPlayer.id] = player; // Store player instance using its id
    });
}

// Play YouTube Video
const playYouTubeVideo = (playerId) => {
    if (ytIframePlayerReady) {
        if (ytPlayers[playerId]) {
            // Check if the pauseVideo method exists before calling it
            if (typeof ytPlayers[playerId].playVideo === "function") {
                ytPlayers[playerId].playVideo();
            } else {
                console.error(`playVideo method not available for Player ID: ${playerId}`);
            }
        } else {
            console.error(`Player ID ${playerId} not found`);
        }
    } else {
        console.error("YouTube iframe player is not ready");
    }
};

// Pause YouTube Video
const pauseYouTubeVideo = (playerId) => {
    if (ytIframePlayerReady) {
        if (ytPlayers[playerId]) {
            // Check if the pauseVideo method exists before calling it
            if (typeof ytPlayers[playerId].pauseVideo === "function") {
                ytPlayers[playerId].pauseVideo();
            } else {
                console.error(`pauseVideo method not available for Player ID: ${playerId}`);
            }
        } else {
            console.error(`Player ID ${playerId} not found`);
        }
    } else {
        console.error("YouTube iframe player is not ready");
    }
};

/* -------------------------------------- */
/* END YouTube Player API                 */
/* -------------------------------------- */

/* -------------------------------------- */
/* BEGIN Vimeo Player API                 */
/* -------------------------------------- */

// Initialize the Vimeo Player API

var tag = document.createElement("script");
tag.src = "https://player.vimeo.com/api/player.js";
var firstScriptTag = document.getElementsByTagName("script")[0];
firstScriptTag.parentNode.insertBefore(tag, firstScriptTag);

console.log("Vimeo API Initialized");

// Creates the Vimeo Player iframes
const createVimeoPlayers = async (element) => {
    console.log("Creating Vimeo Video");

    // Get all Vimeo Player Elements
    let vimeoPlayerElements = document.querySelectorAll(element);

    // Loop through each video element
    vimeoPlayerElements.forEach(async (element) => {
        var videoId = element.id;
        var vimeoPlayer = new Vimeo.Player(element, {
            id: videoId,
            muted: true,
            autoplay: false,
            controls: true,
        })
            .ready(() => {
                console.log("Vimeo Video Embed is Ready");
            })
            .catch((error) => {
                vimeoErrors.push(`ERROR: ${error}`);
            });

        await initValidation(vimeoPlayerElements, "vimeo", vimeoErrors);

        // Store the player instance as a custom property
        element.dataset.vimeoPlayer = vimeoPlayer;
        await checkVimeoPlayerReady();

        startObserving(".vimeoPlayerIframe");
    });
};

// Check if the Vimeo Player API is ready
const checkVimeoPlayerReady = async () => {
    console.log("checkVimeoPlayerReady");
    vimeoIframePlayerReady = true;
};

// Play Vimeo Video
const playVimeoVideo = (playerId) => {
    if (vimeoIframePlayerReady) {
        let vimeoPlayerElement = document.getElementById(playerId);

        var vimeoPlayer = new Vimeo.Player(vimeoPlayerElement, {
            id: playerId,
            muted: true,
            autoplay: false,
            controls: true,
        });
        vimeoPlayer.play();
    } else {
        console.error("Vimeo iframe player is not ready");
    }
};

// Pause Vimeo Video
const pauseVimeoVideo = (playerId) => {
    if (vimeoIframePlayerReady) {
        let vimeoPlayerElement = document.getElementById(playerId);

        var vimeoPlayer = new Vimeo.Player(vimeoPlayerElement, {
            id: playerId,
            muted: true,
            autoplay: false,
            controls: true,
        });
        vimeoPlayer.pause();
    } else {
        console.error("Vimeo iframe player is not ready");
    }
};

/* -------------------------------------- */
/* END Vimeo Player API                   */
/* -------------------------------------- */

/* -------------------------------------- */
/* Helper Functions for Inline Videos     */
/* -------------------------------------- */

const getVideoPlayersList = async (type) => {
    if (type == "youtube") {
        // Get all of the YouTube Player Data from .youTubePlayerIframe <div> Elements
        document.querySelectorAll(".youTubePlayerIframe").forEach((el) => {
            ytPlayerList.push({id: el.id, videoId: el.id});
        });
    }

    if (type == "vimeo") {
        // Get all of the Vimeo Player Data from .vimeoPlayerIframe <div> Elements
        document.querySelectorAll(".vimeoPlayerIframe").forEach((el) => {
            vimeoPlayerList.push({id: el.id, videoId: el.id});
        });
    }
};

// Check if there are Duplicate Values in the ytPlayerList Array
const initValidation = async (data, type, errors) => {
    const idSet = new Set();
    let playerContainer = null;

    data.forEach((item) => {
        if (idSet.has(item.id)) {
            // Push the Errors
            if (type == "youtube") {
                ytErrors.push(item.id);
                playerContainer = document.querySelectorAll(`[data-youtube-id="${item.id}"]`);
            }

            if (type == "vimeo") {
                vimeoErrors.push(...errors, item.id);
                playerContainer = document.querySelectorAll(`[data-vimeo-id="${item.id}"]`);
            }

            playerContainer.forEach((el) => {
                el.innerHTML = `<span style="display: inline-block; color: red; border: 1px solid red; margin: 1rem 0; padding: 1rem;"><b>ERROR: Duplicate ${
                    type == "youtube" ? `YouTube` : `Vimeo`
                } Player ID:</b> ${item.id}</span>`;
            });
        } else {
            idSet.add(item.id);
        }
    });
};

// Create YouTube or Vimeo Player Iframes for APIs
const createVideoPlayerIframes = async (type) => {
    // First check if there are any .youTubeVideoIframe elements or .vimeoVideoIframe elements exist vanilla JS
    if (type == "youtube" && document.querySelectorAll(".youTubeVideoIframe").length == 0) {
        console.error("No YouTube Video Iframes Found");
        return;
    } else if (type == "vimeo" && document.querySelectorAll(".vimeoVideoIframe").length == 0) {
        console.error("No Vimeo Video Iframes Found");
        return;
    }

    // Use a for...of loop to handle asynchronous operations correctly for each element
    let element = null;

    if (type == "youtube") {
        // Get all Format Dropdown .youTubeVideoIframe Elements
        let youTubeVideoIframe = document.querySelectorAll(".youTubeVideoIframe");
        element = youTubeVideoIframe;
    }

    if (type == "vimeo") {
        // Get all Format Dropdown .vimeoVideoIframe Elements
        let vimeoVideoIframe = document.querySelectorAll(".vimeoVideoIframe");
        element = vimeoVideoIframe;
    }

    for (const el of element) {
        // Store the Player ID
        let playerId = el.querySelector("p").innerText;

        // Get other classes potentially added to the child element of  the playerId
        let elClasses = el.querySelector("p").classList;

        // Create the Player Replacement Parent Node
        let replacementNode = document.createElement("p");

        if (elClasses.length > 0) {
            replacementNode.classList.add(elClasses);
        }

        // Remove all Children from the Format Dropdown Element and Replace with the replacementNode
        el.removeChild(el.querySelector("*"));

        // Create the innerHTML for the replacementNode
        let iframeHTML = document.createElement("div");
        iframeHTML.id = playerId;

        // Add the .youTubePlayerIframe class to the iframeHTML if type == "youtube"
        if (type == "youtube") {
            iframeHTML.classList.add("youTubePlayerIframe");
            // Append the iframeHTML to the replacementNode
            replacementNode.appendChild(iframeHTML);
            replacementNode.classList.add("youTubePlayer");
            replacementNode.setAttribute("data-youtube-id", playerId);
        }

        if (type == "vimeo") {
            iframeHTML.classList.add("vimeoPlayerIframe");
            // Append the iframeHTML to the replacementNode
            replacementNode.appendChild(iframeHTML);
            replacementNode.classList.add("vimeoPlayer");
            replacementNode.setAttribute("data-vimeo-id", playerId);
        }

        // Replace the .youTubeVideoIframe with the replacementNode
        el.replaceWith(replacementNode);
    }

    // Initialize the YouTube Player API
    if (type == "youtube") {
        await initYouTubeAPI();
    }

    if (type == "vimeo") {
        await createVimeoPlayers(".vimeoPlayerIframe");
        checkVimeoPlayerReady();
    }
};

/* ------ BEGIN Video iframe Observers ----- */

const startObserving = async (element) => {
    console.log(`Start Observing: ${element}`);
    const observingElements = document.querySelectorAll(element);
    observingElements.forEach(async (element) => {
        setupObserver(element);
    });
};

const setupObserver = async (element) => {
    // Intersection Observer for Elements
    let observerOptions = {
        threshold: 0.8,
    };
    const observer = new IntersectionObserver((entries) => {
        entries.forEach((entry) => {
            if (entry.isIntersecting) {
                console.log(`Entry Target Class: ${entry.target.className}`);
                if (entry.target.className == "youTubePlayerIframe") {
                    playYouTubeVideo(entry.target.id);
                }
                if (entry.target.className == "vimeoPlayerIframe") {
                    playVimeoVideo(entry.target.id);
                }
            } else {
                if (entry.target.className == "youTubePlayerIframe") {
                    pauseYouTubeVideo(entry.target.id);
                }
                if (entry.target.className == "vimeoPlayerIframe") {
                    pauseVimeoVideo(entry.target.id);
                }
            }
        });
    }, observerOptions);

    // Observe The Element(s)
    observer.observe(element);
};
/* ------ END Video iframe Observers ----- */

$(window).on("load", async function () {
    // Initialize and Create YouTube Players
    await createVideoPlayerIframes("youtube");
    await createVideoPlayerIframes("vimeo");
});
