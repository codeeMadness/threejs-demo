import * as THREE from 'https://cdn.skypack.dev/pin/three@v0.137.0-X5O2PK3x44y1WRry67Kr/mode=imports/optimized/three.js';
import { GLTFLoader } from 'https://cdn.skypack.dev/three@0.136.0/examples/jsm/loaders/GLTFLoader.js';
import { OrbitControls } from 'https://cdn.skypack.dev/three@0.136.0/examples/jsm/controls/OrbitControls.js';

const container = document.getElementById( 'container' );
const joystick = document.getElementById( 'joystick' );
let map, mapBox;
let character, characterBox;

let fwdValue = 0;
let bkdValue = 0;
let rgtValue = 0;
let lftValue = 0;
let tempVector = new THREE.Vector3();
let upVector = new THREE.Vector3(0, 1, 0);
let joyManager;

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

    map = gltf.scene;
    map.scale.set( 0.1, 0.1, 0.1 );
    map.position.set(0,0,0);
    
    scene.add( map );
    animate();

}, undefined, function ( e ) {

    console.error( e );

} );

// ===== load character =====
loader.load( 'assets/Soldier.glb', function ( gltf ) {

    character = gltf.scene;
    character.traverse(function(object) {
      if(object.isMesh) object.cashShadow = true;
    })
    scene.add( character );
    animate();

}, undefined, function ( e ) {

    console.error( e );

} );

// ===== joysticks =====
addJoyStick();

// ===== helper =====
const axesHelper = new THREE.AxesHelper( 5 );
scene.add( axesHelper );

window.onresize = function () {

    camera.aspect = window.innerWidth / window.innerHeight;
    camera.updateProjectionMatrix();

    renderer.setSize( window.innerWidth, window.innerHeight );

};


function animate() {

    updatePlayer();

    requestAnimationFrame( animate );

    controls.update();

    renderer.render( scene, camera );

}

function addJoyStick() {
    const options = {
        zone: joystick,
        size: 120,
        multitouch: true,
        maxNumberOfNipples: 2,
        mode: 'static',
        restJoystick: true,
        shape: 'circle',
        // position: { top: 20, left: 20 },
        position: { top: '60px', left: '60px' },
        dynamicPage: true,
      }
   
   
    joyManager = nipplejs.create(options);
  
    joyManager['0'].on('move', function (evt, data) {
        const forward = data.vector.y
        const turn = data.vector.x

        if (forward > 0) {
          fwdValue = Math.abs(forward)
          bkdValue = 0
        } else if (forward < 0) {
          fwdValue = 0
          bkdValue = Math.abs(forward)
        }

        if (turn > 0) {
          lftValue = 0
          rgtValue = Math.abs(turn)
        } else if (turn < 0) {
          lftValue = Math.abs(turn)
          rgtValue = 0
        }
      })

    joyManager['0'].on('end', function (evt) {
        bkdValue = 0
        fwdValue = 0
        lftValue = 0
        rgtValue = 0
    })
}

function updatePlayer() {
    // move the player
    const angle = controls.getAzimuthalAngle();
  
    if (fwdValue > 0) {
      tempVector.set(0, 0, -fwdValue).applyAxisAngle(upVector, angle);
      character.position.addScaledVector(tempVector, 1);
    }
  
    if (bkdValue > 0) {
      tempVector.set(0, 0, bkdValue).applyAxisAngle(upVector, angle);
      character.position.addScaledVector(tempVector, 1);
    }
  
    if (lftValue > 0) {
      tempVector.set(-lftValue, 0, 0).applyAxisAngle(upVector, angle);
      character.position.addScaledVector(tempVector, 1);
    }
  
    if (rgtValue > 0) {
      tempVector.set(rgtValue, 0, 0).applyAxisAngle(upVector, angle);
      character.position.addScaledVector(tempVector, 1);
    }
  
    character.updateMatrixWorld();
  
    //controls.target.set( mesh.position.x, mesh.position.y, mesh.position.z );
    // reposition camera
    camera.position.sub(controls.target);
    controls.target.copy(character.position);
    camera.position.add(character.position);
  }


