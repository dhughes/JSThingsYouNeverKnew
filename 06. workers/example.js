
function loaded(){
	var primes = document.getElementById("primes");
	
	var handler = {
		log: function(message){
			console.log(message);
		},
		
		foundPrime: function(prime){
			primes.value += prime + ", ";
		}
	};
	
	// create our worker
	var worker = new Worker('./primeWorker.js');

	// listen for messages from the worker
	worker.addEventListener("message", function(event){
		var message = JSON.parse(event.data);
		
		handler[message.function].apply(handler, message.arguments);

	});
	
	// start the worker
	document.getElementById("start").addEventListener("click", function(){
		// you can only pass strings as messages so I'm encoding some data as JSON
		worker.postMessage(JSON.stringify({function: "start"}));
	});
	
	// stop the worker
	document.getElementById("stop").addEventListener("click", function(){
		// you can only pass strings as messages so I'm encoding some data as JSON
		worker.postMessage(JSON.stringify({function: "stop"}));
	});
	
	/********************************************************
	 * Below is stuff related to the red draggable box. 
	 * I totally stole this code from http://stackoverflow.com/a/9334106/1481415 *
	 ********************************************************/
	document.getElementById('drag').addEventListener('mousedown', mouseDown, false);
	window.addEventListener('mouseup', mouseUp, false);
	offset = {};
	
	function divMove(e){
		var div = document.getElementById('drag');
		div.style.position = 'absolute';
		div.style.top = (e.clientY - offset.y) + 'px';
		div.style.left = (e.clientX - offset.x) + 'px';
		window.getSelection().removeAllRanges();
	}
	
	function mouseUp(){
		window.removeEventListener('mousemove', divMove, true);
	}

	function mouseDown(e){
		offset.x = e.offsetX;
		offset.y = e.offsetY;
		
		window.addEventListener('mousemove', divMove, true);
	}

};

