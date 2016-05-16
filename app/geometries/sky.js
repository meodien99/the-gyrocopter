var Cloud = require('./cloud');
var GAME = require('../configs/game');

var Sky = function(){
   // Create an empty container
   this.mesh = new THREE.Object3D();

   // choose a number of clouds to be scattered in the sky
   this.nClouds = 20;

   this.clouds = [];

   // To distribute the clouds consistently,
   // We need to place the according to a uniform angle
   var stepAngle = Math.PI * 2 / this.nClouds;

   // create the clouds
   for (var i = 0; i < this.nClouds; i++){
      var c = new Cloud();

      this.clouds.push(c);

      // set the position and rotation of each cloud
      var a = stepAngle*i; // this is the final angle of the cloud
      var h = GAME.SEA_RADIUS + 150 + Math.random() * 200; // this is the distance between the center

      // trigonometry
      // convert polar coordinates (angle, distance) into Cartesian
      c.mesh.position.x = Math.cos(a) * h;
      c.mesh.position.x = Math.sin(a) * h;
      // for a better result, we position the clouds at random depths inside of the scene
      c.mesh.position.z = -400 - Math.random()*400;

      // rotate the cloud according to its position
      c.mesh.rotation.z = a + Math.PI / 2;

      // we also set a random scale for each cloud
      var s = 1 + Math.random() * 2;
      c.mesh.scale.set(s, s, s);

      this.mesh.add(c.mesh);
   }
};

Sky.prototype.moveClouds = function(deltaTime, GAME_VARIABLES){
   for(var i = 0; i < this.clouds.length; i++){
      var c = this.clouds[i];
      c.rotate();
   }

   this.mesh.rotation.z += GAME_VARIABLES.SPEED * deltaTime;
};


module.exports = Sky;