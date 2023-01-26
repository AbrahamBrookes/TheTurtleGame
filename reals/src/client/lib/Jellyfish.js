	/*
		A Jellyfish class to handle all the intricacies of our Jellyfish
		we will store such things as:
				* 3D mesh
				* position and velocity
				* collision
		This class can only be called from within the callback of a THREE.JSONLoader()'s load() function
		as it needs to store the resulting mesh asynchronously so we can reference it properly.
	*/


export default function Jellyfish(obj){
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
			mesh: tempMesh,
			scene: THREE.Scene();
		}
	
	*/
	
	this.mesh = obj.mesh;	// a new THREE.SkinnedMesh object
	this.scene = obj.scene;
	var parent = this;
	this.incrementer = 0; // a number we will use to make the jelly bob up and down
	
	
	this.deleteMe = function(){
		// send out a javascript event to let the game know we are deleting this jellyfish
		var event = new CustomEvent("jellyfishDeleted", {detail: {jellyfish: this}});
		this.scene.remove(this.mesh);
		this.mesh.geometry.dispose();
	}


	this.update = function(delta) {
		// bob up and down
		this.incrementer += 0.025;
		
		var oscillator = Math.cos(this.incrementer);
		var offset =  oscillator * 0.005;
		this.mesh.position.y += offset;
		this.mesh.rotation.y += (offset + 0.01) / 5;
		this.mesh.rotation.z += offset / 5;
	}
	
}