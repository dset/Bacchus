define([], function () {

    function Engine(tickTime, render, handleKeyPresses) {
	this.tickTime = tickTime;
	this.render = render;
	this.handleKeyPresses = handleKeyPresses;
	this.players = {};
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
    }

    Engine.prototype.addPlayer = function (id, player) {
	this.players[id] = player;
    }

    Engine.prototype.removePlayer = function (id) {
	delete this.players[id];
    }

    Engine.prototype.getPlayer = function (id) {
	return this.players[id];
    }

    Engine.prototype.getPlayers = function () {
	return this.players;
    }

    return Engine;
});