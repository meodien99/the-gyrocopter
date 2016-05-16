var Enemy = require('./enemy');
var GAME = require('../configs/game');
var Colors = require('../configs/color');
var SceneHelper = require('../helpers/scene');
var EventHelper = require('../helpers/events');

var EnemiesHolder = function(){
   this.mesh = new THREE.Object3D();
   this.enemiesInUse = [];
};

EnemiesHolder.prototype.spawnEnemies = function(enemiesPool, GAME_VARIABLES){
   var enemiesNumber = GAME_VARIABLES.LEVEL;

   for (var i = 0; i < enemiesNumber; i++) {
      var e;
      if(enemiesPool.length) {
         e = enemiesPool.pop();
      } else {
         e = new Enemy();
      }

      e.setAngle(-(i * 0.1));
      e.setDistance(GAME.SEA_RADIUS + GAME.PLANE_DEFAULT_HEIGHT + (-1 + Math.random() * 2) * (GAME.PLANE_AMP_HEIGHT - 20));
      e.mesh.position.x = Math.cos(e.angle) * e.distance;
      e.mesh.position.y = -GAME_VARIABLES.SEA_RADIUS + Math.sin(e.angle) * e.distance;

      this.mesh.add(e.mesh);
      this.enemiesInUse.push(e);
   }
};

EnemiesHolder.prototype.rotateEnemies = function(enemiesPool, airPlane, particlesPool, particlesHolder, deltaTime,GAME_VARIABLES, ambientLight){
   for(var i = 0; i < this.enemiesInUse.length; i++){
      var e = this.enemiesInUse[i];
      e.angle += GAME_VARIABLES.SPEED * deltaTime * GAME.ENEMIES_SPEED;

      if(e.angle > Math.PI * 2)
         e.angle -= Math.PI * 2;

      e.mesh.position.x = Math.cos(e.angle) * e.distance;
      e.mesh.position.y = -GAME.SEA_RADIUS + Math.sin(e.angle) * e.distance;

      e.mesh.rotation.y += Math.random() * .1;
      e.mesh.rotation.z += Math.random() * .1;

      var diffPos = EventHelper.getDiffPos(airPlane, e);
      var d = diffPos.length();

      if (d < GAME.ENEMY_DISTANCE_TOLERANCE) {
         particlesHolder.spawnParticles(particlesPool, e.mesh.position.clone(), 15, Colors.red, 3);

         enemiesPool.unshift(this.enemiesInUse.splice(i, 1)[0]);
         this.mesh.remove(e.mesh);
         GAME_VARIABLES.PLANE_COLLISION_SPEED_X = 100 * diffPos.x / d;
         GAME_VARIABLES.PLANE_COLLISION_SPEED_Y = 100 * diffPos.y / d;
         ambientLight.intensity = 2;

         SceneHelper.removeEnergy(GAME_VARIABLES);
         i--;
      } else if (e.angle > Math.PI) {
         enemiesPool.unshift(this.enemiesInUse.splice(i, 1)[0]);
         this.mesh.remove(e.mesh);
         i--;
      }
   }
};

module.exports = EnemiesHolder;