module.exports = {
   context: __dirname + '/app',
   entry: __dirname + '/app/main.js',
   output: {
      path : __dirname + '/dist',
      filename: "bundle.js"
   },
   resolve : {
      extensions : ['', '.js']
   },
   module : {
      loaders :[
         {
            test : /\.js$/,
            exclude : /node_modules/,
            loader : 'babel',
            query : {
               presets: ['es2015']
            }
         }
      ]
   }
}