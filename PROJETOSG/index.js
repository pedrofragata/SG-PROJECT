// THREEJS RELATED VARIABLES
var scene, renderer, camera, dirLightHelper, controls;
var windowWidth, windowHeight;
var mouseX = 0,
  mouseY = 0;
var path;
var geometry;
var mesh;
var angle = 0;
var position = 0;
// direction vector for movement
var direction = new THREE.Vector3(1, 0, 0);
var up = new THREE.Vector3(0, 1, 0);
var axis = new THREE.Vector3();
var acc = 0
var views = [
  {
    left: 0,
    bottom: 0,
    width: 0.5,
    height: 1.0,
    background: new THREE.Color(0.5, 0.5, 0.7),
    eye: [0, 300, 1800],
    up: [0, 1, 0],
    fov: 30,
    updateCamera: function (camera, scene, mouseX) {
      camera.position.x += mouseX * 0.05;
      camera.position.x = Math.max(Math.min(camera.position.x, 2000), -2000);
      camera.lookAt(scene.position);
    }
  },
  {
    left: 0.5,
    bottom: 0,
    width: 0.5,
    height: 1.0,
    background: new THREE.Color(0.5, 0.5, 1),
    eye: [0, 300, 1800],
    up: [0, 1, 0],
    fov: 30,
    updateCamera: function (camera, scene, mouseX) {
      camera.position.x += mouseX * 0.05;
      camera.position.x = Math.max(Math.min(camera.position.x, 2000), -2000);
      camera.lookAt(scene.position);
    }
  }
];

// 3D Models
let loop = true;
let cube, teta;
let points = [];

let i = 0;
let n;
let vel = 1;

let keyboardState = {
  up: false
};

window.onload = function init() {
  // set up the scene, the camera and the renderer
  createScene();

  // add the lights
  createLights();
  // add the objects
  //createCar();
  //createPath();

  //KEY EVENTS

  //keydown event
  function onKeyDown(evt) {
    if (evt.keyCode == 38) {
      keyboardState.up = true;
    }
  }
  document.addEventListener("keydown", onKeyDown, false);

  //keyup event
  function onKeyUp(evt) {
    keyboardState.up = false;
  }
  document.addEventListener("keyup", onKeyUp, false);

  animate();
};

function drawPath() {
  var vertices = path.getSpacedPoints(20);

  // Change 2D points to 3D points
  for (var i = 0; i < vertices.length; i++) {
    point = vertices[i];
    vertices[i] = new THREE.Vector3(point.x, 0, point.y);
  }
  var lineGeometry = new THREE.Geometry();
  lineGeometry.vertices = vertices;
  var lineMaterial = new THREE.LineBasicMaterial({
    color: 0xffffff
  });
  var line = new THREE.Line(lineGeometry, lineMaterial);
  scene.add(line);
}

//INIT THREE JS, SCREEN, SCENE, CAMERA AND MOUSE EVENTS
function createScene() {
  for (var ii = 0; ii < views.length; ++ii) {
    var view = views[ii];
    var camera = new THREE.PerspectiveCamera(
      10,
      window.innerWidth / window.innerHeight,
      0.1,
      10000
    );
    camera.position.fromArray(view.eye);
    camera.up.fromArray(view.up);
    view.camera = camera;
  }
  // create an empty scene, that will hold all our elements such as objects, cameras and lights
  scene = new THREE.Scene();

  // create a camera, which defines where we're looking at
  //var aspect = window.innerWidth / window.innerHeight;
  //camera = new THREE.PerspectiveCamera(100, aspect, 0.1, 200);
  // position the camera

  // camera.position.z = 120;
  // camera.position.y = 60;

  // CONTROLS

  controls = new THREE.OrbitControls(camera);
  controls.addEventListener("change", function () {
    renderer.render(scene, camera);
  });

  // create a render and set the size
  renderer = new THREE.WebGLRenderer();
  renderer.setSize(window.innerWidth, window.innerHeight);

  // configure renderer clear color
  renderer.setClearColor("#e4e0ba");
  // enable shadows
  //renderer.shadowMap.enabled = true;
  // add the output of the renderer to the DIV with id "world"
  document.body.appendChild(renderer.domElement);

  // listen to the screen: if the user resizes it we have to update the camera and the renderer size
  window.addEventListener("resize", updateSize, false);

  //LOADER
  var loader = new THREE.OBJLoader();

  loader.load(
    // resource URL
    "models/track.obj",

    // onLoad callback
    // Here the loaded data is assumed to be an object
    function (obj) {
      // Add the loaded object to the scene
      scene.add(obj);
    },
  )

    //FLOOR

    let floor = new THREE.PlaneGeometry(170, 170);
  let floorMaterial = new THREE.MeshBasicMaterial({
    color: 0xf09c67,
    wireframe: false
  });
  let f1 = new THREE.Mesh(floor, floorMaterial);
  f1.rotation.x = -Math.PI / 2;
  scene.add(f1);
  // material
  var material = new THREE.MeshPhongMaterial({
    color: 0xff0000,
    shading: THREE.FlatShading
  });

  // geometry
  geometry = new THREE.BoxGeometry(10, 10, 10);
  // mesh
  mesh = new THREE.Mesh(geometry, material);
  scene.add(mesh);

  // the path
  path = new THREE.Path();
  var arcRadius = 50;
  let A = 80;

  for (let i = 0; i < 2 * Math.PI; i += 0.01) {
    path.lineTo(A * Math.sin(i), A * Math.sin(i) * Math.cos(i));
  }

  // start a loop that will update the objects' positions
  // and render the scene on each frame
  drawPath();

  // Start angle and point
  previousAngle = getAngle(position);
  previousPoint = path.getPointAt(position);
}
let derail = false
let derailPos;
var angle;
let dir;
function move() {
  position += acc;

  if (keyboardState.up) {
    acc += 0.0001;
  } else {
    acc -= 0.0001;
  }
  if (acc < 0.0001) {
    acc = 0.0001;

  }

  if (acc >= 0.02) {//Maxima aceleração
    acc = 0.019;
  }

  if (position >= 1) {
    position = 0.001;
  }
  //Crashing when position is between 0.09 and 0.39 or 0.59 and 0.89
  if (acc > 0.019) {
    if (position > 0.152400000000001 && position < 0.3347999999999924) { //1ª curva
      derail = true
      derailPos = position
    } else if (position > 0.6388999999999956 && position < 0.8412999999999415) {
      derail = true
      derailPos = position
    }
  }
  if (!derail) {
    // get the point at position
    var point = path.getPointAt(position);
    //console.log(position, "POSITION");

    mesh.position.x = point.x;
    mesh.position.z = point.y;
    angle = getAngle(position);
    // set the quaternion
    mesh.quaternion.setFromAxisAngle(up, angle);

    previousPoint = point;
    previousAngle = angle;
  } else {
    // get the point at position
    var point = path.getPointAt(derailPos);


    // mesh.position.x = point.x;
    // mesh.position.z = point.y;
    //var angle = getAngle(derailPos);
    // // set the quaternion
    // mesh.quaternion.setFromAxisAngle(up, angle);



    previousPoint = point;
    previousAngle = angle;

    // console.log("DESCARRILOU", point, angle, Math.cos(angle), Math.sin(angle));

    // mesh.position.x += 2 * Math.cos(angle);
    // mesh.position.z += 2 * Math.sin(angle);

    if (dir == undefined) {
      var normalMatrix = new THREE.Matrix4().extractRotation(mesh.matrixWorld);
      var normal = mesh.geometry.faces[10].normal;
      dir = normal.clone().applyMatrix4(normalMatrix);
    }
    else {
      mesh.position.x += dir.x;
      mesh.position.z += dir.z;
    }


    console.log("DESCARRILOU", dir);

  }
}

function getAngle(position) {
  // get the 2Dtangent to the curve
  var tangent = path.getTangent(position).normalize();

  // change tangent to 3D
  angle = -Math.atan(tangent.x / tangent.y);

  return -angle;
}
/* function handleWindowResize() {
  // update height and width of the renderer and the camera
  var HEIGHT = window.innerHeight;
  var WIDTH = window.innerWidth;
  //renderer.setSize(WIDTH, HEIGHT);
  //camera.aspect = WIDTH / HEIGHT;
  //camera.updateProjectionMatrix();
} */
function onDocumentMouseMove(event) {
  mouseX = event.clientX - windowWidth / 2;
  mouseY = event.clientY - windowHeight / 2;
}
function updateSize() {
  if (windowWidth != window.innerWidth || windowHeight != window.innerHeight) {
    windowWidth = window.innerWidth;
    windowHeight = window.innerHeight;
    renderer.setSize(windowWidth, windowHeight);
  }
}

function render() {
  updateSize();
  for (var ii = 0; ii < views.length; ++ii) {
    var view = views[ii];
    var camera = view.camera;
    view.updateCamera(camera, scene, mouseX, mouseY);
    var left = Math.floor(windowWidth * view.left);
    var bottom = Math.floor(windowHeight * view.bottom);
    var width = Math.floor(windowWidth * view.width);
    var height = Math.floor(windowHeight * view.height);
    renderer.setViewport(left, bottom, width, height);
    renderer.setScissor(left, bottom, width, height);
    renderer.setScissorTest(true);
    renderer.setClearColor(view.background);
    camera.aspect = width / height;
    camera.updateProjectionMatrix();
    renderer.render(scene, camera); //Renderizar duas scenes diferentes
  }
}

function createLights() {
  var light = new THREE.HemisphereLight(0xaaaaaa, 0x000000, 0.9);
  scene.add(light);

  var directionalLight = new THREE.DirectionalLight(0xffffff, 0.9);
  directionalLight.position.set(100, 80, 50);
  directionalLight.shadow.camera.bottom = -500;
  directionalLight.shadow.camera.top = 500;
  directionalLight.shadow.camera.left = -500;
  directionalLight.shadow.camera.right = 500;
  directionalLight.shadow.camera.far = 1000;
  directionalLight.castShadow = true;
  scene.add(directionalLight);
}

function animate() {
  /*  if (i == 628) {
    i = 0;
  }
  // render

  cube.position.x = points[i].x;
  cube.position.z = points[i].z;

  //loop reason
  i = (i + 1) % (n + 1);

  if (keyboardState.up) {
    vel += 1;
    i = (i + vel) % (n - vel);
    if (vel > 6) {
      vel = 6;
    }
    console.log(vel);
  } else {
    vel -= 1;
    i = (i + vel) % (n + vel);
    if (vel < 1) {
      vel = 1;
    }
  } */
  move();
  render();
  requestAnimationFrame(animate);
}
