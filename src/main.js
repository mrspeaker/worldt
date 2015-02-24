import KeyboardControls from "./KeyboardControls";
import KeyboardFieldInput from "./KeyboardFieldInput";
import World from "./world/World";

const keys = new KeyboardControls();

const field = new KeyboardFieldInput( (prog, done) => {

  if (done && prog) {

    console.log( "Loading sub:", done );
    const { x, z } = dolly.position;

    World.loadSub( prog, x, z );
    //World.findRelatedSubs( prog , x, z );

  }

});

const speed = 0.2;

const renderer = new THREE.WebGLRenderer({ antialias: true });
renderer.autoClear = false;
renderer.setClearColor( 0x222222 );
document.body.appendChild( renderer.domElement );

const scene = new THREE.Scene();
scene.fog = new THREE.Fog( 0x000000, 0, 100 );

const dolly = new THREE.Group();
dolly.position.set( 0, 0, -Math.PI );
//dolly.lookAt(new THREE.Vector3(0, 0, 0))
scene.add(dolly);

const camera = new THREE.PerspectiveCamera( 60, window.innerWidth / window.innerHeight, 1, 20000 );
camera.position.set(0, 1, 0);
dolly.add( camera );

// Effect and Controls for VR, Initialize the WebVR manager
const effect = new THREE.VREffect( renderer );
const controls = new THREE.VRControls( camera );
const manager = new WebVRManager( effect );
//controls.zeroSensor();

// lights
{
  const amb = new THREE.AmbientLight(0x111111);
  scene.add(amb);

  const directionalLight = new THREE.DirectionalLight( 0xffffff, 0.85 );
  directionalLight.position.set( -1, 1, -1 );
  scene.add( directionalLight );

  const pointy = new THREE.PointLight( 0x0044ee, 0, 30 );
  pointy.position.set( 0, -2, 0 );
  dolly.add( pointy );

}

scene.add( World.mesh );

requestAnimationFrame( animate );
window.addEventListener( "resize", onWindowResize, false );
onWindowResize();


function onWindowResize () {

  camera.aspect = window.innerWidth / window.innerHeight;
  camera.updateProjectionMatrix();
  effect.setSize( window.innerWidth, window.innerHeight );

};


//dolly.rotation.y += Math.PI;
//let rot = 0;
function animate ( time ) {

  requestAnimationFrame( animate );

  controls.update();

  dolly.rotation.y -= keys.rot() * ( speed * 0.12 );
  dolly.translateX( keys.x() * speed );
  dolly.translateZ( keys.y() * speed );

  var direction = new THREE.Vector3( 0, 0, -1 ).transformDirection( camera.matrixWorld );
  var raycaster = new THREE.Raycaster( dolly.position, direction, 0, 10 );

  var intersects = raycaster.intersectObjects( World.mesh.children, true );
  if (intersects.length) {

    const sign = intersects[0].object.parent;
    if ( sign && sign._data ) {

      sign.scale.x = 1 + ((Math.sin(Date.now() / 1000) + 1) * 0.03);
      if ( keys.enter() ) {

        const title = sign._data.title;
        if (title && title.match(/\/r\/[a-zA-Z]+$/g)) {

          const sub = title.slice(3);
          const { x, z } = dolly.position;

          World.loadSub( sub, x, z );
          //World.findRelatedSubs( sub , x, z );
          keys.enter(true);

        }
        sign.parent.remove(sign);

        //World.mesh.remove(intersects[0].object);
        //intersects[0].object.parent.remove(intersects[0].object);

      }

      if ( keys.action() ) {

        sign.parent.remove(sign);
        keys.action(true);

      }

    }

  }

  if ( manager.isVRMode() ) {

    effect.render( scene, camera );

  } else {

    renderer.render( scene, camera );

  }

}

export default {};
