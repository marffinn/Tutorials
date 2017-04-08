var scene, camera, renderer;
var controls;
var SCREEN_WIDTH, SCREEN_HEIGHT;
var loader, model;
var group = new THREE.Object3D();
var mscale = 10;

var manager = new THREE.LoadingManager();

var textureCube = new THREE.CubeTextureLoader().load(['json/envmap/posx.jpg', 'json/envmap/negx.jpg', 'json/envmap/posy.jpg', 'json/envmap/negy.jpg', 'json/envmap/posz.jpg', 'json/envmap/negz.jpg']);
textureCube.generateMipmaps = false;

//////////////////////////////////////////////////////// MATERIALS Library

var backTextures = {
    'back1': 'json/back1.png',
    'back2': 'json/backTextures/back2.png'
}
currentBackMaterial = backTextures['back2'];

var sitTextures = {
    'bottom1': 'json/bottom1.png',
    'bottom2': 'json/sitTextures/bottom2.png'
}
currentSitMaterial = sitTextures['bottom1'];

////////////////////////////////////////////////////////

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
    renderer.setClearColor( 0x000000, 0 );
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
	
	protoBack = new THREE.TextureLoader().load( currentBackMaterial, function () {
        mat = new THREE.MeshPhongMaterial({
            map: protoBack,
            shininess: 0,
            reflectivity: 0,
            bumpScale: .0001,
            combine: THREE.MultiplyOperation
        });
        loader.load('json/back_piece.json', function (geo) {
            back = new THREE.Mesh(geo, mat);
            back.material.needsUpdate = true;
            back.position.set(0, 0, 0);
            back.scale.set(mscale, mscale, mscale);
            group.add(back);
        });
    });
    
    protoSit = new THREE.TextureLoader().load( currentSitMaterial, function () {
        mat = new THREE.MeshPhongMaterial({
            map: protoSit,
            shininess: 0,
            reflectivity: 0,
            bumpScale: .0001,
            combine: THREE.MultiplyOperation
        });
        loader.load('json/sit_piece.json', function (geo) {
            sit = new THREE.Mesh(geo, mat);
            sit.material.needsUpdate = true;
            sit.position.set(0, 0, 0);
            sit.scale.set(mscale, mscale, mscale);
            group.add(sit);
        });
    });

   
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
    // group.rotation.y += 0.0005;
}

function animate() {
    requestAnimationFrame(animate);
    render();
    renderer.render(scene, camera);
}
init();
animate();

/////////////////////////////////////////////////////////////////////////////




$('.sitt').on('click', function () {

    textureTarget = $(this).attr("alt");
    group.remove(protoSit);

    protoSit = new THREE.TextureLoader().load( sitTextures[textureTarget], function () {
        mat = new THREE.MeshPhongMaterial({
            map: protoSit,
            shininess: 0,
            specular: new THREE.Color(0xff0000),
            reflectivity: 0,
            bumpScale: .0001,
            combine: THREE.MultiplyOperation
        });
        loader.load('json/sit_piece.json', function (geo) {

            sit = new THREE.Mesh(geo, mat);
            sit.material.needsUpdate = true;
            sit.position.set(0, 0, 0);
            sit.scale.set(mscale, mscale, mscale);
            group.add(sit);
        });
    });
	currentSitMaterial = textureTarget;
});

$('.backk').on('click', function () {

    textureTarget = $(this).attr("alt");
    group.remove(protoBack);
	
    protoBack = new THREE.TextureLoader().load( backTextures[textureTarget], function () {
        mat = new THREE.MeshPhongMaterial({
            map: protoBack,
            shininess: 0,
            reflectivity: 0,
            bumpScale: .0001,
            combine: THREE.MultiplyOperation
        });
        loader.load('json/back_piece.json', function (geo) {

            back = new THREE.Mesh(geo, mat);
            back.material.needsUpdate = true;
            back.position.set(0, 0, 0);
            back.scale.set(mscale, mscale, mscale);
            group.add(back);
        });
    });
    currentBackMaterial = textureTarget;
});




/////////////////////////////////////////////////////////////////////////////


$(window).resize(function () {
    SCREEN_WIDTH = window.innerWidth;
    SCREEN_HEIGHT = window.innerHeight;
    camera.aspect = SCREEN_WIDTH / SCREEN_HEIGHT;
    camera.updateProjectionMatrix();
    renderer.setSize(SCREEN_WIDTH, SCREEN_HEIGHT);
});