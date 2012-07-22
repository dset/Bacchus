define([], function () {
	var players = {};

	function start(tickTime, render) {
		setInterval(function () {
			tick(render);
		}, tickTime);
	};
		
	function tick(render) {
		var playerKeys = Object.keys(players);
		playerKeys.forEach(function (key) {
			players[key].update();
		});

		render();
	}

	function addPlayer(id, player) {
		players[id] = player;
	}

	function getPlayers() {
		return players;
	}


	return {start: start, addPlayer: addPlayer, getPlayers: getPlayers};
});