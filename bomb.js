define(['explosionfragment', 'observable'], function (ExplosionFragment, Observable) {
    function Bomb(board, x, y, timeout) {
	this.board = board;
	this.x = x;
	this.y = y;
	this.observers = {};
	this.timeout = timeout;
    }

    Bomb.prototype = new Observable();

    Bomb.prototype.startTicking = function () {
	this.timeoutId = setTimeout(this._timesUp.bind(this), this.timeout);
    };

    Bomb.prototype.render = function (context2d, position, tileSize) {
	context2d.fillStyle = "red";
	context2d.fillRect(position.x * tileSize, position.y * tileSize, tileSize, tileSize);
    };

    Bomb.prototype._timesUp = function () {
	this.notify("explosion");
	this.explode();
    }

    Bomb.prototype.explode = function () {
	clearTimeout(this.timeoutId);
	this.board.setTile(this.x, this.y, null);
	placeExplosionFragment(this.board, this.x, this.y - 1);
	placeExplosionFragment(this.board, this.x - 1, this.y);
	placeExplosionFragment(this.board, this.x, this.y);
	placeExplosionFragment(this.board, this.x + 1, this.y);
	placeExplosionFragment(this.board, this.x, this.y + 1);
    };

    function placeExplosionFragment(board, x, y) {
	if(board.getTileObjectAt(x, y) instanceof Bomb) {
	    board.getTileObjectAt(x, y).explode();
	} else {
	    board.setExplosionFragmentAt(x, y);
	}
    }

    Bomb.prototype.getPosition = function () {
	return {x: this.x, y: this.y};
    };

    return Bomb;
});