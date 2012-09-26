/* create a generic overly simplified proxy object */
Proxy = function(obj, advice){
	// return the proxied object
	return this.applyProxy(obj, advice);
}

Proxy.prototype.applyProxy = function(obj, advice, root){
	if(root == undefined){
		root = obj;
	}
	// returns an array of keys
	var objKeys = Object.keys(obj);

	// replace each of the functions with a proxied function
	for(var i = 0 ; i < objKeys.length ; i++){
		if(typeof(obj[objKeys[i]]) == "function"){
			// I'm creating a proxy object so I can associate the name and target with the proxied function
			this[objKeys[i]] = obj[objKeys[i]];
			// replace the function with a proxy function that has a reference
			// to the proxy, the proxied object, and the name of the function to call
			obj[objKeys[i]] = new advice(this, root, objKeys[i]);
		}
	}
	
	// proxy the object's prototype too 
	if(obj.__proto__){
		obj.__proto__ = this.applyProxy(obj.__proto__, advice, root);
	}
	
	return obj;
}