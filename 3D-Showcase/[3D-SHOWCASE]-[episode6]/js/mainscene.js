var scene, camera, renderer;
var controls;
var SCREEN_WIDTH, SCREEN_HEIGHT;
var loader, model;
var group = new THREE.Object3D();
var mscale = 10;

var manager = new THREE.LoadingManager();


manager.onLoad = function () {
    scene.add(group);
}

var loader = new THREE.JSONLoader(manager);

function init() {
    scene = new THREE.Scene();
    camera = new THREE.PerspectiveCamera(45, window.innerWidth / window.innerHeight, .1, 500);
    renderer = new THREE.WebGLRenderer({
        antialias: true,
        alpha: true
    });
    renderer.setClearColor( 0x000000, 0 ); // the default
    renderer.setPixelRatio(window.devicePixelRatio);
    renderer.setSize(window.innerWidth, window.innerHeight);

    controls = new THREE.OrbitControls(camera, renderer.domElement);
    controls.minDistance = 10;
    controls.maxDistance = 25;
    controls.enablePan = false;
    controls.enableDamping = true;
    controls.dampingFactor = 1;
    controls.addEventListener('change', render);

    camera.position.x = 15;
    camera.position.y = 10;
    camera.position.z = 15;
    camera.lookAt(scene.position);

    h1 = new THREE.HemisphereLight(0xffffff, 0xffffff, 0.3);
    h1.position.set(-300,200, -3000);
    scene.add(h1);

    var s1 = new THREE.SpotLight(0xffffff);
    s1.position.set(300, 300, -1000);
    scene.add(s1);

    var s2 = new THREE.SpotLight(0xffffff);
    s2.position.set(-300, 300, 1000);
    scene.add(s2);

   
    loader.load(
        'json/CHAIR_tut_bckp.json',
        function ( geometry, materials ) {
            var material = new THREE.MultiMaterial( materials );
            var object = new THREE.Mesh( geometry, material );
            object.scale.set(mscale, mscale, mscale);
            object.position.set(0, 0, 0);
            group.add( object );
        }
    );
    loader.load(
        'json/back_piece.json',
        function ( geometry, materials ) {
            var material = new THREE.MultiMaterial( materials );
            var object = new THREE.Mesh( geometry, material );
            object.scale.set(mscale, mscale, mscale);
            object.position.set(0, 0, 0);
            group.add( object );
        }
    );
    loader.load(
        'json/middle_rail.json',
        function ( geometry, materials ) {
            var material = new THREE.MultiMaterial( materials );
            var object = new THREE.Mesh( geometry, material );
            object.scale.set(mscale, mscale, mscale);
            object.position.set(0, 0, 0);
            group.add( object );
        }
    );
    loader.load(
        'json/back_legs.json',
        function ( geometry, materials ) {
            var material = new THREE.MultiMaterial( materials );
            var object = new THREE.Mesh( geometry, material );
            object.scale.set(mscale, mscale, mscale);
            object.position.set(0, 0, 0);
            group.add( object );
        }
    );
    loader.load(
        'json/front_legs.json',
        function ( geometry, materials ) {
            var material = new THREE.MultiMaterial( materials );
            var object = new THREE.Mesh( geometry, material );
            object.scale.set(mscale, mscale, mscale);
            object.position.set(0, 0, 0);
            group.add( object );
        }
    );
    loader.load(
        'json/back_rail.json',
        function ( geometry, materials ) {
            var material = new THREE.MultiMaterial( materials );
            var object = new THREE.Mesh( geometry, material );
            object.scale.set(mscale, mscale, mscale);
            object.position.set(0, 0, 0);
            group.add( object );
        }
    );
    loader.load(
        'json/hinges.json',
        function ( geometry, materials ) {
            var material = new THREE.MultiMaterial( materials );
            var object = new THREE.Mesh( geometry, material );
            object.scale.set(mscale, mscale, mscale);
            object.position.set(0, 0, 0);
            group.add( object );
        }
    );
    loader.load(
        'json/caps.json',
        function ( geometry, materials ) {
            var material = new THREE.MultiMaterial( materials );
            var object = new THREE.Mesh( geometry, material );
            object.scale.set(mscale, mscale, mscale);
            object.position.set(0, 0, 0);
            group.add( object );
        }
    );

    $("#container").append(renderer.domElement);
}

function render() {
    group.rotation.y += 0.0005;
}

function animate() {
    requestAnimationFrame(animate);
    render();
    renderer.render(scene, camera);
}
init();
animate();

$(window).resize(function () {
    SCREEN_WIDTH = window.innerWidth;
    SCREEN_HEIGHT = window.innerHeight;
    camera.aspect = SCREEN_WIDTH / SCREEN_HEIGHT;
    camera.updateProjectionMatrix();
    renderer.setSize(SCREEN_WIDTH, SCREEN_HEIGHT);
});