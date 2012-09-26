

// create a random 100 element array of numbers between 0 and 25
var arr1 = [];

while(arr1.length < 100){
	arr1.push(Math.round(Math.random() * 25));
}

// log the array we created
console.log(arr1);

// now create a new array of chars where a = 0 and z = 25 based on the first array
var charArr = arr1.map(function(value, index, arr){
	// is this number odd?
	return String.fromCharCode(value+65);
});

console.log(charArr);