

Prime = function(callback){
	var candidate = 0;

	this.findNextPrime = function(){
		while(true){
			// increment the candidate
			candidate++;
			
			if(isPrime(candidate)){
				if(callback) callback(candidate);
				return candidate;		
			}
		}
	}

	var isPrime = function(n){
		if(n == 1) return true;

		for(var x = 2 ; x < n ; x++){
			if(n % x === 0){
				return false;
			}
		}

		return true;
	}

}
