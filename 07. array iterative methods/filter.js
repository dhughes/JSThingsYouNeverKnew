

// create a random 100 element array of numbers between 0 and 100
var arr1 = [];

while(arr1.length < 100){
	arr1.push(Math.round(Math.random() * 100));
}

// log the array we created
console.log(arr1);

// now filter this array for odd numbers
var oddArr = arr1.filter(function(value, index, arr){
	// is this number odd?
	return (value % 2 !== 0);
});

console.log(oddArr);