define(['player'], function (Player) {

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

    /// Returns true if player moved, false if player was blocked, and undefined
    /// if the player did not exist.
    Engine.prototype._movePlayer = function (id, dx, dy) {
	var player = this.getPlayer(id);
	if( ! player) {
	    return;
	}

	var pos = player.getPosition();
	if(player.isMoving() || !this.board.isTileWalkable(pos.x + dx, pos.y + dy)) {
	    return false;
	}
	
	var targetPosition = {x: pos.x+dx, y: pos.y+dy};
	var ticks = 400 / this.tickTime;
	var speed = {x: dx / ticks, y: dy / ticks};
	player.moveToPosition(targetPosition, speed, ticks);
	return true;
    }

    Engine.prototype.createPlayer = function (id, x, y) {
	var player = new Player(x, y, this.board);
	this.addPlayer(id, player);
	return player;
    };


    return Engine;
});