'use strict';
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
$(function setupVideoPlayer() {
	var $body = $('body');
	var $video = $('.video-container video');
	$video.on('play', function() {
		$body.addClass('playing-video');
	});
	$video.on('pause', function() {
		$body.removeClass('playing-video');
	});
});
$(function setupChatMessages() {
	var messageDisplayDuration = 2000;
	var $body = $('body');
	var $chatMessageList = $('.chat-message-list');
	var $chatMessageInput = $('.chat-message-input');
	var mouseDown = false;
	setInterval(function() {
		var oldestMessage = $('.chat-message').first();
		var oldestTimestamp = oldestMessage.data('timestamp');
		var now = Date.now();
		if(!oldestTimestamp) {
			oldestMessage.data('timestamp', now);
		}
		else
		if(now - oldestTimestamp > messageDisplayDuration && !oldestMessage.hasClass('fade-out')) {
			oldestMessage.addClass('fade-out').on('transitionend', function() {
				$(this).remove();
			});
		}
	}, 100);
	$chatMessageInput.on('keyup', function(event) {
		var $this = $(this);
		if(event.which === 13) {
			$chatMessageList.append(
				$('<p>').addClass('chat-message').text($this.val())
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
