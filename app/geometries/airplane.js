var Colors = require('../configs/color');
var Pilot = require('./pilot');
var EventHelper = require('../helpers/events');
var GAME = require('../configs/game');

var AirPlane = function(){
   this.mesh = new THREE.Object3D();
   this.mesh.name = "airPlane";

   // create the cabin
   var geomCabin = new THREE.BoxGeometry(80, 50, 50, 1, 1, 1);
   var matCabin = new THREE.MeshPhongMaterial({
      color:Colors.red,
      shading:THREE.FlatShading
   });
   geomCabin.vertices[4].y-=10;
   geomCabin.vertices[4].z+=20;
   geomCabin.vertices[5].y-=10;
   geomCabin.vertices[5].z-=20;
   geomCabin.vertices[6].y+=30;
   geomCabin.vertices[6].z+=20;
   geomCabin.vertices[7].y+=30;
   geomCabin.vertices[7].z-=20;
   var cabin = new THREE.Mesh(geomCabin, matCabin);
   cabin.castShadow = true;
   cabin.receiveShadow = true;
   this.mesh.add(cabin);

   // create the engine
   var geomEngine = new THREE.BoxGeometry(20, 50, 50, 1, 1, 1);
   var matEngine = new THREE.MeshPhongMaterial({
      color: Colors.white,
      shading: THREE.FlatShading
   });
   var engine = new THREE.Mesh(geomEngine, matEngine);
   engine.position.x = 50;
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
   tailPlane.position.set(-40, 20, 0);
   tailPlane.castShadow = true;
   tailPlane.receiveShadow = true;
   this.mesh.add(tailPlane);

   // WINGS
   var geomSideWing = new THREE.BoxGeometry(30, 5, 120, 1, 1, 1);
   var matSideWing = new THREE.MeshPhongMaterial({
      color: Colors.red,
      shading: THREE.FlatShading
   });
   var sideWing = new THREE.Mesh(geomSideWing, matSideWing);
   sideWing.position.set(0, 15, 0);
   sideWing.castShadow = true;
   sideWing.receiveShadow = true;
   this.mesh.add(sideWing);

   var geoWindshield = new THREE.BoxGeometry(3, 15, 20, 1, 1, 1);
   var matWindshield = new THREE.MeshPhongMaterial({
      color:Colors.white,transparent:true,
      opacity:.3,
      shading:THREE.FlatShading
   });
   var windshield = new THREE.Mesh(geomWindshield, matWindshield);
   windshield.position.set(5,27,0);
   windshield.castShadow = true;
   windshield.receiveShadow = true;
   this.mesh.add(windshield);


   // create the propeller
   var geomPropeller = new THREE.BoxGeometry(20,10,10,1,1,1);
   geomPropeller.vertices[4].y -= 5;
   geomPropeller.vertices[4].z += 5;
   geomPropeller.vertices[5].y -= 5;
   geomPropeller.vertices[5].z -= 5;
   geomPropeller.vertices[6].y += 5;
   geomPropeller.vertices[6].z += 5;
   geomPropeller.vertices[7].y += 5;
   geomPropeller.vertices[7].z -= 5;

   var matPropeller = new THREE.MeshPhongMaterial({
      color:Colors.brown,
      shading:THREE.FlatShading
   });
   this.propeller = new THREE.Mesh(geomPropeller, matPropeller);
   this.propeller.castShadow = true;
   this.propeller.receiveShadow = true;

   // blades
   var geomBlade = new THREE.BoxGeometry(1, 80, 10, 1, 1, 1);
   var matBlade = new THREE.MeshPhongMaterial({
      color: Colors.brownDark,
      shading: THREE.FlatShading
   });
   var blade1 = new THREE.Mesh(geomBlade, matBlade);
   blade1.position.set(8, 0, 0);
   blade1.castShadow = true;
   blade1.receiveShadow = true;

   var blade2 = blade1.clone();
   blade2.rotation.x = Math.PI/2;
   blade2.castShadow = true;
   blade2.receiveShadow = true;

   this.propeller.add(blade1);
   this.propeller.add(blade2);
   this.propeller.position.set(60, 0, 0);
   this.mesh.add(this.propeller);

   var wheelProtecGeom = new THREE.BoxGeometry(30, 15, 10, 1, 1, 1);
   var wheelProtecMat = new THREE.MeshPhongMaterial({
      color : Colors.red,
      shading: THREE.FlatShading
   });
   var wheelProtecR = new THREE.Mesh(wheelProtecGeom, wheelProtecMat);
   wheelProtecR.position.set(25, -20, 25);
   this.mesh.add(wheelProtecR);

   var wheelTireGeom = new THREE.BoxGeometry(24, 24, 4);
   var wheelTireMat = new THREE.MeshPhongMaterial({
      color:Colors.brownDark,
      shading:THREE.FlatShading
   });
   var wheelTireR = new THREE.Mesh(wheelTireGeom,wheelTireMat);
   wheelTireR.position.set(25, -28, 25);

   var wheelAxisGeom = new THREE.BoxGeometry(10, 10, 6);
   var wheelAxisMat = new THREE.MeshPhongMaterial({
      color:Colors.brown,
      shading:THREE.FlatShading
   });
   var wheelAxis = new THREE.Mesh(wheelAxisGeom,wheelAxisMat);

   wheelTireR.add(wheelAxis);
   this.mesh.add(wheelTireR);

   var wheelProtecL = wheelProtecR.clone();
   wheelProtecL.position.z = -wheelProtecR.position.z ;
   this.mesh.add(wheelProtecL);

   var wheelTireL = wheelTireR.clone();
   wheelTireL.position.z = -wheelTireR.position.z;
   this.mesh.add(wheelTireL);

   var wheelTireB = wheelTireR.clone();
   wheelTireB.scale.set(.5, .5, .5);
   wheelTireB.position.set(-35, -5, 0);
   this.mesh.add(wheelTireB);

   var suspensionGeom = new THREE.BoxGeometry(4, 20, 4);
   suspensionGeom.applyMatrix(new THREE.Matrix4().makeTranslation(0, 10, 0))
   var suspensionMat = new THREE.MeshPhongMaterial({
      color:Colors.red,
      shading:THREE.FlatShading
   });
   var suspension = new THREE.Mesh(suspensionGeom,suspensionMat);
   suspension.position.set(-35, -5, 0);
   suspension.rotation.z = -.3;
   this.mesh.add(suspension);


   this.pilot = new Pilot();
   this.pilot.mesh.position.set(-10, 27, 0);
   this.mesh.add(this.pilot.mesh);

   this.mesh.castShadow = true;
   this.mesh.receiveShadow = true;
};

AirPlane.prototype.updatePlane = function(GAME_VARIABLES, mousePos){
   // let's move the airplane between -100 and 100 on the horizontal axis,
   // and between 25 and 175 on the vertical axis,
   // depending on the mouse position which ranges between -1 and 1 on both axes;
   // var targetX = normalize(mousePos.x, -1, 1, -100, 100);
   var targetY = EventHelper.normalize(mousePos.y, -1, 1, 25, 175);

   // Move the plane at each frame by adding a fraction of the remaining distance
   this.mesh.position.y += (targetY-this.mesh.position.y)*0.1;

   // update the airplane's position
   this.mesh.rotation.z = (targetY-this.mesh.position.y)*0.0128;
   this.mesh.rotation.x = (this.mesh.position.y-targetY)*0.0064;
   this.propeller.rotation.x += 0.3;

   this.pilot.updateHairs();
};

module.exports = AirPlane;