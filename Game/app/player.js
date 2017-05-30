function Player() {
	var bobby;
	this.loader = new THREE.JSONLoader();
    
    this.loader.load(
	
        'obj/models/minecraft_sole.json',
        function ( geometry, materials ) {
            
            var material = new THREE.MultiMaterial( materials );
            var bobby = new THREE.Mesh( geometry, material );
            bobby.position.set(0, 0, 0);
            
            bobby.castShadow = true;
            bobby.receiveShadow = false;
			
			scene.add( bobby );
            
        }
    );
	
}

Player.prototype.animate = function() {
	
	this.bobby.rotation.y -= 0.5;
	
}
