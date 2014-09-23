// YOUR CODE HERE:
var parseUrl = 'https://api.parse.com/1/classes/chatterbox/?order=-createdAt';
var postUrl = 'https://api.parse.com/1/classes/chatterbox/';
var app = {
  index: 0,
  server: parseUrl,
  rooms: {},
  currentRoom: 'lobby',
  currentUser: null,
  mostRecentPost:{},
  pushChatAnimation:null,
  init: function() {
    var name = window.location.search.split('username=')[1];
    var text = $('.name').text();
    this.currentUser = name;
    $('.name').text(text +" " +name);

    //Start in lobby by default
    this.addRoom('lobby');
    $('#lobby').addClass('active');
  },
  send: function(message) {
    $.ajax({
      type: 'POST',
      url: postUrl,
      data: JSON.stringify(message),
      contentType: 'application/json'
    });
    app.fetch();
  },
  fetch: function() {
    $.ajax({
      type: 'GET',
      url: parseUrl,
      success: function(data){
        data = data.results;
        var totalItems = 0;
        for(var key in app.rooms){
          totalItems += app.rooms[key].length;
        }

        app.displayMessages(data);
      },
      error: function(data){
        console.log("ERROR: ", data);
      }
    });
  },
  displayMessages: function(data) {
    if (data === undefined) {
      return;
    }

    data = data.reverse();

    for (var i = 0; i < data.length; i++) {
      // console.log('display message check: ' , this.mostRecentPost[this.currentRoom])
      if(!this.mostRecentPost[this.currentRoom] || this.mostRecentPost[this.currentRoom] < data[i].createdAt){
        app.addMessage(data[i]);
      }
    }
  },
  clearMessages: function() {
    $('#chats').html('');
  },
  addMessage: function(message) {
    //Check for blank message
    if(!message.text || message.text.length < 1){
      return;
    }

    //Check for blank room
    if(message.roomname === undefined || message.roomname.length <= 1) {
      message.roomname = 'lobby';
    }

    //Check if this is a new message
    if (!this.mostRecentPost[this.currentRoom] || this.mostRecentPost[this.currentRoom] < message.createdAt) {
      this.mostRecentPost[this.currentRoom] = message.createdAt;
      for (var key in message) {
        // SUPER AWESOME REGEX
        if(message[key]){
          message[key] = message[key].replace(/(<([^>]+)>)/ig,"");
        }

        var roomNameArray = app.rooms[message.roomname];
        if(roomNameArray === undefined){
          roomNameArray = new Array();
        }
        roomNameArray.push(message);
      }
    }

    //Add room if it has not been used before
    if (app.rooms[message.roomname] === undefined && message.roomname.length) {
      app.addRoom(message.roomname);
    }

    //If we are currently in this room, add the message to the screen
    if (message.roomname === app.currentRoom) {
      var $user = $('<div class="username">').text(message.username);
      var $time = $('<div class="timestamp">').text(message.createdAt);
      var $msg = $('<div>').addClass('message well')
                  .text(message.text)
                  .append($user)
                  .append($time);
      $('#chats').append($msg);
      $('.username').on('click', function() {
        app.addFriend();
      });
      $('#chats').css('overflow-y', 'hidden');
      $('.message').last().addClass('animated fadeInUpBig');
      clearInterval(this.pushChatAnimation);
      this.pushChatAnimation = setTimeout(function() {
        $('#chats').css('overflow-y', 'auto');
        $("#chats").animate({ scrollTop: $("#chats")[0].scrollHeight}, 1000);
      }, 800);
    }
  },

  addRoom: function(roomName) {
    // console.log(roomName);
    // roomName = roomName.replace('#', '');
    roomName = roomName.replace(/[!#]/g, "");
    app.rooms[roomName] = new Array();

    var $room = $('<a href="#" id="' + roomName +'">').addClass('room list-group-item').text(roomName);
    $('#roomSelect').append($room);

    //CHANGE ROOM
    $('#' + roomName).on('click', function(e) {
      e.preventDefault();
      app.clearMessages();
      // app.mostRecentMessageAdded = 0;
      var roomName = $(this).text();
      $('#roomSelect > .room').removeClass('active');
      $(this).addClass('active');
      app.currentRoom = roomName;

      app.fetch();
      //app.displayMessages(app.rooms[roomName]);
    });
  },
  addFriend: function() {

  }
};

