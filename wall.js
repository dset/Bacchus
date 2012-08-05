define([], function () {

    function Wall() {
	
    }

    Wall.prototype.render = function (context2d, position, tileSize) {
	context2d.fillStyle = "black";
	context2d.fillRect(position.x * tileSize, position.y * tileSize, tileSize, tileSize);
    };

    return Wall;
});