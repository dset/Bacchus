define([], function () {
	function ExplosionFragment(board, x, y) {
		this.board = board;
		this.x = x;
		this.y = y;
		setTimeout(this.remove.bind(this), 900);
	}

	ExplosionFragment.prototype.remove = function () {
		this.board.setTile(this.x, this.y, null);
	};

	ExplosionFragment.prototype.render = function (context2d, position, tileSize) {
		context2d.fillStyle = "yellow";
		context2d.fillRect(position.x * tileSize, position.y * tileSize, tileSize, tileSize);
	};

	return ExplosionFragment;
});