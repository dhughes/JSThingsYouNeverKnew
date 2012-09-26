// value = A, 2, 3 .... 10, J, Q, K
// suit = clubs, diamonds, hearts, spades
// visible = true/false (can I see it's face or is it turned down?)
Card = function(value, suit, numericValue, color, faceUp){
	var me = this;

	var value = value || null;
	var suit = suit || null;
	var numericValue = numericValue || null;
	var color = color || null;
	var faceUp = faceUp || false;

	me.clone = function(){
		return new Card().setState(value, suit, numericValue, color, faceUp);
	}

	me.setState = function(_value, _suit, _numericValue, _color, _faceUp){
		value = _value;
		suit = _suit;
		numericValue = _numericValue;
		color = _color;
		faceUp = _faceUp;
		return this;
	}

	// flips the card over to make it visible
	me.setFaceUp = function(_faceUp){
		faceUp = _faceUp;
	}

	me.getFaceUp = function(){
		return faceUp;
	}

	me.getValue = function(){
		return value;
	}

	me.getSuit = function(){
		return suit;
	}

	me.getSymbol = function(){
		switch(suit){
			case "hearts":
				return "H";
			case "diamonds":
				return "D";
			case "spades":
				return "S";
			case "clubs":
				return "C";
		}
	}

	me.getNumericValue = function(){
		return numericValue;
	}

	me.getColor = function(){
		return color;
	}

	me.toString = function(format){
		var str =  "";
		
		if(!faceUp){
			str += "(";
		}

		str += value + me.getSymbol();

		if(!faceUp){
			str += ")";
		}
		
		return str;
	}

}

