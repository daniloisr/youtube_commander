$(document).ready(function(){
    commander = new YoutubeCommander();
    $('#volume').slider({
        range: 'min',
        min: 0,
        stop: function(event, ui){
            commander.execute({id: 'volume', value: $('#volume').slider('value')});
        }
    });

    $('#thumbnails_list').selectable({
        tolerance: 'fit',
        stop: function(){
            var youtube_tab_id = parseInt($(".ui-selected").attr('meta-data-youtube-tab-id'));
            commander.setYoutubeData(youtube_tab_id);
        }
    });
});
