var path = require('path');
var express = require('express');
var app = express();
var logger = require('morgan');
const { log } = require('console');
var http = require('http').Server(app);
var io = require('socket.io')(http);

// Log the requests
app.use(logger('dev'));

// Serve static files
app.use(express.static(path.join(__dirname, 'troisjs/dist'))); 

// Route for everything else.
app.get('*', function(req, res){
  res.send('Hello World');
});

var client = {	// an object to track our client connection (client is the screen with the game on it)
		id: ''
}
controls = {}; 
	/*
		controls is an array that we will use to track all our controllers controls on the fly 
		as updates come into the server. We will send the whole shemozzle to the client when 
		they ask for it. It looks like this:
		[
			'AQmGWSfg54wgfv3GGHXP' = {x:n, y:n, z:n},
			'AQmGlwlYDy7WkqBOAAAE' = {x:n, y:n, z:n}
		]
	*/
// server-side
io.on("connection", (socket) => {
	console.log('a user connected', socket.id)
	// if the user doesn't send a secure key in the first connection request, refuse the connection
	// if(socket.handshake.query.key != '1234567890') {
	socket.emit("hello", "world")
	socket.on("what", () => {
		console.log("ayyyyy")
	})
});

// io.on('connection', function(socket){
// 	console.log('a user connected', socket.id);

// 	socket.on('registerClient', function(){ // register the screen machine (client)
// 		console.log('registerClient', socket)
// 		client.id = socket.id;
// 		console.log('client registered with id ' + client.id);
// 		io.to(socket.id).emit('clientRegistered', socket.id);
// 	});
	
	
// 	socket.on('addPlayer', function(e){
// 		console.log('player requesting to join, id: ' + e);
// 		if(client.id == '') {
// 			console.log("no screen client registered to play on cannot join")
// 			return {error: 2}; // no client registered yet, die
// 		}
		
// 		io.to(client.id).emit('addPlayer', e); // pass the socket id to id this player object on the client
// 		console.log('adding player to client');
// 	});
	
// 	socket.on('playerAdded', function(e){
// 		console.log('player successfully added, id: ' + e);
// 		// record the new player
// 		controls[e] = {x: 0, y: 0, z: 0};
// 		// tell the controller they have been spawned
// 		io.to(e).emit('playerAdded');
// 	});
	
// 	socket.on('requestControls', function(){		// client has requested controls
// 		//console.log('controls requested from client - sending: ' + JSON.stringify(controls));
// 		io.to(socket.id).emit('controlsAsRequested', controls);
// 	});
	
// 	socket.on('replyControls', function(e){	// a controller sent in some controls
// 		// collate the controls on the server to send to the client
// 		controls[socket.id] = e;
// 		// console.log('controls received from controller - ' + Object.keys(controls).length);
// 		io.to(socket.id).emit('controlsReplied');
// 	});
	
// 	socket.on('bite', function(e){
// 		console.log('bite received from client');
// 		io.to(client.id).emit('bite', e);
// 	});
	
// 	socket.on('disconnect', function(e){
	
// 		console.log('socket close event')
// 		if(socket.id == client.id){ // client disconnected, shut down
// 			controls = {};
// 			console.log('client refreshed')
// 		} else {					// player disconnected
// 			delete controls[socket.id]; // delete them
// 			io.to(client.id).emit('deletePlayer', socket.id); // tell the client to delete them
// 		}
// 	});

// });

http.listen(8080, function(){
	console.log('listening on *:8080');
});
