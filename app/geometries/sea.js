var Colors = require('../configs/color');
var GAME = require('../configs/game');

var Sea = function(){
   // Create the geometry (shape) of the cylinder;
   // The parameters are:
   // radius top, radius bottom, height, number of segments on radius, number of segments vertically
   var geom = new THREE.CylinderGeometry(GAME.SEA_RADIUS, GAME.SEA_RADIUS, GAME.SEA_LENGTH, 40, 10);
   // rotate the geometry on the x-axis
   geom.applyMatrix(new THREE.Matrix4().makeRotationX(-Math.PI/2));
   geom.mergeVertices();

   var l = geom.vertices.length;
   // create an array to store new data associated to each vertex
   this.waves = [];

   for (var i = 0; i < l; i++){
      var v = geom.vertices[i];

      this.waves.push ({
         x:v.x,
         y:v.y,
         z:v.z,
         ang:Math.random()*Math.PI*2, // a random angle
         amp:GAME.WAVES_MIN_AMP + Math.random() * (GAME.WAVES_MAX_AMP - GAME.WAVES_MIN_AMP), // a random distance
         speed:GAME.WAVES_MIN_SPEED + Math.random() * (GAME.WAVES_MAX_SPEED - GAME.WAVES_MIN_SPEED) // a random speed range between radians / frame
      });
   }

   // create the material
   var mat = new THREE.MeshPhongMaterial({
      color: Colors.blue,
      transparent: true,
      opacity: .8,
      shading: THREE.FlatShading,
   });

   // To create an object in Three.js, we have to create a mesh
   // which is a combination of a geometry and some material
   this.mesh = new THREE.Mesh(geom, mat);
   this.mesh.name = "waves";
   // Allow the sea to receive shadows
   this.mesh.receiveShadow = true;
};

Sea.prototype.moveWaves = function(deltaTime){
   // get the vertices
   var verts = this.mesh.geometry.vertices;
   var l = verts.length;

   for (var i=0; i<l; i++){
      var v = verts[i];
      // get the data associated to it
      var vprops = this.waves[i];

      // update the position of the vertex
      v.x = vprops.x + Math.cos(vprops.ang)*vprops.amp;
      v.y = vprops.y + Math.sin(vprops.ang)*vprops.amp;

      // increment the angle for the next frame
      vprops.ang += vprops.speed * deltaTime;
   }

   // Tell the renderer that the geometry of the sea has changed.
   // In fact, in order to maintain the best level of performance,
   // three.js caches the geometries and ignores any changes
   // unless we add this line
   this.mesh.geometry.verticesNeedUpdate = true;
}
module.exports = Sea;