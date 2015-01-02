define(['socket.io'],
	function (io) {

		function connect(port) {
			var socket = io.connect('http://localhost:' + port);
			return socket;
		}

		function registerEvent(socket, event, callback) {
			socket.on('server', function (data) {
				callback(data);
			});
		}

		function raiseClientEvent(socket, event, data) {
			socket.emit(event, data);
		}

		return {
			connect: connect,
			registerEvent: registerEvent,
			raiseClientEvent: raiseClientEvent
		};
	});
