var requirejs = require("requirejs");

requirejs.config({
	nodeRequire: require
});

requirejs(['express', 'socket.io', 'player', 'engine', 'wall', 'gametypes'], 
function (express, socketio, Player, engine, Wall, gametypes) {
	var TICK_TIME = 30;
	var BOARD_SIZE = 10;
	var board = new Array(BOARD_SIZE);
	for(var i = 0; i < board.length; i++) {
		board[i] = new Array(BOARD_SIZE);
	}
	for(var i = 0; i < board[0].length; i++) {
		board[0][i] = new Wall();
 		board[board.length-1][i] = new Wall();
	}
	for(var i = 0; i < board.length; i++) {
		board[i][0] = new Wall();
 		board[i][board[0].length-1] = new Wall();
	}
		
	var server = express.createServer();
	server.use(express.static(__dirname));

	var io = socketio.listen(server);

	io.sockets.on("connection", function (socket) {
		var player = new Player(5, 5);
		engine.addPlayer(socket.id, player);
		// Loop board and replace objects with codenames (gametypes.js)
		var boardCopy = new Array(board.length);
		for(var i = 0; i < board.length; i++) {
			boardCopy[i] = new Array(board[i].length);
			for(var j = 0; j < board[0].length; j++) {
				if(board[i][j] instanceof Wall)
					boardCopy[i][j] = gametypes.WALL;
			}
		}		
		socket.emit("gameinfo", {tickTime: TICK_TIME, board: boardCopy});
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
			if( !(board[pos.x - 1][pos.y] instanceof Wall) &&
				pos.x-1 >= 0) {
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