import RedditAPI from "./RedditAPI";
import Keys from './KeyboardArrowAndActionControls';

var camera, scene, renderer;
var controls, effect;
var manager;
var dolly;
var sky, water, label;

var speed = 0.1,
  xo = 0,
  zo = 0;

function init() {

  renderer = new THREE.WebGLRenderer({ antialias: true });
  renderer.autoClear = false;
  renderer.setClearColor(0x404040);

  document.body.appendChild(renderer.domElement);

  scene = new THREE.Scene();
  scene.fog = new THREE.Fog(0xcacfde, 0, 1000);

  dolly = new THREE.Group();
  dolly.position.set(0, 1, 0);
  scene.add( dolly );

  camera = new THREE.PerspectiveCamera(60, window.innerWidth / window.innerHeight, 1, 20000);
  camera.position.z = 0.0001;
  dolly.add(camera);

  // Effect and Controls for VR
  effect = new THREE.VREffect(renderer);
  controls = new THREE.VRControls(camera);

  onWindowResize();

  // Initialize the WebVR manager.
  manager = new WebVRManager(effect);

  // skybox
  var geometry = new THREE.SphereGeometry(10000, 64, 32);
  var vertices = geometry.vertices;
  var faces = geometry.faces;

  var colorTop = new THREE.Color(0x8EC3D5);
  var colorMiddle = new THREE.Color(0x7B67A4);
  var colorBottom = new THREE.Color(0x221046);

  for ( var i = 0, l = faces.length; i < l; i ++ ) {
    var face = faces[ i ];

    var vertex1 = vertices[ face.a ];
    var vertex2 = vertices[ face.b ];
    var vertex3 = vertices[ face.c ];

    var color1 = colorMiddle.clone();
    color1.lerp( vertex1.y > 0 ? colorTop : colorBottom, Math.abs( vertex1.y ) / 6000 );

    var color2 = colorMiddle.clone();
    color2.lerp( vertex2.y > 0 ? colorTop : colorBottom, Math.abs( vertex2.y ) / 6000 );

    var color3 = colorMiddle.clone();
    color3.lerp( vertex3.y > 0 ? colorTop : colorBottom, Math.abs( vertex3.y ) / 6000 );

    face.vertexColors.push( color1, color2, color3 );

  }

  var material = new THREE.MeshBasicMaterial( {
    vertexColors: THREE.VertexColors,
    side: THREE.BackSide,
    depthWrite: false,
    depthTest: false,
    fog: false
  } );

  sky = new THREE.Mesh(geometry, material);
  scene.add(sky);

  // floor
  var geometry = new THREE.PlaneBufferGeometry(10000, 10000);
  var material = new THREE.MeshBasicMaterial({
    color: 0x26463E,
    opacity: 0.75,
    transparent: true
  });
  water = new THREE.Mesh(geometry, material);
  water.position.y = 0;
  water.rotation.x = - Math.PI / 2;
  water.renderDepth = 2;
  scene.add( water );


  var box = new THREE.BoxGeometry(10, 20, 1);
  var boxM = new THREE.MeshBasicMaterial({
    color: 0x000000,
    fog: false
  });
  var boxMesh = new THREE.Mesh(box, boxM);
  boxMesh.position.set(0, 5, 10)
  scene.add(boxMesh);

  // lights
  var directionalLight = new THREE.DirectionalLight(0xffffff, 0.15);
  directionalLight.position.set( -1, 1, -1 );
  scene.add( directionalLight );

  var hemisphereLight = new THREE.HemisphereLight( 0xffffff, 0xffffff, 0.8 );
  hemisphereLight.position.set( -1, 2, 1.5 );
  scene.add( hemisphereLight );

  RedditAPI.load("gamedev")
    .then(urls => {
      console.log(urls);
    });

  label = createCanvasPlane(256, 256, function (ctx, w, h) {

    ctx.font = "22pt Helvetica";

    ctx.fillStyle = "rgba(255, 255, 255, 0.8)";
    ctx.textAlign = "center";
    ctx.fillText("lol! yeah!", w / 2, h / 2 + 11);

  });
  label.position.set(0, 2, 9);
  label.rotation.y = Math.PI;
  scene.add(label);

  THREE.ImageUtils.crossOrigin = ""; //Anonymous";
  var //texture = THREE.ImageUtils.loadTexture('crate.gif'),
    texture = THREE.ImageUtils.loadTexture('http://i.imgur.com/dAvWkN8.jpg'),
    material = new THREE.MeshBasicMaterial({map: texture, side: THREE.DoubleSide}),
     geometry = new THREE.PlaneGeometry(4, 4),
    mesh = new THREE.Mesh(geometry, material);

  mesh.position.set(0, 7, 9);
  scene.add(mesh);

  requestAnimationFrame( animate );
  window.addEventListener( 'resize', onWindowResize, false );

}


var keys = new Keys();

function onWindowResize() {
  camera.aspect = window.innerWidth / window.innerHeight;
  camera.updateProjectionMatrix();

  effect.setSize( window.innerWidth, window.innerHeight );
};

var createCanvasPlane = function (w, h, drawFunc) {

  var canvas = document.createElement("canvas"),
    ctx = canvas.getContext("2d"),
    scale = 0.01,
    texture,
    material,
    geometry,
    planeMesh;

  canvas.width = w;
  canvas.height = h;

  drawFunc(ctx, w, h);

  texture = new THREE.Texture(canvas);
  texture.needsUpdate = true;

  material = new THREE.MeshBasicMaterial({
    map: texture,
    side: THREE.DoubleSide,
    transparent: true
  });

  geometry = new THREE.PlaneBufferGeometry(canvas.width, canvas.height, 1, 1);
  planeMesh = new THREE.Mesh(geometry, material);

  planeMesh.scale.set(scale, scale, scale);

  return planeMesh;

};


function animate(time) {

  requestAnimationFrame(animate);

  if (controls) {
    controls.update();
  }

  //dolly.position.x -= keys.x() * speed;
  //dolly.position.z -= keys.y() * speed;
  dolly.translateZ(-keys.y() * speed);
  //dolly.translateX(-keys.y() * speed);

  dolly.rotation.y -= keys.x() * (speed * 0.2);

  if (manager.isVRMode()) {
    effect.render(scene, camera);
  } else {
    renderer.render(scene, camera);
  }

}

init();

export default {};
