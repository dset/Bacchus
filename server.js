var requirejs = require("requirejs");

requirejs.config({
    nodeRequire: require
});

requirejs(['express', 'socket.io', 'player', 'engine', 'wall', 'gametypes', 'board', 'bomb'],
function (express, socketio, Player, Engine, Wall, gametypes, Board, Bomb) {
    var TICK_TIME = 30;
    var BOARD_SIZE = 10;
    var engine = new Engine(TICK_TIME, new Board(BOARD_SIZE, BOARD_SIZE), function () {}, function () {});

    var server = express.createServer();
    server.use(express.static(__dirname));

    var io = socketio.listen(server);
    io.set('log level', 1);

    io.sockets.on("connection", function (socket) {
	var serializedBoard = engine.getSerializedBoard();
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
	    var newplayer = engine.createPlayer(socket.id, x, y);
	    newplayer.addObserver("dead", killPlayer);
	    newplayer.addObserver("invalidcommand", revertCommand);
	    io.sockets.emit("newplayer", {id: socket.id, x: x, y: y});
	}

	function revertCommand(identifier) {
	    if(identifier === gametypes.MOVE_COMMAND) {
		revertMove();
	    }
	}

	socket.on("moveleft", function () {
	    var successfulMove = engine.movePlayerLeft(socket.id);
	    if(successfulMove === true) {
		socket.broadcast.emit("moveplayerleft", {id: socket.id});
	    }
	});

	socket.on("moveright", function () {
	    var successfulMove = engine.movePlayerRight(socket.id);
	    if(successfulMove === true) {
		socket.broadcast.emit("moveplayerright", {id: socket.id});
	    }
	});

	socket.on("moveup", function () {
	    var successfulMove = engine.movePlayerUp(socket.id);
	    if(successfulMove === true) {
		socket.broadcast.emit("moveplayerup", {id: socket.id});
	    }
	});

	socket.on("movedown", function () {
	    var successfulMove = engine.movePlayerDown(socket.id);
	    if(successfulMove === true) {
		socket.broadcast.emit("moveplayerdown", {id: socket.id});
	    }
	});

	function revertMove() {
	    var data = engine.getPlayer(socket.id).getPosition();
	    data.id = socket.id;
	    io.sockets.emit("moveplayerto", data);
	}

	socket.on("placebomb", function () {
	    var player = engine.getPlayer(socket.id);
	    if( ! player) {
		/// If the player is dead, getPlayer will return undefined,
		/// thats why this has to be here.
		return;
	    }

	    var bomb = player.placeBombAtCurrentPosition();
	    if(bomb) {
		bomb.addObserver("explosion", function () {
		    onBombExplosion(bomb);
		});
		io.sockets.emit("placebomb", {id: socket.id, x: bomb.x, y: bomb.y});
		bomb.startTicking();
	    }
	});

	function onBombExplosion(bomb) {
	    io.sockets.emit("bombexplosion", bomb.getPosition());
	}

	socket.on("disconnect", function () {
	    engine.removePlayer(socket.id);
	    io.sockets.emit("removeplayer", {id: socket.id});
	});
    });

    server.listen(8080);

    engine.start();
});