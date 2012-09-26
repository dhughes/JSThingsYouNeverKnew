
/* define a Car object */
Car = function(){
	var _speed = 0;
	
	this.__defineGetter__("speed", function(){
		return _speed;
	});
	
	this.__defineSetter__("speed", function(speed){
		_speed = speed;
	});
};

Car.prototype.accelerate = function(amount){
	return this.speed += amount;
}

Car.prototype.decelerate = function(amount){
	return this.speed -= +amount;
}

Car.prototype.stop = function(){
	this.speed = 0;
}

