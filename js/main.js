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
$(function setupChatMessages() {
	var messageDisplayDuration = 2000;
	var $chatMessageList = $('.chat-message-list');
	var $chatMessageInput = $('.chat-message-input');
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
	$chatMessageInput.on('blur', function() {
		var $this = $(this);
		setTimeout(function() {
			$this.focus();
		}, 0);
	});
	$chatMessageInput.focus();
});
