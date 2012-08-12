define([], function () {
    function InputHandler() {
	this.keyBindings = {};
	this.pressed = [];
    }

    InputHandler.prototype.addKeyBinding = function (key, listener) {
	this.keyBindings[key] = listener;
    };

    InputHandler.prototype.pressKey = function (key) {
	if(this.pressed.indexOf(key) < 0) {
	    this.pressed.push(key);
	}
    };

    InputHandler.prototype.releaseKey = function (key) {
	this.pressed.splice(this.pressed.indexOf(key), 1);
    };

    InputHandler.prototype.update = function () {
	this.pressed.forEach(function (key) {
	    var listener = this.keyBindings[key];
	    if(listener) {
		listener();
	    }
	}, this);
    };

    return InputHandler;
});