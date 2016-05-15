var Colors = require('../configs/color');

var Pilot = function(){
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
   var faceMat = new THREE.MeshPhongMaterial({color: Colors.pink});
   var face = new THREE.Mesh(faceGeom, faceMat);
   this.mesh.add(face);

   // Hair element
   var hairGeom = new THREE.BoxGeometry(4, 4, 4);
   var hairMat = new THREE.MeshPhongMaterial({color: Colors.brown});
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
      var row = Math.floor(i/3);
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
   var glassMat = new THREE.MeshPhongMaterial({color: Colors.brown});
   var glassR = new THREE.Mesh(glassGeom, glassMat);
   glassR.position.set(6, 0, 3);
   var glassL = glassR.clone();
   glassL.position.z = -glassR.position.z;

   var glassAGeom = new THREE.BoxGeometry(11, 1, 11);
   var glassA = new THREE.Mesh(glassAGeom, glassMat);

   this.mesh.add(glassR);
   this.mesh.add(glassL);
   this.mesh.add(glassA);

   var earGeom = new THREE.BoxGeometry(2,3,2);
   var earL = new THREE.Mesh(earGeom,faceMat);
   earL.position.set(0,0,-6);
   var earR = earL.clone();
   earR.position.set(0,0,6);
   this.mesh.add(earL);
   this.mesh.add(earR);
};


// move the hair
Pilot.prototype.updateHairs = function(){
   // get the hair
   var hairs = this.hairsTop.children;

   // update them according the angle angelHairs
   var l = hairs.length;
   for (var i = 0; i < l; i++){
      var h = hairs[i];
      // each hair element will scale on cyclical basis between 75% and 100% of its original size
      h.scale.y = .75 + Math.cos(this.angleHairs+i/3)*.25;
   }

   this.angleHairs += .16;
};

module.exports = Pilot;