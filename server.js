var requirejs = require("requirejs");

requirejs.config({
	nodeRequire: require
});

requirejs(['express', 'socket.io', 'player', 'engine', 'wall', 'gametypes', 'board'], 
function (express, socketio, Player, engine, Wall, gametypes, Board) {
	var TICK_TIME = 30;
	var BOARD_SIZE = 10;
	var board = new Board(BOARD_SIZE, BOARD_SIZE);
		
	var server = express.createServer();
	server.use(express.static(__dirname));

	var io = socketio.listen(server);

	io.sockets.on("connection", function (socket) {
		var player = new Player(5, 5);
		engine.addPlayer(socket.id, player);

		var serializedBoard = board.getSerializedVersion();
		socket.emit("gameinfo", {tickTime: TICK_TIME, board: serializedBoard});
		var players = engine.getPlayers();
		var playerKeys = Object.keys(players);
		playerKeys.forEach(function (key) {
			var pos = players[key].getPosition();
			socket.emit("newplayer", {id: key, x: pos.x, y: pos.y});
		});

		socket.on("moveleft", function () {
			// kolla pos nu, kolla kollisioner, beräkna, svara
			var pos = engine.getPlayers()[socket.id].getPosition();
			var speed = engine.getPlayers()[socket.id].getSpeed();
			if(speed.x !== 0 || speed.y !== 0) {
				return;
			}
			if(pos.x-1 >= 0 && board.isTileWalkable(pos.x - 1, pos.y)) {
				var targetPosition = {x: pos.x-1, y: pos.y};
				var ticks = 1000 / TICK_TIME;
				var speed = {x: -1 / ticks, y: 0};
				socket.emit("moveplayer", {id: socket.id, targetPosition: targetPosition,
										   speed: speed, ticks: ticks});
				engine.getPlayers()[socket.id].moveToPosition(targetPosition, speed, ticks);
			}
		});
	});

	server.listen(8080);

	engine.start(TICK_TIME, function () {});
});