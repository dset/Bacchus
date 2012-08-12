define([], function () {
    var players = {};

    function start(tickTime, render, handleKeyPresses) {
	setInterval(function () {
	    tick(render, handleKeyPresses);
	}, tickTime);
    };
    
    function tick(render, handleKeyPresses) {
	var playerKeys = Object.keys(players);
	playerKeys.forEach(function (key) {
	    players[key].update();
	});

	handleKeyPresses();
	render();
    }

    function addPlayer(id, player) {
	players[id] = player;
    }

    function removePlayer(id) {
	delete players[id];
    }

    function getPlayer(id) {
	return players[id];
    }

    function getPlayers() {
	return players;
    }


    return {start: start,
	    addPlayer: addPlayer,
	    getPlayers: getPlayers,
	    getPlayer: getPlayer,
	    removePlayer: removePlayer
	   };
});