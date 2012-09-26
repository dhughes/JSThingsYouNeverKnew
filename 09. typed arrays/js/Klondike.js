/**
 * Klondike is an object that can create and manipulate klondike game states.
 * @type {Object}
 */
Klondike = {};

Klondike.automaticallyCreateStringRepresentation = false;

/**
 * Creates a new, virginal, gameState
 * @return {Object} The new gameState
 */
Klondike.newGameState = function(drawCount){
	// create the game state
	var data = new Uint8Array(212);
	var piles = Klondike.getPiles(data);
	var gameState = {
		data: data, // 13+13+13+13 + 13+14+15+16+17+18+19 + 24 + 24
		piles: piles,
		pileLengths: {
			foundations: new Uint8Array(4),
			tableaux: new Uint8Array(7),
			waste: 0,
			stock: 0
		},
		drawCount: drawCount,
		stateScore: 0,
		stringRepresentation: "",
		foundationSuits: undefined,
		lowestFoundationValue: 0,
		hash: 0,
		won: false
	};

	Klondike.updatePileLengths(gameState);

	return gameState;
};

/**
 * Creates and deals a new game
 * @param drawCount
 */
Klondike.newGame = function(drawCount){
	// create and shuffle a new deck
	var cards = Deck.shuffle(Deck.newDeck());

	// create the game state
	var gameState = Klondike.newGameState(drawCount);

	// figure out what piles we've got
	var piles = gameState.piles;

	// deal the game out

	// populate the Tableau columns
	var i = -1;
	for(var r = 0 ; r < 7 ; r++){
		for(var t = 0 + r ; t < 7 ; t++){
			i++;
			piles.tableaux[t][r] = cards[i];
			if(r === t){
				piles.tableaux[t][r] = Card.flip(piles.tableaux[t][r]);
			}
		}
	}

	//console.log(Card.asString(cards[i]));

	// stock the stock
	piles.stock.set(cards.subarray(28, 52 - drawCount));

	// todo: I may want to factor this out into its own function so I can reuse the code for drawing
	// set the waste
	i = -1;
	for(var c = cards.length-1 ; c > cards.length-1-drawCount ; c--){
		i++;
		piles.waste[i] = Card.flip(cards[c]);
	}

	// set the calculated values in the gameState
	Klondike.updateState(gameState);

	// return the gameState (this can be worked with by any function on this Klondike object.
	return gameState;
};

/**
 * Makes a move as specified by the move object.  If this move wins the game the won attribute is set to true!
 * @param {Object} move The move to make.
 */
Klondike.doMove = function(gameState, move){
	// default the count, if need be
	move.count = move.count || 1;

	// get the piles from the gameState
	var piles = gameState.piles;
	var pileLengths = gameState.pileLengths;

	var from = piles[move.from];
	var fromLen = pileLengths[move.from];

	if(move.fromIndex !== undefined){
		from = from[move.fromIndex];
		fromLen = fromLen[move.fromIndex];
	}

	var to = piles[move.to];
	if(move.toIndex !== undefined){
		to = to[move.toIndex];
	}

	// figure out the index of what we're moving
	var start = fromLen - move.count;
	var end = fromLen;
	var i, card;

	// if we're moving to or from the stock we need to loop backwards, otherwise we loop forward and move the cards to the to pile
	if(move.from === "stock" || move.to === "stock"){
		// loop backwards
		for(i = end - 1 ; i >= start && i >= 0 ; i--){
			// remove the card
			card = from[i];
			from[i] = 0;
			// flip this card to the target
			if(card !== 0){
				to.push(Card.flip(card));
				//console.log(i + ": " + card + "/" + Card.asString(card !== 0 && Card.isFaceUp(card) ? card : Card.flip(card)));
			}
		}
	} else {
		// loop forwards
		for(i = start ; i < end ; i++){
			// remove the card
			card = from[i];
			from[i] = 0;
			// add this card to the target
			to.push(card);
			//console.log(i + ": " + Card.asString(card));
		}

		// make sure the exposed card is face up
		card = from[fromLen-move.count-1];
		if(card !== 0 && !Card.isFaceUp(card)){
			from[fromLen-move.count-1] = Card.flip(card);
		}
	}

	// update the game's state
	Klondike.updateState(gameState, [
		{pile: move.from, index: move.fromIndex},
		{pile: move.to, index: move.toIndex}
	]);

	//console.log(gameState.stringRepresentation.indent(1));
};

/**
 * This is a convenience function to refesh all calculated values in a gamestate
 * @param gameState
 */
Klondike.updateState = function(gameState, specificPiles){
	// update the pile lengths
	Klondike.updatePileLengths(gameState, specificPiles);

	// update the score
	Klondike.updateScore(gameState);

	// generate the string representation of this state
	if(Klondike.automaticallyCreateStringRepresentation){
		Klondike.setStringRepresentation(gameState);
	}

	// populate the set of foundation suits
	Klondike.setFoundationSuits(gameState);

	// find the lowest foundation value
	Klondike.setLowestFoundationValue(gameState);

	// set the game's hash
	Klondike.setHash(gameState);
};

/**
 * Updates the score in the gameState
 * @param {Object} gameState The gameState to update.
 */
Klondike.updateScore = function(gameState){
	gameState.stateScore = 0;

	// get the piles
	var piles = gameState.piles;
	var pileLengths = gameState.pileLengths;

	// add the foundations into the score
	for(var f = 0 ; f < piles.foundations.length ; f++){
		gameState.stateScore += (pileLengths.foundations[f] * 2);
	}

	// add the tableaux into the score
	for(t = 0 ; t < piles.tableaux.length ; t++){
		// loop backwards over this foundation until we find a card that's not face up
		for(var c = piles.tableaux[t].length-1 ; c >= 0 ; c--){
			var card = piles.tableaux[t][c];
			if(card !== 0){
				if(Card.isFaceUp(card)){
					gameState.stateScore++;
				} else {
					break;
				}
			}
		}
	}

	// add the the waste
	if(pileLengths.waste){
		gameState.stateScore++;
	}

	// check if we won!
	if(gameState.stateScore === 104){
		gameState.won = true;
	} else {
		gameState.won = false;
	}
};

/**
 * Creates the string representation of a game state
 * @param {Object} gameState The gameState to update
 */
Klondike.setStringRepresentation = function(gameState){
	gameState.stringRepresentation = "\r\n";
	var text = "";
	var piles = gameState.piles;
	var pileLengths = gameState.pileLengths;
	var i;
	// add the foundation piles
	for(var f = 0 ; f < piles.foundations.length ; f++){
		for(i = 0 ; i < piles.foundations[f].length ; i++){
			if(i === 0 && piles.foundations[f][i] === 0){
				text = "[]";
			} else if(piles.foundations[f][i] !== 0){
				text = Card.asString(piles.foundations[f][i]);
			} else {
				break;
			}
		}

		gameState.stringRepresentation += text.leftPadTo(5);
	}

	gameState.stringRepresentation += "\r\n\r\n";

	// add the waste and stock
	var line = "";
	for(i = 0 ; i < piles.waste.length ; i++){
		if(i === 0 && piles.waste[i] === 0){
			text = "[]";
		} else if(piles.waste[i] !== 0){
			text = Card.asString(piles.waste[i]);
		} else {
			break;
		}

		line += text.leftPadTo(5);
	}

	if(pileLengths.stock){
		// add the stock (Backwards)
		for(i = pileLengths.stock-1 ; i >=0 ; i--){
			line += Card.asString(piles.stock[i]).leftPadTo(5);
		}
	} else {
		line += "[]".leftPadTo(5);
	}

	gameState.stringRepresentation += line + "\r\n\r\n";

	// add the tableaux cards
	for(i = 0 ; i < piles.tableaux[6].length ; i++){
		var line = "";
		for(var t = 0 ; t < piles.tableaux.length ; t++){
			if(i === 0 && piles.tableaux[t][i] === 0){
				text = "[]";
			} else if(piles.tableaux[t][i]){
				text = Card.asString(piles.tableaux[t][i]);
			} else {
				text = "";
			}

			line += text.leftPadTo(5);
		}

		if(line.trim()){
			gameState.stringRepresentation += line + "\r\n";
		} else {
			break;
		}
	}

	// returns nothing, but alters provided gameState
};

/**
 * Updates the lengths of piles in the provided gameState
 * @param {Object} gameState The gameSthat containing the piles
 * @param {Array} specificPiles This is an array of specific piles to update. Each element is an object consisting of {pile, index}.
 */
Klondike.updatePileLengths = function(gameState, specificPiles){
	var piles = gameState.piles;

	if(specificPiles !== undefined){
		// only update specific piles
		for(var i = 0 ; i < specificPiles.length ; i++){
			if(specificPiles[i].index !== undefined){
				gameState.pileLengths[specificPiles[i].pile][specificPiles[i].index] = gameState.piles[specificPiles[i].pile][specificPiles[i].index].len();
			} else {
				gameState.pileLengths[specificPiles[i].pile] = gameState.piles[specificPiles[i].pile].len();
			}
		}
	} else {
		// update all piles
		gameState.pileLengths.foundations[0] = piles.foundations[0].len();
		gameState.pileLengths.foundations[1] = piles.foundations[1].len();
		gameState.pileLengths.foundations[2] = piles.foundations[2].len();
		gameState.pileLengths.foundations[3] = piles.foundations[3].len();

		gameState.pileLengths.tableaux[0] = piles.tableaux[0].len();
		gameState.pileLengths.tableaux[1] = piles.tableaux[1].len();
		gameState.pileLengths.tableaux[2] = piles.tableaux[2].len();
		gameState.pileLengths.tableaux[3] = piles.tableaux[3].len();
		gameState.pileLengths.tableaux[4] = piles.tableaux[4].len();
		gameState.pileLengths.tableaux[5] = piles.tableaux[5].len();
		gameState.pileLengths.tableaux[6] = piles.tableaux[6].len();

		gameState.pileLengths.waste = piles.waste.len();
		gameState.pileLengths.stock = piles.stock.len();
	}
};

/**
 * Creates a set of subarrays within the game state.cards element for each pile
 * @param gameState
 * @returns {Object} Object with elements (all arrays): foundation0, foundation1, foundation2, foundation3, tableau0, tableau1, tableau2, tableau3, tableau4, tableau5, tableau6, waste, stock
 */
Klondike.getPiles = function(data){
	return {
		foundations: Klondike.getFoundations(data),
		tableaux: Klondike.getTableaux(data),
		waste: data.subarray(164, 188), // 24
		stock: data.subarray(188, 212) // 24
	};
};

/**
 * Gets the foundations from the game
 * @param {Object} gameState The gameState to get the foundations from
 * @return {Array} The array of Foundations
 */
Klondike.getFoundations = function(data){
	return [
		data.subarray(0, 13), // 13
		data.subarray(13, 26), // 13
		data.subarray(26, 39), // 13
		data.subarray(39, 52) // 13
	];
};

/**
 * Gets the tableaux from the game
 * @param  {Object} gameState The gameState to get the tableaux from
 * @return {Array} The array of tableaux
 */
Klondike.getTableaux = function(data){
	return [
		data.subarray(52, 65), // 13
		data.subarray(65, 79), // 14
		data.subarray(79, 94), // 15
		data.subarray(94, 110), // 16
		data.subarray(110, 127), // 17
		data.subarray(127, 145), // 18
		data.subarray(145, 164) // 19
	];
};

/**
 * Sets the lowest foundation value into the gameState.
 * @param {Object} gameState The gameState
 */
Klondike.setLowestFoundationValue = function(gameState){
	// get the foundations we're working with
	var foundations = gameState.piles.foundations;
	var foundationLengths = gameState.pileLengths.foundations;

	// record the lowest foundation value
	var lowestFoundationValue = 13;

	for(var f = 0 ; f < foundations.length ; f++){
		/*console.log("foundationLengths " + f + ": " + foundationLengths[f]);
		console.log("foundation.len() " + f + ": " + foundations[f].len());
		console.log(foundations[f].asString());
*/
		if(foundationLengths[f] < lowestFoundationValue){
			lowestFoundationValue = foundationLengths[f];
		}

		// if we find an empty foundation we're done.
		if(!lowestFoundationValue){
			break;
		}
	}

	gameState.lowestFoundationValue = lowestFoundationValue;
};

/**
 * Sets the hash value of a given gameState
 * @param {Object} gameState the gameState
 */
Klondike.setHash = function(gameState){
	gameState.hash = 0;

	for(var i = 0 ; i < gameState.data.length ; i++){
		//console.log(i + " / " + gameState.data[i]);
		if(gameState.data[i] !== 0){
			var val = (gameState.data[i] * i << i) + i;
			gameState.hash += val;
			//console.log("   " + val + " = " + gameState.hash);

			//console.log("   " + (i << 8) + gameState.data[i]);
			//gameState.hash += ((i << 8) + gameState.data[i]);
		}
	}
};

/**
 * Sets the suits for the foundations based on what's in them already and what we expect.
 * @param {Uint8Array} gameState the gameState
 */
Klondike.setFoundationSuits = function(gameState){
	// default order is: c d h s
	var suits = new Uint8Array(4);
	suits[0] = 0;
	suits[1] = 1;
	suits[2] = 2;
	suits[3] = 3;

	// set the default order
	var order = suits;

	// get the foundations we're working with
	var foundations = gameState.piles.foundations;

	var swap = function(arr, val1, val2){
		var pos1 = -1;
		var pos2 = -1;

		for(var x = 0 ; x < arr.length ; x++){
			if(arr[x] === val1){
				pos1 = x;
			}
			if(arr[x] === val2){
				pos2 = x;
			}
			if(pos1 !== -1 && pos2 !== -1){
				break;
			}
		}

		var temp = arr[pos1];
		arr[pos1] = arr[pos2];
		arr[pos2] = temp;

	};

	// loop over the foundations and see what card we actually have in each (if any)
	for(var i = 0 ; i < foundations.length ; i++){
		if(foundations[i][0] !== 0){
			var suit = Card.numericSuit(foundations[i][0]);
			swap(order, suit, suits[i]);
		}

	}

	gameState.foundationSuits = order;
};