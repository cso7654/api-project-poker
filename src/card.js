class Card {
	constructor(suit, value) {
		this.s = suit;
		this.v = value;
	}

	// Check if this card is higher than a provided one
	isHigherThan(card) {
		return this.getNumericalValue() > card.getNumericalValue();
	}

	// Get the numerical value for this card (convert faces and aces to a normal integer)
	getNumericalValue() {
		switch (this.v) {
		default:
			return this.v;
		case 'J':
			return 11;
		case 'Q':
			return 12;
		case 'K':
			return 13;
		case 'A':
			return 14;
		}
	}
}

module.exports.Card = Card;
