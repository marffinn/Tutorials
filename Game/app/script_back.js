var world = [[]];
var worldWidth = 30;
var worldHeight = worldWidth;
var chanceToStartAlive = 0.55;
var deathLimit = 4;
var birthLimit = 5;
var numberOfSteps = 5;
var newSelection = null;
var oldSelection = null;
var playerArray = [];

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

var Colors = {
  midnightColor: 0x514656,
  grassColor: 0x9E9D7D,
  beigeColor: 0xFEFDF5,
  greenColor: 0x9FA560,
  skyColor: 0x57D0FA,
  floorColor: 0xD3BA85,
  waterColor: 0x74ccf4
};

var scene = new THREE.Scene();
scene.fog = new THREE.Fog(Colors.skyColor, 30, 120);

var camera = new THREE.OrthographicCamera( window.innerWidth / - 2, window.innerWidth / 2, window.innerHeight / 2, window.innerHeight / - 2, -100, 1000 );
camera.position.set(12, 12, 12);
camera.lookAt( new THREE.Vector3(0,0,0) );
camera.zoom = 45;

raycaster = new THREE.Raycaster();
mouse = new THREE.Vector2();

var renderer = new THREE.WebGLRenderer({
  alpha: true,
  antialias: true
});
renderer.setSize(window.innerWidth, window.innerHeight);
document.body.appendChild(renderer.domElement);

var Ground = function( x, z ){
  this.mesh = new THREE.Object3D();
  var groundGeometry = new THREE.PlaneGeometry(1, 1, 1);
  var groundMaterial = new THREE.MeshPhongMaterial({ color: Colors.beigeColor });
  var ground = new THREE.Mesh(groundGeometry, groundMaterial);
  ground.tex = Colors.beigeColor;
  ground.type = 'ground';
  ground.position.set(x, 0, z);
  ground.rotation.x = -Math.PI/2;
  this.mesh.add( ground );
  return ground;
}

var Sea = function( x, z ){
  this.mesh = new THREE.Object3D();
  var seaGeometry = new THREE.PlaneGeometry(1, 1, 1);
  var seaMaterial = new THREE.MeshPhongMaterial({ color: Colors.waterColor });
  var sea = new THREE.Mesh(seaGeometry, seaMaterial);
  sea.tex = Colors.waterColor;
  sea.type = 'sea';
  sea.position.set(x, 0, z);
  sea.rotation.x = -Math.PI/2;
  this.mesh.add( sea );
  return sea;
}

var levelArray = [];
var Level = function() {
  var levelGroup = new THREE.Object3D();
  for (var i = 0; i < world.length; i++) {
    var dir = world[i];
    for (var j = 0; j < dir.length; j++) {
      if (dir[j] == 0) {
        var seaObject = new Sea(i,j);
        levelGroup.add(seaObject);
        levelArray.push(seaObject);
      }
      else {
        var groundObject = new Ground(i,j);
      	levelGroup.add(groundObject);
        levelArray.push(groundObject);
      }
    }
  }
  return levelGroup;
}

var spawnLevel = function(){
  var level = new Level();
  scene.add(level);
}

var Player = function( x,z ){

  var geometry = new THREE.BoxGeometry(1, 1, 1);
  var material = new THREE.MeshPhongMaterial({
    color: 0xff0000,
    wireframe: false
  });
  var cube = new THREE.Mesh(geometry, material);
  cube.position.set( x, .5, z );
  cube.castShadow = true;
  cube.receiveShadow = true;
  playerArray.push(cube);
  return cube;

}

var spawnPlayer = function(){
  var player = new Player(0,0);
  scene.add(player);
}

var Lights = function(){
  var hemisphereLight = new THREE.HemisphereLight(0xaaaaaa,0x000000, .9);
  scene.add(hemisphereLight);
}

var spawnLights = function() {
  var lights = new Lights();
}

init();
animate();

function init(){
  spawnPlayer();
  spawnLevel();
  spawnLights();
}

function animate() {
  requestAnimationFrame(animate);
	TWEEN.update();
  render();
  renderer.render(scene, camera);
};
function render(){
  camera.updateProjectionMatrix();
}



function transformTo2D(levelArray){
  var newArr = [];
    while(levelArray.length) newArr.push( levelArray.splice(0, worldWidth ));
    return newArr;
}
var la = transformTo2D(levelArray);

function highlightSurroundings( la, playerToMove ){
  for( var i = 0; i <= la.length - 1 ; i++ ){

    hx = newSelection[i][0];
    hz = newSelection[i][1];

    if( la[hx][hz].type == 'sea' ){
      continue;
    }
    else {
      la[hx][hz].material.color.setHex( 0xff00ff );
    }
  }
  oldSelection = newSelection;
  console.log(playerToMove);
}


function neighbours( col, row, dis ){
  var matrix= [];
  for( var c = col - dis ; c <= col + dis ; c++ ){
      for( var r = row - dis ; r <= row + dis ; r++ ){
        var position = { x:c, z:r }
        matrix.push( position );
      }
  }
  return matrix;
}

function onPlayerClick(){
  event.preventDefault();
  mouse.x = ( event.clientX / renderer.domElement.width ) * 2 - 1;
  mouse.y = - ( event.clientY / renderer.domElement.height ) * 2 + 1;
  raycaster.setFromCamera( mouse, camera );
  var intersects = raycaster.intersectObjects( playerArray );

  if ( intersects.length > 0 ) {
    playerPos = { x: +intersects[0].object.position.x,z: intersects[0].object.position.z  }
    console.log( playerPos );
    console.log( neighbours( intersects[0].object.position.x, intersects[0].object.position.z, 2 ) )
    highlight( playerPos, intersects[0].object );
  }
}
document.addEventListener( 'mousedown', onPlayerClick, false );

function addPlayer(){
  var x = Math.floor( Math.random()* world.length );
  var z = Math.floor( Math.random()* world.length );
  var player = new Player(x,z);
  playerArray.push( player );
  scene.add(player);
}
var moveCamera = function(){
  var x = Math.floor( Math.random()* worldWidth );
  var z = Math.floor( Math.random()* worldHeight );
  new TWEEN.Tween(camera.position)
      .to({ x: x , y:5, z: z}, 1000)
      .start();
}

var worldAxis = new THREE.AxisHelper(20);
scene.add(worldAxis);
