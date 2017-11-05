var clock, container, camera, scene, renderer, controls, listener;

var ground, character;
var light;
var textureLoader = new THREE.TextureLoader();
var loader = new THREE.JSONLoader();
var isLoaded = false;
var action = {}, mixer;
var activeActionName = 'idle';

var arrAnimations = [
  'idle',
  'walk'
];
var actualAnimation = 0;

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
  camera.position.set(0, 1.2, 2.5);
  listener = new THREE.AudioListener();
  camera.add(listener);

  controls = new THREE.OrbitControls(camera, renderer.domElement);
  controls.target = new THREE.Vector3(0, 0.6, 0);
  // Lights
  light = new THREE.AmbientLight(0xffffff, 1);
  scene.add(light);

  textureLoader.load('textures/ground.png', function (texture) {
    var geometry = new THREE.PlaneBufferGeometry(2, 2);
    geometry.rotateX(-Math.PI / 2);
    var material = new THREE.MeshBasicMaterial({ map: texture, transparent: true });
    ground = new THREE.Mesh(geometry, material);
    scene.add(ground);

  });

  loader.load('./models/simplerig.json', function (geometry, materials) {
    materials.forEach(function (material) {
      material.skinning = true;
    });
    character = new THREE.SkinnedMesh( geometry, new THREE.MeshFaceMaterial(materials) );

    mixer = new THREE.AnimationMixer(character);

    action.idle = mixer.clipAction(geometry.animations[ 0 ]);
    action.walk = mixer.clipAction(geometry.animations[ 1 ]);


    action.idle.enabled = true;
    action.walk.enabled = true;

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

  from.crossFadeTo(to, 0.3);
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
  controls.update();
  render();

}

function render () {
  var delta = clock.getDelta();
  mixer.update(delta);
  renderer.render(scene, camera);
}
