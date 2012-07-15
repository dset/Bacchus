var socket = io.connect("http://localhost:8080");
var canvas = document.getElementById("canvas");
var context2d = canvas.getContext("2d");
var board;
socket.on("board", function (boardData) {
	board = boardData;
});

socket.on("moveleft", function (data) {
	setTimeout(function () {
		board[data.i][data.j][4]--;
		board[data.i-1][data.j][4]++;
	}, data.time);
});

function draw() {
	window.webkitRequestAnimationFrame(draw);

	context2d.clearRect(0, 0, canvas.width, canvas.height);
	tilesize = canvas.width / board.length;
	for(var i = 0; i < board.length; i++) {
		for(var j = 0; j < board[i].length; j++) {
			for(var k = 0; k < board[i][j].length; k++) {
				switch(k) {
				case 0:
					context2d.fillStyle = "black";
					if(board[i][j][k] === 0) {
						context2d.strokeRect(i * tilesize, j * tilesize, tilesize, tilesize);
					} else if(board[i][j][k] === 1) {
						context2d.fillRect(i * tilesize, j * tilesize, tilesize, tilesize);
					}
					break;
				case 4:
					context2d.fillStyle = "blue";
					if(board[i][j][k] !== 0) {
						context2d.fillRect(i * tilesize, j * tilesize, tilesize, tilesize);
					}
					break;
				}
			}
		}
	}
}

window.webkitRequestAnimationFrame(draw);