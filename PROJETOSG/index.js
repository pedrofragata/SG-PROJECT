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

    n = 628; // number of points
    var r = 50; //radius
    var r2 = 70
    let r3 = 55
    let r4 = 65

    var loader = new THREE.OBJLoader();
    // load a resource
    /*loader.load(
        // resource URL
        'models/toycar.obj',
        // Function when resource is loaded
        function (object) {
            
            scene.add(object);
            object.position.z = 50
        }
    );*/

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
    /*
    x	=	asint	
y	=	asintcost.

http://mathworld.wolfram.com/EightCurve.html
    */
    let A = 80;
    let geometry3 = new THREE.Geometry();
    for (let i = 0; i < 2 * Math.PI; i += 0.01) {
        geometry3.vertices.push(new THREE.Vector3(
            A * Math.sin(i), 0,
            A * Math.sin(i) * Math.cos(i)));
    }

    let geometryPath3 = new THREE.Geometry()

    for(let i = 0; i<2*Math.PI;i+=0.01){
        points.push(new THREE.Vector3(
            A * Math.sin(i), 0,
            A * Math.sin(i) * Math.cos(i)))
    }

   


    let line3 = new THREE.Line(geometry3, material);
    scene.add(line3)


    //CAR
    let geometryCar = new THREE.BoxGeometry(10, 5, 5);
    let materialCar = new THREE.MeshBasicMaterial({ color: 0x00ff00 });
    cube = new THREE.Mesh(geometryCar, materialCar);
    scene.add(cube);
    cube.position.y = 1
    cube.position.z = r3

    //car2

    
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
    
    controls = new THREE.OrbitControls(camera);
    controls.addEventListener('change', function () { renderer.render(scene, camera); });


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
    if(i==628){
        i=0
    }
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




