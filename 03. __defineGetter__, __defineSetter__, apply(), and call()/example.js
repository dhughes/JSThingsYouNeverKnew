
car = new Car();
// new Proxy(car, LoggingAdvice);
// new Proxy(car, SpeedLimitAdvice);

car.accelerate(60);
console.log(car.speed);

car.decelerate(40);
console.log(car.speed);

car.stop();
console.log(car.speed);

