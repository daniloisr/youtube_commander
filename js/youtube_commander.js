var YoutubeCommander = (function(){
   var yc = function(){
      var new_this = this;
      this.setYoutubeData = function(youtube_tab_id){
         console.dir(youtube_tab_id);
         chrome.tabs.sendRequest(youtube_tab_id, {'command': 'getStatus', 'params': ''}, function(playerStatus){
            new_this.setPlayPause(playerStatus);
            new_this.setVolume(playerStatus);
            new_this.setMute(playerStatus);
            new_this.setTitle(playerStatus);
         });

         return true;
      };

      this.setPlayPause = function(playerStatus){
         if(playerStatus.play){
            $('#play_pause').css('background-position', '0 35px');
            chrome.browserAction.setIcon({path: 'images/play.png' });
         }else{
            $('#play_pause').css('background-position', '0 0');
            chrome.browserAction.setIcon({path: 'images/pause.png' });
         }

         return true;
      };

      this.setVolume = function(playerStatus){
         if (playerStatus.type == 'flash') {
            $('#volume_text').html(playerStatus.mute ? '0 %' : playerStatus.volume + ' %');
            $('#volume').slider('value', playerStatus.volume);
         } else {
            $('#volume_text').html(playerStatus.mute ? '0 %' : Math.round(parseFloat(playerStatus.volume)*100) + ' %');
            $('#volume').slider('value', parseFloat(playerStatus.volume)*100);
         }

         return true;
      };

      this.setTitle = function(playerStatus){
         $('#title').html(playerStatus.title);
         chrome.browserAction.setTitle({title: playerStatus.title + (playerStatus.play ? ' - tocando' : ' - pausado')});

         return true;
      };

      this.setMute = function(playerStatus){
         $('#mute').html(playerStatus.mute ? 'Unmute' : 'Mute');

         return true;
      };

      this.addVideoToList = function (youtube_tab){
         var video_title = youtube_tab.title.match(/youtube\ -\ (.*)/i)[1];
         var video_id = youtube_tab.url.match(/v=([^&]*)/)[1];

         thumbnail = new Image();
         thumbnail.src = "http://img.youtube.com/vi/"+video_id+"/1.jpg";

         figcaption = $(document.createElement('figcaption'));
         figcaption.html(video_title);

         figure = $(document.createElement('figure'));
         figure.append(thumbnail);
         figure.append(figcaption);

         item = $(document.createElement('li'));
         item.html(figure);
         item.attr('meta-data-youtube-tab-id', youtube_tab.id);

         $('#thumbnails_list').append(item);

         return true;
      };

      this.execute = (function(object){
         var youtube_tab_id = parseInt($(".ui-selected").attr('meta-data-youtube-tab-id'));
         chrome.tabs.sendRequest(youtube_tab_id, {'command': object.id, 'params': object.value}, function(data){
            console.dir(data);
         });
         this.setYoutubeData(youtube_tab_id);

         return true;
      });

      chrome.windows.getAll(null, function(win){
         for(index in win){
            chrome.tabs.getAllInWindow(win[index].id,
               function(tabs){
                  for(tab in tabs){
                     // alterar para pegar todas as abas com elementos do youtube.
                     if(tabs[tab].url.match(/youtube\.com\/watch\?v=[^&]+/i)){
                        new_this.addVideoToList(tabs[tab]);
                     }
                  }
               });
         }
      });

   };

   return yc;
})();
