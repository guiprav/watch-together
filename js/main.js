'use strict';
var $body;
var $video;
var $chatMessageList;
var $chatMessageInput;
var mouseDown = false;
function executeSome(fns) {
	var fnArguments = [].slice.call(arguments, 1);
	fns.some(function(fn) {
		return fn.apply(null, fnArguments);
	});
}
function aliasIfDefined(object, source, target) {
	if(object[source]) {
		object[target] = object[source];
		return true;
	}
}
executeSome ([
	function() {
		return !!Element.prototype.requestFullscreen;
	},
	function() {
		return aliasIfDefined(Element.prototype, 'mozRequestFullScreen', 'requestFullscreen');
	},
	function() {
		return aliasIfDefined(Element.prototype, 'webkitRequestFullscreen', 'requestFullscreen');
	},
]);
$(function findElements() {
	$body = $('body');
	$video = $('.video-container video');
	$chatMessageList = $('.chat-message-list');
	$chatMessageInput = $('.chat-message-input');
});
$(function setupVideoPlayer() {
	$video.on('play', function() {
		$body.addClass('playing-video');
	});
	$video.on('pause', function() {
		$body.removeClass('playing-video');
	});
});
$(function setupChatMessages() {
	var messageDisplayDuration = 4000;
	setInterval(function() {
		var oldestMessage = $('.chat-message').first();
		var oldestTimestamp = oldestMessage.data('timestamp');
		var now = Date.now();
		if(!oldestTimestamp) {
			oldestMessage.data('timestamp', now);
		}
		else
		if(now - oldestTimestamp > messageDisplayDuration) {
			if(!oldestMessage.hasClass('fade-out')) {
				oldestMessage.addClass('fade-out');
			}
			else
			if(oldestMessage.css('opacity') === '0') {
				oldestMessage.remove();
			}
		}
	}, 100);
	$chatMessageInput.on('keyup', function(event) {
		var $this = $(this);
		var message = $this.val();
		if(event.which === 13) {
			w2g.sendChatMessage(message);
			$chatMessageList.append(
				$('<p>').addClass('chat-message').text("You: " + message)
			);
			$this.val('');
		}
		if($this.val() !== '') {
			$this.addClass('typing');
		}
		else {
			$this.removeClass('typing');
		}
	});
	$body.on('mousedown', function() {
		mouseDown = true;
	});
	$body.on('mouseup', function() {
		$chatMessageInput.focus();
		mouseDown = false;
	});
	$chatMessageInput.on('blur', function() {
		var $this = $(this);
		if(mouseDown) {
			return;
		}
		setTimeout(function() {
			$this.focus();
		}, 0);
	});
	$chatMessageInput.focus();
});
$(function setupWatchTogether() {
	var targetPeerId = window.location.hash.slice(1);
	window.history.replaceState('Object', 'Title', window.location.pathname);
	if(window.location.href.startsWith("https:")) {
		$(document).ready(function() {
			document.body.innerHTML = (
				"Due to PeerJS.com's bad SSL certificate, this application cannot run over HTTPS."
				+ " <a href='http://n2liquid.github.io/watch-together/'>Go to the HTTP version</a>."
			);
		});
		return;
	}
	window.w2g = {
		ping_timeout: 10000
		, logMessage: function(message) {
			$chatMessageList.append(
				$('<p class="chat-message">').text(message)
			);
		}
		, sendChatMessage: function(message) {
			w2g.send('chat_message', message);
		}
		, setup: function() {
			$body.addClass('connected');
			other_peer.on('data', function(data) {
				var name = data[0];
				var message_arguments = data.slice(1);
				if(['ping', 'pong'].indexOf(name) === -1) {
					console.log("Message received:", name, message_arguments);
				}
				w2g.message_handlers[name].apply(null, message_arguments);
			});
			other_peer.on('close', function() {
				w2g.logMessage("Your peer has gone away :(");
				w2g.quietly_pause();
				window.other_peer = null;
				$body.removeClass('connected');
			});
			other_peer.timeOuts = 0;
			setInterval(function() {
				if(!other_peer) {
					return;
				}
				var elapsed = performance.now() - other_peer.ping_timestamp;
				if(elapsed > w2g.ping_timeout) {
					w2g.logMessage("Ping timed out after " + Math.floor(elapsed / 1000) + " seconds...");
					++other_peer.timeOuts;
					if(other_peer.timeOuts >= 2) {
						other_peer.close();
						return;
					}
					w2g.ping();
				}
			}, 500);
			w2g.ping();
		}
		, chooseFile: function() {
			var $input = (
				$('<input type="file">')
					.attr('accept', 'video/*')
					.css('display', 'none')
					.on('change', function() {
						var $this = $(this);
						var file = this.files[0];
						$video.attr('src', URL.createObjectURL(file));
						$video.data('file-name', file.name);
						if(other_peer) {
							w2g.send('file_selected', file.name);
						}
						$('.choose-file').text(file.name);
						$this.remove();
					})
			);
			$body.append($input);
			$input.click();
		}
		, quietly_play: function() {
			$video.data('quietly-play', true);
			$video[0].play();
		}
		, quietly_pause: function() {
			$video.data('quietly-pause', true);
			$video[0].pause();
		}
		, quietly_seek: function(target_time) {
			$video.data('quietly-seek', true);
			$video.prop('currentTime', target_time);
		}
		, peer_seek: function(target_time) {
			$video.data('peer-seek', true);
			$video.prop('currentTime', target_time);
		}
		, send: function(name) {
			var data = [].slice.call(arguments, 0);
			if(['ping', 'pong'].indexOf(name) === -1) {
				console.log("Message sent:", name, data.slice(1));
			}
			other_peer.send(data);
		}
		, ping: _.throttle (
			function() {
				if(!other_peer) {
					return;
				}
				if(!other_peer.ping_count) {
					other_peer.ping_count = 0;
				}
				other_peer.ping_timestamp = performance.now();
				w2g.send('ping', ++other_peer.ping_count, $video.prop('currentTime'));
			}
			, 500
		)
		, adjust_peer_time: function(time) {
			if(time !== 0 && other_peer.roundtrip) {
				time += other_peer.roundtrip / 2 / 1000;
			}
			return time;
		}
	};
	w2g.message_handlers = {
		ready: function() {
			var yourFile = $video.data('file-name');
			if(yourFile) {
				w2g.send('file_selected', yourFile);
			}
		},
		chat_message: function(message) {
			w2g.logMessage(message);
		}
		, file_selected: function(name) {
			$('.peers-file').text(name);
		}
		, play: function() {
			w2g.quietly_play();
		}
		, pause: function() {
			w2g.quietly_pause();
		}
		, seek: function(time) {
			w2g.peer_seek(w2g.adjust_peer_time(time));
		}
		, ping: function(ping_count, peer_time) {
			var lag;
			other_peer.timeOuts = 0;
			w2g.send('pong', ping_count);
			if(!other_peer.roundtrip) {
				w2g.ping();
			}
			if(peer_time !== null && peer_time !== other_peer.last_reported_time) {
				other_peer.last_reported_time = peer_time;
				peer_time = w2g.adjust_peer_time(peer_time);
				$('.peer-time').text(peer_time.toFixed(2));
				lag = peer_time - $('video').prop('currentTime');
				lag = lag.toFixed(2);
				if(lag >= 0) {
					lag = '+' + lag;
				}
				$('.lag').text(lag);
			}
		}
		, pong: function(ping_count) {
			if(ping_count < other_peer.ping_count) {
				return;
			}
			w2g.ping();
			other_peer.roundtrip = performance.now() - other_peer.ping_timestamp;
			$('.ping').text(Math.round(other_peer.roundtrip));
		}
	};
	window.other_peer = null;
	window.peer = new Peer ({
		key: 'w3y11gzechy6i529',
		config: {
            iceServers: [
                {
                    url: "turn:numb.viagenie.ca",
                    credential: "webrtcdemo",
                    username: "louis%40mozilla.com",
                },
            ],
        },
        //host: 'localhost',
        //port: 9000,
        //path: '/',
	});
	peer.on('open', function(id) {
		$('.session-url').empty().append(
			$('<a onclick="return false">')
				.attr('href', '#' + id)
				.text("Share this with a friend!")
		);
	});
	peer.on (
		'connection', function(other_peer) {
			if(window.other_peer) {
				console.log (
					other_peer.id,
					"has tried to connect, but we are already connected to",
					window.other_peer.id + "."
				);
				return;
			}
			window.other_peer = other_peer;
			w2g.setup();
			w2g.logMessage("Your peer has joined you!");
		}
	);
	if(targetPeerId) {
		window.other_peer = peer.connect(targetPeerId);
		other_peer.on('open', function() {
			w2g.setup();
			w2g.send('ready');
			w2g.logMessage("Peer connected!");
		});
	}
	$('.your-file').change (
		function() {
			var file = this.files[0];
			document.querySelector('video').src = URL.createObjectURL(file);
			if(other_peer) {
				w2g.send('file_selected', file.name);
			}
		}
	);
	$video.on (
		'play', function(event) {
			if($video.data('quietly-play')) {
				$video.removeData('quietly-play');
				return;
			}
			if(other_peer) {
				w2g.send('play');
			}
		}
	);
	$video.on (
		'pause', function(event) {
			if($video.data('quietly-pause')) {
				$video.removeData('quietly-pause');
				return;
			}
			if(other_peer) {
				w2g.send('pause');
			}
		}
	);
	$video.on (
		'seeked', function(event) {
			if($video.data('quietly-seek')) {
				$video.removeData('quietly-seek');
				return;
			}
			if($video.data('peer-seek')) {
				$video.removeData('peer-seek');
				if(!$video.prop('paused')) {
					w2g.send('play');
				}
				return;
			}
			if(other_peer) {
				w2g.quietly_pause();
				w2g.send('seek', $video.prop('currentTime'));
			}
		}
	);
});
