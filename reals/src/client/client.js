import * as THREE from 'three'
import { io } from 'socket.io-client'

import Jellyfish from '@lib/Jellyfish'

var clock, container, camera, scene, renderer, listener;

var ground, character, nest;
var light;
var textureLoader = new THREE.TextureLoader();
var loader = new THREE.JSONLoader();
// var FBXLoader = new FBXLoader();
var objectLoader = new THREE.ObjectLoader();
var isLoaded = false;
var activeActionName = 'idle';
var players = []; // an array to track players by socket id
var jellyfishes = []; // an array to track jellyfish
var isFading = false; // a variable to check if we are fading between animations

console.log(THREE);
    
// prepare a socket
var socket = io();

function controlsLoop(){		// a looped callback for updating with the server
    //console.log('requesting controls');
    socket.emit('requestControls');
}

// a slow loop for checking things every couple of frames
function slowLoop(){
    // check if we have players
    if(Object.keys(players).length < 1){
        // no players, do nothing
        return;
    }

    nest.checkForPlayers(players);

}
// run our slow loop every 10 frames
setInterval(slowLoop, 100);


// listen for our custom jellyfishDeleted event and remove the jellyfish from the array
document.addEventListener('jellyfishDeleted', function(e){
    console.log('jellyfish deleted');
    jellyfishes.splice(jellyfishes.indexOf(e.detail), 1);
});



    
function init() {		
    // prepare to register this device as the client
    socket.on('clientRegistered', function(e){
        console.log('client registered with id ' + e);
    });
    // tell the server that we are the client
    socket.emit('registerClient');
    
    // prepare for controls
    socket.on('controlsAsRequested', function(e){					// begin control loop
        
        // check we have players
        if(Object.keys(players).length > 0){
            // loop through the players and assign controls
            for(var prop in e){
                if(players[prop] != undefined){
                    players[prop].control(e[prop]);
                }
            }
        }
        
        // request the next set of controls
        socket.emit('requestControls');
    });
    socket.emit('requestControls');
    
    // register socket events
    
    socket.on('addPlayer', function(e){ // a new controller wants to join - 'e' contains the socket id of the socket from the server to the controller
        console.log('adding player ' + e);
        
        // spawn a player

        FBXLoader.load('./models/3DKit-diver.glb', function (geometry, materials) {
        // loader.load('./models/seaturtle.json', function (geometry, materials) {
            materials.forEach(function (material) {
                material.skinning = true;
            });

            var tempMesh = new THREE.SkinnedMesh( geometry, new THREE.MultiMaterial(materials) );
            
            players[e] = new Player({
                pos: {x: 100, y: 100},
                vel: {x: 0, y: 0},
                mesh: tempMesh,
                socketId: e,
                scene: scene
            });
            
            for(var i = 0; i < geometry.animations.length; i ++) {
                //console.log(geometry.animations[ i ].name);
                players[e].actions[ geometry.animations[ i ].name ] = players[e].mixer.clipAction( geometry.animations[ i ] )
                players[e].actions[ geometry.animations[ i ].name ].setEffectiveWeight(1)
                players[e].actions[ geometry.animations[ i ].name ].enabled = true; 
                // parent.actions['idle'] << as named in blender
            };
            scene.add(players[e].mesh);
            players[e].actions['swim'].play();

            // tell the server we're all added
            socket.emit('playerAdded', e);
        });
    });
    
    socket.on('deletePlayer', function(e){
        if( !! players[e] ) {
            players[e].deleteMe()
            delete players[e]
        }
    });
    
    socket.on('bite', function(e){
        players[e].bite(jellyfishes);
    });
    
    window.addEventListener('resize', onWindowResize, false);
    window.addEventListener('click', onDoubleClick, false);

    clock = new THREE.Clock();

    scene = new THREE.Scene();
    scene.background = new THREE.Color( 0x00234d );
    scene.fog = new THREE.Fog(0x00387c, 5, 180);
    
                hemiLight = new THREE.HemisphereLight( 0xffffff, 0xffffff, 0.6 );
                hemiLight.color.setHSL( 0.6, 1, 0.6 );
                hemiLight.groundColor.setHSL( 0.095, 1, 0.75 );
                hemiLight.position.set( 0, 500, 0 );
                scene.add( hemiLight );
                //
                dirLight = new THREE.DirectionalLight( 0xffffff, 1 );
                dirLight.color.setHSL( 0.1, 1, 0.95 );
                dirLight.position.set( -1, 1.75, 1 );
                dirLight.position.multiplyScalar( 50 );
                scene.add( dirLight );
                dirLight.castShadow = true;
                dirLight.shadow.mapSize.width = 2048;
                dirLight.shadow.mapSize.height = 2048;
                var d = 50;
                dirLight.shadow.camera.left = -d;
                dirLight.shadow.camera.right = d;
                dirLight.shadow.camera.top = d;
                dirLight.shadow.camera.bottom = -d;
                dirLight.shadow.camera.far = 3500;
                dirLight.shadow.bias = -0.0001;


    renderer = new THREE.WebGLRenderer({ antialias: true });
    renderer.setPixelRatio(window.devicePixelRatio);
    renderer.setSize(window.innerWidth, window.innerHeight);

    container = document.getElementById('container');
    container.appendChild(renderer.domElement);


    camera = new THREE.OrthographicCamera( 52 / - 2, 52 / 2, 30 / 2, 30 / - 2, 1, 1000 );
    camera.position.set(0, -1, -20);
    camera.rotateY( 3.14159 );
    camera.rotateX( 0.15 );
    listener = new THREE.AudioListener();
    camera.add(listener);

    loader.load('./models/scene.json', function (geometry, materials) {

        var loaderMat = new THREE.MeshStandardMaterial ( { color: 0xaaaaaa } );
        //loaderMat.wireframe = true;
        loaderMat.roughness = 0.95;

        var loaderModel = new THREE.Mesh(
            geometry,
            loaderMat
        );
        scene.add(loaderModel);


    });

    // add the turtles nest to the bottom left hand corner
    loader.load('./models/jellyfish_01.json', function (geometry, materials) {
        // handle multiple materials
        materials.forEach(function (material) {
            material.transparent = true;
            material.blending = THREE.AdditiveBlending;
            material.side = THREE.DoubleSide;
            //material.mapDiffuse = './textures/jellyfish_01_dif.png'
        });
        
        var multiMat =  new THREE.MultiMaterial(materials);
        var basicMat =  new THREE.MeshBasicMaterial(materials[0]);
        var tempMesh = new THREE.SkinnedMesh(geometry, basicMat);

        nest = new Nest({
            pos: {x: 20, y: -10},
            mesh: tempMesh,
        });

        scene.add(nest.mesh);
    });


    
    // jellyfish tiem!!
    loader.load('./models/jellyfish_01.json', function (geometry, materials) {
        // handle multiple materials
        materials.forEach(function (material) {
            material.transparent = true;
            material.blending = THREE.AdditiveBlending;
            material.side = THREE.DoubleSide;
            //material.mapDiffuse = './textures/jellyfish_01_dif.png'
        });
        
        var multiMat =  new THREE.MultiMaterial(materials);
        var basicMat =  new THREE.MeshBasicMaterial(materials[0]);
        var tempMesh = new THREE.SkinnedMesh(geometry, basicMat);
        
        let jelly = new Jellyfish({
            pos: {x: 100, y: 100},
            vel: {x: 0, y: 0},
            mesh: tempMesh,
            scene,
        });

        jellyfishes.push(jelly);
        
        scene.add(tempMesh);

    });

    // light = new THREE.DirectionalLight(0x8888ff, 1);
    // scene.add(light);
    // scene.add(light.target);
    // light.target.position = new THREE.Vector3( 10, 100, 0 );

    animate();

    isLoaded = true;
      
} //  init()
init();



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
    
  } else {
    // too much time to be a doubletap
  }

  mylatesttap = new Date().getTime();

}

function animate () {
  requestAnimationFrame(animate);
  render();
}

function render () {
  var delta = clock.getDelta();
  renderer.render(scene, camera);
  
  for( var player in players ){
      players[player].update(delta);
  }
  for( var jelly in jellyfishes ){
      jellyfishes[jelly].update(delta);
  }
  
}