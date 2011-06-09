chrome.extension.onRequest.addListener( function(request, sender, sendResponse) {
    player = new Player();
    eval("player."+request.command+"("+request.params+")");
    sendResponse(player.getStatus());
});

Player = function(){
    this.player = null;
    this.type = null;

    if(document.getElementById("movie_player")) {
        this.player = document.getElementById("movie_player");
        this.type = "flash";
    } else if(document.getElementsByClassName("video-stream")[0]) {
        this.player = document.getElementsByClassName("video-stream")[0];
        this.type = "html5";
    }

    this.play_pause = function() {
        if(this.type == "flash") {
            if(this.player.getPlayerState() == 1) {
                this.player.pauseVideo();
            } else if(this.player.getPlayerState() == 2) {
                this.player.playVideo();
            }
        } else if(this.type == "html5") {
            if(this.player.paused) {
                this.player.play();
            } else {
                this.player.pause();
            }
        }
        return this;
    }

    this.volume = function(value) {
        if(this.type == "flash") {
            this.player.setVolume(value);
        } else if(this.type == "html5") {
            this.player.volume = Math.round(value/100);
        }

        return this;
    }

    this.mute = function() {
        if(this.type == "flash") {
            if(this.player.isMuted()) {
                this.player.unMute();
            } else {
                this.player.mute()
            } 
        } else if(this.type == "html5") {
            this.player.muted = !player.muted;
        }
        return this;
    }

    this.getStatus = function(){
        var player_status = new Object();

        if(this.type == "flash") {
            player_status.mute = this.player.isMuted();
        } else if(this.type == "html5") {
            player_status.mute = this.player.muted;
        }

        if(this.type == "flash") {
            player_status.volume = this.player.getVolume();
        } else if(this.type == "html5") {
            player_status.volume = this.player.volume;
        }

        if(this.type == "flash") {
            if(this.player.getPlayerState() == 1) {
                player_status.play = true;
            } else if(this.player.getPlayerState() == 2) {
                player_status.play = false;
            }
        } else if(this.type == "html5") {
            player_status.play = !this.player.paused;
        }
        player_status.type = this.type;
        player_status.title = document.getElementById("eow-title").title;
        return player_status;
    }

    return this;
}
