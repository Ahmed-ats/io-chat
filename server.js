const express = require('express');
const app = express();
const server = require('http').createServer(app);
const io = require('socket.io').listen(server);
var users = [];
var connections = []; 

server.listen(process.env.PORT || 8080);
console.log('Server is running...');

app.get('/', function(req, res){
    res.sendFile(__dirname + '/index.html')
});

// open a connection with socket.IO
io.sockets.on("connection", function(socket) {
  connections.push(socket);
  console.log("Connected: %s sockets conected", connections.length);

  //Disconnect
  socket.on('disconnect', function(data) {
    users.splice(users.indexOf(socket.username), 1);
    updateUsersname();
    connections.splice(connections.indexOf(socket), 1);
    console.log("Disconnected: %s sockets connected", connections.length);
  });
  /// Send Message
  socket.on('send message', function(data){
      io.sockets.emit('new message', {msg: data, user: socket.username})
  })
  // New User 
  socket.on('new user', function(data, callback) {
    callback(true);
    socket.username = data;
    users.push(socket.username)
    updateUsersname();
  })

   function updateUsersname() {
     io.sockets.emit('get users', users);
   }
});