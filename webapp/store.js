define(['jquery',
	'jquery.cookie'],
	function ($) {

		var PREFIX = "terminode_";

		function Store() {
			this.events = [];
		}

		Store.prototype.setValue = function (name, val) {
			$.cookie(getName(name), JSON.stringify(val), { expires: 999, path: '/' });
			this.emit("valueChanged", { name: name, value: val });
		};

		Store.prototype.getValue = function (name) {
			var val = $.cookie(getName(name));
			return val ? JSON.parse(val) : {};
		};

		Store.prototype.on = function (event, callback) {
			this.events[event] = callback;
		};

		Store.prototype.emit = function (event, data) {
			if (this.events[event]) {
				this.events[event](data);
			}
		};

		function getName(name) {
			return PREFIX + name;
		}

		return Store;

	});