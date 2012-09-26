
function loaded(){
	var primes = document.getElementById("primes");
	
	var timeoutId;
	var primeFinder = new Prime(function(prime){
		primes.value += prime + ", ";
	});
	
	document.getElementById("start").addEventListener("click", function(){
		// start finding primes
		while(true){
			primeFinder.findNextPrime();
		}
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

