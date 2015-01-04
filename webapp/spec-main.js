define(['mock-ajax'], function () {

});

define('webapp/store', [], function () {
	//in memory stub
	var values = [];
	var PREFIX = "terminode_";

	function Store() {
		this.events = [];
	}

	Store.prototype.setValue = function (name, val) {
		values[PREFIX + name] = val;
	};

	Store.prototype.getValue = function (name) {
		return values[PREFIX + name] || {};
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

define('webapp/hub', [], function () {
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

	function raiseServerEvent(socket, event, data) {
		var callback = sockets[socket.io.uri][event];
		callback(data);
	}

	function raiseClientEvent(socket, event, data) {
		console.log(event + " raised by client");
	}

	return {
		connect: connect,
		registerEvent: registerEvent,
		raiseServerEvent: raiseServerEvent,
		raiseClientEvent: raiseClientEvent
	};
});
