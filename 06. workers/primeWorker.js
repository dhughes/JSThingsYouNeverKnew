// this is how you load scripts the worker depends on
importScripts("prime.js");

var timeoutId;

// this is my prime finder
var primeFinder = new Prime(function(prime){
	// call back to the main thread with the new prime
	self.postMessage(JSON.stringify({function: "foundPrime", arguments:Array.prototype.slice.call(arguments)}));
	
	// start another timer to find the next prime
	timeoutId = setTimeout(primeFinder.findNextPrime, 0);
});

// this function is what handles the message event in the worker
self.addEventListener('message', function(e) {
	// our message is a string and we passed in JSON data to specify the method and argument values
	var message = JSON.parse(e.data);
	
	// I'm using apply to call specific functions with arguments specified in the JSON message
	self[message.function].apply(self, message.arguments);
});

// starts the prime finder
self.start = function(){
	// because I'm using a timer to enqueue this action on the Event Queue
	// this will allow JavaScript to also handle other events and not block
	// the worker's thread.  IE: I can stop this too
	timeoutId = setTimeout(primeFinder.findNextPrime, 0);
}

self.stop = function(){
	// stops timers, thereby stopping the prime finder
	clearTimeout(timeoutId);
}

self.log = function(message){
	self.postMessage(JSON.stringify({function: "log", arguments:Array.prototype.slice.call(arguments)}));
};
