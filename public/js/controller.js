
	function $(el){
		return document.querySelector(el);
	}
	Object.prototype.on = function(type, func){
		
		if(type.indexOf( ',' ) > -1){ // concatenated string
		
			var types = type.split(',');
			for( var entry in types ){
				var tempEvt = entry.trim();
				this.addEventListener(tempEvt, func);
			}
			
		} else {
			this.addEventListener(type, func);
		}
	}
	function log(str){
		//var p = document.createElement('p');
		//p.appendChild( document.createTextNode( str ) );
		//$('#track').appendChild(p);
		$('#track').innerText = str;
		console.log(str);
	}
	
	
	controls = { // a package to update constantly and send to the server on request
		x: 0,
		y: 0,
		z: 0,
		cart: { x: 0, y: 0 },
		joystickDown: 0,
		bite: 0
	};
	pad = $('#pad'); // the pad area of the joystick
	// get the center point of the pad area
	padCenterX = pad.offsetLeft + (pad.clientWidth / 2);
	padCenterY = pad.offsetTop + (pad.clientHeight / 2);
	// we will use this reference point to get the offset of our joysticknub
	
	
	// handle our directional joystick
	// the joystick is made up of the pad and the nub
	// the nub is the bit the player moves around
	// the pad is the part that doesn't move
	
	$('#joystickNub').on('touchstart', function(e){
		e.preventDefault();
		
		controls.joystickDown = 1;
		var touchX = e.targetTouches[0].pageX;
		var touchY = e.targetTouches[0].pageY;
		
		// save the offset of the touch relative to the nub
		window.bufX = touchX - e.target.offsetLeft;
		window.bufY = touchY - e.target.offsetTop;
		// subtract bufX+Y from the touch location to inform where we should place the nub
			
	});
	
	document.on('click', function(e){
		e.preventDefault();
	});
		
	document.on('touchmove', function(e){
		e.preventDefault();
		
		if(e.target.id == 'joystickNub'){
			curX = e.targetTouches[0].pageX;
			curY = e.targetTouches[0].pageY;
			
			// get the co-ords from the difference between the nub and the center of the pad
			fromObj = {
				x: padCenterX,
				y: padCenterY
			};
			toObj = {
				x: curX,
				y: curY
			};
			cart = getCart(fromObj, toObj);
			polar = cart2pol(cart.x, cart.y);
			// clamp the nub within the pad area by limiting its magnitude and re-calculating the cartesian offset
			if(polar.mag > 100) polar.mag = 100;
			reCart = pol2cart(polar.rad, polar.mag);
			putX = reCart.x + (pad.clientWidth / 2) - window.bufX;
			putY = reCart.y + (pad.clientHeight / 2) - window.bufY;
			
			//log('left: ' + (putX) + 'px; top: ' + (putY) + 'px;');
			$('#joystickNub').style = 'margin: 0; position: absolute; left: ' + (putX) + 'px; top: ' + (putY) + 'px;';
			
			// update the controls object to be sent to the server
			controls.cart = cart;
		}
	});
		
	
	
	document.on('touchend', function(e){
		
		if(e.target.id == 'joystickNub'){
			// spring the nub back to zero;
			$('#joystickNub').style = 'margin: -40px; position: absolute; left: '+ padCenterX +'px; top: '+ padCenterY +'px;';
				
			// update the controls object to be sent to the server
			controls.joystickDown = 0;
			controls.cart = {x: 0, y: 0};
		}
	});
	
	

	var socket = io();
	
	$('#bite').on('touchstart', function(e){
		log('bite');
		// send a bite over the socket
		socket.emit('bite', socket.id);
	});
	

	$('#join').on('click', function(e){
		log('clicked join');
		//this.disabled = true; // stop people from multi-joining
	// controller wants to join game
		//log('requesting to join game');
		socket.emit('addPlayer', socket.id);		// request to join game via socket
		
	});

	socket.on('playerAdded', function(){			// this controller has been added to the screen
		log('player has joined game');
	});
	
	socket.on('controlsReplied', function(e){					// begin control loop
		//log('server has received controls');
		socket.emit('replyControls', controls);
	});
	socket.emit('replyControls', controls);

	