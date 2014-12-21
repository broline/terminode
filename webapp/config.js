var require = (function (root) {

  var cfg = {
    baseUrl: "../",
    paths: {
      "app": "./",
      "bower": "./bower_components/",
      "jquery": "bower/jquery/dist/jquery",
      "knockout": "bower/knockout.js/knockout",
      "bootstrap": "http://maxcdn.bootstrapcdn.com/bootstrap/3.3.1/js/bootstrap.min"
    },
    map: {
      "*": {
        'css': '../bower_components/require-css/css'
      }
    },
    shim:{
      "bootstrap": {
        deps:["jquery","css!https://maxcdn.bootstrapcdn.com/bootstrap/3.3.1/css/bootstrap-theme.min.css"]
      }
    }
  };

  return cfg;
})(this);

if (typeof (exports) === "object") {
  module.exports = require;
}
