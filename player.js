define([], function () {
	function Player(x, y) {
		this.moveTicksLeft = 0;
		this.targetPosition;
		this.speed = {x: 0, y: 0};
		this.position = {x: x, y: y};
	};

	Player.prototype.moveToPosition = function (targetPosition, speed, ticks) {
		this.moveTicksLeft = ticks;
		this.targetPosition = targetPosition;
		this.speed = speed;
	};

	Player.prototype.update = function () {
		if(this.moveTicksLeft > 0) {
			this.position.x += this.speed.x;
			this.position.y += this.speed.y;
			this.moveTicksLeft--;
			if(this.moveTicksLeft <= 0) {
				this.position = this.targetPosition;
				this.targetPosition = undefined;
				this.speed = {x: 0, y: 0};
			}
		}
	};

	Player.prototype.getPosition = function () {
		return this.position;
	};

	Player.prototype.getSpeed = function () {
		return this.speed;
	};

	Player.prototype.isMoving = function () {
		return this.speed.x !== 0 || this.speed.y !== 0;
	};
	
	return Player;
});