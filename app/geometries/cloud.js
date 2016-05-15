var Colors = require('../configs/color');

var Cloud = function(){
   // create empty container that will hold all the different parts of the cloud
   this.mesh = new THREE.Object3D();
   this.mesh.name = "cloud";

   // create a cube geometry;
   // This shape will be duplicated to create the cloud
   var geom = new THREE.BoxGeometry(20, 20, 20);

   // create material, a simple white material
   var mat = new THREE.MeshPhongMaterial({
      color: Colors.white,
   });

   // duplicate geometry a random number of times
   var nBlocs = 3 + Math.floor(Math.random() * 3);
   for( var i = 0; i < nBlocs; i++ ){
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

Cloud.prototype.rotate = function(){
   var len = this.mesh.children.length;
   for(var i = 0; i < len; i++){
      var m = this.mesh.children[i];
      m.rotation.z += Math.random() * .005 * (i + 1);
      m.rotation.y += Math.random() * .002 * (i + 1);
   }
};

module.exports = Cloud;