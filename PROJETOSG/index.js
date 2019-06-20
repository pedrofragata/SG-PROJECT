// THREEJS RELATED VARIABLES
var scene, scene2, renderer, camera, dirLightHelper, controls;
var windowWidth, windowHeight;
var mouseX = 0,
  mouseY = 0;
var path;
var geometry;
var mesh, mesh2;
var angle = 0,
  angle2 = 0;
var position = 0;
let position2 = 0;

// direction vector for movement
var direction = new THREE.Vector3(1, 0, 0);
var up = new THREE.Vector3(0, 1, 0);
var axis = new THREE.Vector3();
var acc = 0;
var direction2 = new THREE.Vector3(1, 0, 0);
var up2 = new THREE.Vector3(0, 1, 0);
var axis2 = new THREE.Vector3();
var acc2 = 0;
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
    updateCamera: function(camera, scene, mouseX) {
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
    background: new THREE.Color(0.5, 0.5, 0.7),
    eye: [0, 300, 1800],
    up: [0, 1, 0],
    fov: 30,
    updateCamera: function(camera, scene, mouseX) {
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
  up: false,
  space: false
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
    if (evt.keyCode == 32) {
      keyboardState.space = true;
    }
  }
  document.addEventListener("keydown", onKeyDown, false);

  //keyup event
  function onKeyUp(evt) {
    if (evt.keyCode == 38) {
      keyboardState.up = false;
    }
    if (evt.keyCode == 32) {
      keyboardState.space = false;
    }
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
  var line2 = line.clone();
  scene.add(line);
  scene2.add(line2);
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
  scene2 = new THREE.Scene();
  // create a camera, which defines where we're looking at
  //var aspect = window.innerWidth / window.innerHeight;
  //camera = new THREE.PerspectiveCamera(100, aspect, 0.1, 200);
  // position the camera

  // camera.position.z = 120;
  // camera.position.y = 60;

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

  // CAR 1
  var mtlLoaderCar = new THREE.MTLLoader();
  mtlLoaderCar.load("models/carSingle.mtl", function(materials) {
    materials.preload(); // load a material’s resource
    var objLoaderCar = new THREE.OBJLoader();
    objLoaderCar.setMaterials(materials);
    objLoaderCar.load("models/carSingle.obj", function(object) {
      // load a geometry resource
      car1 = object;
      car1.scale.set(1.5,1.5,1.5)
      scene.add(car1);
    });
  });
  //CAR 2
  var mtlLoaderCar2 = new THREE.MTLLoader();
  mtlLoaderCar2.load("models/car2.mtl", function(materials) {
    materials.preload(); // load a material’s resource
    var objLoaderCar2 = new THREE.OBJLoader();
    objLoaderCar2.setMaterials(materials);
    objLoaderCar2.load("models/car2.obj", function(object) {
      // load a geometry resource
      car2 = object;
      car2.scale.set(0.4,0.4,0.4)
      scene2.add(car2);
    });
  });
  //FLOOR1

  //LOADER
  // instantiate a loader
  var mtlLoader = new THREE.MTLLoader();
  mtlLoader.load("models/track.mtl", function(materials) {
    materials.preload(); // load a material’s resource
    var objLoader = new THREE.OBJLoader();
    objLoader.setMaterials(materials);
    objLoader.load("models/track.obj", function(object) {
      // load a geometry resource
      mesh3 = object;
      mesh3.position.y = -5;
      scene.add(mesh3);
    });
  });
  var mtlLoader2 = new THREE.MTLLoader();

  mtlLoader2.load("models/track.mtl", function(materials2) {
    materials2.preload(); // load a material’s resource
    var objLoader = new THREE.OBJLoader();
    objLoader.setMaterials(materials2);
    objLoader.load("models/track.obj", function(object) {
      // load a geometry resource
      mesh4 = object;
      mesh4.position.y = -5;
      scene2.add(mesh4);
    });
  });
  //FLOOR
  // let floorMaterial = new THREE.TextureLoader().load("models/grass.jpg");
  let floor = new THREE.PlaneGeometry(1000, 700);
  let grass = new THREE.TextureLoader().load("models/grass2.jpg");
  grass.wrapS = THREE.RepeatWrapping;
  grass.wrapT = THREE.RepeatWrapping;
  grass.repeat.set(4, 4);
  let floorMaterial = new THREE.MeshBasicMaterial({
    color: 0xf09c67,
    wireframe: false,
    map: grass
  });

  let f1 = new THREE.Mesh(floor, floorMaterial);
  f1.rotation.x = -Math.PI / 2;

  //FLOOR2
  let floorMaterial2 = new THREE.MeshBasicMaterial({
    color: 0xf09c67,
    wireframe: false,
    map: grass
  });
  let f2 = new THREE.Mesh(floor, floorMaterial2);
  f2.rotation.x = -Math.PI / 2;
  f1.position.y = -5;
  f2.position.y = -5;

  scene.add(f1);
  scene2.add(f2);
  // material
  var material = new THREE.MeshPhongMaterial({
    color: 0xff0000,
    shading: THREE.FlatShading
  });
  var material2 = new THREE.MeshPhongMaterial({
    color: 0xff0000,
    shading: THREE.FlatShading
  });
  // geometry
  geometry = new THREE.BoxGeometry(10, 10, 10);
  // mesh
  mesh = new THREE.Mesh(geometry, material);
  scene.add(mesh);
  mesh2 = new THREE.Mesh(geometry, material2);
  scene2.add(mesh2);
  // the path
  path = new THREE.Path();
  var arcRadius = 50;
  let A = 400;

  for (let i = 0; i < 2 * Math.PI; i += 0.01) {
    path.lineTo(A * Math.sin(i), A * Math.sin(i) * Math.cos(i));
  }

  // start a loop that will update the objects' positions
  // and render the scene on each frame
  drawPath();

  // Start angle and point
  previousAngle = getAngle(position);
  previousPoint = path.getPointAt(position);
  // Start angle and point
  previousAngle2 = getAngle(position2);
  previousPoint2 = path.getPointAt(position2);
}
let derail = false;
let derail2 = false;
let derailPos;
let derail2Pos;

var angle;
var angle2;
let dir;
let dir2;
let fps = 0,
  fps2 = 0;
let lap1 = 1,
  lap2 = 1;
function move() {
  position += acc;
  position2 += acc2;
  if (keyboardState.space) {
    acc += 0.0001;
  } else {
    acc -= 0.0001;
  }

  if (keyboardState.up) {
    acc2 += 0.0001;
  } else {
    acc2 -= 0.0001;
  }
  if (acc < 0.0001) {
    acc = 0.0001;
  }
  if (acc2 < 0.0001) {
    acc2 = 0.0001;
  }

  if (acc >= 0.02) {
    //Maxima aceleração
    acc = 0.019;
  }
  if (acc2 >= 0.02) {
    acc2 = 0.019;
  }
  //Onde ele dá volta
  if (position >= 1) {
    if (!derail) {
      lap1++;
      console.log(lap1);
    }
    position = 0.001;
  }

  if (position2 >= 1) {
    if (!derail2) {
      lap2++;
      console.log(lap2);
    }
    position2 = 0.001;
  }
  //Crashing when position
  if (acc > 0.019) {
    if (position > 0.16 && position < 0.35) {
      //1ª curva
      derail = true;

      derailPos = position;
    } else if (position > 0.7 && position < 0.85) {
      derail = true;
      derailPos = position;
    }
  }
  if (acc2 > 0.019) {
    if (position2 > 0.16 && position2 < 0.35) {
      //1ª curva
      derail2 = true;
      derail2Pos = position2;
    } else if (position2 > 0.7 && position2 < 0.85) {
      derail2 = true;
      derail2Pos = position2;
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
    } else {
      mesh.position.x += dir.x;
      mesh.position.z += dir.z;
    }

    fps++;

    if (fps == 66) {
      acc = 0.0001;
      position = 0.001;
      derail = false;
      fps = 0;
    }
  }

  if (!derail2) {
    //Second car movement
    // get the point at position
    var point2 = path.getPointAt(position2);
    //console.log(position, "POSITION");

    mesh2.position.x = point2.x;
    mesh2.position.z = point2.y;
    angle2 = getAngle(position2);
    // set the quaternion
    mesh2.quaternion.setFromAxisAngle(up2, angle2);

    previousPoint2 = point2;
    previousAngle2 = angle2;
  } else {
    //Segundo Carro

    // get the point at position
    var point2 = path.getPointAt(derail2Pos);

    previousPoint2 = point2;
    previousAngle2 = angle2;

    if (dir2 == undefined) {
      var normalMatrix2 = new THREE.Matrix4().extractRotation(
        mesh2.matrixWorld
      );
      var normal2 = mesh2.geometry.faces[10].normal;
      dir2 = normal2.clone().applyMatrix4(normalMatrix2);
    } else {
      mesh2.position.x += dir2.x;
      mesh2.position.z += dir2.z;
    }

    fps2++;

    if (fps2 == 66) {
      acc2 = 0.0001;
      position2 = 0.001;
      derail2 = false;
      fps2 = 0;
    }
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

  var view = views[0];
  var camera = view.camera;
  view.updateCamera(camera, mesh, mouseX, mouseY);
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
  var view = views[1];
  var camera = view.camera;
  view.updateCamera(camera, mesh2, mouseX, mouseY);
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
  renderer.render(scene2, camera);
}

function createLights() {
  var light = new THREE.HemisphereLight(0xaaaaaa, 0x000000, 0.9);
  var light2 = new THREE.HemisphereLight(0xaaaaaa, 0x000000, 0.9);

  scene.add(light);
  scene2.add(light2);
  var directionalLight = new THREE.DirectionalLight(0xffffff, 0.9);
  directionalLight.position.set(100, 80, 50);
  directionalLight.shadow.camera.bottom = -500;
  directionalLight.shadow.camera.top = 500;
  directionalLight.shadow.camera.left = -500;
  directionalLight.shadow.camera.right = 500;
  directionalLight.shadow.camera.far = 1000;
  directionalLight.castShadow = true;
  var directionalLight2 = new THREE.DirectionalLight(0xffffff, 0.9);
  directionalLight2.position.set(100, 80, 50);
  directionalLight2.shadow.camera.bottom = -500;
  directionalLight2.shadow.camera.top = 500;
  directionalLight2.shadow.camera.left = -500;
  directionalLight2.shadow.camera.right = 500;
  directionalLight2.shadow.camera.far = 1000;
  directionalLight2.castShadow = true;
  scene.add(directionalLight);
  scene2.add(directionalLight2);
}

function animate() {
  move();
  render();
  requestAnimationFrame(animate);
}
