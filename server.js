var requirejs = require("requirejs");

requirejs.config({
	nodeRequire: require
});

requirejs(['express', 'socket.io'], function (express, socketio) {
	var BOARD_SIZE = 10;
	var board = new Array();
	for(var i = 0; i < BOARD_SIZE; i++) {
		board[i] = new Array();
		for(var j = 0; j < BOARD_SIZE; j++) {
			board[i][j] = new Array();
			for(var k = 0; k < 6; k++) {
				board[i][j][k] = 0;
			}
			if(i === 0 || i === BOARD_SIZE - 1 || j === 0 || j === BOARD_SIZE - 1) {
				board[i][j][0] = 1;
			}
		}
	}
		
	var server = express.createServer();
	server.use(express.static(__dirname));

	var io = socketio.listen(server);

	io.sockets.on("connection", function (socket) {
		socket.player = {i: 4, j: 4};
		board[4][4][4]++;
		socket.emit("board", board);
		socket.emit("moveleft", {i: 4, j: 4, time: 2000});
	});

	server.listen(8080);
});