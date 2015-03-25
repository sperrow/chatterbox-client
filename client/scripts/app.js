var App = function() {
	this.server = 'http://127.0.0.1:3000/classes/';
	// this.server = 'https://api.parse.com/1/classes/chatterbox';
	// this.roomList = [];
	this.friendList = [];
};

// App.prototype.rooms = function () {
// 	var roomList;

// 	var getRooms = function(array) {
// 		var rooms = [];
// 		for( var i = 0; i < array.length; i++ ) {
// 			var roomname = array[i].roomname;
// 			if( rooms.indexOf(roomname) < 0 ) {
// 				rooms.push(roomname);
// 			}
// 		}

// 		return rooms;
// 	};

// 	var context = this;

//   $.ajax({
// 	  url: this.server,
// 	  type: 'GET',
// 	  data: {keys:'roomname', order:'-createdAt'},
// 	  contentType: 'application/json',
// 	  success: function (data) {
// 	    context.roomList = getRooms(data.results);
// 	    context.displayRooms(context.roomList);
// 	    context.fetch($('#roomname').val());
// 	  },
// 	  error: function (data) {
// 	    // See: https://developer.mozilla.org/en-US/docs/Web/API/console.error
// 	    console.error('chatterbox: Failed to get rooms');
// 	  }
// 	});

// };

App.prototype.fetch = function (roomname) {
	var dataObj = {order:'-createdAt'};
	if( roomname ) {
		dataObj.where = {roomname:roomname};
	}
  $.ajax({
	  url: this.server+roomname,
	  type: 'GET',
	  //data: dataObj,
	  contentType: 'application/json',
	  success: function (data) {
	    this.displayMessages(data.results);
	  }.bind(this),
	  error: function (data) {
	    // See: https://developer.mozilla.org/en-US/docs/Web/API/console.error
	    console.error('chatterbox: Failed to get messages');
	  }
	});
};

App.prototype.parseMessage = function (message) {
	var username = _.escape(message.username);
	var messageText = _.escape(message.text);
	var timestamp = new Date(Date.parse(message.createdAt));
	var addZero = function(i) {
    if (i < 10) {
        i = "0" + i;
    }
    return i;
}
	timestamp = addZero(timestamp.getHours()) + ':' + addZero(timestamp.getMinutes()) + ' ' + timestamp.toDateString();
	if( this.friendList.indexOf(username) > -1 ) {
		return '<div class="chat"><span class="username friend" data-username="' + username + '">@'+ username +': </span>'+ messageText +' <span class="timestamp">' + timestamp + '</span></div>';
	} else {
	  return '<div class="chat"><span class="username" data-username="' + username + '">@'+ username +': </span>'+ messageText +' <span class="timestamp">' + timestamp + '</span></div>';
	}
};

App.prototype.displayMessages = function (array) {
  this.clearMessages();
  for (var i = 0; i < array.length; i++) {
  	$('#chats').prepend(this.parseMessage(array[i]));
  }
};

App.prototype.parseRoom = function (roomname) {
  return '<option value="'+ roomname + '">'+roomname+'</option>';
};

// App.prototype.displayRooms = function (array) {
// 	$('#roomname').html('');
//   for (var i = 0; i < array.length; i++) {
//   	$('#roomname').append(this.parseRoom(array[i]));
//   }
// };

App.prototype.clearMessages = function () {
  $('#chats').html('');
};

App.prototype.send = function (message) {
  $.ajax({
	  url: this.server+message.roomname,
	  type: 'POST',
	  data: JSON.stringify(message),
	  contentType: 'application/json',
	  success: function (data) {
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

App.prototype.addFriend = function (username) {
	var index = this.friendList.indexOf(username);
	if( index < 0 ) {
		this.friendList.push(username);
	} else {
		this.friendList.splice(index, 1);
	}
	this.fetch($('#roomname').val());
};

App.prototype.init = function () {
	// this.rooms();
  var context = this;
  setInterval(function() {
  	context.fetch($('#roomname').val());
  }, 2000);
};

App.prototype.submit = function() {
	app.send({
		username: window.location.search.slice(10),
		text: $('input.postfield').val(),
		roomname: $('#roomname').val()
	});
	$('.postfield').val('');
};

var app = new App();

app.init();

$(document).ready(function() {
	// // Post message to room
	// $('#submitbutton').on('click', function(event) {
	// 	var username = window.location.search.slice(10);
	// 	var text = $('#messagetext').val();
	// 	var roomname = $('#roomname').val();
	// 	var message = {
	// 		username: username,
	// 		text: text,
	// 		roomname: roomname
	// 	};
	// 	app.send(message);
	// 	$('#messagetext').val('');
	// 	event.preventDefault();
	// });

	// Switch to different rooms
	$('#roomname').on('change', function(event) {
		app.fetch($('#roomname').val());
		event.preventDefault();
	});

	// Add room to dropdown list
	$('#createroombutton').on('click', function(event) {
		var roomname = $('#newroom').val();
		$('#newroom').val('');
		$('#roomname').prepend(app.parseRoom(roomname));
		$('#roomname option:first-child').attr('selected', 'selected');
		app.fetch(roomname);
		event.preventDefault();
	});

	// Add/remove friend
	$('#chats').on('click', '.username', function(event) {
		app.addFriend($(this).data('username'));
	});
});