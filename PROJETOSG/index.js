// THREEJS RELATED VARIABLES
let playTexture = new THREE.TextureLoader().load("images/PLAY.png");
let startTexture = new THREE.TextureLoader().load("images/StartMenu2.png");
let helpTexture = new THREE.TextureLoader().load("images/help.png");
let controlsTexture = new THREE.TextureLoader().load("images/CONTROLS.png");
let showHelp = false;
var finalTexture = new THREE.TextureLoader().load("images/YouWin.jpg");
var finalTexture2 = new THREE.TextureLoader().load("images/YouLose.png");
var scene, scene2, startScene, renderer, camera, dirLightHelper, controls;
var windowWidth, windowHeight;
let playMusic = true;
let isPlaying = true;
let sound;
var mouseX = 0,
  mouseY = 0;
var mouse;
var path;
var geometry;
var mesh, mesh2;
var angle = 0,
  angle2 = 0;
var position = 0;
let position2 = 0;
var h1 = 0,
  m1 = 0,
  s1 = 0,
  h2 = 0,
  m2 = 0,
  s2 = 0;
var timer1 = document.createElement("canvas");
var timer2 = document.createElement("canvas");
var winner = null;
var play = false;
var timer1Texture, timer2Texture;

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


  //KEY EVENTS

  //keydown event
  function onKeyDown(evt) {
    if (evt.keyCode == 38) {
      keyboardState.up = true;
    }
    if (evt.keyCode == 32) {
      keyboardState.space = true;
    }
    if (evt.keyCode == 77) {
      if (isPlaying) {
        sound.pause();
        isPlaying = false;
      } else {
        sound.play();
        isPlaying = true;
      }
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
    if (winner != null) {
      if (evt.keyCode == 82) {
        location.reload();
      }
    }
  }
  document.addEventListener("keyup", onKeyUp, false);

  drawTimers();
  var timer1Geometry = new THREE.BoxGeometry(100, 30, 1);
  timer1Texture = new THREE.Texture(timer1);
  var timer1Material = new THREE.MeshBasicMaterial({
    map: timer1Texture
  });
  var timer1Mesh = new THREE.Mesh(timer1Geometry, timer1Material);
  timer1Mesh.position.set(0, 100, 100);
  scene.add(timer1Mesh);
  var timer2Geometry = new THREE.BoxGeometry(100, 30, 1);
  timer2Texture = new THREE.Texture(timer2);
  var timer2Material = new THREE.MeshBasicMaterial({
    map: timer2Texture
  });
  var timer2Mesh = new THREE.Mesh(timer2Geometry, timer2Material);
  timer2Mesh.position.set(0, 100, 100);
  scene2.add(timer2Mesh);

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
    color: 0xffffff,
    visible: false
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

  // BACKGROUND MUSIC

  var audioArray = [
    "sounds/bgmusic.ogg",
    "sounds/bgmusic2.ogg",
    "sounds/bgmusic3.ogg"
  ];
  var choice = Math.floor(Math.random() * audioArray.length);

  console.log(choice, "CHOICE");

  var listener = new THREE.AudioListener();
  camera.add(listener);

  // create a global audio source
  sound = new THREE.Audio(listener);

  // load a sound and set it as the Audio object's buffer
  var audioLoader = new THREE.AudioLoader();
  audioLoader.load(audioArray[choice], function(buffer) {
    sound.setBuffer(buffer);
    sound.setLoop(true);
    sound.setVolume(0.5);
  });

  //SKYBOX 1

  var skybox = new THREE.CubeGeometry(1200, 1000, 3600);
  var cubeMaterials = [
    new THREE.MeshBasicMaterial({
      map: new THREE.TextureLoader().load("images/red_rt.png"),
      side: THREE.DoubleSide
    }),
    new THREE.MeshBasicMaterial({
      map: new THREE.TextureLoader().load("images/red_lf.png"),
      side: THREE.DoubleSide
    }),
    new THREE.MeshBasicMaterial({
      map: new THREE.TextureLoader().load("images/red_up.png"),
      side: THREE.DoubleSide
    }),
    new THREE.MeshBasicMaterial({
      map: new THREE.TextureLoader().load("images/red_bk.png"),
      side: THREE.DoubleSide
    }),
    new THREE.MeshBasicMaterial({
      map: new THREE.TextureLoader().load("images/hills_dn.png"),
      side: THREE.DoubleSide
    }),
    new THREE.MeshBasicMaterial({
      map: new THREE.TextureLoader().load("images/red_ft.png"),
      side: THREE.DoubleSide
    })
  ];
  var cubeMaterial = new THREE.MeshFaceMaterial(cubeMaterials);
  var sky = new THREE.Mesh(skybox, cubeMaterial);
  sky.position.y = 80;
  console.log(sky.position, "lalal");
  scene.add(sky);

  //SKYBOX 2
  var skybox2 = new THREE.CubeGeometry(1200, 1000, 3600);
  var cubeMaterials2 = [
    new THREE.MeshBasicMaterial({
      map: new THREE.TextureLoader().load("images/nightsky_rt.png"),
      side: THREE.DoubleSide
    }),
    new THREE.MeshBasicMaterial({
      map: new THREE.TextureLoader().load("images/nightsky_lf.png"),
      side: THREE.DoubleSide
    }),
    new THREE.MeshBasicMaterial({
      map: new THREE.TextureLoader().load("images/nightsky_up.png"),
      side: THREE.DoubleSide
    }),
    new THREE.MeshBasicMaterial({
      map: new THREE.TextureLoader().load("images/nightsky_bk.png"),
      side: THREE.DoubleSide
    }),
    new THREE.MeshBasicMaterial({
      map: new THREE.TextureLoader().load("images/nightsky_dn.png"),
      side: THREE.DoubleSide
    }),
    new THREE.MeshBasicMaterial({
      map: new THREE.TextureLoader().load("images/nightsky_ft.png"),
      side: THREE.DoubleSide
    })
  ];
  var cubeMaterial2 = new THREE.MeshFaceMaterial(cubeMaterials2);
  var sky2 = new THREE.Mesh(skybox2, cubeMaterial2);
  sky2.position.z = 100;
  sky2.position.y = -20;
  scene2.add(sky2);

  // CAR 1
  var mtlLoaderCar = new THREE.MTLLoader();
  mtlLoaderCar.load("models/carSingle.mtl", function(materials) {
    materials.preload(); // load a material’s resource
    var objLoaderCar = new THREE.OBJLoader();
    objLoaderCar.setMaterials(materials);
    objLoaderCar.load("models/carSingle.obj", function(object) {
      // load a geometry resource
      car1 = object;
      car1.scale.set(1.5, 1.5, 1.5);
      car1.rotateY(-Math.PI / 2);
      mesh.add(car1);
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
      car2.scale.set(0.4, 0.4, 0.4);
      car2.rotateY(-Math.PI / 2);
      mesh2.add(car2);
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
  
  let floor = new THREE.PlaneGeometry(1000, 1150);
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
  f1.position.z = 150;

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
  f2.position.z = 150;

  scene.add(f1);
  scene2.add(f2);

  // material
  var material = new THREE.MeshPhongMaterial({
    color: 0xff0000,
    shading: THREE.FlatShading,
    visible: false
  });
  var material2 = new THREE.MeshPhongMaterial({
    color: 0xff0000,
    shading: THREE.FlatShading,
    visible: false
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

function drawTimers() {
  //Remove Previous Timers

  //ADD Timers
  timer1.width = 512;
  timer1.height = 512;
  var ctx = timer1.getContext("2d");
  ctx.fillStyle = "white";
  ctx.textAlign = "center";
  ctx.textBaseline = "middle";
  ctx.font = "60px Arial";
  ctx.fillText(
    `${h1}:${m1}:${s1} Laps:${lap1}/20`,
    timer1.width / 2,
    timer1.height / 2
  );
  timer2.width = 512;
  timer2.height = 512;
  ctx = timer2.getContext("2d");
  ctx.fillStyle = "white";
  ctx.textAlign = "center";
  ctx.textBaseline = "middle";
  ctx.font = "60px Arial";
  ctx.fillText(
    `${h2}:${m2}:${s2} Laps:${lap2}/20`,
    timer2.width / 2,
    timer2.height / 2
  );
}
function add() {
  s1++;
  if (s1 >= 60) {
    s1 = 0;
    m1++;
    if (m1 >= 60) {
      m1 = 0;
      h1++;
    }
  }
  s2++;
  if (s2 >= 60) {
    s2 = 0;
    m2++;
    if (m2 >= 60) {
      m2 = 0;
      h2++;
    }
  }
}

function timer() {
  t = setTimeout(add, 1000);
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
let backRotation, backRotation2;
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

    previousPoint = point;
    previousAngle = angle;


    if (dir == undefined) {
      var normalMatrix = new THREE.Matrix4().extractRotation(mesh.matrixWorld);
      var normal = mesh.geometry.faces[10].normal;
      dir = normal.clone().applyMatrix4(normalMatrix);
    } else {
      mesh.position.x -= dir.x;
      mesh.position.z -= dir.z;
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
      mesh2.position.x -= dir2.x;
      mesh2.position.z -= dir2.z;
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
  angle = -Math.atan2(tangent.x, tangent.y);

  return -angle;
}

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

  if (play) {
    if (playMusic) {
      sound.play();
      playMusic = false;
    }
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
  } else {
    startScene = new THREE.Scene();

    var startcamera = new THREE.PerspectiveCamera(
      90,
      window.innerWidth / window.innerHeight,
      0.1,
      1000
    );
    startcamera.position.z = 50;

    startScene.background = startTexture;
    var buttonPlay = new THREE.Mesh(
      new THREE.PlaneGeometry(30, 10),
      new THREE.MeshBasicMaterial({ map: playTexture })
    );
    buttonPlay.position.set(4, -10, 0);
    buttonPlay.name = "Play";
    startScene.add(buttonPlay);
    var helpPlay = new THREE.Mesh(
      new THREE.PlaneGeometry(30, 10),
      new THREE.MeshBasicMaterial({ map: helpTexture })
    );
    helpPlay.position.set(4, -25, 0);
    helpPlay.name = "Help";
    startScene.add(helpPlay);

    var helpPlane = new THREE.Mesh(
      new THREE.PlaneGeometry(50, 65),
      new THREE.MeshBasicMaterial({ map: controlsTexture, visible: showHelp })
    );
    startScene.add(helpPlane);
    helpPlane.position.set(70, 0, 0);
    renderer.render(startScene, startcamera);
    document.addEventListener("click", function(event) {
      mouse = new THREE.Vector2(
        (event.clientX / window.innerWidth) * 2 - 1, //x
        -(event.clientY / window.innerHeight) * 2 + 1
      ); //y
      var raycaster = new THREE.Raycaster();
      // update the picking ray with the camera and mouse position
      raycaster.setFromCamera(mouse, startcamera);
      // calculate objects intersecting the picking ray
      var intersects = raycaster.intersectObjects(startScene.children);
      if (intersects.length > 0) {
        if (intersects[0].object.name == "Play") {
          play = true;
          (position = 0),
            (position2 = 0),
            (h1 = 0),
            (m1 = 0),
            (s1 = 0),
            (h2 = 0),
            (m2 = 0),
            (s2 = 0),
            (lap1 = 1),
            (lap2 = 1);
        } else if (intersects[0].object.name == "Help") {
          showHelp = !showHelp;
        }
      }
    });
  }
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
  drawTimers();
  timer1Texture.needsUpdate = true;
  timer2Texture.needsUpdate = true;
  if (lap1 < 20 && lap2 < 20) {
    timer();
  }
  if (lap1 == 20) {
    winner = "Red Car";
  } else if (lap2 == 20) {
    winner = "Blue Car";
  }
  if (winner == null) {
    move();
    render();
    requestAnimationFrame(animate);
  } else {
    if (winner == "Red Car") {
      var view = views[0];
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
      scene.children.length = 0;

      var finalMesh2 = new THREE.Mesh(
        new THREE.BoxGeometry(window.innerWidth / 2, window.innerHeight / 2, 1),
        new THREE.MeshBasicMaterial({ map: finalTexture })
      );
      scene.add(finalMesh2);
      camera.position.z = 4000;
      camera.position.y = 600;
      renderer.render(scene, camera);
      var view = views[1];
      var camera = view.camera;
      view.updateCamera(camera, scene2, mouseX, mouseY);
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
      scene2.children.length = 0;

      var finalMesh = new THREE.Mesh(
        new THREE.BoxGeometry(window.innerWidth / 2, window.innerHeight / 2, 1),
        new THREE.MeshBasicMaterial({ map: finalTexture2 })
      );
      scene2.add(finalMesh);
      camera.position.z = 4000;
      camera.position.y = 600;
      renderer.render(scene2, camera);
      alert(`Red Winner With Time: ${h1}:${m1}:${s1}`);
    } else {
      var view = views[1];
      var camera = view.camera;
      view.updateCamera(camera, scene2, mouseX, mouseY);
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
      scene2.children.length = 0;

      var finalMesh = new THREE.Mesh(
        new THREE.BoxGeometry(window.innerWidth / 2, window.innerHeight / 2, 1),
        new THREE.MeshBasicMaterial({ map: finalTexture })
      );

      scene2.add(finalMesh);
      camera.position.z = 4000;
      camera.position.y = 600;
      renderer.render(scene2, camera);
      var view = views[0];
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
      scene.children.length = 0;

      var finalMesh2 = new THREE.Mesh(
        new THREE.BoxGeometry(window.innerWidth / 2, window.innerHeight / 2, 1),
        new THREE.MeshBasicMaterial({ map: finalTexture2 })
      );

      scene.add(finalMesh2);
      camera.position.z = 4000;
      camera.position.y = 600;
      renderer.render(scene, camera);
      alert(`Blue Winner With Time: ${h2}:${m2}:${s2}`);
    }
  }
}
