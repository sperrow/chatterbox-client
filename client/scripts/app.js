var App = function() {
};

App.prototype.fetch = function () {
  $.ajax({
  // This is the url you should use to communicate with the parse API server.
	  url: 'https://api.parse.com/1/classes/chatterbox',
	  type: 'GET',
	  data: 'order=-createdAt',
	  contentType: 'application/json',
	  success: function (data) {
	    console.log('chatterbox: Messages received');
	    console.log(data);
	    this.displayMessages(data.results);
	  },
	  error: function (data) {
	    // See: https://developer.mozilla.org/en-US/docs/Web/API/console.error
	    console.error('chatterbox: Failed to get messages');
	  }
	});
}

App.prototype.send = function (message) {
  $.ajax({
  // This is the url you should use to communicate with the parse API server.
	  url: 'https://api.parse.com/1/classes/chatterbox',
	  type: 'POST',
	  data: JSON.stringify(message),
	  contentType: 'application/json',
	  success: function (data) {
	    console.log('chatterbox: Message posted');
	  },
	  error: function (data) {
	    // See: https://developer.mozilla.org/en-US/docs/Web/API/console.error
	    console.error('chatterbox: Failed to send message');
	  }
	});
};

App.prototype.parseMessage = function (message) {
	var messageText = _.escape(message.text);
	// console.log(messageText);
  return '<div class="chat"><span class="username">'+ _.escape(message.username) +': </span>'+ messageText +'</div>';
};

App.prototype.displayMessages = function (array) {
  for (var i = 0; i < array.length; i++) {
  	$('#main').append(this.parseMessage(array[i]));
  }
};

App.prototype.init = function () {
  this.fetch();
};

var app = new App();

app.init();

// setInterval(fetch,10000);

$(document).ready(function() {
	$('#submitbutton').on('click', function(event) {
		var username = window.location.search.slice(10);
		var text = $('#messagetext').val();
		var roomname = $('#roomname').val();
		var message = {
			username: username,
			text: text,
			roomname: roomname
		};
		app.send(message);
		event.preventDefault();
	});

	$('#refresh').on('click', function() {
		app.fetch();
	});
});