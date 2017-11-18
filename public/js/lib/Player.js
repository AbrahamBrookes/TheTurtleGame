	/*
		A Player class to handle all the intricacies of our player
		we will store such things as:
				* 3D mesh
				* position and velocity
				* collision
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
			},
			scene: THREE.Scene();
			
		}
	
	*/
	
	this.mesh = obj.mesh;	// a new THREE.SkinnedMesh object
	this.actions = {}; // an object to hold arbitrary action (animation clip) names
	this.mixer = new THREE.AnimationMixer(obj.mesh); // a new THREE.AnimationMixer
	this.trackerBall; // a mesh object used to point the character model when moving
	this.controls = {}; // stores our controls from the phone
	this.socketId = obj.socketId; // the socket to the controller for this player
	this.pauseRotate = 0; // when we pause, rotate proud a bit. Track the rotation in this variable. Radians
	this.scene = obj.scene;
	
	var parent = this;
	

			// joystick released, spring the trackerBall back to the player
			
		}
		
		if(controls.bite == 1){
			this.bite();
		}

		this.scene.remove(this.trackerBall);
		this.mesh.geometry.dispose();
	
	this.bite = function(){
		this.mixer.clipAction('bite').reset().play().fadeIn(0.15).fadeOut(0.15);
	}
		
		if(polVelocity.mag < 0.25) polVelocity.mag = 0;
		// degrees = radians * 180 / Math.PI;
		while(trackerScalar > 1) trackerScalar = 0.99999;
		if(trackerScalar < 0.1) trackerScalar = 0;
		
		var myRotateX = (0.6 * trackerScalar) - this.pauseRotate;
		this.pauseRotate += myRotateX;
		
		this.mesh.rotateX(myRotateX);
		// apply our velocity
		if(trackerScalar < 0.3) trackerScalar = 0;
		this.mesh.translateZ(finalVelocity * trackerScalar);