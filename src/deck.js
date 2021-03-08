const Card = require('./card.js');

class Deck {
	constructor() {
		// Generate cards.
		this.cards = [];

		// 2-10
		for (let i = 2; i <= 10; i++) {
			// Hearts
			this.cards.push(new Card.Card('H', i));
			// Diamonds
			this.cards.push(new Card.Card('D', i));
			// Spades
			this.cards.push(new Card.Card('S', i));
			// Clubs
			this.cards.push(new Card.Card('C', i));
		}
		// Faces and Aces (a great band name)
		// Hearts
		this.cards.push(new Card.Card('H', 'J'));
		this.cards.push(new Card.Card('H', 'Q'));
		this.cards.push(new Card.Card('H', 'K'));
		this.cards.push(new Card.Card('H', 'A'));
		// Diamonds
		this.cards.push(new Card.Card('D', 'J'));
		this.cards.push(new Card.Card('D', 'Q'));
		this.cards.push(new Card.Card('D', 'K'));
		this.cards.push(new Card.Card('D', 'A'));
		// Spades
		this.cards.push(new Card.Card('S', 'J'));
		this.cards.push(new Card.Card('S', 'Q'));
		this.cards.push(new Card.Card('S', 'K'));
		this.cards.push(new Card.Card('S', 'A'));
		// Clubs
		this.cards.push(new Card.Card('C', 'J'));
		this.cards.push(new Card.Card('C', 'Q'));
		this.cards.push(new Card.Card('C', 'K'));
		this.cards.push(new Card.Card('C', 'A'));
	}

	drawCards(count) {
		// Take the top-most cards from the card array and return them
		const drawnCards = [];
		for (let i = 0; i < count; i++) {
			drawnCards.push(this.cards.shift());
		}
		return drawnCards;
	}

	returnCards(cards) {
		// Return cards to the deck so they can be dealt out later
		if (Array.isArray(cards)) {
			// If returning an entire array of cards
			for (let i = 0; i < cards.length; i++) {
				this.cards.push(cards[i]);
			}
		} else {
			// If returning a single card
			this.cards.push(cards);
		}
	}

	shuffleCards() {
		// Use Fisher-Yates shuffling algorithm
		let cardsLeft = this.cards.length;

		while (cardsLeft > 0){
			let rand = Math.floor(Math.random() * cardsLeft--);
			let swap = this.cards[cardsLeft];
			this.cards[cardsLeft] = this.cards[rand];
			this.cards[rand] = swap;
		}
	}

	printCards() {
		let cardStr = '';
		for (let i = 0; i < this.cards.length; i++) {
			cardStr += `${this.cards[i]} `;
		}
		console.log(`This deck has the following cards: ${cardStr}`);
	}
}

module.exports.Deck = Deck;
