// const util = require('util');
// const timeout = util.promisify(setTimeout);

const Deck = require('./deck.js');
const Hand = require('./hand.js');
const Player = require('./player.js');

class Game {
	constructor() {
		// this.maxPlayers = 8;
		this.players = [];
		this.deck = new Deck.Deck();
		this.deck.shuffleCards();

		this.result = false;
		this.winner = undefined;

		this.updateLoop = setInterval(() => { this.update(); }, 100);
	}

	// Add a new player based on their name
	addNewPlayer(name) {
		const player = new Player.Player(name, undefined);
		this.addPlayer(player);
	}

	// Add a player to the game
	addPlayer(player) {
		this.players.push(player);
		if (player.hand !== undefined) {
			player.returnCards();
		}
		player.setHand(new Hand.Hand(this.deck));
		player.hand.drawCards(5);
	}

	// Check if a name is taken by a player (names MUST be unique)
	isNameAvailable(name) {
		// Return false if any of the players has a name matching the provided one
		for (let i = 0; i < this.players.length; i++) {
			if (this.players[i].name === name) {
				return false;
			}
		}
		// No players have the name, it is available
		return true;
	}

	// Check if a player with the given name is in this game
	hasPlayer(name) {
		for (let i = 0; i < this.players.length; i++) {
			if (this.players[i].name === name) {
				return true;
			}
		}
		return false;
	}

	// Get a player with the given name from the game (if one exists)
	getPlayer(name) {
		for (let i = 0; i < this.players.length; i++) {
			if (this.players[i].name === name) {
				return this.players[i];
			}
		}
		return undefined;
	}

	// Remove a player from the game
	removePlayer(player) {
		const i = this.players.indexOf(player);
		if (i > -1) {
			this.players.splice(i, 1);
		}
	}

	// Set all players as not ready
	clearReadyStates() {
		for (let i = 0; i < this.players.length; i++) {
			this.players[i].setReady(false);
		}
	}

	// Check if all players are ready
	allPlayersReady() {
		for (let i = 0; i < this.players.length; i++) {
			if (!this.players[i].ready) {
				return false;
			}
		}
		return true;
	}

	// Make all players draw their hands
	drawHands() {
		for (let i = 0; i < this.players.length; i++) {
			this.players[i].hand.returnCards();
			this.players[i].hand.drawCards(5);
		}
	}

	// Get the winner of the game (or winners if a tie)
	testForWinner() {
		// Compile player scores
		for (let i = 0; i < this.players.length; i++) {
			this.players[i].hand.getScore();
		}

		let topPlayers = [];
		[topPlayers[0]] = [this.players[0]];
		for (let i = 1; i < this.players.length; i++) {
			// Compare current player to top player
			if (this.players[i].hand.score > topPlayers[0].hand.score) {
				// If current beats top, set new top
				topPlayers = [];
				[topPlayers[0]] = [this.players[i]];
			} else if (this.players[i].hand.score === topPlayers[0].hand.score) {
				// If current matches top, ad to tied players
				topPlayers.push(this.players[i]);
			}
		}

		if (topPlayers.length === 0 || topPlayers[0] === undefined || topPlayers[0].score === 0) {
			return [];
		}

		return topPlayers;
	}

	update() {
		if (this.allPlayersReady()) {
			const topPlayers = this.testForWinner();

			if (topPlayers.length < 1) {
				this.winner = undefined;
			} else if (topPlayers.length > 0 && topPlayers[0] !== undefined) {
				this.setWinner(topPlayers);
				// console.log("WINNER FOUND");
			}
		}
	}

	setWinner(winner) {
		this.winner = winner;
	}

	hasResult() {
		return this.winner !== undefined && this.winner.length > 0;
	}

	// End the game and clear the update interval
	close() {
		clearInterval(this.updateLoop);
	}
}

module.exports.Game = Game;
