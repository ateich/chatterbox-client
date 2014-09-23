// YOUR CODE HERE:
var parseUrl = 'https://api.parse.com/1/classes/chatterbox/?order=-createdAt';
var app = {
  index: 0,
  server: parseUrl,
  rooms: {},
  currentRoom: 'lobby',
  init: function() {
    var name = window.location.search.split('username=')[1];
    var text = $('.name').text();
    $('.name').text(text +" " +name);
  },
  send: function(message) {
    $.ajax({
      type: 'POST',
      url: parseUrl,
      data: JSON.stringify(message)
    });
  },
  fetch: function() {
    $.ajax({
      type: 'GET',
      url: parseUrl,
      success: function(data){
        data = data.results;
        // data = data.slice(app.index);
        var totalItems = 0;
        for(var key in app.rooms){
          totalItems += app.rooms[key].length;
        }
        if (totalItems < data.length) {
          app.displayMessages(data, true);
        }
      },
      error: function(data){
        console.log("ERROR: ", data);
      }
    });
  },
  displayMessages: function(data, newMessages) {
    for (var i = app.index; i < data.length; i++) {
      app.addMessage(data[i], newMessages);
    }
    app.index = data.length - 1;
  },
  clearMessages: function() {
    $('#chats').html('');
  },
  addMessage: function(message, newMessages) {
    if (newMessages) {
      if(!message.text || message.text.length < 1){
        return;
      }
      for (var key in message) {
        // SUPER AWESOME REGEX
        // console.log(message[key]);
        message[key] = message[key].replace(/(<([^>]+)>)/ig,"");
      }
    }

    if(message.roomname === undefined || message.roomname.length <= 1) {
      message.roomname = 'lobby';
    }
    if (message.roomname.length && !app.rooms[message.roomname]) {
      app.addRoom(message.roomname);
      app.rooms[message.roomname] = [];
    }
    if(newMessages){
      app.rooms[message.roomname].push(message);
    }
    // console.log(message);
    if (message.roomname === app.currentRoom) {
      var $user = $('<div class="username">').text(message.username);
      var $time = $('<div class="timestamp">').text(message.createdAt);
      var $msg = $('<div>').addClass('message')
                  .text(message.text)
                  .append($user)
                  .append($time);
      $('#chats').append($msg);
      $('.username').on('click', function() {
        app.addFriend();
      });
    }
  },
  addRoom: function(roomName) {
    var $room = $('<a href="#" id="' + roomName +'">').addClass('room').text(roomName);
    $('#roomSelect').append($room);

    $('#' + roomName).on('click', function(e) {
      e.preventDefault();
      app.clearMessages();
      // app.mostRecentMessageAdded = 0;
      var roomName = $(this).text();
      app.currentRoom = roomName;
      app.index = 0;
      app.displayMessages(app.rooms[roomName]);
    });
  },
  addFriend: function() {

  }
};

