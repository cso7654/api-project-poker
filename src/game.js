// const util = require('util');
// const timeout = util.promisify(setTimeout);

const Deck = require('./deck.js');
const Hand = require('./hand.js');
const Player = require('./player.js');

class Game {
	constructor() {
		this.maxPlayers = 4;
		this.players = [];
		this.deck = new Deck.Deck();
		this.deck.shuffleCards();
		this.wasReset = true;

		this.winner = undefined;
		this.gameOver = false;

		// Keep an array of events that take place and names of players who haven't recieved them
		// Once all players have revieced an event, remove it
		this.events = [];

		this.updateLoop = setInterval(() => { this.update(); }, 250);
	}

	// Removes any game over criteria
	reset() {
		this.gameOver = false;
		this.winner = undefined;

		// Force all players to return their cards
		for (let i = 0; i < this.players.length; i++) {
			this.players[i].hand.returnCards();
		}

		// Shuffle cards
		this.deck.shuffleCards();

		// Deal out cards
		for (let i = 0; i < this.players.length; i++) {
			this.players[i].hand.drawCards(5);
		}

		this.logEvent('reset', '');
	}

	// Fully reset the game and clear everything
	hardReset() {
		this.reset();

		this.players = [];

		this.deck = new Deck.Deck();
		this.deck.shuffleCards();

		this.wasReset = true;
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

		this.logEvent('playerJoin', player.name);
		this.wasReset = false;
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
		this.logEvent('playerLeave', player.name);
	}

	// Remove a player based on their name
	removePlayerName(name) {
		const player = this.getPlayer(name);
		if (player) {
			this.removePlayer(player);
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

	// Set a player as ready
	setPlayerReady(name) {
		this.getPlayer(name).setReady(true);

		this.logEvent('playerReady', name);
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
		if (this.players.length > 0) {
			[topPlayers[0]] = [this.players[0]];
			for (let i = 1; i < this.players.length; i++) {
				// Compare current player to top player
				const comparison = this.players[i].hand.score.compareTo(topPlayers[0].hand.score);
				if (comparison === 1) {
					// If current beats top, set new top
					topPlayers = [];
					[topPlayers[0]] = [this.players[i]];
				} else if (comparison === 0) {
					// If current matches top, add to tied players
					topPlayers.push(this.players[i]);
				}
			}

			if (topPlayers.length === 0 || topPlayers[0] === undefined) {
				return [];
			}
			// Get just the names
			const topPlayerNames = [];
			for (let i = 0; i < topPlayers.length; i++) {
				topPlayerNames.push(topPlayers[i].name);
			}
			topPlayers = topPlayerNames;
		}

		return topPlayers;
	}

	update() {
		// Check for winners
		if (this.allPlayersReady() && !this.gameOver) {
			const topPlayers = this.testForWinner();

			if (topPlayers.length < 1) {
				this.winner = undefined;
			} else if (topPlayers.length > 0 && topPlayers[0] !== undefined) {
				this.winner = topPlayers;
				this.logEvent('win', { winners: topPlayers, playerData: this.players });
				this.gameOver = true;
			}
		}

		// Update events and remove any that are up to date with all players
		const validEvents = [];
		for (let i = 0; i < this.events.length; i++) {
			// If the length of the unupdated players is more than 0, it is valid
			if (this.events[i].players.length > 0) {
				validEvents.push(this.events[i]);
			}
		}
		this.events = validEvents;

		// Check if all players have left. If so, reset
		if (this.players.length === 0 && !this.wasReset) {
			this.hardReset();
		}
	}

	hasResult() {
		return this.winner !== undefined && this.winner.length > 0;
	}

	// Add an event to the events list so players can update when they need to
	logEvent(type, data) {
		this.events.push({
			type, data, players: this.createPlayerNameArray(),
		});
	}

	// Create an array of the names of all players. Used for events
	createPlayerNameArray() {
		const names = [];
		for (let i = 0; i < this.players.length; i++) {
			names.push(this.players[i].name);
		}
		return names;
	}

	// End the game and clear the update interval
	close() {
		clearInterval(this.updateLoop);

		this.logEvent('gameClose', '');
	}
}

module.exports.Game = Game;
