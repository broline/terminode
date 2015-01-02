define(['jquery',
	'jquery.cookie'],
	function ($) {

		var PREFIX = "terminode_";

		function getName(name) {
			return PREFIX + name;
		}

		function setValue(name, val) {
			$.cookie(getName(name), val, { expires: 999, path: '/' });
		}

		function getValue(name) {
			return $.cookie(getName(name));
		}

		return {
			getValue: getValue,
			setValue: setValue
		};

	});