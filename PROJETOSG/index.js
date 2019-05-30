// THREEJS RELATED VARIABLES
var scene, renderer, camera, dirLightHelper, controls;


// 3D Models
let loop = true
let cube, teta
let points = []

let i = 0
let n
let vel = 1

let keyboardState = {
    up: false,
}


window.onload = function init() {
    // set up the scene, the camera and the renderer
    createScene();

    // add the lights
    createLights();
    // add the objects
    createCar()
    createPath()

    //KEY EVENTS

    //keydown event
    function onKeyDown(evt) {
        if (evt.keyCode == 38) {
            keyboardState.up = true
        }
    }
    document.addEventListener('keydown', onKeyDown, false)

    //keyup event
    function onKeyUp(evt) {
        keyboardState.up = false
    }
    document.addEventListener('keyup', onKeyUp, false)


    // start a loop that will update the objects' positions 
    // and render the scene on each frame
    animate();
}

function createCar() {

}
function createPath() {

    n = 800; // number of points
    var r = 50; //radius
    var r2 = 70
    let r3 = 55
    let r4 = 65

    // instantiate a loader
    var loader = new THREE.FBXLoader();
    // load a resource
    loader.load(
        // resource URL
        'models/carSingle.fbx',
        // Function when resource is loaded
        function (object) {
            
            scene.add(object);
            object.position.z = 50
        }
    );


    //Draw the lines
    //lines of the track material
    let material = new THREE.LineBasicMaterial({
        color: 0x000000,
    });
    //lines of the cars'path material
    let materialPath = new THREE.LineBasicMaterial({
        color: 0xFF0000
    })

    //track gemoetries
    let geometry = new THREE.Geometry();
    for (let i = 0; i < n + 1; i++) {
        geometry.vertices.push(new THREE.Vector3((r + (r / 5) * Math.sin(8 * i * Math.PI / n)) * Math.sin(2 * i * Math.PI / n), 0, (r + (r / 20) * Math.sin(8 * i * Math.PI / n)) * Math.cos(2 * i * Math.PI / n)));
    }

    let geometry2 = new THREE.Geometry()
    for (let i = 0; i < n + 1; i++) {
        geometry2.vertices.push(new THREE.Vector3((r2 + (r2 / 5) * Math.sin(8 * i * Math.PI / n)) * Math.sin(2 * i * Math.PI / n), 0, (r2 + (r2 / 20) * Math.sin(8 * i * Math.PI / n)) * Math.cos(2 * i * Math.PI / n)));
    }

    //paths geometries*
    let geometryPath1 = new THREE.Geometry();
    for (let i = 0; i < n + 1; i++) {
        points.push(new THREE.Vector3((r3 + (r3 / 5) * Math.sin(8 * i * Math.PI / n)) * Math.sin(2 * i * Math.PI / n), 0, (r3 + (r3 / 20) * Math.sin(8 * i * Math.PI / n)) * Math.cos(2 * i * Math.PI / n)))
        geometry.vertices.push(new THREE.Vector3((r3 + (r3 / 5) * Math.sin(8 * i * Math.PI / n)) * Math.sin(2 * i * Math.PI / n), 0, (r3 + (r3 / 20) * Math.sin(8 * i * Math.PI / n)) * Math.cos(2 * i * Math.PI / n)));
    }

    let geometryPath2 = new THREE.Geometry()
    for (let i = 0; i < n + 1; i++) {
        geometry2.vertices.push(new THREE.Vector3((r4 + (r4 / 5) * Math.sin(8 * i * Math.PI / n)) * Math.sin(2 * i * Math.PI / n), 0, (r4 + (r4 / 20) * Math.sin(8 * i * Math.PI / n)) * Math.cos(2 * i * Math.PI / n)));
    }



    //create lines
    let line2 = new THREE.Line(geometry2, material)
    let line = new THREE.Line(geometry, material);
    scene.add(line2)
    scene.add(line);

    //create Paths
    let path1 = new THREE.Line(geometryPath1, materialPath)
    let path2 = new THREE.Line(geometryPath2, materialPath);
    scene.add(path1)
    scene.add(path2);

    console.log("path1 created", path2)

    //CAR
    let geometryCar = new THREE.BoxGeometry(10, 5, 5);
    let materialCar = new THREE.MeshBasicMaterial({ color: 0x00ff00 });
    cube = new THREE.Mesh(geometryCar, materialCar);
    scene.add(cube);
    cube.position.y = 1
    cube.position.z = r3
    //teta = Math.acos(THREE.Vector3.dot())


    //POSITION CAR


}

//INIT THREE JS, SCREEN, SCENE, CAMERA AND MOUSE EVENTS
function createScene() {
    // create an empty scene, that will hold all our elements such as objects, cameras and lights
    scene = new THREE.Scene();


    // create a camera, which defines where we're looking at
    var aspect = window.innerWidth / window.innerHeight;
    camera = new THREE.PerspectiveCamera(100, aspect, 0.1, 200);
    // position the camera

    camera.position.z = 120;
    camera.position.y = 60;

    // CONTROLS
    //controls = new THREE.OrbitControls(camera);
    //controls.addEventListener('change', function () { renderer.render(scene, camera); });


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
    window.addEventListener('resize', handleWindowResize, false);


    //FLOOR

    let floor = new THREE.PlaneGeometry(170, 170);
    let floorMaterial = new THREE.MeshBasicMaterial({
        color: 0xf09c67,
        wireframe: false
    });
    let f1 = new THREE.Mesh(floor, floorMaterial);
    f1.rotation.x = -Math.PI / 2;
    scene.add(f1);

}

function handleWindowResize() {
    // update height and width of the renderer and the camera
    var HEIGHT = window.innerHeight;
    var WIDTH = window.innerWidth;
    //renderer.setSize(WIDTH, HEIGHT);
    //camera.aspect = WIDTH / HEIGHT;
    //camera.updateProjectionMatrix();
}

function createLights() {
    var light = new THREE.HemisphereLight(0xaaaaaa, 0x000000, 0.9);
    scene.add(light);

    var directionalLight = new THREE.DirectionalLight(0xffffff, 0.9)
    directionalLight.position.set(100, 80, 50)
    directionalLight.shadow.camera.bottom = -500;
    directionalLight.shadow.camera.top = 500;
    directionalLight.shadow.camera.left = -500;
    directionalLight.shadow.camera.right = 500;
    directionalLight.shadow.camera.far = 1000;
    directionalLight.castShadow = true
    scene.add(directionalLight);


}


function animate() {
    // render

    cube.position.x = points[i].x
    cube.position.z = points[i].z

    //loop reason
    i = (i + 1) % (n + 1)


    if (keyboardState.up) {

        vel += 1
        i = (i + vel) % (n - vel);
        if (vel > 6) {
            vel = 6
        }
        console.log(vel)
    }

    else {
        vel -= 1
        i = (i + vel) % (n + vel);
        if (vel < 1) {
            vel = 1
        }


    }

    renderer.render(scene, camera);
    requestAnimationFrame(animate);
}



