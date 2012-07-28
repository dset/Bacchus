define(['wall', 'gametypes'], function (Wall, gametypes) {
	function Board(width, height) {
		this.board = new Array(width);
		
		for(var i = 0; i < this.board.length; i++) {
			this.board[i] = new Array(height);
		}
		for(var i = 0; i < this.board[0].length; i++) {
			this.board[0][i] = new Wall();
 			this.board[this.board.length-1][i] = new Wall();
		}
		for(var i = 0; i < this.board.length; i++) {
			this.board[i][0] = new Wall();
 			this.board[i][this.board[0].length-1] = new Wall();
		}
	}

	Board.prototype.getSerializedVersion = function () {
		var serializedBoard = new Array(this.board.length);
		for(var i = 0; i < this.board.length; i++) {
			serializedBoard[i] = new Array(this.board[i].length);
			for(var j = 0; j < this.board[0].length; j++) {
				if(this.board[i][j] instanceof Wall)
					serializedBoard[i][j] = gametypes.WALL;
			}
		}

		return serializedBoard;
	};

	Board.prototype.buildFromSerializedVersion = function (serializedBoard) {
		this.board = new Array(serializedBoard.length);
		
		for(var i = 0; i < this.board.length; i++) {
			this.board[i] = new Array(serializedBoard[i].length);
		}

		for(var i = 0; i < serializedBoard.length; i++) {
			for(var j = 0; j < serializedBoard[0].length; j++) {
				if(serializedBoard[i][j] === gametypes.WALL)
					this.board[i][j] = new Wall();
			}
		}
	};

	Board.prototype.isTileWalkable = function (x, y) {
		return !(this.board[x][y] instanceof Wall);
	};

	return Board;
});