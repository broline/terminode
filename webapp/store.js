define(['jquery',
	'jquery.cookie'],
	function ($) {

		var PREFIX = "terminode_";

		function Store() {
			this.events = [];
		}

		Store.prototype.setValue = function (name, val) {
			$.cookie(getName(name), JSON.stringify(val), { expires: 999, path: '/' });
			emit("valueChanged");
		};

		Store.prototype.getValue = function (name) {
			return JSON.parse($.cookie(getName(name)));
		};
		
		Store.prototype.on = function (event, callback) {
			this.events[event] = callback;
		};

		function getName(name) {
			return PREFIX + name;
		}

		function emit(event, data) {
			if (this.events[event]) {
				this.events[event](data);
			}
		}

		return Store;

	});