	/*
		A Player class to handle all the intricacies of our player
		we will store such things as:
				* 3D mesh
				* position and velocity
				* collision		This player class can only be called from within the callback of a THREE.JSONLoader()'s load() function		as it needs to store the resulting mesh asynchronously so we can reference it properly.
	*/


function Player(obj){
	/*
		obj = {
			pos: {
				x: float,
				y: float
			},
			vel: {
				x: float,
				y: float
			},			mesh: tempMesh,			mixer: tempMixer,			socketId: socket.id,
			scene: THREE.Scene();
			
		}
	
	*/
	
	this.mesh = obj.mesh;	// a new THREE.SkinnedMesh object
	this.actions = {}; // an object to hold arbitrary action (animation clip) names
	this.mixer = new THREE.AnimationMixer(obj.mesh); // a new THREE.AnimationMixer
	this.trackerBall; // a mesh object used to point the character model when moving
	this.controls = {}; // stores our controls from the phone	this.position = {x:0, y:0, z:0}; // xyz position	this.velocity = {x:0, y:0, z:0}; // xyz velocity	this.velocityGoal = {x:0, y:0, z:0}; // xyz velocity goal for lerping movement
	this.socketId = obj.socketId; // the socket to the controller for this player
	this.pauseRotate = 0; // when we pause, rotate proud a bit. Track the rotation in this variable. Radians
	this.scene = obj.scene;
	
	var parent = this;
	
	// add our trackerBall	var mySphereGeometry = new THREE.SphereGeometry( 0.5, 12, 8 );	var mySphereMaterial = new THREE.MeshBasicMaterial( { transparent: true, opacity: 0, wireframe: true } );	this.trackerBall = new THREE.Mesh( mySphereGeometry, mySphereMaterial );	this.scene.add( this.trackerBall );			this.control = function(controls){		this.controls = controls;		// use the cartesian offset from the joystick on the controller		// to decide how to move the player		if(controls.joystickDown == 1){			// joystick is being manipulated			var trackToX = this.mesh.position.x - (this.controls.cart.x / 15);			var trackToY = this.mesh.position.y - (this.controls.cart.y / 15);			if(trackToX > 25) trackToX = 25;			if(trackToX < -25) trackToX = -25;			if(trackToY > 16) trackToY = 16;			if(trackToY < -8) trackToY = -8;			this.trackerBall.position.x = trackToX;			this.trackerBall.position.y = trackToY;			this.mesh.lookAt(this.trackerBall.position);		} else if(controls.joystickDown == 0){
			// joystick released, spring the trackerBall back to the player
			
		}
		
		if(controls.bite == 1){
			this.bite();
		}
			}		this.deleteMe = function(){		this.scene.remove(this.mesh);
		this.scene.remove(this.trackerBall);		this.trackerBall.geometry.dispose();
		this.mesh.geometry.dispose();	}
	
	this.bite = function(){
		this.mixer.clipAction('bite').reset().play().fadeIn(0.15).fadeOut(0.15);
	}	this.update = function(delta) {		// runs in the render loop		var maxVelocity = .025;
				// lerp up our velocity		var cartVelocity = getCart(this.mesh.position, this.trackerBall.position);		var polVelocity = cart2pol(cartVelocity.x, cartVelocity.y);		// clamp our velocity		if(polVelocity.mag > 10) polVelocity.mag = 10;
		if(polVelocity.mag < 0.25) polVelocity.mag = 0;		// scale our velocity		var finalVelocity = (polVelocity.mag * maxVelocity);				// handle character animation 		// changing animation weights 		// depending on position of trackball		var trackerDistX = Math.abs(this.trackerBall.position.x - this.mesh.position.x);		var trackerDistY = Math.abs(this.trackerBall.position.y - this.mesh.position.y);		var trackerScalar = (trackerDistX + trackerDistY) / 5;		this.actions['swim'].play();		this.actions['idle'].weight = 1- trackerScalar;		this.actions['swim'].weight = trackerScalar;
		// degrees = radians * 180 / Math.PI;
		while(trackerScalar > 1) trackerScalar = 0.99999;
		if(trackerScalar < 0.1) trackerScalar = 0;
		
		var myRotateX = (0.6 * trackerScalar) - this.pauseRotate;
		this.pauseRotate += myRotateX;
		
		this.mesh.rotateX(myRotateX);		
		// apply our velocity
		if(trackerScalar < 0.3) trackerScalar = 0;
		this.mesh.translateZ(finalVelocity * trackerScalar);						this.mixer.update(delta);				}	}