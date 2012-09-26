
// added a convenience method to Array to get the last element
Array.prototype.__defineGetter__("last", function(){
	return this[this.length-1];
});

// this is a deck of cards
var deck = new Deck(10); // create a new deck of cards and shuffle it 10 times

// this is the deck output as a stringified array
console.log(deck.toString());


/***********************************************
 * get the number of face-up cards 
 ***********************************************/
var faceUpCards = deck.cards.reduce(function(previousValue, currentValue, index, array){
	// note the use of the + operator to convert a boolean into 1 or 0
	return previousValue += +currentValue.getFaceUp();	
}, 0);

console.log("There are " + faceUpCards + " face up cards.");

/***********************************************
 * get the cards in the hearts suit
 ***********************************************/
var heartsCards = deck.cards.reduce(function(previousValue, currentValue, index, array){
	
	if(currentValue.getSuit() === "hearts"){
		previousValue.push(currentValue);
	}
	
	return previousValue;
}, []);

console.log("These are the cards in the hearts suit: " + heartsCards.toString());

/***********************************************
 * group cards by strings of suits.
 ***********************************************/
var suitStrings = deck.cards.reduce(function(previousValue, currentValue, index, array){
	
	if(previousValue.last && previousValue.last.last.getSuit() === currentValue.getSuit()){
		// append this to the current last array
		previousValue.last.push(currentValue);
	} else {
		previousValue.push([currentValue]);
	}
	
	return previousValue;
}, []); // previous value is a 2d array.  each element in the array is an array of cards which are all in the same suit

// log the contents of each array
for(var suitString in suitStrings){
	console.log(suitStrings[suitString].toString());
}