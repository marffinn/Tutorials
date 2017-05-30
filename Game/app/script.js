var scene, controls, camera, renderer;
var SCREEN_WIDTH, SCREEN_HEIGHT;

var loader, thing, cube;

init();
animate();

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
    
    renderer.shadowMap.enabled = true;
    renderer.shadowMap.type = THREE.PCFSoftShadowMap;
    
    controls = new THREE.OrbitControls( camera, renderer.domElement );
    controls.addEventListener( 'change', render ); 
    controls.enableZoom = true;
    
    camera.position.z = 30;
    camera.position.y = 10;
    camera.lookAt(scene.position);

    h1 = new THREE.HemisphereLight(0xffffff, 0xffffff, 0.3);
    h1.position.set(0, 500, 0);
    scene.add(h1);
    
	
    var light = new THREE.DirectionalLight( 0xffffff );
    
    light.position.set(10,10,30);
    
    light.castShadow = true;

    light.shadow.mapSize.width = 512;
    light.shadow.mapSize.height = 512;
    light.shadow.camera.near = 0.5;
    light.shadow.camera.far = 500;
    scene.add( light );
    

    var s1 = new THREE.DirectionalLight(0xffffff);
    s1.position.set(300, 300, 1000); // x y z
    scene.add(s1);
    
    var geometry = new THREE.BoxGeometry( 10, 1, 10 );
    
    var material = new THREE.MeshPhongMaterial( {
        
        color: 0xffffff,
        wireframe: false,
        shading: THREE.SmoothShading
        
    } );
    
    cube = new THREE.Mesh( geometry, material );
    cube.position.set(0,-0.5,0);
    cube.receiveShadow = true;
    scene.add( cube );
    

	thing = new Player();
	
    
    $("#container").append(renderer.domElement);
}


function animate() {
 
	cube.rotation.y += 0.005;
 
    requestAnimationFrame(animate);    
    controls.update();
    render();
    
}

function render() {
	
    renderer.render(scene, camera);
	
}



$(window).resize(function () {
    SCREEN_WIDTH = window.innerWidth;
    SCREEN_HEIGHT = window.innerHeight;
    camera.aspect = SCREEN_WIDTH / SCREEN_HEIGHT;
    camera.updateProjectionMatrix();
    renderer.setSize(SCREEN_WIDTH, SCREEN_HEIGHT);
});