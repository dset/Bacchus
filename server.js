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
		var newplayer = new Player(5, 5);
		engine.addPlayer(socket.id, newplayer);

		var serializedBoard = board.getSerializedVersion();
		socket.emit("gameinfo", {tickTime: TICK_TIME, board: serializedBoard});
		var players = engine.getPlayers();
		var playerKeys = Object.keys(players);
		playerKeys.forEach(function (key) {
			var pos = players[key].getPosition();
			socket.emit("newplayer", {id: key, x: pos.x, y: pos.y});
		});

		socket.on("moveleft", function () {
			doMovePlayer(-1, 0);
		});

		socket.on("moveright", function () {
			doMovePlayer(1, 0);
		});

		socket.on("moveup", function () {
			doMovePlayer(0, -1);
		});

		socket.on("movedown", function () {
			doMovePlayer(0, 1);
		});

		function doMovePlayer(dx, dy) {
			var player = engine.getPlayer(socket.id);

			var pos = player.getPosition();
			if(player.isMoving() || !board.isTileWalkable(pos.x + dx, pos.y + dy)) {
				return;
			}
						
			var targetPosition = {x: pos.x+dx, y: pos.y+dy};
			var ticks = 400 / TICK_TIME;
			var speed = {x: dx / ticks, y: dy / ticks};
			socket.emit("moveplayer", {id: socket.id, targetPosition: targetPosition,
									   speed: speed, ticks: ticks});
			engine.getPlayer(socket.id).moveToPosition(targetPosition, speed, ticks);
		}
	});

	server.listen(8080);

	engine.start(TICK_TIME, function () {});
});