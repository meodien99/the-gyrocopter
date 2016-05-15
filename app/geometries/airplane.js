var Colors = require('../configs/color');
var Pilot = require('./pilot');
var EventHelper = require('../helpers/events');


var AirPlane = function(){
   this.mesh = new THREE.Object3D();

   // create the cabin
   var geomCockpit = new THREE.BoxGeometry(60, 50, 50, 1, 1, 1);
   var matCockpit = new THREE.MeshPhongMaterial({
      color: Colors.red,
      shading : THREE.FlatShading
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
   var geomPropeller = new THREE.BoxGeometry(20,10,10,1,1,1);
   var matPropeller = new THREE.MeshPhongMaterial({
      color:Colors.brown,
      shading:THREE.FlatShading
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
   this.pilot.mesh.position.set(-10,27,0);
   this.mesh.add(this.pilot.mesh);

   this.mesh.castShadow = true;
   this.mesh.receiveShadow = true;
};

AirPlane.prototype.updatePlane = function(mousePos){
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