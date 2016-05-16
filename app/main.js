var Colors = require('./configs/color');
var GAME = require('./configs/game');
// helpers
var SceneHelper = require('./helpers/scene');
var EventHelper = require('./helpers/events');
// geoms
var Sea = require('./geometries/sea');
var Sky = require('./geometries/sky');
var AirPlane = require('./geometries/airplane');
var CoinsHolder = require('./geometries/coins_holder');
var Enemy = require('./geometries/enemy');
var EnemiesHolder = require('./geometries/enemy_holder');
var Particle = require('./geometries/particle');
var ParticlesHolder = require('./geometries/particle_holder');

//////////////////////////////////////////////////
// ================ GAME VARIABLES ============ //
//////////////////////////////////////////////////
var deltaTime = 0,
   newTime = new Date().getTime(),
   oldTime = new Date().getTime(),
   game, isFirst = true;
var fieldDistance, energyBar, replayMessage, fieldLevel, levelCircle;

///////////////////////////////////////////////////
// ================= SCENE VARIABLE ============ //
///////////////////////////////////////////////////
var scene, camera,
   fieldOfView, aspectRatio, nearPlane, farPlane,
   renderer, ambientLight,
   container,
   HEIGHT, WIDTH,
   mousePos = {x: 0, y: 0};


///////////////////////////////////////////////////
// ================= INGAME VARIABLE ============ //
///////////////////////////////////////////////////
var sky, sea, airplane,
   coinsHolder, enemiesHolder,
   enemiesPool = [],
   particlesHolder,
   particlesPool = [];


function createScene(){
   // Get width and height of the screen
   // Use them to set aspect ratio of the camera
   // and the size of renderer
   HEIGHT = window.innerHeight;
   WIDTH = window.innerWidth;
   aspectRatio = WIDTH / HEIGHT;
   fieldOfView = 50;
   nearPlane = .1;
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
   camera.position.y = GAME.PLANE_DEFAULT_HEIGHT;

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
   airplane.mesh.position.y = GAME.PLANE_DEFAULT_HEIGHT;
   scene.add(airplane.mesh);
}

function createSea(){
   sea = new Sea();
   // push it a little bit at the bottom of the scene
   sea.mesh.position.y = -GAME.SEA_RADIUS;
   scene.add(sea.mesh);
}

function createSky(){
   sky = new Sky();
   sky.mesh.position.y = -GAME.SEA_RADIUS;
   scene.add(sky.mesh);
}

function createCoins(){
   coinsHolder = new CoinsHolder(20);
   scene.add(coinsHolder.mesh);
}

function createEnemies(){
   for(var i = 0; i < 10; i++){
      var e = new Enemy();
      enemiesPool.push(e);
   }
   enemiesHolder = new EnemiesHolder();
   scene.add(enemiesHolder.mesh);
}

function createParticles(){
   for(var i = 0; i < 10; i++){
      var p = new Particle();
      particlesPool.push(p);
   }

   particlesHolder = new ParticlesHolder();
   scene.add(particlesHolder.mesh);
}


function _resetGameVariables(){
   return {
      ENERGY: 100,
      LEVEL: 1,
      SPEED_LAST_UPDATE: 0,
      STATUS: "playing",
      COIN_LAST_SPAWN: 0,
      LEVEL_LAST_UPDATE: 0,
      ENEMY_LAST_SPAWN: 0,
      TARGET_BASE_SPEED : .00035,
      BASE_SPEED : .00035,
      SPEED : 0,
      PLANE_SPEED: 0,
      PLANE_FALL_SPEED: .001,
      PLANE_COLLISION_DISPLACEMENT_X: 0,
      PLANE_COLLISION_DISPLACEMENT_Y: 0,
      PLANE_COLLISION_SPEED_X: 0,
      PLANE_COLLISION_SPEED_Y: 0,
      DISTANCE:0
   };
}

function resetGame(){
   game = GAME.VARIABLES = _resetGameVariables();
   if(isFirst){
      game.STATUS = 'begin';
      isFirst = false;
   }
   fieldLevel.innerHTML = Math.floor(game.LEVEL);
}

function updateDistance(){
   game.DISTANCE += game.SPEED * deltaTime * GAME.RATIO_SPEED_DISTANCE;
   fieldDistance.innerHTML = Math.floor(game.DISTANCE);

   var d = 502 * (1 - (game.DISTANCE % GAME.DISTANCE_FOR_LEVEL_UPDATE) / GAME.DISTANCE_FOR_LEVEL_UPDATE);
   levelCircle.setAttribute("stroke-dashoffset", d);
}

////////////////////////////////////////////////////////
// ======================== EVENTS ================== //
////////////////////////////////////////////////////////
function handleMouseMove (event){
   mousePos = EventHelper.handleMouseMove(event, WIDTH, HEIGHT);
}

function handleTouchMove (event){
   mousePos = EventHelper.handleTouchMove(event, WIDTH, HEIGHT);
}

function handleMouseUp(event){
   if (game.STATUS == 'waitingReplay' || game.STATUS == 'begin'){
      resetGame();
      hideReplay();
   }
}

function handleTouchEnd(event){
   if (game.STATUS == "waitingReplay" || game.STATUS == 'begin'){
      resetGame();
      hideReplay();
   }
}

function showReplay(){
   if(game.STATUS == 'waitingReplay'){
      replayMessage.innerHTML = "Click To Replay"
   }
   replayMessage.style.display = 'block';
}

function hideReplay(){
   replayMessage.style.display = 'none';
}

function createGeometries(){
   createPlane();
   createSea();
   createSky();
   createCoins();
   createEnemies();
   createParticles();
}


function loop(){
   newTime = new Date().getTime();
   deltaTime = newTime - oldTime;
   oldTime = newTime;
   if(game.STATUS == 'playing'){
      // Add Energy coins every 100ms
      if(Math.floor(game.DISTANCE) % GAME.DISTANCE_FOR_COINS_SPAWN == 0 && Math.floor(game.DISTANCE) > game.COIN_LAST_SPAWN) {
         game.COIN_LAST_SPAWN = Math.floor(game.DISTANCE);
         coinsHolder.spawnCoins();
      }

      // increment plane speed
      if(Math.floor(game.DISTANCE) % GAME.DISTANCE_FOR_SPEED_UPDATE == 0 && Math.floor(game.DISTANCE) > game.SPEED_LAST_UPDATE) {
         game.SPEED_LAST_UPDATE = Math.floor(game.DISTANCE);
         game.TARGET_BASE_SPEED += GAME.INCREMENT_SPEED_BY_TIME * deltaTime;
      }

      if(Math.floor(game.DISTANCE) % GAME.DISTANCE_FOR_LEVEL_UPDATE == 0 && Math.floor(game.DISTANCE) > game.LEVEL_LAST_UPDATE) {
         game.LEVEL_LAST_UPDATE = Math.floor(game.DISTANCE);
         game.LEVEL ++;
         fieldLevel.innerHTML = Math.floor(game.LEVEL);

         game.TARGET_BASE_SPEED += GAME.INIT_SPEED + GAME.INCREMENT_SPEED_BY_LEVEL * game.LEVEL;
      }

      // enemy spawns
      if(Math.floor(game.DISTANCE) % GAME.DISTANCE_FOR_ENEMIES_SPAWN == 0 && Math.floor(game.DISTANCE) > game.ENEMY_LAST_SPAWN){
         game.ENEMY_LAST_SPAWN = Math.floor(game.DISTANCE);
         enemiesHolder.spawnEnemies(enemiesPool, game);
      }

      airplane.updatePlane(mousePos, game, deltaTime, camera);
      updateDistance();
      SceneHelper.updateEnergy(game, energyBar, deltaTime);
      game.BASE_SPEED += (game.TARGET_BASE_SPEED - game.BASE_SPEED) * deltaTime * 0.02;
      game.SPEED = game.BASE_SPEED * game.PLANE_SPEED;
   } else if (game.STATUS == 'gameover') {
      game.SPEED *= .99;
      airplane.mesh.rotation.z += (-Math.PI/2 - airplane.mesh.rotation.z) * .0002 * deltaTime;
      airplane.mesh.rotation.x += 0.0003 * deltaTime;
      game.PLANE_FALL_SPEED *= 1.05;
      airplane.mesh.position.y -= game.PLANE_FALL_SPEED * deltaTime;
      if(airplane.mesh.position.y < -200){
         showReplay();
         game.STATUS = 'waitingReplay';
      }
   } else if (game.STATUS == 'begin') {
      showReplay();
   } else if (game.STATUS == 'waitingReplay'){
   }

   // Rotation propeller, sky, sea
   sea.mesh.rotation.z += game.SPEED * deltaTime;

   if(sea.mesh.rotation.z > 2 * Math.PI)
      sea.mesh.rotation.z -= 2 * Math.PI;

   ambientLight.intensity += (.5 - ambientLight.intensity) * deltaTime * .005;

   coinsHolder.rotateCoins(airplane, particlesHolder, particlesPool, deltaTime, game);

   enemiesHolder.rotateEnemies(enemiesPool, airplane, particlesPool, particlesHolder, deltaTime, game, ambientLight);

   sky.moveClouds(deltaTime, game);

   sea.moveWaves(deltaTime);

   renderer.render(scene, camera);
   requestAnimationFrame(loop);
}


function init(){
   // UI
   fieldDistance = document.getElementById('distValue');
   energyBar = document.getElementById('energyBar');
   replayMessage = document.getElementById('replayMessage');
   fieldLevel = document.getElementById('levelValue');
   levelCircle = document.getElementById('levelCircleStroke');

   // reset Game variable
   resetGame();

   // set up the scene, the camera and the render
   createScene();

   // add the lights
   ambientLight = new THREE.AmbientLight(0xdc8874, .5);
   SceneHelper.createLights(scene, ambientLight);

   // add the objects
   createGeometries();

   // listener
   document.addEventListener('mousemove', handleMouseMove, false);
   document.addEventListener('touchmove', handleTouchMove, false);
   document.addEventListener('mouseup', handleMouseUp, false);
   document.addEventListener('touchend', handleTouchEnd, false);

   // start a loop that will update the objects's positions
   // and render the scene on each frame
   loop();
}

window.addEventListener('load', init, false);
