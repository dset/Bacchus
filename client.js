require(['player', 'engine', 'gametypes', 'wall', 'board', 'bomb', 'inputhandler'], function (Player, Engine, gametypes, Wall, Board, Bomb, InputHandler) {

    var socket = io.connect("http://localhost:8080");
    var canvas = document.getElementById("canvas");
    var context2d = canvas.getContext("2d");
    var inputHandler = new InputHandler();
    var engine;
    var board;
    var tickTime;

    socket.on("gameinfo", function (gameInfo) {
	board = new Board(1, 1);
	board.buildFromSerializedVersion(gameInfo.board);
	engine = new Engine(gameInfo.tickTime, draw, inputHandler.update.bind(inputHandler));
	engine.start();

	inputHandler.addKeyBinding(65, function () {
	    socket.emit("moveleft");
	});

	inputHandler.addKeyBinding(68, function () {
	    socket.emit("moveright");
	});

	inputHandler.addKeyBinding(83, function () {
	    socket.emit("movedown");
	});

	inputHandler.addKeyBinding(87, function () {
	    socket.emit("moveup");
	});

	inputHandler.addKeyBinding(32, function () {
	    socket.emit("placebomb");
	});
    });

    socket.on("newplayer", function (playerData) {
	engine.addPlayer(playerData.id, new Player(playerData.x, playerData.y, board));
    });

    socket.on("removeplayer", function (data) {
	engine.removePlayer(data.id);
    });

    socket.on("moveplayer", function (moveData) {
	var players = engine.getPlayers();
	players[moveData.id].moveToPosition(moveData.targetPosition, moveData.speed,
					    moveData.ticks);
    });

    socket.on("placebomb", function (data) {
	var bomb = new Bomb(board, data.x, data.y);
	board.setTile(data.x, data.y, bomb);
    });

    socket.on("bombexplosion", function (data) {
	var bomb = board.getTileObjectAt(data.x, data.y);
	bomb.explode();
    });

    function draw() {
	context2d.clearRect(0, 0, canvas.width, canvas.height);

	board.render(context2d);

	var players = engine.getPlayers();
	var keys = Object.keys(players);
	keys.forEach(function (key) {
	    var pos = players[key].getPosition();
	    context2d.fillStyle = "green";
	    context2d.fillRect(pos.x * tileSize, pos.y * tileSize, tileSize, tileSize);
	});
    }

    document.addEventListener("keydown", function (e) {
	inputHandler.pressKey(e.keyCode);
    });

    document.addEventListener("keyup", function (e) {
	inputHandler.releaseKey(e.keyCode);
    });
});