var ParticlesHolder = function(){
   this.mesh = new THREE.Object3D();
   this.particlesInUse = [];
};

ParticlesHolder.prototype.spawnParticles = function(particlesPool, pos, density, color, scale){
   var nParticles = denisty;

   for(var i = 0; i < nParticles; i++) {
      var particle;
      if(particlesPool.length) {
         particle = particlesPool.pop();
      } else {
         particle = new Particle();
      }

      this.mesh.add(particle.mesh);
      particle.mesh.visible = true;

      particle.mesh.position.x = pos.x;
      particle.mesh.position.y = pos.y;
      particle.explode(particlesPool, pos,color, scale);
   }
};

module.exports = ParticlesHolder;