var Colors = require('../configs/color');

var Sea = function(){
   // Create the geometry (shape) of the cylinder;
   // The parameters are:
   // radius top, radius bottom, height, number of segments on radius, number of segments vertically
   var geom = new THREE.CylinderGeometry(600, 600, 800, 40, 10);

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
         amp:5 + Math.random()*15, // a random distance
         speed:0.016 + Math.random()*0.032 // a random speed between 0.016 and 0.048 radians / frame
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

   // Allow the sea to receive shadows
   this.mesh.receiveShadow = true;

   this.moveWaves = function(){
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