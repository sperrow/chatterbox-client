var App = function() {
	this.server = 'https://api.parse.com/1/classes/chatterbox';
};

App.prototype.fetch = function () {
  $.ajax({
  // This is the url you should use to communicate with the parse API server.
	  url: this.server,
	  type: 'GET',
	  data: 'order=-createdAt', 
	  contentType: 'application/json',
	  success: function (data) {
	    console.log('chatterbox: Messages received');
	    console.log(data);
	    this.displayMessages(data.results);
	  }.bind(this),
	  error: function (data) {
	    // See: https://developer.mozilla.org/en-US/docs/Web/API/console.error
	    console.error('chatterbox: Failed to get messages');
	  }
	});
}

App.prototype.parseMessage = function (message) {
  return '<div class="chat"><span class="username">'+ _.escape(message.username) +': </span>'+ _.escape(message.text) +'</div>';
};

App.prototype.displayMessages = function (array) {
  this.clearMessages();
  for (var i = 0; i < array.length; i++) {
  	$('#chats').append(this.parseMessage(array[i]));
  }
};

App.prototype.clearMessages = function () {
  $('#chats').html('');
};

App.prototype.send = function (message) {
  $.ajax({
  // This is the url you should use to communicate with the parse API server.
	  url: this.server,
	  type: 'POST',
	  data: JSON.stringify(message),
	  contentType: 'application/json',
	  success: function (data) {
	    console.log('chatterbox: Message posted');
	    this.addMessage(message);
	  }.bind(this),
	  error: function (data) {
	    // See: https://developer.mozilla.org/en-US/docs/Web/API/console.error
	    console.error('chatterbox: Failed to send message');
	  }
	});
};

App.prototype.addMessage = function (message) {
  $('#chats').prepend(this.parseMessage(message));
};

App.prototype.init = function () {
  this.fetch();
  setInterval(this.fetch.bind(this), 2000);
};

var app = new App();

app.init();

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
		$('#messagetext').val('');
		event.preventDefault();
	});
});