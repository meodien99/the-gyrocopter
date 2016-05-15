var Colors = require('../configs/color');


var Coin = function(){
   var geom = new THREE.TetrahedronGeometry(5, 0);
   var mat = new THREE.MeshPhongMaterial({
      color: Colors.COIN,
      shininess: 0,
      specular: Colors.PURGE_WHITE,
      shading: THREE.FlatShading
   });

   this.mesh = new THREE.Mesh(geom, mat);
   this.mesh.castShadow = true;
   this.angle = 0;
   this.dist = 0;
   this.distance = 0;
};

module.exports = Coin;