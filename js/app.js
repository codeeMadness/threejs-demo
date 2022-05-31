import * as THREE from 'https://cdn.skypack.dev/pin/three@v0.137.0-X5O2PK3x44y1WRry67Kr/mode=imports/optimized/three.js';
import { GLTFLoader } from 'https://cdn.skypack.dev/three@0.136.0/examples/jsm/loaders/GLTFLoader.js';
import { OrbitControls } from 'https://cdn.skypack.dev/three@0.136.0/examples/jsm/controls/OrbitControls.js';

const container = document.getElementById( 'container' );

// ===== renderer =====
const renderer = new THREE.WebGLRenderer( { antialias: true } );
renderer.setPixelRatio( window.devicePixelRatio );
renderer.setSize( window.innerWidth, window.innerHeight );
renderer.outputEncoding = THREE.sRGBEncoding;
container.appendChild( renderer.domElement );

// ===== scene =====
const scene = new THREE.Scene();
scene.background = new THREE.Color( 0xbfe3dd );
scene.fog = new THREE.Fog(0x69e6f4, 1600, 2000);

// ===== camera =====
const camera = new THREE.PerspectiveCamera( 40, window.innerWidth / window.innerHeight, 1, 100 );
camera.position.set( 5, 2, 8 );

// ===== lights =====
const light = new THREE.HemisphereLight(0xffeeff, 0x777788, 1);
light.position.set(0.5, 1, 0.75);
scene.add(light);

// ===== controls =====
const controls = new OrbitControls( camera, renderer.domElement );
controls.target.set( 0, 0.5, 0 );
controls.update();
controls.enablePan = false;
controls.enableDamping = true;

// ===== load map =====
const loader = new GLTFLoader();
loader.load( 'assets/dry-sand.glb', function ( gltf ) {

    const model = gltf.scene;
    model.scale.set( 0.1, 0.1, 0.1 );
    scene.add( model );
    animate();

}, undefined, function ( e ) {

    console.error( e );

} );

// ===== load character =====
loader.load( 'assets/vanguard.glb', function ( gltf ) {

    const model = gltf.scene;
    model.scale.set( 0.01, 0.01, 0.01 );
    model.position.set( 0, 1.25, 0);
    scene.add( model );
    animate();

}, undefined, function ( e ) {

    console.error( e );

} );

const axesHelper = new THREE.AxesHelper( 5 );
scene.add( axesHelper );

window.onresize = function () {

    camera.aspect = window.innerWidth / window.innerHeight;
    camera.updateProjectionMatrix();

    renderer.setSize( window.innerWidth, window.innerHeight );

};


function animate() {

    requestAnimationFrame( animate );

    controls.update();

    renderer.render( scene, camera );

}


