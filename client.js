require(['player', 'engine', 'gametypes', 'wall', 'board'], function (Player, engine, gametypes, Wall, Board) {
	var socket = io.connect("http://localhost:8080");
	var canvas = document.getElementById("canvas");
	var context2d = canvas.getContext("2d");
	var board;
	var tickTime;
	socket.on("gameinfo", function (gameInfo) {
		board = new Board(1, 1);
		board.buildFromSerializedVersion(gameInfo.board);
		engine.start(gameInfo.tickTime, draw);
	});

	socket.on("newplayer", function (playerData) {
		engine.addPlayer(playerData.id, new Player(playerData.x, playerData.y));
	});

	socket.on("moveplayer", function (moveData) {
		var players = engine.getPlayers();
		players[moveData.id].moveToPosition(moveData.targetPosition, moveData.speed,
											moveData.ticks);
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
		switch(e.keyCode) {
		case 65:
			socket.emit("moveleft");
			break;
		case 68:
			socket.emit("moveright");
			break;
		case 83:
			socket.emit("movedown");
			break;
		case 87:
			socket.emit("moveup");
			break;
		}
	});
});