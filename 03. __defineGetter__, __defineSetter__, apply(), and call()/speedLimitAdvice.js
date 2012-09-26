
/* this proxy logs functions called */

SpeedLimitAdvice = function(proxy, proxiedObject, targetFunction){
	// creating a new Proxy actually returns the function we call as the proxy
	return function(){
		// arguments is not a real array object so we need to convert it to one 
		var args = Array.prototype.slice.call(arguments);

		// let's put a few limits in this
		if(args[0] > 50 && targetFunction == "accelerate"){
			console.log("Go easy on the gas, my friend!");
			args[0] = 50 
		}
		if(args[0] > 20 && targetFunction    == "decelerate"){
			console.log("Dude, breaks are expensive!");
			args[0] = 20
		}
		
		// call the function
		return proxy[targetFunction].apply(proxiedObject, args);

	}
}