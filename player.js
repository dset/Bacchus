define(['explosionfragment', 'observable', 'bomb', 'movecommand'], function (ExplosionFragment, Observable, Bomb, MoveCommand) {
    function Player(x, y, board) {
	this.position = {x: x, y: y};
	this.board = board;
	this.observers = {};
	this.commandQueue = [];
	this.runningCommand = undefined;
    };

    Player.prototype = new Observable();

    Player.prototype.jumpTo = function (x, y) {
	this.position.x = x;
	this.position.y = y;
    };

    Player.prototype.placeBomb = function () {
	var x = Math.round(this.position.x);
	var y = Math.round(this.position.y);
	if(this.board.canPlaceBombAt(x, y)) {
	    var bomb = new Bomb(this.board, x, y, 3000);
	    this.board.setTile(x, y, bomb);
	    return bomb;
	}
    };

    Player.prototype.pushCommand = function (command) {
	if( ! this.runningCommand && this.commandQueue.length === 0) {
	    this.runningCommand = command;
	    this._initRunningCommand();
	} else {
	    this.commandQueue.push(command);
	}
    };


    Player.prototype.update = function () {
	this.runCommand();
	this.deathDetection();
    };

    Player.prototype.runCommand = function () {
	if(!this.runningCommand && this.commandQueue.length > 0) {
	    this.runningCommand = this.commandQueue.shift();
	    this._initRunningCommand();
	}

	if(this.runningCommand) {
	    var finished = this.runningCommand.execute();
	    if(finished) {
		this.runningCommand = undefined;
	    }
	}
    };

    Player.prototype._initRunningCommand = function () {
	if( ! this.runningCommand.init()) {
	    this.notify("invalidcommand", this.runningCommand.identifier);
	    this.runningCommand = undefined;
	}
    };


    Player.prototype.deathDetection = function () {
	var pos = this.position;
	var tile1 = this.board.getTileObjectAt(Math.floor(pos.x), Math.floor(pos.y));
	var tile2 = this.board.getTileObjectAt(Math.ceil(pos.x), Math.floor(pos.y));
	var tile3 = this.board.getTileObjectAt(Math.floor(pos.x), Math.ceil(pos.y));
	var tile4 = this.board.getTileObjectAt(Math.ceil(pos.x), Math.ceil(pos.y));
	if(tile1 instanceof ExplosionFragment || tile2 instanceof ExplosionFragment ||
	   tile3 instanceof ExplosionFragment || tile4 instanceof ExplosionFragment) {
	    //Kill player
	    this.notify("dead");
	}
    };


    Player.prototype.getPosition = function () {
	return this.position;
    };

    Player.prototype.isMoving = function () {
	return this.runningCommand instanceof MoveCommand;
    };
    
    return Player;
});