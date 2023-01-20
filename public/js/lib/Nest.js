/*
    The Nest is the turtles nest, where they will bring Jellyfish to score points
*/

function Nest(obj){
    /*
		obj = {
			pos: {
				x: float,
				y: float
			},
			mesh: tempMesh,
		}
    */
   
    this.mesh = obj.mesh
    this.pos = obj.pos
    this.distance = 4

    // set the given offset
    this.mesh.translateX(this.pos.x);
    this.mesh.translateY(this.pos.y);

    // if a player is within our radius, we will attemtp to take their jellyfish
    this.checkForPlayers = function(players){
        Object.keys(players).forEach((id) => {
            let player = players[id];
            if(player.currentJellyfish){
                var distance = Math.sqrt(Math.pow(player.mesh.position.x - this.pos.x, 2) + Math.pow(player.mesh.position.y - this.pos.y, 2));
                if(distance < this.distance){
                    // player is within range, take their jellyfish
                    player.scoreJellyfish()
                }
            }
        });
    }
}