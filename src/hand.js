const { Score } = require('./score');

class Hand {
	constructor(deck) {
		this.parentDeck = deck;
		this.cards = [];
	}

	getCards() {
		return this.cards;
	}

	// Add cards to this hand (usually from a deck)
	addCards(cards) {
		if (Array.isArray(cards)) {
			// If an array of cards
			for (let i = 0; i < cards.length; i++) {
				this.cards.push(cards);
			}
		} else {
			// If a single card
			this.cards.push(cards);
		}
	}

	// Clear this hand's card array
	clearCards() {
		this.cards = [];
	}

	// Draw an amount of cards from the parent deck
	drawCards(count) {
		const newCards = this.parentDeck.drawCards(count);
		for (let i = 0; i < newCards.length; i++) {
			this.cards.push(newCards[i]);
		}
	}

	// Return this hand's cards to the parent deck
	returnCards() {
		this.parentDeck.returnCards(this.cards);
		this.clearCards();
	}

	// Get the highest value card in the hand
	getHighestCard() {
		let card = this.cards[0];
		// Check all cards and single out the highest
		for (let i = 1; i < this.cards.length; i++) {
			if (this.cards[i].isHigherThan(card)) {
				card = this.cards[i];
			}
		}
		return card;
	}

	// Get the score of this hand of cards
	getScore() {
		this.score = new Score();
		this.score.evaluate(this);
		return this.score;
	}

	printCards() {
		let cardStr = '';
		for (let i = 0; i < this.cards.length; i++) {
			cardStr += `${this.cards[i]} `;
		}
		console.log(`This hand has the following cards: ${cardStr}`);
	}
}

module.exports.Hand = Hand;
