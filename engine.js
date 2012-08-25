define(['player', 'movecommand'], function (Player, MoveCommand) {

    function Engine(tickTime, board, render, handleKeyPresses) {
	this.tickTime = tickTime;
	this.render = render;
	this.handleKeyPresses = handleKeyPresses;
	this.players = {};
	this.board = board;
    }
    
    Engine.prototype.start = function () {
	var self = this;
	setInterval(function () {
	    self.tick();
	}, this.tickTime);
    };
    
    Engine.prototype.tick = function () {
	var playerKeys = Object.keys(this.players);
	playerKeys.forEach(function (key) {
	    this.players[key].update();
	}, this);

	this.handleKeyPresses();
	this.render();
    };

    Engine.prototype.addPlayer = function (id, player) {
	this.players[id] = player;
    };

    Engine.prototype.removePlayer = function (id) {
	delete this.players[id];
    };

    Engine.prototype.getPlayer = function (id) {
	return this.players[id];
    };

    Engine.prototype.getPlayers = function () {
	return this.players;
    };

    Engine.prototype.getSerializedBoard = function () {
	return this.board.getSerializedVersion();
    };

    Engine.prototype.movePlayerLeft = function (id) {
	return this._movePlayer(id, -1, 0);
    };

    Engine.prototype.movePlayerRight = function (id) {
	return this._movePlayer(id, 1, 0);
    };

    Engine.prototype.movePlayerUp = function (id) {
	return this._movePlayer(id, 0, -1);
    };

    Engine.prototype.movePlayerDown = function (id) {
	return this._movePlayer(id, 0, 1);
    };

    Engine.prototype._movePlayer = function (id, dx, dy) {
	var player = this.getPlayer(id);
	if( ! player) {
	    return;
	}

	var ticks = 400 / this.tickTime;
	var command = new MoveCommand(dx, dy, ticks, player,
				      this.board.isTileWalkable.bind(this.board));
	player.pushCommand(command);
	return true;
    }

    Engine.prototype.createPlayer = function (id, x, y) {
	var player = new Player(x, y, this.board);
	this.addPlayer(id, player);
	return player;
    };


    return Engine;
});