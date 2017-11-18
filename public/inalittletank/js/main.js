var clock, container, camera, scene, renderer, myController, listener;

var ground, character, trackerBall;
var light;
var textureLoader = new THREE.TextureLoader();
var loader = new THREE.JSONLoader();
var objectLoader = new THREE.ObjectLoader();
var isLoaded = false;
var action = {}, mixer;
var activeActionName = 'idle';

var myController = { 
	up : {
		pressed: false
	},
	down : {
		pressed: false
	},
	left : {
		pressed: false
	},
	right : {
		pressed: false
	},
	into : {
		pressed: false
	},
	out : {
		pressed: false
	},
	activate : {
		pressed: false
	}
};
var isFading = false; // a variable to check if we are fading between animations

var arrAnimations = [
  'idle',
  'swim'
];
var actualAnimation = 0;

	
	/**************************************
		myController
		We'll record our control keys (WASD) in our 
		`myController` object when they are pressed 
		and un-track them when they are released.
		Then in the renderer loop we'll check the
		myController and respond accordingly		
	
	***************************************/
	
	
	
	document.addEventListener( 'keydown', onKeyDown, false );
	document.addEventListener( 'keyup', onKeyUp, false );

	function onKeyDown ( event ) {

		switch( event.keyCode ) {

			case 38: /*up*/
				// tell the renderer the button is down
				myController.up.pressed = true;
				break;
			case 87: /*W*/ 
				// tell the renderer the button is down
				myController.up.pressed = true;
				break;

			case 40: /*down*/
				// tell the renderer the button is down
				myController.down.pressed = true;
				break;
			case 83: /*S*/ 
				// tell the renderer the button is down
				myController.down.pressed = true;
				break;

			case 37: /*left*/
				// tell the renderer the button is down
				myController.left.pressed = true;
				break;
			case 65: /*A*/  
				// tell the renderer the button is down
				myController.left.pressed = true;
				break;

			case 39: /*right*/
				// tell the renderer the button is down
				myController.right.pressed = true;
				break;
			case 68: /*D*/  
				// tell the renderer the button is down
				myController.right.pressed = true;
				break;

			case 32: /*D*/  

			//case 67: /*C*/     myController.crouch = true; break;
			//case 32: /*space*/ myController.jump = true; break;
			//case 17: /*ctrl*/  myController.attack = true; break;

		}

	};

	function onKeyUp ( event ) {

		switch( event.keyCode ) {

			case 38: /*up*/
				// tell the renderer the button is down
				myController.up.pressed = false;
				break;
			case 87: /*W*/ 
				// tell the renderer the button is down
				myController.up.pressed = false;
				break;

			case 40: /*down*/
				// tell the renderer the button is down
				myController.down.pressed = false;
				break;
			case 83: /*S*/ 
				// tell the renderer the button is down
				myController.down.pressed = false;
				break;

			case 37: /*left*/
				// tell the renderer the button is down
				myController.left.pressed = false;
				break;
			case 65: /*A*/  
				// tell the renderer the button is down
				myController.left.pressed = false;
				break;

			case 39: /*right*/
				// tell the renderer the button is down
				myController.right.pressed = false;
				break;
			case 68: /*D*/  
				// tell the renderer the button is down
				myController.right.pressed = false;
				break;

			//case 67: /*C*/     myController.crouch = false; break;
			//case 32: /*space*/ myController.jump = false; break;
			//case 17: /*ctrl*/  myController.attack = false; break;

		}

	};
	
	/*              end capturing keys                     */
	
	
init();

function init () {

  clock = new THREE.Clock();

  scene = new THREE.Scene();

  renderer = new THREE.WebGLRenderer({ antialias: true });
  renderer.setPixelRatio(window.devicePixelRatio);
  renderer.setSize(window.innerWidth, window.innerHeight);

  container = document.getElementById('container');
  container.appendChild(renderer.domElement);

  camera = new THREE.PerspectiveCamera(60, window.innerWidth / window.innerHeight, 0.1, 1000);
  camera.position.set(0, 0, -50);
  camera.rotateY( 3.14159 );
  listener = new THREE.AudioListener();
  camera.add(listener);

  //controls = new THREE.OrbitControls(camera, renderer.domElement);
  //controls.target = new THREE.Vector3(0, 0.6, 0);
  
  
  
  // Lights
  light = new THREE.AmbientLight(0xffffff, 1);
  scene.add(light);
  light = new THREE.PointLight(0x8888ff, 1, 500);
  scene.add(light);
/*
  textureLoader.load('textures/ground.png', function (texture) {
    var geometry = new THREE.PlaneBufferGeometry(2, 2);
    geometry.rotateX(-Math.PI / 2);
    var material = new THREE.MeshBasicMaterial({ map: texture, transparent: true });
    ground = new THREE.Mesh(geometry, material);
    scene.add(ground);

  });
*/
	var mySphereGeometry = new THREE.SphereGeometry( 0.5, 12, 8 );
	var mySphereMaterial = new THREE.MeshBasicMaterial( { transparent: true, opacity: 0 } );
	trackerBall = new THREE.Mesh( mySphereGeometry, mySphereMaterial );
	scene.add( trackerBall );


  loader.load('./models/scene.json', function (geometry, materials) {
	  
	var shitMaterial = new THREE.MeshStandardMaterial ( { color: 0xffff00 } );

    swimScene = new THREE.Mesh(
      geometry,
      shitMaterial
    );
    scene.add(swimScene);


  });
  
  
  loader.load('./models/seaturtle.json', function (geometry, materials) {
    materials.forEach(function (material) {
      material.skinning = true;
    });
    character = new THREE.SkinnedMesh(
      geometry,
      new THREE.MultiMaterial(materials)
    );

    mixer = new THREE.AnimationMixer(character);

    action.swim = mixer.clipAction(geometry.animations[ 0 ]);
    action.idle = mixer.clipAction(geometry.animations[ 1 ]);

    action.swim.setEffectiveWeight(1);
    action.idle.setEffectiveWeight(1);

    //action.swim.setLoop(THREE.LoopOnce, 0);
    //action.hello.clampWhenFinished = true;

    action.swim.enabled = true;
    action.idle.enabled = true;

    scene.add(character);

    window.addEventListener('resize', onWindowResize, false);
    window.addEventListener('click', onDoubleClick, false);
    console.log('Double click to change animation');
    animate();

    isLoaded = true;

    action.idle.play();
  });
}

function fadeAction (name) {
  var from = action[ activeActionName ].play();
  var to = action[ name ].play();

  from.enabled = true;
  to.enabled = true;

  if (to.loop === THREE.LoopOnce) {
    to.reset();
  }

  from.crossFadeTo(to, 0.5);
  activeActionName = name;
  

}

function onWindowResize () {
  camera.aspect = window.innerWidth / window.innerHeight;
  camera.updateProjectionMatrix();

  renderer.setSize(window.innerWidth, window.innerHeight);
}

var mylatesttap;
function onDoubleClick () {
  var now = new Date().getTime();
  var timesince = now - mylatesttap;
  if ((timesince < 600) && (timesince > 0)) {
    if (actualAnimation == arrAnimations.length - 1) {
      actualAnimation = 0;
    } else {
      actualAnimation++;
    }
    fadeAction(arrAnimations[actualAnimation]);

  } else {
    // too much time to be a doubletap
  }

  mylatesttap = new Date().getTime();

}

function animate () {
  requestAnimationFrame(animate);
  //controls.update();
  render();

}

function render () {
  var delta = clock.getDelta();
  mixer.update(delta);
  if(myController.up.pressed){
	  character.position.y += 0.175;
	  
	  if(trackerBall.position.y <= character.position.y + 5){
		  trackerBall.position.y += 0.5;
	  }
	 
  }
  if(myController.down.pressed){
	  character.position.y -= 0.175;
	  if(trackerBall.position.y >= character.position.y - 5){
		  trackerBall.position.y -= 0.5;
	  }
	 
  }
  if(myController.left.pressed){
	  character.position.x += 0.175;
	  if(trackerBall.position.x <= character.position.x + 5){
		  trackerBall.position.x += 0.5;
	  }
	 
  }
  if(myController.right.pressed){
	  character.position.x -= 0.175;
	  if(trackerBall.position.x >= character.position.x - 5){
		  trackerBall.position.x -= 0.5;
	  }
	 
  }
  
	 // fadeAction(arrAnimations[0]);
	  
	  if(trackerBall.position.y >= character.position.y){
		  trackerBall.position.y -= 0.2;
	  }
	  if(trackerBall.position.y <= character.position.y){
		  trackerBall.position.y += 0.2;
	  }
	  if(trackerBall.position.x >= character.position.x+1){
		  trackerBall.position.x -= 0.1;
	  }
	  if(trackerBall.position.x <= character.position.x-1){
		  trackerBall.position.x += 0.1;
	  }
	  character.lookAt(trackerBall.position);
	  
  
  // handle character animation 
  // changing animation weights 
  // depending on position of trackball
  var trackerDist = Math.abs(trackerBall.position.x - character.position.x);
  var trackerScalar = trackerDist / 5;
  action.swim.play();
  action.swim.weight = 1- trackerScalar;
  action.idle.weight = trackerScalar;
  
  
  renderer.render(scene, camera);
}
