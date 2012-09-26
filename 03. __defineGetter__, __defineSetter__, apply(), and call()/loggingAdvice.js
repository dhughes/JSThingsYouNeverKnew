
/* this logs functions called */

LoggingAdvice = function(proxy, proxiedObject, targetFunction){
	// creating a new instance of this object actually returns the function we call as the proxy
	return function(){
		// arguments is not a real array object so we need to convert it to one
		// this is an example of the call() function calling slice on the array prototype
		var args = Array.prototype.slice.call(arguments);

		// note that we're calling this function
		console.log("** Calling function " + targetFunction + " with arguments [" + args.toString() + "]. ** ");

		// call the function via apply().
		// note that the proxy can proxy any function so we don't know ahead of time how many arguments will be provided
		var result = proxy[targetFunction].apply(proxiedObject, args);

		// return the result, if any
		if(result){
			console.log("** Returning result " + result + " from " + targetFunction + " **");
			return result;
		} else {
			console.log("** " + targetFunction + " did not return a result **");
		}

	}
}