

// create a random 10 element array with no repeating numbers between 0 and 20
var arr1 = [];

while(arr1.length < 10){
	var num = Math.round(Math.random() * 20);

	// loop over the array and confirm none of the elements are already set to num 
	if(arr1.every(function(value, index, arr){
		return value !== num;
	})){
		// this number did not exist in the array
		console.log("Adding " + num + " to array");
		arr1.push(num);
	} else {
		// this number did exist in the array
		console.log("Array already contained " + num);
	};
}

console.log(arr1);