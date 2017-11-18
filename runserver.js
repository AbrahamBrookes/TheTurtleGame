var path = require('path');
var express = require('express');
var app = express();
var logger = require('morgan');
var http = require('http').Server(app);
var io = require('socket.io')(http);

// Log the requests
app.use(logger('dev'));

// Serve static files
app.use(express.static(path.join(__dirname, 'public'))); 

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

io.on('connection', function(socket){
	
	socket.on('registerClient', function(){ // register the screen machine (client)
		client.id = socket.id;
		io.to(socket.id).emit('clientRegistered', socket.id);
	});
	
	
	socket.on('addPlayer', function(e){
		console.log('player requesting to join, id: ' + e);
		if(client.id == '') return {error: 2}; // no client registered yet, die
		
		io.to(client.id).emit('addPlayer', e); // pass the socket id to id this player object on the client
		
	});
	
	socket.on('playerAdded', function(e){
		console.log('player successfully added, id: ' + e);
		// record the new player
		controls[e] = {x: 0, y: 0, z: 0};
		// tell the controller they have been spawned
		io.to(e).emit('playerAdded');
	

	});
	
	socket.on('requestControls', function(){		// client has requested controls
		//console.log('controls requested from client - sending: ' + JSON.stringify(controls));
		io.to(socket.id).emit('controlsAsRequested', controls);
	});
	
	socket.on('replyControls', function(e){	// a controller sent in some controls
		// collate the controls on the server to send to the client
		controls[socket.id] = e;
		//console.log('controls received from controller - ' + Object.keys(controls).length);
		io.to(socket.id).emit('controlsReplied');
	});
	
	
	socket.on('disconnect', function(e){
	
		console.log('socket close event')
		if(socket.id == client.id){ // client disconnected, shut down
			controls = {};
			console.log('client refreshed')
		} else {					// player disconnected
			delete controls[socket.id]; // delete them
			io.to(client.id).emit('deletePlayer', socket.id); // tell the client to delete them
		}
	});

});

http.listen(8080, function(){
  console.log('listening on *:8080');
  var os = require( 'os' );

var networkInterfaces = os.networkInterfaces( );

console.log( networkInterfaces );
});
    