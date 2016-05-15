var Helper = {
   normalize : function(v, vmin, vmax, tmin, tmax){
      var nv = Math.max(Math.min(v, vmax), vmin);
      var dv = vmax - vmin;
      var pc = (nv - vmin)/dv;
      var dt = tmax - tmin;
      var tv = tmin + (pc * dt);

      return tv;
   },

   handleMouseMove : function (event, WIDTH, HEIGHT){
      // here we are converting the mouse position value received
      // to a normalized value varying between -1 and 1;
      // this is the formula for the horizontal axis:
      var tx = -1 + (event.clientX / WIDTH) * 2;

      // for the vertical axis, we need to inverse the formula
      // because the 2D y-axis goes the opposite direction of the 3D y-axis
      var ty = 1 - (event.clientY / HEIGHT) * 2;

      return {
         x: tx,
         y: ty
      };
   }
};

module.exports = Helper;