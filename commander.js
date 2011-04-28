chrome.extension.onRequest.addListener(
        function(request, sender, sendResponse) {
            console.log(sender.tab ?
                "from a content script:" + sender.tab.url :
                "from the extension");
            if (request.command == "play")
    play();
            else
        });

var player = null;
var playerType = null;

if(document.getElementById("movie_player")) {
    player = document.getElementById("movie_player");
    playerType = "flash";
} else if(document.getElementsByClassName("video-stream")[0]) {
    player = document.getElementsByClassName("video-stream")[0];
    playerType = "html5";
}

function pause() {
    if(playerType == "flash") {
        if(player.getPlayerState() == 1) {
            player.pauseVideo();
        } else if(player.getPlayerState() == 2) {
            player.playVideo();
        }
    } else if(playerType == "html5") {
        if(player.paused) {
            player.play();
        } else {
            player.pause();
        }
    }
}

function ffwd() {
    if(playerType == "flash") {
        player.seekTo(player.getCurrentTime() + 5 < player.getDuration() ? player.getCurrentTime() + 5 : player.getDuration(), true);
    } else if(playerType == "html5") {
        if(player.currentTime + 5 < player.duration) {
            player.currentTime += 5;
        } else {
            player.currentTime = player.duration;
        }
    }
}

function rewind() {
    if(playerType == "flash") {
        player.seekTo(player.getCurrentTime() - 5 > 0 ? player.getCurrentTime() - 5 : 0, true);
    } else if(playerType == "html5") {
        if(player.currentTime - 5 > 0) {
            player.currentTime -= 5;
        } else {
            player.currentTime = 0;
        }
    }
}

function decVolume() {
    if(playerType == "flash") {
        player.setVolume(player.getVolume() - 10 > 0 ? player.getVolume() - 10 : 0);
    } else if(playerType == "html5") {
        if(player.volume - 0.1 > 0) {
            player.volume -= 0.1;
        } else {
            player.volume = 0;
        }
    }
}

function incVolume() {
    if(playerType == "flash") {
        player.setVolume(player.getVolume() + 10 < 100 ? player.getVolume() + 10 : 100);
    } else if(playerType == "html5") {
        if(player.volume + 0.1 < 1) {
            player.volume += 0.1;
        } else {
            player.volume = 1;
        }
    }
}

function mute() {
    if(playerType == "flash") {
        if(player.isMuted()) {
            player.unMute();
        } else {
            player.mute()
        } 
    } else if(playerType == "html5") {
        player.muted = !player.muted;
    }
}
