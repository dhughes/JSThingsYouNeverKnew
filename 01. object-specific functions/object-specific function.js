// Define a person object with its own age function
Person = function(){
	this.age = function(){
		return Math.round(Math.random() * 100);
	}
}

// Create two instances of Person. Each gets its own instance of the age function
liz = new Person();
doug = new Person();

// We can change the age function on one instance and the other is not changed
liz.age = function(){
	return "You should know better than to ask a lady her age!";
}

// proof!!
console.log("Doug is: " + doug.age());
console.log("Liz is: " + liz.age());