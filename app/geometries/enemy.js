var Colors = require('../configs/color');

var Enemy = function(){
   var geom = new THREE.TetrahedronGeometry(8, 2);
   var mat = new THREE.MeshPhongMaterial({
      color : Colors.red,
      shininess : 0,
      specular : Colors.PURGE_WHITE,
      shading : THREE.FlatShading
   });

   this.mesh = new THREE.Mesh(geom, mat);
   this.mesh.castShadow = true;
   this.angle = 0;
   this.dist = 0;
   this.distance = 0;
};

Enemy.prototype.setAngle = function(angle) {
   this.angle = angle;
};

Enemy.prototype.setDistance = function(distance){
   this.distance = distance;
}

module.exports = Enemy;

