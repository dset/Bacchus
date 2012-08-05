define(['explosionfragment'], function (ExplosionFragment) {
    function Bomb(board, x, y) {
	this.board = board;
	this.x = x;
	this.y = y;
	this.hasExploded = false;
    }

    Bomb.prototype.render = function (context2d, position, tileSize) {
	context2d.fillStyle = "red";
	context2d.fillRect(position.x * tileSize, position.y * tileSize, tileSize, tileSize);
    };

    Bomb.prototype.explode = function () {
	if(this.hasExploded) {
	    return;
	}

	this.hasExploded = true;
	this.board.setTile(this.x, this.y, null);
	var bombs = new Array();
	bombs.push(placeExplosionFragment(this.board, this.x, this.y - 1));
	bombs.push(placeExplosionFragment(this.board, this.x - 1, this.y));
	bombs.push(placeExplosionFragment(this.board, this.x, this.y));
	bombs.push(placeExplosionFragment(this.board, this.x + 1, this.y));
	bombs.push(placeExplosionFragment(this.board, this.x, this.y + 1));
	return bombs.filter(function (bomb) {
	    return bomb !== undefined;
	});
    };

    function placeExplosionFragment(board, x, y) {
	if(board.getTileObjectAt(x, y) instanceof Bomb) {
	    return board.getTileObjectAt(x, y);
	} else {
	    board.setTile(x, y, new ExplosionFragment(board, x, y));
	}
    }

    Bomb.prototype.getPosition = function () {
	return {x: this.x, y: this.y};
    };

    return Bomb;
});