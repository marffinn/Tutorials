var world = [
  []
];
var worldWidth = 40;
var worldHeight = 40;
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

// THREE JS //////////////////////////////////////////////////////////////////////////////////////////////////////
var easystar = new EasyStar.js();

easystar.setGrid(world);
easystar.setAcceptableTiles([1]);
easystar.enableDiagonals();
easystar.findPath(0, 0, 4, 7, function( path ) {
	if (path === null) {
		console.log('no path');
	} else {
  	walkPath = path.slice(0);
    console.log(path);
	}
});
easystar.calculate();


var movePlayerPath = function(xto,zto){
	easystar.findPath(cube.position.z, cube.position.z, xto, zto, function( path ) {
    if (path === null) {
      	console.log('no path');
    }
    else {
        var xa = [];
        var za = [];  

        for ( var i = 0; i < path.length; i++ ){
        xa.push( path[i].x );
        za.push( path[i].y );
        }
        new TWEEN.Tween(cube.position).to({ x: xa , y:1.2, z: za}, 800).start();
    }
  });
  easystar.calculate();
}

var mp = $('.movePlayer');
mp.on('click',function(){
  
  var xa = [];
  var za = [];  
  
  for ( var i = 0; i < walkPath.length; i++ ){
    xa.push( walkPath[i].x );
    za.push( walkPath[i].y );
  }
  
  new TWEEN.Tween(cube.position).to({ x: xa , y:1.2, z: za}, 800).start();
});


var ari = [];
raycaster = new THREE.Raycaster();
mouse = new THREE.Vector2();

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

var camera = new THREE.PerspectiveCamera(75, window.innerWidth / window.innerHeight, 0.1, 1000);
camera.position.set(15, 5, 15);

var renderer = new THREE.WebGLRenderer({
  alpha: true,
  antialias: true
});
renderer.shadowMap.enabled = true;
renderer.shadowMap.type = THREE.PCFSoftShadowMap;
renderer.shadowMapSoft = true;
renderer.setSize(window.innerWidth, window.innerHeight);
document.body.appendChild(renderer.domElement);

controls = new THREE.OrbitControls(camera, renderer.domElement);
controls.enableDamping = true;

var ari = [];
var group = new THREE.Group();

var level = function() {
	
  
  
  for (var i = 0; i < world.length; i++) {
    var dir = world[i];
    for (var j = 0; j < dir.length; j++) {

      if (dir[j] == 0) {
       	var seaGeometry = new THREE.BoxGeometry(1, 0.6, 1);
        var seaMaterial = new THREE.MeshPhongMaterial({ color: Colors.waterColor });
        var sea = new THREE.Mesh(seaGeometry, seaMaterial);
        sea.tex = Colors.waterColor;
        sea.type = 'sea';
        sea.position.set(j, 0.4, i);
        
        group.add(sea);
        ari.push(sea);
      } 
      else {
      	var groundGeometry = new THREE.BoxGeometry(1, 0.6, 1);
        var groundMaterial = new THREE.MeshPhongMaterial({ color: Colors.beigeColor });
        var ground = new THREE.Mesh(groundGeometry, groundMaterial);
        ground.tex = Colors.floorColor;
        ground.type = 'sea';
        ground.position.set(j, 0.4, i);
        group.add(ground);
        ari.push(ground);
      }
      
    }
  }
}
level();
scene.add(group);

var geometry = new THREE.BoxGeometry(1, 1, 1);
var material = new THREE.MeshPhongMaterial({
  color: 0xff0000,
  wireframe: false
});
var cube = new THREE.Mesh(geometry, material);
cube.position.y = 1.2;
cube.castShadow = true;
cube.receiveShadow = true;
ari.push(cube);
scene.add(cube);

var shadowlight = new THREE.DirectionalLight(0xffffff, 1);
shadowlight.position.set(30, 20, 30);
shadowlight.castShadow = true;
shadowlight.shadow.mapSize.width = 1024;
shadowlight.shadow.mapSize.height = 1024;
scene.add(shadowlight);

var animate = function() {
	TWEEN.update();
  requestAnimationFrame(animate);
  renderer.render(scene, camera);
};


function onDocumentMouseDown( event ) {

    event.preventDefault();

    mouse.x = ( event.clientX / renderer.domElement.width ) * 2 - 1;
    mouse.y = - ( event.clientY / renderer.domElement.height ) * 2 + 1;
		
    raycaster.setFromCamera( mouse, camera );
    var intersects = raycaster.intersectObjects( ari );
    if ( intersects.length > 0 ) {
    	movePlayerPath( intersects[0].object.position.x , intersects[0].object.position.z );   
    	console.log(intersects[ 0 ].object.position);
    }

} 
    
animate();
document.addEventListener( 'mousedown', onDocumentMouseDown, false );