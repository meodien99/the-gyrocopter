var Coin = require('./coin');
var GAME = require('../configs/game');
var Colors = require('../configs/color');
var EventHelper = require('../helpers/events');
var SceneHelper = require('../helpers/scene');

var CoinsHolder = function(nCoins){
   this.mesh = new THREE.Object3D();
   this.coinsInUse = [];
   this.coinsPool = [];

   for(var i = 0; i < nCoins; i++){
      var coin = new Coin();
      this.coinsPool.push(coin);
   }
};


CoinsHolder.prototype.spawnCoins = function(){
   var nCoins = 1 + Math.floor(Math.random() * 10);
   var d = GAME.SEA_RADIUS + GAME.PLANE_DEFAULT_HEIGHT + (-1 + Math.random() * 2) * (GAME.PLANE_AMP_HEIGHT - 20);
   var amplitude = 10 + Math.round(Math.random() * 10);
   for(var i = 0; i < nCoins; i++) {
      var coin;
      if(this.coinsPool.length) {
         coin = this.coinsPool.pop();
      } else {
         coin = new Coin();
      }

      this.mesh.add(coin.mesh);
      this.coinsInUse.push(coin);
      coin.angle = -(i * 0.02);
      coin.distance = d + Math.cos(i * 5) * amplitude;
      coin.mesh.position.y = Math.sin(coin.angle) * coin.distance - GAME.SEA_RADIUS;
      coin.mesh.position.x = Math.cos(coin.angle) * coin.distance;
   }
};

CoinsHolder.prototype.rotateCoins = function(airPlane, particlesHolder, particlesPool, deltaTime, GAME_VARIABLES){
   for(var i = 0;  i < this.coinsInUse.length; i++){
      var coin = this.coinsInUse[i];
      if(coin.exploding) continue;

      coin.angle += GAME_VARIABLES.SPEED * deltaTime * GAME.COINS_SPEED;

      if(coin.angle > Math.PI * 2)
         coin.angle -= Math.PI * 2;

      coin.mesh.position.y = Math.sin(coin.angle) * coin.distance - GAME.SEA_RADIUS;
      coin.mesh.position.x = Math.cos(coin.angle) * coin.distance;

      coin.mesh.rotation.z += Math.random() * 0.1;
      coin.mesh.rotation.y += Math.random() * 0.1;

      var diffPos = EventHelper.getDiffPos(airPlane, coin);
      var d = diffPos.length();

      if( d < GAME.COIN_DISTANCE_TOLERANCE) {
         this.coinsPool.unshift(this.coinsInUse.splice(i, 1)[0]);
         this.mesh.remove(coin.mesh);
         particlesHolder.spawnParticles(particlesPool, coin.mesh.position.clone(), 5, Colors.COIN, .8);
         SceneHelper.addEnergy(GAME_VARIABLES);
         i--;
      } else if (coin.angle > Math.PI){
         this.coinsPool.unshift(this.coinsInUse.splice(i, 1)[0]);
         this.mesh.remove(coin.mesh);
         i--;
      }
   }
};

module.exports = CoinsHolder;