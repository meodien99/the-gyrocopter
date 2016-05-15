var Colors = require('./configs/color');
var SceneHelper = require('./helpers/scene');
var EventHelper = require('./helpers/events');
var Sea = require('./geometries/sea');
var Sky = require('./geometries/sky');
var AirPlane = require('./geometries/airplane');


//////////////////////////////////////////////////
// ================ GAME VARIABLES ============ //
//////////////////////////////////////////////////

var deltaTime = 0,
   newTime = new Date().getTime(),
   oldTime = new Date().getTime(),
   ennemiesPool = [],
   particlesPool = [],
   particlesInUse = [];

var scene, camera, fieldOfView, aspectRatio, nearPlane, farPlane, HEIGHT, WIDTH, renderer, container,
   sky, sea, airplane;

function createScene(){
   // Get width and height of the screen
   // Use them to set aspect ratio of the camera
   // and the size of renderer
   HEIGHT = window.innerHeight;
   WIDTH = window.innerWidth;
   aspectRatio = WIDTH / HEIGHT;
   fieldOfView = 60;
   nearPlane = 1;
   farPlane = 10000;

   // create the scene
   scene = new THREE.Scene();

   // Add a fog effect to the scene, same color as the background color used in style sheet
   scene.fog = new THREE.Fog(Colors.FOG, 100, 950);

   // Create the camera
   camera = new THREE.PerspectiveCamera(
      fieldOfView,
      aspectRatio,
      nearPlane,
      farPlane
   );

   // Set the position of the camera
   camera.position.x = 0;
   camera.position.z = 200;
   camera.position.y = 100;

   // Create the renderer
   renderer = new THREE.WebGLRenderer({
      // Allow transparency to show gradient background we defined in the CSS
      alpha: true,
      // Activate the anti-aliasing;
      // this is less performant, but, as our project is low-poly based, it should be fine
      antialias: true
   });

   // Define the size of renderer; in this case it will fill the entire the screen
   renderer.setSize(WIDTH, HEIGHT);

   // enable shadow rendering
   renderer.shadowMap.enabled = true;

   // Add the DOM element of the renderer to the container we created in the HTML
   container = document.getElementById('world');
   container.appendChild(renderer.domElement);

   var handleWindowResize = SceneHelper.handleWindowResize(camera, renderer, WIDTH, HEIGHT);

   // listen to the screen if the user resizes it
   // we have to update camera and renderer size
   window.addEventListener('resize', handleWindowResize, false);

}


function createPlane(){
   airplane = new AirPlane();
   airplane.mesh.scale.set(.25, .25, .25);
   airplane.mesh.position.y = 100;
   scene.add(airplane.mesh);
}

function createSea(){
   sea = new Sea();
   // push it a little bit at the bottom of the scene
   sea.mesh.position.y = -600;

   scene.add(sea.mesh);
}

function createSky(){
   sky = new Sky();
   sky.mesh.position.y = -600;
   scene.add(sky.mesh);
}


var mousePos = {x: 0, y: 0};

function handleMouseMove (event){
   mousePos = EventHelper.handleMouseMove(event, WIDTH, HEIGHT);
}

function loop(){
   // Rotation propeller, sky, sea
   airplane.propeller.rotation.x += 0.3;
   sky.mesh.rotation.z += .01;
   sea.mesh.rotation.z += .005;
   sea.moveWaves();
   SceneHelper.updateCameraFov(camera, mousePos);
   airplane.updatePlane(mousePos);
   renderer.render(scene, camera);

   requestAnimationFrame(loop);
}

function init(){
   // set up the scene, the camera and the render
   createScene();

   // add the lights
   SceneHelper.createLights(scene);

   // add the objects
   createPlane();
   createSea();
   createSky();

   // listener
   document.addEventListener('mousemove', handleMouseMove, false);

   // start a loop that will update the objects's positions
   // and render the scene on each frame
   loop();
}

window.addEventListener('load', init, false);
