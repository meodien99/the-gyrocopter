var Colors = require('../configs/color');

var Particle = function(){
   var geom = new THREE.TetrahedronGeometry(3,0);
   var mat = new THREE.MeshPhongMaterial({
      color:0x009999,
      shininess:0,
      specular:Colors.PURGE_WHITE,
      shading:THREE.FlatShading
   });
   this.mesh = new THREE.Mesh(geom,mat);
};

Particle.prototype.explode = function(particlesPool, pos, color, scale){
   var _this = this;
   var _p = this.mesh.parent;
   this.mesh.material.color = new THREE.Color(color);
   this.mesh.material.needsUpdate = true;
   this.mesh.scale.set(scale, scale, scale);

   var targetX = pos.x + (-1 + Math.random() * 2) * 50;
   var targetY = pos.y + (-1 + Math.random() * 2) * 50;
   var speed = .6 + Math.random() * .2;

   TweenMax.to(this.mesh.rotation, speed, {
      x: Math.random() * 12,
      y: Math.random() * 12
   });
   TweenMax.to(this.mesh.scale, speed, {x:.1, y:.1, z:.1});
   TweenMax.to(this.mesh.position, speed, {
      x: targetX,
      y: targetY,
      delay: Math.random() * .1,
      ease: Power2.easeOut,
      onComplete: function(){
         if(_p)
            _p.remove(_this.mesh);
         _this.mesh.scale.set(1, 1, 1);
         particlesPool.unshift(_this);
      }
   });
};

module.exports = Particle;