// This time let's define a human object.  
Human = function(){};

// Let's give the human object's prototype an age function
Human.prototype.age = function(){
	return Math.round(Math.random() * 10);
}

// Create two instances of human. They share the same instance of the human function
collin = new Human();
audrey = new Human();

// proof the age function works....
console.log("Collin is: " + collin.age());
console.log("Audrey is: " + audrey.age());

// now let's change the human prototype function
Human.prototype.age = function(){
	return "None of your beeswax!";
}

// both human objects are updated
console.log("Collin is: " + collin.age());
console.log("Audrey is: " + audrey.age());