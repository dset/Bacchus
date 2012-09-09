define(['gametypes'], function (types) {
    function MoveCommand(dx, dy, ticks, player, isTileWalkable) {
        this.dx = dx;
        this.dy = dy;
        this.ticks = ticks;
        this.speedX = dx / ticks;
        this.speedY = dy / ticks;
        this.player = player;
        this.isTileWalkable = isTileWalkable;
        this.identifier = types.MOVE_COMMAND;
    }

    MoveCommand.prototype.init = function () {
        this.targetX = this.player.position.x + this.dx;
        this.targetY = this.player.position.y + this.dy;

        if(this.isTileWalkable(this.targetX, this.targetY)) {
            return true;
        } else {
            return false;
        }
    };

    MoveCommand.prototype.execute = function () {
        if(this.ticks > 0) {
            this.player.position.x += this.speedX;
            this.player.position.y += this.speedY;
            this.ticks--;
            if(this.ticks <= 0) {
                this.player.position.x = this.targetX;
                this.player.position.y = this.targetY;
                return true;
            }
        }
        return false;
    };

    MoveCommand.prototype.fastForward = function () {
        if(this.targetX === undefined) {
            this.targetX = this.player.position.x + this.dx;
            this.targetY = this.player.position.y + this.dy;
        }
        this.player.position.x = this.targetX;
        this.player.position.y = this.targetY;
    };


    return MoveCommand;
});