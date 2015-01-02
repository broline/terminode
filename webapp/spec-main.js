define(['mock-ajax'], function () {

});

define('webapp/store',[], function () {
	//in memory stub
	var values = [];
	var PREFIX = "terminode_";
	function setValue(name, val) {
		values[PREFIX + name] = val;
	}

	function getValue(name) {
		return values[PREFIX + name];
	}

	return {
		getValue: getValue,
		setValue: setValue
	};
});

define('webapp/hub',[], function () {
	//stub hub

	var sockets = [];

	function connect(port) {
		console.log("hub connected socket to port: " + port);
		var socket = {
			connected: true,
			disconnected: false,
			io: {
				uri: "http://localhost:" + port
			}
		};
		sockets[socket.io.uri] = [];
		return socket;
	}

	function registerEvent(socket, event, callback) {
		sockets[socket.io.uri][event] = callback;
	}

	function raiseServerEvent(socket, event) {
		var callback = sockets[socket.io.uri][event];
		callback();
	}

	return {
		connect: connect,
		registerEvent: registerEvent,
		raiseEvent: raiseServerEvent
	};
});
