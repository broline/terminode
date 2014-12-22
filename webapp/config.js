//ignore with jshint since we are redefining require
var require = (function(root) { // jshint ignore:line

    var env = window.__env;

    var bower = "../bower_components/";

    var cfg = {
        baseUrl: "../",
        paths: {
            app: "..",
            webapp: "webapp",
            bower: bower,
            "jquery": bower + "jquery/dist/jquery",
            "knockout": bower + "bower/knockout.js/knockout",
            "bootstrap": bower + "bootstrap-sass-official/assets/javascripts/bootstrap"
        },
        map: {
            "*": {
                'css': 'bower/require-css/css'
            }
        },
        shim: {
            "bootstrap": {
                deps: ["jquery"]
            }
        }
    };

    return cfg;
})(this);

if (typeof(exports) === "object") {
    module.exports = require;
}
