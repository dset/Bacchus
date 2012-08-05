var requirejs = require("requirejs");

requirejs.config({
    nodeRequire: require
});

requirejs(['express', 'socket.io', 'player', 'engine', 'wall', 'gametypes', 'board', 'bomb'], 
function (express, socketio, Player, engine, Wall, gametypes, Board, Bomb) {
    var TICK_TIME = 30;
    var BOARD_SIZE = 10;
    var board = new Board(BOARD_SIZE, BOARD_SIZE);
    
    var server = express.createServer();
    server.use(express.static(__dirname));

    var io = socketio.listen(server);

    io.sockets.on("connection", function (socket) {
	var serializedBoard = board.getSerializedVersion();
	socket.emit("gameinfo", {tickTime: TICK_TIME, board: serializedBoard});

	var players = engine.getPlayers();
	var playerKeys = Object.keys(players);
	playerKeys.forEach(function (key) {
	    var pos = players[key].getPosition();
	    socket.emit("newplayer", {id: key, x: pos.x, y: pos.y});
	});

	createPlayer(5, 5);

	function killPlayer() {
	    engine.removePlayer(socket.id);
	    io.sockets.emit("removeplayer", {id: socket.id});
	    setTimeout(function () {
		createPlayer(5, 5);
	    }, 2000);
	}

	function createPlayer(x, y) {
	    var newplayer = new Player(x, y, board);
	    newplayer.addObserver("dead", killPlayer);
	    engine.addPlayer(socket.id, newplayer);
	    io.sockets.emit("newplayer", {id: socket.id, x: x, y: y});
	}

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
	    if(!player) {
		return;
	    }
	    
	    var pos = player.getPosition();
	    if(player.isMoving() || !board.isTileWalkable(pos.x + dx, pos.y + dy)) {
		return;
	    }
	    
	    var targetPosition = {x: pos.x+dx, y: pos.y+dy};
	    var ticks = 400 / TICK_TIME;
	    var speed = {x: dx / ticks, y: dy / ticks};
	    io.sockets.emit("moveplayer", {id: socket.id, targetPosition: targetPosition,
				       speed: speed, ticks: ticks});
	    engine.getPlayer(socket.id).moveToPosition(targetPosition, speed, ticks);
	}

	socket.on("placebomb", function () {
	    var player = engine.getPlayer(socket.id);
	    if(!player) {
		return;
	    }
	    
	    var pos = player.getPosition();
	    pos.x = Math.round(pos.x);
	    pos.y = Math.round(pos.y);
	    var bomb = board.setBombAt(pos.x, pos.y);
	    if(bomb) {
		bomb.timeoutId = setTimeout(function () {
		    explodeBomb(bomb);
		}, 3000);

		io.sockets.emit("placebomb", bomb.getPosition());
	    }
	});

	function explodeBomb(bomb) {
	    var touchedBombs = bomb.explode() || new Array();
	    touchedBombs.forEach(function (bomb) {
		clearTimeout(bomb.timeoutId);
		if(!bomb.isExploded()) {
		    explodeBomb(bomb);
		}
	    });
	    io.sockets.emit("bombexplosion", bomb.getPosition());
	}

	socket.on("disconnect", function () {
	    engine.removePlayer(socket.id);
	    io.sockets.emit("removeplayer", {id: socket.id});
	});
    });

    server.listen(8080);

    engine.start(TICK_TIME, function () {});
});