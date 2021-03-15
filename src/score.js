// const Card = require(',/card.js');

class Score {
	// Calculate the score based on a given hand of cards
	evaluate(hand) {
		// Get card values in descending order
		this.cardVals = [];
		this.high = 0;
		// Store a hand type variable that is set while evaluating for quick comparisons
		this.handType = 0;
		for (let i = 0; i < hand.cards.length; i++) {
			this.cardVals.push(hand.cards[i].getNumericalValue());
		}
		// Sort card vals in descending order (highest first)
		this.cardVals.sort((a, b) => b - a);
		[this.high] = [this.cardVals[0]];

		// Count occurances of each card
		const counter = {};
		for (let i = 0; i < this.cardVals.length; i++) {
			if (this.cardVals[i] in counter) {
				// Increment counter for card val
				counter[this.cardVals[i]]++;
			} else {
				// Set card count for val to 1
				counter[this.cardVals[i]] = 1;
			}
		}

		// Get pairs of cards
		// Store a "pair" as the value of the card that is in a pair. otherPairVal is for 2 pairs
		this.otherPairVal = 0;
		let numPairs = 0;
		// Find counter values of exactly 2
		for (let i = 0; i < Object.keys(counter).length; i++) {
			// If the property of the counter at this value is exactly 2, add this counter value to pairs
			if (counter[Object.keys(counter)[i]] === 2) {
				if (numPairs > 1) {
					// One pair becomes 2 pairs
					const newHigh = Object.keys(counter)[i];
					// Make sure this.high is always the higher of the two pairs
					// and this.otherPairVal is the lower
					if (newHigh > this.high) {
						this.otherPairVal = this.high;
						this.high = newHigh;
					} else {
						this.otherPairVal = newHigh;
					}
					numPairs++;
					this.handType = 2;
				} else {
					// No pairs becomes 1 pair
					this.high = Object.keys(counter)[i];
					numPairs++;
					this.handType = 1;
				}
			}
		}

		// Get 3 of a kind
		// Store a 3OAK as the value of the card that is in a 3OAK. If 0, no 3OAK
		let threeOAK = false;
		// Find counter values of exactly 3
		for (let i = 0; i < Object.keys(counter).length; i++) {
			// If the property of the counter at this value is exactly 3, add this counter value to 3OAK
			if (counter[Object.keys(counter)[i]] === 3) {
				this.high = Object.keys(counter)[i];
				threeOAK = true;
				// Set handType to 3 (above 2 pairs)
				this.handType = 3;
				// No more than one 3OAK can exist, so break
				break;
			}
		}

		// Get straight
		// Store a straight as the highest value in the straight. If 0, no straight
		let straight = false;
		// Make sure there are no pairs or 3OAKs, otherwise it is impossible to have a straight
		if (numPairs === 0 && !threeOAK) {
			// Check for ace as a low card. Highest val is an ace (14) but next highest is a 5
			if (this.cardVals[0] === 14 && this.cardVals[1] === 5) {
				// Make sure the 2nd highest minus the lowest is 3
				// (5 - 2, which would mean cards are A, 5, 4, 3, 2)
				if (5 - this.cardVals[4] === 3) {
					// Cards are contiguous with ace as a low card, straight has 5 as high
					this.high = 5;
					straight = true;
					// Set hand type to 4 (above 3OAK)
					this.handType = 4;
				}
			} else if (this.cardVals[0] - this.cardVals[4] === 4) {
				// Ace is a high card or not in the hand
				// Like before, subtract lowest card from the highest card
				// and see if the value is 4 (ex. 10, 9, 8, 7, 6 and 10 - 6 = 4)

				[this.high] = [this.cardVals];
				straight = true;
				// Set hand type to 4 (above 3OAK)
				this.handType = 4;
			}
		}

		// Get flush
		let flush = false;
		// Make sure there are no pairs or 3OAKs, otherwise it is impossible to
		// have a flush (must have multiple suits to have more of one value)
		if (numPairs === 0 && !threeOAK) {
			let allSameSuit = true;
			// Loop and check suits of all cards in hand
			for (let i = 1; i < hand.cards.length; i++) {
				if (hand.cards[i].s !== hand.cards[i - 1].s) {
					allSameSuit = false;
					break;
				}
			}
			// If all are the same suit, get the highest card
			if (allSameSuit) {
				[this.high] = [this.cardVals];
				flush = true;
				// Set handType to 4 (above straight)
				this.handType = 5;
			}
		}

		// Get full house (1 pair and 3 of a kind)
		// If there is one pair and a 3OAK was found
		if (numPairs === 1 && threeOAK) {
			[this.high] = [this.cardVals];
			// Set handType to 5 (above flush)
			this.handType = 5;
		}

		// Get 4 of a kind
		// Find counter values of exactly 4
		for (let i = 0; i < Object.keys(counter).length; i++) {
			// If the property of the counter at this value is exactly 4 4OAK was found
			if (counter[Object.keys(counter)[i]] === 4) {
				this.high = Object.keys(counter)[i];
				// Set handType to 6 (above full house)
				this.handType = 6;
				// No more than one 4OAK can exist, so exit
				break;
			}
		}

		// Get straight flush
		let straightFlush = false;
		if (straight > 0 && flush) {
			// High will have already been set
			straightFlush = true;
			// Set handType to 7 (above 4OAK)
			this.handType = 7;
		}

		// Get royal flush
		// If the hand is a straight flush and the highest card is an ace (14),
		// then the hand must be a royal flush
		if (straightFlush && this.cardVals[0] === 14) {
			this.high = 14;
			// set handType to 8 (above straight flush)
			this.handType = 8;
		}
	}

	// Check how this score compares to another. 1 means it beats it,
	// -1 means it loses to it, and 0 mean they tie
	compareTo(score) {
		// Preliminary hand type check
		if (this.handType > score.handType) {
			return 1;
		} 
		if (this.handType < score.handType) {
			return -1;
		}
		// Hand types are the same, so compare highest values
		//Start with 2 pairs since there are 2 values to check
		if (this.handType === 2 && this.high === score.high) {
			// Two pairs with same highest pair. Must compare once for each pair
			if (this.otherPairVal > score.otherPairVal) {
				return 1;
			} 
			if (this.otherPairVal < score.otherPairVal) {
				return -1;
			}
			return 0;
		}
		// Compare highest value
		if (this.high > score.high) {
			return 1;
		} if (this.high < score.high) {
			return -1;
		}
		return 0;
	}
}

module.exports.Score = Score;
