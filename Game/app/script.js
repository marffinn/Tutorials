var scene, camera, renderer;
var controls;
var SCREEN_WIDTH, SCREEN_HEIGHT;

var	player, world, tower;
	
var	mapArray = [];
var level; // also an Array consisting of block spread on a 2D matrix
var	playerArray = [];
var towerArray	= [];

var raycaster = new THREE.Raycaster();
var mouse = new THREE.Vector2();
var intersects;
var selection = null;

var loader = new THREE.JSONLoader();

var Colors = {
	
	midnightColor: 	'#514656',
	grassColor:		'#9E9D7D',
	beigeColor:		'#FEFDF5',
	greenColor:		'#9FA560',
	groundColor:	'#383636',
	skyColor:		'#57D0FA',
	floorColor:		'#D3BA85'
	
};

/*
ooooooooooo   ooooooo   oooo     oooo ooooooooooo oooooooooo 
88  888  88 o888   888o  88   88  88   888    88   888    888
    888     888     888   88 888 88    888ooo8     888oooo88 
    888     888o   o888    888 888     888    oo   888  88o  
   o888o      88ooo88       8   8     o888ooo8888 o888o  88o8
*/

function Tower(){
	
	this.mesh = new THREE.Object3D();
	
	var geometry = new THREE.BoxGeometry( 0.2, 0.2, .2 , 1, 1, 1 );
	var material = new THREE.MeshPhongMaterial( {color: Colors.midnightColor } );
	var cup = new THREE.Mesh( geometry, material );
        cup.rotation.x = Math.PI/2;
        cup.position.y = 1;
        cup.position.z = 0;
    
	this.mesh.add( cup );
    towerArray.push( cup );
}
Tower.prototype.selectedTower = function(event){

   var tw1 = new TWEEN.Tween( this.mesh.position )
                    .to( { y : 1 }, 1000 )
                    .easing(TWEEN.Easing.Quadratic.InOut)
                    .yoyo()
                    .start();
    
   var tw2 = new TWEEN.Tween( this.mesh.position )
                    .to( { y : 0 }, 1000 )
                    .easing(TWEEN.Easing.Quadratic.InOut)
                    .yoyo()
                    .start();
    tw1.chain(tw2);
    tw2.chain(tw1);
    
    tw1.start();
    
}

function createTower(){
	tower = new Tower();
	scene.add( tower.mesh );
}

/*
oooooooooo ooooo            o   ooooo  oooo ooooooooooo oooooooooo 
 888    888 888            888    888  88    888    88   888    888
 888oooo88  888           8  88     888      888ooo8     888oooo88 
 888        888      o   8oooo88    888      888    oo   888  88o  
o888o      o888ooooo88 o88o  o888o o888o    o888ooo8888 o888o  88o8
*/

function Player(xpos,zpos){
	
	this.name = 'sa';
		
	loader.load(
		'obj/models/minecraft_sole.json',
		function ( geometry, materials ) {
			
			var material = new THREE.MultiMaterial( materials );
			this.player = new THREE.Mesh( geometry, material );
			this.player.position.set(xpos , 1, zpos );
			this.player.scale.set(0.3, 0.3, 0.3);
			playerArray.push( this.player );
			scene.add( this.player );
			
		}
	);
	
}

function createPlayer(x,z){
	
	player = new Player(x,z);
	
}

/*
ooooo       ooooo  ooooooo8 ooooo ooooo ooooooooooo  oooooooo8 
 888         888 o888    88  888   888  88  888  88 888        
 888         888 888    oooo 888ooo888      888      888oooooo 
 888      o  888 888o    88  888   888      888             888
o888ooooo88 o888o 888ooo888 o888o o888o    o888o    o88oooo888 
*/

function createLights(){
	
	var light1 = new THREE.HemisphereLight(0xffffff, 0xffffff, 0.3);
    light1.position.set(0, 500, 0);
    
    var light2 = new THREE.DirectionalLight( 0xffffff );
    light2.position.set(10,10,30);  
    light2.castShadow = true;
    light2.shadow.mapSize.width = 512;
    light2.shadow.mapSize.height = 512;
    light2.shadow.camera.near = 0.5;
    light2.shadow.camera.far = 500;
    
    var light3 = new THREE.DirectionalLight(0xffffff);
    light3.position.set(300, 300, 1000);
	
	scene.add( light1 );
	scene.add( light2 );
	scene.add( light3 );
	
}

/*
 oooooooo8    oooooooo8 ooooooooooo oooo   oooo ooooooooooo
888         o888     88  888    88   8888o  88   888    88 
 888oooooo  888          888ooo8     88 888o88   888ooo8   
        888 888o     oo  888    oo   88   8888   888    oo 
o88oooo888   888oooo88  o888ooo8888 o88o    88  o888ooo8888
*/

function createScene(){
	scene = new THREE.Scene();
	camera = new THREE.PerspectiveCamera(45, window.innerWidth / window.innerHeight, .1, 500);    
    
    camera.position.x = 50;
    camera.position.y = 45;
    camera.position.z = 50;
    camera.updateProjectionMatrix();
    camera.lookAt(scene.position);
    
	renderer = new THREE.WebGLRenderer({
        antialias: true,
        alpha: true
    });
    renderer.setClearColor( 0x000000, 0 );
    renderer.setPixelRatio(window.devicePixelRatio);
    renderer.setSize(window.innerWidth, window.innerHeight);
    
    renderer.shadowMap.enabled = true;
    renderer.shadowMap.type = THREE.PCFSoftShadowMap;
    
    
    
}

/*
oooo     oooo  ooooooo  oooooooooo  ooooo       ooooooooo  
 88   88  88 o888   888o 888    888  888         888    88o
  88 888 88  888     888 888oooo88   888         888    888
   888 888   888o   o888 888  88o    888      o  888    888
    8   8      88ooo88  o888o  88o8 o888ooooo88 o888ooo88  
*/                                                          

function listToMatrix(list, elementsPerSubArray) {
    var matrix = [], i, k;

    for (i = 0, k = -1; i < list.length; i++) {
        if (i % elementsPerSubArray === 0) {
            k++;
            matrix[k] = [];
        }

        matrix[k].push(list[i]);
    }

    return matrix;
}

function World(){
	
	this.mesh = new THREE.Object3D();
	this.type = 'sea';
	var plane = null;
	var geometry = new THREE.CubeGeometry( 1, 1, 1 );
	var material = null;
	
	this.levelArray = [
		[0,0,0,0,0,0,0,1,1,1,1,1,1,0,0],
		[0,0,0,0,0,0,0,1,1,1,0,1,1,1,0],
		[0,0,0,0,0,0,0,1,1,1,0,1,1,1,0],
		[0,1,1,1,0,0,0,1,1,1,0,0,1,0,0],
		[0,1,1,1,1,1,1,1,1,1,0,0,0,0,0],
		[0,1,1,1,0,1,0,1,1,1,0,1,1,1,0],
		[0,1,1,1,0,1,1,1,1,1,0,1,1,1,0],
		[0,0,0,0,0,0,0,1,1,1,0,0,1,1,0],
		[0,0,0,0,0,0,0,1,1,1,0,0,0,0,0],
		[0,0,0,0,0,0,0,1,1,1,0,0,0,0,0],
		[0,0,0,2,2,0,0,1,1,1,0,0,0,0,0],
		[0,1,1,1,2,0,0,1,1,1,0,0,0,0,0],
		[0,1,1,1,2,1,0,1,1,1,0,0,0,0,0],
		[0,1,1,1,2,1,0,1,1,1,0,0,0,0,0],
		[0,0,0,2,2,1,0,1,1,1,0,0,0,0,0]
	];
	
	for(var i = 0; i < this.levelArray.length; i++) {
		
		var dir = this.levelArray[i];	
		for( var j = 0 ; j < dir.length ; j++) {

			if( dir[j] == 0 ){
				
				material = new THREE.MeshPhongMaterial( {color: Colors.skyColor } );
				plane = new THREE.Mesh( geometry, material );
				plane.tex = Colors.skyColor;
				plane.type = 'sea';
				plane.position.set( j , 0 , i );
			}
			else if( dir[j] == 2 ){
				
				material = new THREE.MeshPhongMaterial( {color: Colors.midnightColor } );
				plane = new THREE.Mesh( geometry, material );
				plane.tex = Colors.midnightColor;
				plane.type = 'sea';
				plane.position.set( j , 0 , i );
			}
			else {
				
				material = new THREE.MeshPhongMaterial( {color: Colors.groundColor } );
				plane = new THREE.Mesh( geometry , material );
				plane.tex = Colors.groundColor;
				plane.type = 'ground';
				plane.position.set( j , 0 , i );
			}
			
			plane.rotation.x = -Math.PI / 2;
			
			mapArray.push( plane );
			
			this.mesh.add( plane );
			
		}
	}
	
	level = listToMatrix(mapArray, this.levelArray.length );
}

World.prototype.selectSurroundingArea = function( object ){

	var selectX = object.position.x;
	var selectZ = object.position.z;
    
	if( selection === null ){ // if selectoin never ran before proceed with normal selection
		
		selection = Array2D.neighbors( level , selectZ, selectX);
		
		for (var i = 0 ; i <= selection.length ; i++){
			if( selection[i] == undefined ){	
				continue;
			}
			else {
				selection[i].material.color.setHex(0xff0000);
			}
		}
		
	}
	
	else {
		
		for (var j = 0 ; j <= selection.length ; j++){
			if( selection[j] == undefined ){	
				continue;
			}
			else {
				selection[j].material.color.setHex( selection[j].tex );
				console.log( selection[j].tex );
			}
		}
				
		selection = Array2D.neighbors( level , selectZ, selectX);
		
		for (var k = 0 ; k <= selection.length ; k++){
			if( selection[k] == undefined ){	
				continue;
			}
			else {
				selection[k].material.color.setHex(0xff0000);
			}
		}
		
	}
	
}


function createWorld(){
	world = new World();
	scene.add(world.mesh);
}

init();
animate();

/*

ooooo oooo   oooo ooooo ooooooooooo
 888   8888o  88   888  88  888  88
 888   88 888o88   888      888    
 888   88   8888   888      888    
o888o o88o    88  o888o    o888o  

*/

function init(event) {
	
	createScene();
    createLights();
	createWorld();
	createTower();
	
    controls = new THREE.OrbitControls(camera, renderer.domElement);
    // controls.enableZoom = false;
    // controls.enableRotate = false;
	
    
    controls.addEventListener('change', render);
	$("#container").append(renderer.domElement);
}

/*

     o      oooo   oooo ooooo oooo     oooo      o   ooooooooooo ooooooooooo
    888      8888o  88   888   8888o   888      888  88  888  88  888    88 
   8  88     88 888o88   888   88 888o8 88     8  88     888      888ooo8   
  8oooo88    88   8888   888   88  888  88    8oooo88    888      888    oo 
o88o  o888o o88o    88  o888o o88o  8  o88o o88o  o888o o888o    o888ooo8888

*/

function animate() {
	
	requestAnimationFrame(animate);
	controls.update();
	TWEEN.update();
    render();
	
}

function render() {	
    
    renderer.render(scene, camera);	
    
}

/*

ooooooooooo                                   o8   888           
 888    88 oooo   oooo ooooooooo8 oo oooooo o888oo 888 oooooooo8 
 888ooo8    888   888 888oooooo8   888   888 888  o88 888ooooooo 
 888    oo   888 888  888          888   888 888              888
o888ooo8888    888      88oooo888 o888o o888o 888o    88oooooo88 

*/

function onWorldEvent( event ) {

    event.preventDefault();		
	mouse.x = ( event.clientX / renderer.domElement.clientWidth ) * 2 - 1;
	mouse.y = - ( event.clientY / renderer.domElement.clientHeight ) * 2 + 1;
	raycaster.setFromCamera( mouse, camera );

	intersects = raycaster.intersectObjects( mapArray );
    
    if ( intersects.length > 0 ) {
        world.selectSurroundingArea( intersects[0].object );
		
    }
    
}

window.addEventListener( 'click', onWorldEvent, false );

function onTowerMouseDown( event ) {

    event.preventDefault();		
	mouse.x = ( event.clientX / renderer.domElement.clientWidth ) * 2 - 1;
	mouse.y = - ( event.clientY / renderer.domElement.clientHeight ) * 2 + 1;
	raycaster.setFromCamera( mouse, camera );

	intersects = raycaster.intersectObjects( towerArray );
    
    if ( intersects.length > 0 ) {
        tower.selectedTower();
    }
    
}

window.addEventListener( 'click', onPlayerMouseDown, false );

function onPlayerMouseDown( event ) {

    event.preventDefault();		
	mouse.x = ( event.clientX / renderer.domElement.clientWidth ) * 2 - 1;
	mouse.y = - ( event.clientY / renderer.domElement.clientHeight ) * 2 + 1;
	raycaster.setFromCamera( mouse, camera );

	intersects = raycaster.intersectObjects( towerArray );
    
    if ( intersects.length > 0 ) {
        tower.selectedTower();
    }
    
}

window.addEventListener( 'click', onTowerMouseDown, false );

$('.addPlayer').on('click', function(){
    createPlayer( 6, 6);
});

window.addEventListener('resize', function () {
    SCREEN_WIDTH = window.innerWidth;
    SCREEN_HEIGHT = window.innerHeight;
    camera.aspect = SCREEN_WIDTH / SCREEN_HEIGHT;
    camera.updateProjectionMatrix();
    renderer.setSize(SCREEN_WIDTH, SCREEN_HEIGHT);
});