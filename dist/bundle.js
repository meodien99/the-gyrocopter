/******/ (function(modules) { // webpackBootstrap
/******/ 	// The module cache
/******/ 	var installedModules = {};

/******/ 	// The require function
/******/ 	function __webpack_require__(moduleId) {

/******/ 		// Check if module is in cache
/******/ 		if(installedModules[moduleId])
/******/ 			return installedModules[moduleId].exports;

/******/ 		// Create a new module (and put it into the cache)
/******/ 		var module = installedModules[moduleId] = {
/******/ 			exports: {},
/******/ 			id: moduleId,
/******/ 			loaded: false
/******/ 		};

/******/ 		// Execute the module function
/******/ 		modules[moduleId].call(module.exports, module, module.exports, __webpack_require__);

/******/ 		// Flag the module as loaded
/******/ 		module.loaded = true;

/******/ 		// Return the exports of the module
/******/ 		return module.exports;
/******/ 	}


/******/ 	// expose the modules object (__webpack_modules__)
/******/ 	__webpack_require__.m = modules;

/******/ 	// expose the module cache
/******/ 	__webpack_require__.c = installedModules;

/******/ 	// __webpack_public_path__
/******/ 	__webpack_require__.p = "";

/******/ 	// Load entry module and return exports
/******/ 	return __webpack_require__(0);
/******/ })
/************************************************************************/
/******/ ([
/* 0 */
/***/ function(module, exports, __webpack_require__) {

	'use strict';

	var Colors = __webpack_require__(1);
	var SceneHelper = __webpack_require__(2);
	var EventHelper = __webpack_require__(3);
	var Sea = __webpack_require__(4);
	var Sky = __webpack_require__(5);
	var AirPlane = __webpack_require__(7);

	var scene, camera, fieldOfView, aspectRatio, nearPlane, farPlane, HEIGHT, WIDTH, renderer, container, sky, sea, airplane;

	function createScene() {
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
	   camera = new THREE.PerspectiveCamera(fieldOfView, aspectRatio, nearPlane, farPlane);

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

	function createPlane() {
	   airplane = new AirPlane();
	   airplane.mesh.scale.set(.25, .25, .25);
	   airplane.mesh.position.y = 100;
	   scene.add(airplane.mesh);
	}

	function createSea() {
	   sea = new Sea();
	   // push it a little bit at the bottom of the scene
	   sea.mesh.position.y = -600;

	   scene.add(sea.mesh);
	}

	function createSky() {
	   sky = new Sky();
	   sky.mesh.position.y = -600;
	   scene.add(sky.mesh);
	}

	var mousePos = { x: 0, y: 0 };

	function handleMouseMove(event) {
	   mousePos = EventHelper.handleMouseMove(event, WIDTH, HEIGHT);
	}

	function loop() {
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

	function init() {
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

/***/ },
/* 1 */
/***/ function(module, exports) {

	"use strict";

	module.exports = {
	   red: 0xf25346,
	   white: 0xd8d0d1,
	   brown: 0x59332e,
	   pink: 0xF5986E,
	   brownDark: 0x23190f,
	   blue: 0x68c3c0,
	   FOG: 0xf7d9aa
	};

/***/ },
/* 2 */
/***/ function(module, exports, __webpack_require__) {

	'use strict';

	var EventHelper = __webpack_require__(3);

	var SceneHelper = {
	   handleWindowResize: function handleWindowResize(camera, renderer, WIDTH, HEIGHT) {
	      // update HEIGHT and WIDTH of the renderer and camera
	      renderer.setSize(WIDTH, HEIGHT);
	      camera.aspect = WIDTH / HEIGHT;
	      camera.updateProjectionMatrix();
	   },

	   createLights: function createLights(scene) {
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

	   updateCameraFov: function updateCameraFov(camera, mousePos) {
	      camera.fov = EventHelper.normalize(mousePos.x, -1, 1, 40, 80);
	      camera.updateProjectionMatrix();
	   }
	};

	module.exports = SceneHelper;

/***/ },
/* 3 */
/***/ function(module, exports) {

	"use strict";

	var Helper = {
	   normalize: function normalize(v, vmin, vmax, tmin, tmax) {
	      var nv = Math.max(Math.min(v, vmax), vmin);
	      var dv = vmax - vmin;
	      var pc = (nv - vmin) / dv;
	      var dt = tmax - tmin;
	      var tv = tmin + pc * dt;

	      return tv;
	   },

	   handleMouseMove: function handleMouseMove(event, WIDTH, HEIGHT) {
	      // here we are converting the mouse position value received
	      // to a normalized value varying between -1 and 1;
	      // this is the formula for the horizontal axis:
	      var tx = -1 + event.clientX / WIDTH * 2;

	      // for the vertical axis, we need to inverse the formula
	      // because the 2D y-axis goes the opposite direction of the 3D y-axis
	      var ty = 1 - event.clientY / HEIGHT * 2;

	      return {
	         x: tx,
	         y: ty
	      };
	   }
	};

	module.exports = Helper;

/***/ },
/* 4 */
/***/ function(module, exports, __webpack_require__) {

	'use strict';

	var Colors = __webpack_require__(1);

	var Sea = function Sea() {
	   // Create the geometry (shape) of the cylinder;
	   // The parameters are:
	   // radius top, radius bottom, height, number of segments on radius, number of segments vertically
	   var geom = new THREE.CylinderGeometry(600, 600, 800, 40, 10);

	   // rotate the geometry on the x-axis
	   geom.applyMatrix(new THREE.Matrix4().makeRotationX(-Math.PI / 2));

	   geom.mergeVertices();

	   var l = geom.vertices.length;

	   // create an array to store new data associated to each vertex
	   this.waves = [];

	   for (var i = 0; i < l; i++) {
	      var v = geom.vertices[i];

	      this.waves.push({
	         x: v.x,
	         y: v.y,
	         z: v.z,
	         ang: Math.random() * Math.PI * 2, // a random angle
	         amp: 5 + Math.random() * 15, // a random distance
	         speed: 0.016 + Math.random() * 0.032 // a random speed between 0.016 and 0.048 radians / frame
	      });
	   }

	   // create the material
	   var mat = new THREE.MeshPhongMaterial({
	      color: Colors.blue,
	      transparent: true,
	      opacity: .8,
	      shading: THREE.FlatShading
	   });

	   // To create an object in Three.js, we have to create a mesh
	   // which is a combination of a geometry and some material
	   this.mesh = new THREE.Mesh(geom, mat);

	   // Allow the sea to receive shadows
	   this.mesh.receiveShadow = true;

	   this.moveWaves = function () {
	      // get the vertices
	      var verts = this.mesh.geometry.vertices;
	      var l = verts.length;

	      for (var i = 0; i < l; i++) {
	         var v = verts[i];
	         // get the data associated to it
	         var vprops = this.waves[i];

	         // update the position of the vertex
	         v.x = vprops.x + Math.cos(vprops.ang) * vprops.amp;
	         v.y = vprops.y + Math.sin(vprops.ang) * vprops.amp;

	         // increment the angle for the next frame
	         vprops.ang += vprops.speed;
	      }

	      // Tell the renderer that the geometry of the sea has changed.
	      // In fact, in order to maintain the best level of performance,
	      // three.js caches the geometries and ignores any changes
	      // unless we add this line
	      this.mesh.geometry.verticesNeedUpdate = true;
	   };
	};

	module.exports = Sea;

/***/ },
/* 5 */
/***/ function(module, exports, __webpack_require__) {

	'use strict';

	var Cloud = __webpack_require__(6);

	var Sky = function Sky() {
	   // Create an empty container
	   this.mesh = new THREE.Object3D();

	   // choose a number of clouds to be scattered in the sky
	   this.nClouds = 20;

	   // To distribute the clouds consistently,
	   // We need to place the according to a uniform angle
	   var stepAngle = Math.PI * 2 / this.nClouds;

	   // create the clouds
	   for (var i = 0; i < this.nClouds; i++) {
	      var c = new Cloud();

	      // set the position and rotation of each cloud
	      var a = stepAngle * i; // this is the final angle of the cloud
	      var h = 750 + Math.random() * 200; // this is the distance between the center

	      // trigonometry
	      // convert polar coordinates (angle, distance) into Cartesian
	      c.mesh.position.x = Math.cos(a) * h;
	      c.mesh.position.x = Math.sin(a) * h;

	      // rotate the cloud according to its position
	      c.mesh.rotation.z = a + Math.PI / 2;

	      // for a better result, we position the clouds at random depths inside of the scene
	      c.mesh.position.z = -400 - Math.random() * 400;

	      // we also set a random scale for each cloud
	      var s = 1 + Math.random() * 2;
	      c.mesh.scale.set(s, s, s);

	      this.mesh.add(c.mesh);
	   }
	};

	module.exports = Sky;

/***/ },
/* 6 */
/***/ function(module, exports, __webpack_require__) {

	'use strict';

	var Colors = __webpack_require__(1);

	var Cloud = function Cloud() {
	   // create empty container that will hold all the different parts of the cloud
	   this.mesh = new THREE.Object3D();

	   // create a cube geometry;
	   // This shape will be duplicated to create the cloud
	   var geom = new THREE.BoxGeometry(20, 20, 20);

	   // create material, a simple white material
	   var mat = new THREE.MeshPhongMaterial({
	      color: Colors.white
	   });

	   // duplicate geometry a random number of times
	   var nBlocs = 3 + Math.floor(Math.random() * 3);
	   for (var i = 0; i < nBlocs; i++) {
	      // Create the mesh by cloning the geometry
	      var m = new THREE.Mesh(geom, mat);

	      // set the position and the rotate of each cube randomly
	      m.position.x = i * 15;
	      m.position.y = Math.random() * 10;
	      m.position.z = Math.random() * 10;

	      m.rotation.z = Math.random() * Math.PI * 2;
	      m.rotation.y = Math.random() * Math.PI * 2;

	      // set the size of the cube randomly
	      var s = .1 + Math.random() * .9;
	      m.scale.set(s, s, s);

	      // allow each cube to cast and to receive shadows
	      m.castShadow = true;
	      m.receiveShadow = true;

	      // add the cube to container we first create
	      this.mesh.add(m);
	   }
	}; // End Cloud

	module.exports = Cloud;

/***/ },
/* 7 */
/***/ function(module, exports, __webpack_require__) {

	'use strict';

	var Colors = __webpack_require__(1);
	var Pilot = __webpack_require__(8);
	var EventHelper = __webpack_require__(3);

	var AirPlane = function AirPlane() {
	   this.mesh = new THREE.Object3D();

	   // create the cabin
	   var geomCockpit = new THREE.BoxGeometry(60, 50, 50, 1, 1, 1);
	   var matCockpit = new THREE.MeshPhongMaterial({
	      color: Colors.red,
	      shading: THREE.FlatShading
	   });

	   geomCockpit.vertices[4].y -= 10;
	   geomCockpit.vertices[4].z += 20;
	   geomCockpit.vertices[5].y -= 10;
	   geomCockpit.vertices[5].z -= 20;
	   geomCockpit.vertices[6].y += 30;
	   geomCockpit.vertices[6].z += 20;
	   geomCockpit.vertices[6].y += 30;
	   geomCockpit.vertices[6].z -= 20;

	   var cockpit = new THREE.Mesh(geomCockpit, matCockpit);
	   cockpit.castShadow = true;
	   cockpit.receiveShadow = true;
	   this.mesh.add(cockpit);

	   // create the engine
	   var geomEngine = new THREE.BoxGeometry(20, 50, 50, 1, 1, 1);
	   var matEngine = new THREE.MeshPhongMaterial({
	      color: Colors.white,
	      shading: THREE.FlatShading
	   });
	   var engine = new THREE.Mesh(geomEngine, matEngine);
	   engine.position.x = 40;
	   engine.castShadow = true;
	   engine.receiveShadow = true;
	   this.mesh.add(engine);

	   // create the tail
	   var geomTailPlane = new THREE.BoxGeometry(15, 20, 5, 1, 1, 1);
	   var matTailPlane = new THREE.MeshPhongMaterial({
	      color: Colors.red,
	      shading: THREE.FlatShading
	   });
	   var tailPlane = new THREE.Mesh(geomTailPlane, matTailPlane);
	   tailPlane.position.set(-35, 25, 0);
	   tailPlane.castShadow = true;
	   tailPlane.receiveShadow = true;
	   this.mesh.add(tailPlane);

	   // create the wing
	   var geomSideWing = new THREE.BoxGeometry(40, 8, 150, 1, 1, 1);
	   var matSideWing = new THREE.MeshPhongMaterial({
	      color: Colors.red,
	      shading: THREE.FlatShading
	   });
	   var sideWing = new THREE.Mesh(geomSideWing, matSideWing);
	   sideWing.castShadow = true;
	   sideWing.receiveShadow = true;
	   this.mesh.add(sideWing);

	   // create the propeller
	   var geomPropeller = new THREE.BoxGeometry(20, 10, 10, 1, 1, 1);
	   var matPropeller = new THREE.MeshPhongMaterial({
	      color: Colors.brown,
	      shading: THREE.FlatShading
	   });
	   this.propeller = new THREE.Mesh(geomPropeller, matPropeller);
	   this.propeller.castShadow = true;
	   this.propeller.receiveShadow = true;

	   // blades
	   var geomBlade = new THREE.BoxGeometry(1, 100, 20, 1, 1, 1);
	   var matBlade = new THREE.MeshPhongMaterial({
	      color: Colors.brownDark,
	      shading: THREE.FlatShading
	   });
	   var blade = new THREE.Mesh(geomBlade, matBlade);
	   blade.position.set(8, 0, 0);
	   blade.castShadow = true;
	   blade.receiveShadow = true;
	   this.propeller.add(blade);
	   this.propeller.position.set(50, 0, 0);

	   this.mesh.add(this.propeller);

	   this.pilot = new Pilot();
	   this.pilot.mesh.position.set(-10, 27, 0);
	   this.mesh.add(this.pilot.mesh);

	   this.mesh.castShadow = true;
	   this.mesh.receiveShadow = true;
	};

	AirPlane.prototype.updatePlane = function (mousePos) {
	   // let's move the airplane between -100 and 100 on the horizontal axis,
	   // and between 25 and 175 on the vertical axis,
	   // depending on the mouse position which ranges between -1 and 1 on both axes;
	   // var targetX = normalize(mousePos.x, -1, 1, -100, 100);
	   var targetY = EventHelper.normalize(mousePos.y, -1, 1, 25, 175);

	   // Move the plane at each frame by adding a fraction of the remaining distance
	   this.mesh.position.y += (targetY - this.mesh.position.y) * 0.1;

	   // update the airplane's position
	   this.mesh.rotation.z = (targetY - this.mesh.position.y) * 0.0128;
	   this.mesh.rotation.x = (this.mesh.position.y - targetY) * 0.0064;
	   this.propeller.rotation.x += 0.3;

	   this.pilot.updateHairs();
	};

	module.exports = AirPlane;

/***/ },
/* 8 */
/***/ function(module, exports, __webpack_require__) {

	"use strict";

	var Colors = __webpack_require__(1);

	var Pilot = function Pilot() {
	   this.mesh = new THREE.Object3D();
	   this.mesh.name = "pilot";

	   this.angleHairs = 0;

	   // body of the pilot
	   var bodyGeom = new THREE.BoxGeometry(15, 15, 15);
	   var bodyMat = new THREE.MeshPhongMaterial({
	      color: Colors.brown,
	      shading: THREE.FlatShading
	   });
	   var body = new THREE.Mesh(bodyGeom, bodyMat);
	   body.position.set(2, -12, 0);
	   this.mesh.add(body);

	   // Face of the pilot
	   var faceGeom = new THREE.BoxGeometry(10, 10, 10);
	   var faceMat = new THREE.MeshPhongMaterial({ color: Colors.pink });
	   var face = new THREE.Mesh(faceGeom, faceMat);
	   this.mesh.add(face);

	   // Hair element
	   var hairGeom = new THREE.BoxGeometry(4, 4, 4);
	   var hairMat = new THREE.MeshPhongMaterial({ color: Colors.brown });
	   var hair = new THREE.Mesh(hairGeom, hairMat);
	   // Align the shape of the hair to its bottom boundary, that will make it easier to scale.
	   hair.geometry.applyMatrix(new THREE.Matrix4().makeTranslation(0, 2, 0));

	   // create container for the hair
	   var hairs = new THREE.Object3D();

	   // create container for hair at top of head
	   this.hairsTop = new THREE.Object3D();

	   // create the hair at the top of head
	   // and position them on a 3x4 grid
	   for (var i = 0; i < 12; i++) {
	      var h = hair.clone();
	      var col = i % 3;
	      var row = Math.floor(i / 3);
	      var startPosZ = -4;
	      var startPosX = -4;
	      h.position.set(startPosX + row * 4, 0, startPosZ + col * 4);
	      this.hairsTop.add(h);
	   }

	   hairs.add(this.hairsTop);

	   // create the hair at the side of face
	   var hairSideGeom = new THREE.BoxGeometry(12, 4, 2);
	   hairSideGeom.applyMatrix(new THREE.Matrix4().makeTranslation(-6, 0, 0));
	   var hairSideR = new THREE.Mesh(hairSideGeom, hairMat);
	   var hairSideL = hairSideR.clone();

	   hairSideR.position.set(8, -2, 6);
	   hairSideR.position.set(8, -2, -6);

	   hairs.add(hairSideR);
	   hairs.add(hairSideL);

	   // create the hair at the back of head
	   var hairBackGeom = new THREE.BoxGeometry(2, 8, 10);
	   var hairBack = new THREE.Mesh(hairBackGeom, hairMat);
	   hairBack.position.set(-1, -4, 0);
	   hairs.add(hairBack);
	   hairs.position.set(-5, 5, 0);

	   this.mesh.add(hairs);

	   var glassGeom = new THREE.BoxGeometry(5, 5, 5);
	   var glassMat = new THREE.MeshPhongMaterial({ color: Colors.brown });
	   var glassR = new THREE.Mesh(glassGeom, glassMat);
	   glassR.position.set(6, 0, 3);
	   var glassL = glassR.clone();
	   glassL.position.z = -glassR.position.z;

	   var glassAGeom = new THREE.BoxGeometry(11, 1, 11);
	   var glassA = new THREE.Mesh(glassAGeom, glassMat);

	   this.mesh.add(glassR);
	   this.mesh.add(glassL);
	   this.mesh.add(glassA);

	   var earGeom = new THREE.BoxGeometry(2, 3, 2);
	   var earL = new THREE.Mesh(earGeom, faceMat);
	   earL.position.set(0, 0, -6);
	   var earR = earL.clone();
	   earR.position.set(0, 0, 6);
	   this.mesh.add(earL);
	   this.mesh.add(earR);
	};

	// move the hair
	Pilot.prototype.updateHairs = function () {
	   // get the hair
	   var hairs = this.hairsTop.children;

	   // update them according the angle angelHairs
	   var l = hairs.length;
	   for (var i = 0; i < l; i++) {
	      var h = hairs[i];
	      // each hair element will scale on cyclical basis between 75% and 100% of its original size
	      h.scale.y = .75 + Math.cos(this.angleHairs + i / 3) * .25;
	   }

	   this.angleHairs += .16;
	};

	module.exports = Pilot;

/***/ }
/******/ ]);