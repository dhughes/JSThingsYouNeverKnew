

// create a random 100 element array of numbers between 0 and 25
var arr1 = [];

while(arr1.length < 100){
	arr1.push(Math.round(Math.random() * 25));
}

// log the array we created
console.log(arr1);

// now just loop over the array and output the charcode to the console
arr1.forEach(function(value, index, arr){
	// is this number odd?
	console.log(String.fromCharCode(value+65));
});
