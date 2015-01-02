/* global window */

//ignore with jshint since we are redefining require
var require = (function (root) { // jshint ignore:line

	var env;

	if (root) {
		env = root.__env;
	}


	var bower = "../bower_components/";

	var cfg = {
		baseUrl: "../",
		paths: {
			app: "..",
			webapp: "webapp",
			bower: bower,
			"jquery": bower + "jquery/dist/jquery",
			"knockout": bower + "knockout/dist/knockout",
			"bootstrap": bower + "bootstrap-sass-official/assets/javascripts/bootstrap",
			"crossroads": bower + "crossroads/dist/crossroads.min",
			"signals": bower + "signals/dist/signals.min",
			"template": bower + "knockout-require-templates/template",
			"stringTemplateEngine": bower + "knockout-require-templates/stringTemplateEngine",
			"text": bower + "requirejs-text/text",
			"knockout.punches": bower + "knockout.punches/knockout.punches",
			"lodash": bower + "lodash/dist/lodash",
			'css': bower + 'require-css/css',
			'socket.io': bower + 'socket.io-client/socket.io',
			'ko.xedit': bower + "knockout-x-editable/knockout.x-editable",
			'xedit': bower + "x-editable/dist/bootstrap3-editable/js/bootstrap-editable",
			'mock-ajax': bower + 'jasmine-ajax/lib/mock-ajax',
			'jquery.cookie': bower + 'jquery.cookie/jquery.cookie'
		},
		shim: {
			"bootstrap": {
				deps: ["jquery"]
			},
			'ko.xedit': {
				deps: ['xedit']
			},
			'xedit': {
				deps: ['bootstrap']
			}
		}
	};

	return cfg;
})(this);

if (typeof (exports) === "object") {
	module.exports = require;
}
