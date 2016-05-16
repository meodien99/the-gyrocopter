var EventHelper = require('./events');
var GAME = require('../configs/game');

var SceneHelper = {
   handleWindowResize : function (camera, renderer, WIDTH, HEIGHT) {
      // update HEIGHT and WIDTH of the renderer and camera
      renderer.setSize(WIDTH, HEIGHT);
      camera.aspect = WIDTH / HEIGHT;
      camera.updateProjectionMatrix();
   },

   createLights : function(scene, ambientLight){
      var hemisphereLight, shadowLight;

      // A hemisphere light is a gradient colored light;
      // the first parameter is the sky color, the second parameter is the ground color,
      // the third parameter is the intensity of the light
      hemisphereLight = new THREE.HemisphereLight(0xaaaaaa, 0x000000, .9);

      // the directional light shines from the specific direction.
      // It acts like the sun, that means all the rays produced are parallel
      shadowLight = new THREE.DirectionalLight(0xffffff, .9);

      // set the direction of light
      shadowLight.position.set(150, 350, 350);
      // all shadow casting
      shadowLight.castShadow = true;
      // define the visible area of the projected shadow
      shadowLight.shadow.camera.left = -400;
      shadowLight.shadow.camera.right = 400;
      shadowLight.shadow.camera.top = 400;
      shadowLight.shadow.camera.bottom = -400;
      shadowLight.shadow.camera.near = 1;
      shadowLight.shadow.camera.far = 1000;
      // define the resolution of the shadow; the higher the better,
      // but also the more expensive and less performant
      shadowLight.shadow.mapSize.width = 2048 * 2;
      shadowLight.shadow.mapSize.height = 2048 * 2;

      // var ch = new THREE.CameraHelper(shadowLight.shadow.camera);

      // scene.add(ch);


      // to activate the lights, just add them to the scene
      scene.add(hemisphereLight);
      scene.add(shadowLight);
      // an ambient light modifies the global color of a scene and makes the shadows softer
      scene.add(ambientLight);
   },

   updateCameraFov : function (camera, mousePos){
      camera.fov = EventHelper.normalize(mousePos.x, -1, 1, 40, 80);
      camera.updateProjectionMatrix();
   },


   // INGAME
   removeEnergy : function(GAME_VARIABLES){
      GAME_VARIABLES.ENERGY -= GAME.ENEMY_VALUE;
      GAME_VARIABLES.ENERGY = Math.max(0, GAME_VARIABLES.ENERGY);
   },
   addEnergy : function(GAME_VARIABLES){
      GAME_VARIABLES.ENERGY += GAME.COIN_VALUE;
      GAME_VARIABLES.ENERGY = Math.min(GAME_VARIABLES.ENERGY, 100);
   },
   updateEnergy: function (GAME_VARIABLES, energyBar, deltaTime){
      GAME_VARIABLES.ENERGY -= GAME_VARIABLES.SPEED * deltaTime * GAME.RATIO_SPEED_ENERGY;
      GAME_VARIABLES.ENERGY = Math.max(0, GAME_VARIABLES.ENERGY);
      energyBar.style.right = (100 - GAME_VARIABLES.ENERGY) + "%";
      energyBar.style.backgroundColor = (GAME_VARIABLES.ENERGY < 50) ? "#f25346" : "#68c3c0";

      if(GAME_VARIABLES.ENERGY < 30) {
         energyBar.style.animationName = 'blinking';
      } else {
         energyBar.style.animationName = 'none';
      }

      if(GAME_VARIABLES.ENERGY < 1){
         GAME_VARIABLES.STATUS = 'gameover';
      }
   }
};

module.exports = SceneHelper;