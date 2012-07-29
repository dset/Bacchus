define([], function () {
	function Bomb(board, x, y) {
		this.board = board;
		this.x = x;
		this.y = y;
	}

	Bomb.prototype.render = function (context2d, position, tileSize) {
		context2d.fillStyle = "red";
		context2d.fillRect(position.x * tileSize, position.y * tileSize, tileSize, tileSize);
	};

	Bomb.prototype.explode = function () {
		this.board.setTile(this.x, this.y, null);
	};

	Bomb.prototype.getPosition = function () {
		return {x: this.x, y: this.y};
	};

	return Bomb;
});