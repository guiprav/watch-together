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
(function setupChatMessages() {
	var messageDisplayDuration = 2000;
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
})();
