var EventHelper = require('./events');

var SceneHelper = {
   handleWindowResize : function (camera, renderer, WIDTH, HEIGHT) {
      // update HEIGHT and WIDTH of the renderer and camera
      renderer.setSize(WIDTH, HEIGHT);
      camera.aspect = WIDTH / HEIGHT;
      camera.updateProjectionMatrix();
   },

   createLights : function(scene){
      var hemisphereLight, shadowLight, ambientLight;

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
      shadowLight.shadow.mapSize.width = 2048;
      shadowLight.shadow.mapSize.height = 2048;

      // to activate the lights, just add them to the scene
      scene.add(hemisphereLight);
      scene.add(shadowLight);

      // an ambient light modifies the global color of a scene and makes the shadows softer
      ambientLight = new THREE.AmbientLight(0xdc8874, .5);
      scene.add(ambientLight);
   },

   updateCameraFov : function (camera, mousePos){
      camera.fov = EventHelper.normalize(mousePos.x,-1,1,40, 80);
      camera.updateProjectionMatrix();
   }
};

module.exports = SceneHelper;