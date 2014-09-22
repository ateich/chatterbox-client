// YOUR CODE HERE:
var parseUrl = 'https://api.parse.com/1/classes/chatterbox';
var app = {
  mostRecentMessageAdded: 0,
  server: parseUrl,
  rooms: {},
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
        app.displayMessages(data, true);
      },
      error: function(data){
        console.log("ERROR: ", data);
      }
    });
  },
  displayMessages: function(data, newMessages) {
    console.log('display messages with ', data);
    for (var i = 0; i < data.length; i++) {
      // var mostRecentPostAt = data[i].createdAt;
      // if (app.mostRecentMessageAdded === 0 || app.mostRecentMessageAdded < mostRecentPostAt) {
        app.addMessage(data[i], newMessages);
      // }
    }
    if(data[data.length-1]){
      app.mostRecentMessageAdded = data[data.length-1].createdAt;
    }
  },
  clearMessages: function() {
    $('#chats').html('');
  },
  addMessage: function(message, newMessages) {
    console.log(message);
    if(message.roomname === undefined || message.roomname.length <= 1) {
      return;
    }
    if (message.roomname.length && !app.rooms[message.roomname]) {
      console.log("SHOULD ADD ROOM ", message.roomname);
      app.addRoom(message.roomname);
      app.rooms[message.roomname] = [];
    }
    if(newMessages){
      app.rooms[message.roomname].push(message);
    }
    var $user = $('<div class="username">').text(message.username);
    var $msg = $('<div>').addClass('message')
                .text(message.text)
                .append($user);
    $('#chats').append($msg);
    $('.username').on('click', function() {
      app.addFriend();
    });
  },
  addRoom: function(roomName) {
    var $room = $('<a href="#" id="' + roomName +'">').addClass('room').text(roomName);
    $('#roomSelect').append($room);
    console.log('add room');

    $('#' + roomName).on('click', function(e) {
      e.preventDefault();
      console.log('change room');
      app.clearMessages();
      // app.mostRecentMessageAdded = 0;
      var roomName = $(this).text();
      console.log(roomName);
      console.log(app.rooms[roomName]);
      app.displayMessages(app.rooms[roomName]);
    });
  },
  addFriend: function() {

  }
};

