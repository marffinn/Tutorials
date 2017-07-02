// stats
stats = new Stats();
stats.domElement.style.position = 'absolute';
stats.domElement.style.top = '10px';
stats.domElement.style.left = '10px';
stats.domElement.style.zIndex = 100;
document.body.appendChild(stats.domElement);

var world = [
  []
];
var worldWidth = 30;
var worldHeight = 30;
var chanceToStartAlive = 0.55;
var deathLimit = 4;
var birthLimit = 5;
var numberOfSteps = 5;

world = generateMap();

function iterate() {
  world = doSimulationStep(world);
}

function generateMap() {
  var map = [
    []
  ];
  initialiseMap(map);
  for (var i = 0; i < numberOfSteps; i++) {
    map = doSimulationStep(map);
  }
  return map;
}

function initialiseMap(map) {
  for (var x = 0; x < worldWidth; x++) {
    map[x] = [];
    for (var y = 0; y < worldHeight; y++) {
      map[x][y] = 0;
    }
  }

  for (var x = 0; x < worldWidth; x++) {
    for (var y = 0; y < worldHeight; y++) {
      if (Math.random() < chanceToStartAlive)
        map[x][y] = 1;
    }
  }
  return map;
}

function doSimulationStep(map) {
  var newmap = [
    []
  ];
  for (var x = 0; x < map.length; x++) {
    newmap[x] = [];
    for (var y = 0; y < map[0].length; y++) {
      var nbs = countAliveNeighbours(map, x, y);
      if (map[x][y] > 0) {
        if (nbs < deathLimit) {
          newmap[x][y] = 0;
        } else {
          newmap[x][y] = 1;
        }
      } else {
        if (nbs > birthLimit) {
          newmap[x][y] = 1;
        } else {
          newmap[x][y] = 0;
        }
      }
    }
  }
  return newmap;
}

function countAliveNeighbours(map, x, y) {
  var count = 0;
  for (var i = -1; i < 2; i++) {
    for (var j = -1; j < 2; j++) {
      var nb_x = i + x;
      var nb_y = j + y;
      if (i == 0 && j == 0) {} else if (nb_x < 0 || nb_y < 0 ||
        nb_x >= map.length ||
        nb_y >= map[0].length) {
        count = count + 1;
      } else if (map[nb_x][nb_y] == 1) {
        count = count + 1;
      }
    }
  }
  return count;
}

//////////////////////////////////////////////////////////////////// THREE.JS

var world2 = world.slice(0);
var easystar = new EasyStar.js();

easystar.setGrid(world2);
easystar.setAcceptableTiles([1]);

var Colors = {
  midnightColor: 0x514656,
  grassColor: 0x9E9D7D,
  beigeColor: 0xFEFDF5,
  greenColor: 0x9FA560,
  skyColor: 0x57D0FA,
  floorColor: 0xD3BA85,
  waterColor: 0x74ccf4

};

var clock = new THREE.Clock();

scene = new THREE.Scene();
scene.fog = new THREE.Fog(Colors.skyColor, 30, 120);

var camera = new THREE.PerspectiveCamera(75, window.innerWidth / window.innerHeight, 2, 40);
camera.position.set(0, 5, 0);
camera.rotation.y = 15;

var renderer = new THREE.WebGLRenderer({
  alpha: true,
  antialias: true
});
renderer.setPixelRatio( window.devicePixelRatio );
renderer.setSize(window.innerWidth, window.innerHeight);
document.body.appendChild(renderer.domElement);

controls = new THREE.OrbitControls(camera, renderer.domElement);
controls.enableDamping = true;
controls.enableZoom = true;

var Sea = function(xPos, zPos) {

  this.mesh = new THREE.Object3D();

  var seaGeometry = new THREE.PlaneGeometry(1, 1, 4,4);
  var seaMaterial = new THREE.MeshPhongMaterial({
    color: Colors.waterColor,
    opacity: 0.5,
	  wireframe: false,
    shininess: 0
  });

  this.sea = new THREE.Mesh(seaGeometry, seaMaterial);
  this.sea.tex = Colors.waterColor;
  this.sea.type = 'sea';
  this.sea.rotation.x = -Math.PI/2;
  this.sea.position.set(xPos, 0.7, zPos);

  this.mesh.add(this.sea);

}
var Ground = function(xPos, zPos) {

  this.mesh = new THREE.Object3D();

  var groundGeometry = new THREE.BoxGeometry(1, 1, 1);
  var groundMaterial = new THREE.MeshPhongMaterial({
    color: Colors.beigeColor
  });

  this.ground = new THREE.Mesh(groundGeometry, groundMaterial);
  this.ground.tex = Colors.floorColor;
  this.ground.type = 'sea';
  this.ground.position.set(xPos, 0.2, zPos);
  this.ground.rotation.x = -Math.PI/2;

  this.mesh.add(this.ground);

}

var Level = function() {

  this.mesh = new THREE.Object3D();

  var plane = null;
  var geometry = new THREE.BoxGeometry(1, 0.5, 1);
  var material = null;

  for (var i = 0; i < world.length; i++) {

    var dir = world[i];
    for (var j = 0; j < dir.length; j++) {

      if (dir[j] == 0) {
        plane = new Sea(j, i);
      } else {
        plane = new Ground(j, i);
      }
      this.mesh.add(plane.mesh);

    }
  }
 }

var level;
var spawnLevel = function(){
	level = new Level();
	level.mesh.position.x = -worldWidth/2;
	level.mesh.position.z = -worldHeight/2;
	scene.add(level.mesh);
}

var townContainer = [];
var Town = function( xpos,zpos ){
	
	this.mesh = new THREE.Object3D();
	var geometry = new THREE.BoxGeometry(1, 2, 1);
	var material = new THREE.MeshPhongMaterial({ color: Colors.midnightColor, wireframe: false });
	var cube = new THREE.Mesh(geometry, material);
	cube.position.set(xpos,1.7,zpos);
	townContainer.push(cube);
	this.mesh.add(cube);
	
}
var spawnTown = function(xpos,zpos){
	
	var town = new Town(xpos,zpos);
	scene.add(town.mesh);
	
}

var spawnLights = function(){
	
	var shadowlight = new THREE.DirectionalLight(0xffffff, 1);
	shadowlight.position.set(30, 20, 30);
	shadowlight.castShadow = true;
	shadowlight.shadow.mapSize.width = 1024;
	shadowlight.shadow.mapSize.height = 1024;
	scene.add(shadowlight);

	var shadowlight1 = new THREE.DirectionalLight(0xffffff, 1);
	shadowlight1.position.set(-30, -20, -30);
	shadowlight1.castShadow = true;
	shadowlight1.shadow.mapSize.width = 1024;
	shadowlight1.shadow.mapSize.height = 1024;
	scene.add(shadowlight1);


	var hemiLight = new THREE.HemisphereLight(Colors.skyColor, 0x44ff44, 0.4);
	hemiLight.position.copy(new THREE.Vector3(0, 500, 0));
	scene.add(hemiLight);
	
}

var playerContainer = [];
var Player = function(xpos,zpos){
	
	this.mesh = new THREE.Object3D();
	
	var geometry = new THREE.BoxGeometry(1, 1, 1);
	var material = new THREE.MeshPhongMaterial({
	  color: 0xff0000,
	  wireframe: false
	});
	var cube = new THREE.Mesh(geometry, material);
	cube.position.set(xpos,1.2,zpos);
	playerContainer.push(cube);
	this.mesh.add(cube);

}
var spawnPlayer = function(x,z){
	
	var player = new Player(x,z);
	scene.add(player.mesh);
	
}

function getRandomInt(min, max) {
  return Math.floor(Math.random() * (max - min + 1) + min);
}
var worldDimX = ( worldWidth/2  ) - 1;
var worldDimZ = ( worldHeight/2 ) - 1;

var addPlayer = function(){
	var x = getRandomInt( -worldDimX-1 , worldDimX );
	var z = getRandomInt( -worldDimZ-1 , worldDimZ );
	spawnPlayer(x,z);
}
var addTown = function(){
	var x = getRandomInt( -worldDimX , worldDimX );
	var z = getRandomInt( -worldDimZ , worldDimZ );
	spawnTown(x,z)
}

init();
animate();

function init() {

	spawnLights();
	spawnLevel();

}

function animate(){

  var delta = clock.getDelta();
  stats.update();
  requestAnimationFrame(animate);
  controls.update(delta);
  renderer.render(scene, camera);

  // addPlayer();
  // addTown();

};


var axisHelper = new THREE.AxisHelper( 10 );
axisHelper.position.y = 3;
scene.add( axisHelper );

function render() {

	var delta = clock.getDelta();
	// var time = clock.getElapsedTime() * 10;

	// for ( var i = 0, l = geometry.vertices.length; i < l; i ++ ) {
		// geometry.vertices[ i ].y =  Math.sin( i / 5 + ( time + i ) / 7 );
	// }

	// mesh.geometry.verticesNeedUpdate = true;

	controls.update( delta );
	renderer.render( scene, camera );
  // addPlayer();
  // addTown();
}