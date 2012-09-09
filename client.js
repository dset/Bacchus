require(['player', 'engine', 'gametypes', 'wall', 'board', 'bomb', 'inputhandler'], function (Player, Engine, gametypes, Wall, Board, Bomb, InputHandler) {

    var socket = io.connect("http://localhost:8080");
    var canvas = document.getElementById("canvas");
    var context2d = canvas.getContext("2d");
    var inputHandler = new InputHandler();
    var engine;
    var board;
    var tickTime;

    socket.on("gameinfo", function (gameInfo) {
        board = new Board(1,1);
        board.buildFromSerializedVersion(gameInfo.board);
        engine = new Engine(gameInfo.tickTime, board, draw, inputHandler.update.bind(inputHandler));
        engine.start();

        inputHandler.addKeyBinding(65, function () {
            var player = engine.getPlayer(socket.socket.sessionid);
            var pos = player.getPosition();
            if( ! isPlayerMoving() && board.isTileWalkable(pos.x - 1, pos.y)) {
                engine.movePlayerLeft(socket.socket.sessionid);
                socket.emit("moveleft");
            }
        });

        inputHandler.addKeyBinding(68, function () {
            var player = engine.getPlayer(socket.socket.sessionid);
            var pos = player.getPosition();
            if( ! isPlayerMoving() && board.isTileWalkable(pos.x + 1, pos.y)) {
                engine.movePlayerRight(socket.socket.sessionid);
                socket.emit("moveright");
            }
        });

        inputHandler.addKeyBinding(83, function () {
            var player = engine.getPlayer(socket.socket.sessionid);
            var pos = player.getPosition();
            if( ! isPlayerMoving() && board.isTileWalkable(pos.x, pos.y + 1)) {
                engine.movePlayerDown(socket.socket.sessionid);
                socket.emit("movedown");
            }
        });

        inputHandler.addKeyBinding(87, function () {
            var player = engine.getPlayer(socket.socket.sessionid);
            var pos = player.getPosition();
            if( ! isPlayerMoving() && board.isTileWalkable(pos.x, pos.y - 1)) {
                engine.movePlayerUp(socket.socket.sessionid);
                socket.emit("moveup");
            }
        });

        function isPlayerMoving() {
            var player = engine.getPlayer(socket.socket.sessionid);
            return player && player.isMoving();
        }

        inputHandler.addKeyBinding(32, function () {
            socket.emit("placebomb");
        });
    });

    socket.on("newplayer", function (data) {
        engine.createPlayer(data.id, data.x, data.y);
    });

    socket.on("removeplayer", function (data) {
        engine.removePlayer(data.id);
    });

    socket.on("moveplayerleft", function (data) {
        engine.movePlayerLeft(data.id);
    });

    socket.on("moveplayerright", function (data) {
        engine.movePlayerRight(data.id);
    });

    socket.on("moveplayerup", function (data) {
        engine.movePlayerUp(data.id);
    });

    socket.on("moveplayerdown", function (data) {
        engine.movePlayerDown(data.id);
    });

    socket.on("moveplayerto", function (data) {
        engine.getPlayer(data.id).jumpTo(data.x, data.y);
    });

    socket.on("placebomb", function (data) {
        var player = engine.getPlayer(data.id);
        if(player.runningCommand && player.commandQueue.length > 0) {
            player.runningCommand.fastForward();
            player.runningCommand = undefined;
        }
        while(player.commandQueue.length > 1) {
            player.commandQueue.shift().fastForward();
        }
        player.placeBombAt(data.x, data.y);
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