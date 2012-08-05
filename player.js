define(['explosionfragment', 'observable'], function (ExplosionFragment, Observable) {
    function Player(x, y, board) {
	this.moveTicksLeft = 0;
	this.targetPosition;
	this.speed = {x: 0, y: 0};
	this.position = {x: x, y: y};
	this.board = board;
	this.observers = {};
    };

    Player.prototype = new Observable();

    Player.prototype.moveToPosition = function (targetPosition, speed, ticks) {
	this.moveTicksLeft = ticks;
	this.targetPosition = targetPosition;
	this.speed = speed;
    };

    Player.prototype.update = function () {
	if(this.moveTicksLeft > 0) {
	    this.position.x += this.speed.x;
	    this.position.y += this.speed.y;
	    this.moveTicksLeft--;
	    if(this.moveTicksLeft <= 0) {
		this.position = this.targetPosition;
		this.targetPosition = undefined;
		this.speed = {x: 0, y: 0};
	    }
	}

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

    Player.prototype.getSpeed = function () {
	return this.speed;
    };

    Player.prototype.isMoving = function () {
	return this.speed.x !== 0 || this.speed.y !== 0;
    };
    
    return Player;
});