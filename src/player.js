class Player {
	constructor(name, hand) {
		this.name = name;
		this.hand = hand;
		this.ready = false;
	}

	setHand(hand) {
		this.hand = hand;
	}

	setReady(ready) {
		this.ready = ready;
	}
}

module.exports.Player = Player;
