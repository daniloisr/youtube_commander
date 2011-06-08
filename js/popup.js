$(document).ready(function(){
	$('#volume').slider({
		range: 'min',
	min: 0,
	stop: function(event, ui){
		execute({id: 'volume', value: $('#volume').slider('value')});
	}
	});
});

var youtube_tab;
chrome.windows.getAll(null, function(win){
	for(index in win){
		chrome.tabs.getAllInWindow(win[index].id,
			function(tabs){
				for(tab in tabs){
					if(tabs[tab].url.match(/youtube\.com\/watch\?v=[^&]+/i)){
						youtube_tab = tabs[tab];
						checkLabels(tabs[tab]);
					}
				}
			});
	}
});

function checkLabels(youtube_tab){

	var volume_text = document.getElementById('volume_text');
	var volume = $('#volume');
	var play_pause = document.getElementById('play_pause');
	var mute = document.getElementById('mute');
	var title = document.getElementById('title');

	volume_text.innerHTML = volume.slider('value') + ' %';

	chrome.tabs.sendRequest(youtube_tab.id, {'command': 'getStats', 'params': ''}, function(player){
		if(player.play){
			play_pause.style.backgroundPosition = '0 35px';
			chrome.browserAction.setIcon({path: 'images/play.png' });
		}else{
			play_pause.style.backgroundPosition = '0 0';
			chrome.browserAction.setIcon({path: 'images/pause.png' });
		}
		mute.innerHTML = player.mute ? 'Unmute' : 'Mute';
		if (player.type == 'flash') {
			volume_text.innerHTML = player.mute ? '0 %' : player.volume + ' %';
			volume.slider('value',player.volume);
		} else {
			volume_text.innerHTML = player.mute ? '0 %' : Math.round(parseFloat(player.volume)*100) + ' %';
			volume.slider('value',parseFloat(player.volume)*100);
		}
		title.innerHTML = player.title;
		addVideo(player);
		// FIXME: melhorar, pois não muda quando muda de musica e não abre o popup
		chrome.browserAction.setTitle({title: player.title + (player.play ? ' - tocando' : ' - pausado')});
	});
}

function addVideo(player){
	thumbnail = new Image();
	figure = $(document.createElement('figure'));
	caption = $(document.createElement('caption'));
	caption.text(player.title);

	thumbnail.alt = thumbnail.title = player.title;
	thumbnail.src = "http://img.youtube.com/vi/"+player.video_id+"/1.jpg";

	figure.append(thumbnail);
	figure.append(caption);

	$('#thumbnails_list').append(figure);
}

function execute(object){
	chrome.tabs.sendRequest(youtube_tab.id, {'command': object.id, 'params': object.value}, function(data){
		console.dir(data);
	});
	checkLabels(youtube_tab);
}

