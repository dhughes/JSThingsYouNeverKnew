

Deck = function(shuffleTimes){
	var me = this;

	var suits = ["hearts", "diamonds", "clubs", "spades"];
	var values = ["A", 2, 3, 4, 5, 6, 7, 8, 9, 10, "J", "Q", "K"];

	// load up the deck with cards
	var cards = [];

	// loop over our suits
	for(var s = 0; s < suits.length ; s++){
		// loop over the card values
		for(var v = 0 ; v < values.length ; v++){
			cards.push(new Card(values[v], suits[s], v, (s < 2 ? "red":"black"), Math.round(Math.random())));
		}
	}
	
	me.__defineGetter__("cards", function(){
		return cards;
	})
	
	me.toString = function(){
		return cards.toString();
	}

	me.dump = function(){
		for(var i = 0 ; i < cards.length ; i++){
			log(i + ": " + cards[i].toString());
		}
	}

	me.drawTop = function(faceUp){
		if(faceUp == undefined){
			faceUp = false;
		}

		var card = cards.pop();
		card.setFaceUp(faceUp);

		return card;
	}

	me.rest = function(){
		var rest = cards;
		cards = [];
		return rest;
	}

	me.count = function(){
		return cards.length;
	}

	me.shuffle = function(times){

		times = times ? times : 1;

		for(var i = 0 ; i < times ; i++){
			cards.sort(function(){
				return Math.round(Math.random() * 2) - 1;
			});
		}
	}

	if(shuffleTimes != undefined){
		me.shuffle(shuffleTimes);
	}

}