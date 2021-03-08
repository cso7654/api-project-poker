const { Game } = require('./game');

let game = new Game();

const postRequest = (request, response, bodyPresent, noBody) => {
	const method = request.method.toLowerCase();
	if (method === 'post') {
		let body = '';
		request.on('data', (chunk) => {
			body += chunk;
		});
		request.on('end', () => {
			if (body !== '') {
				// Body present. Parse and run
				const props = JSON.parse(body);
				// console.log(props);
				bodyPresent(props);
			} else {
				// No body present
				noBody();
			}
			response.end();
		});
	} else if (method === 'head') {
		response.writeHead(400, { 'Content-Type': 'application/json' });
		response.end();
	} else {
		response.writeHead(400, { 'Content-Type': 'application/json' });
		const message = {
			id: 'Bad Request',
			message: 'A POST request is required for this function',
		};
		response.write(JSON.stringify(message));
		response.end();
	}
};

const getNotReal = (request, response) => {
	response.writeHead(404, { 'Content-Type': 'application/json' });

	if (request.method.toLowerCase() !== 'head') {
		const message = {
			id: 'Not Found',
			message: 'Page not found',
		};

		response.write(JSON.stringify(message));
	}

	response.end();
};

const getCards = (request, response) => {
	response.writeHead(200, { 'Content-Type': 'application/json' });

	if (request.method.toLowerCase() !== 'head') {
		const message = {
			id: 'Current deck cards',
			message: JSON.stringify(game.deck),
		};

		response.write(JSON.stringify(message));
	}

	response.end();
};

const getHands = (request, response) => {
	response.writeHead(200, { 'Content-Type': 'application/json' });

	if (request.method.toLowerCase() !== 'head') {
		const message = {
			id: 'Current hands',
			message: "",
		};
		for (let i = 0; i < game.players.length; i++){
			let cardMessage = "";
			for (let j = 0; j < game.players[i].hand.cards.length; j++){
				let card = game.players[i].hand.cards[j];
				cardMessage += card.value;
				cardMessage += " of ";
				switch (card.suit){
					case "H":
						cardMessage += "Hearts";
						break;
					case "D":
						cardMessage += "Diamonds";
						break;
					case "S":
						cardMessage += "Spades";
						break;
					case "C":
						cardMessage += "Clubs";
						break;
				}

				if (j < game.players[i].hand.cards.length - 1){
					cardMessage += ", ";
				}
			}
			message.message += `${game.players[i].name}: ${cardMessage}<br><br>`;
		}

		response.write(JSON.stringify(message));
	}

	response.end();
};

const getPlayers = (request, response) => {
	response.writeHead(200, { 'Content-Type': 'application/json' });

	if (request.method.toLowerCase() !== 'head') {
		let players = '';
		for (let i = 0; i < game.players.length; i++) {
			players += `${game.players[i].name} `;
		}
		const message = {
			id: 'Current Players',
			message: players,
		};

		response.write(JSON.stringify(message));
	}

	response.end();
};

// Add a new player to the game
const joinGame = (request, response) => {
	postRequest(request, response,
		(properties) => {
			if (properties.name !== undefined) {
				const message = {
					id: '',
					message: '',
				};

				if (game.isNameAvailable(properties.name)) {
				// Adding new user to game
					game.addNewPlayer(properties.name);
					response.writeHead(201, { 'Content-Type': 'application/json' });
					message.id = 'Created';
					message.message = 'New user created and added to game';
				} else {
				// User already in game
					response.writeHead(409, { 'Content-Type': 'application/json' });
					message.id = 'Conflict';
					message.message = `The name ${properties.name} is already taken`;
				}

				response.write(JSON.stringify(message));
			} else {
				response.writeHead(400, { 'Content-Type': 'application/json' });
				const message = {
					id: 'Bad Request',
					message: 'Name is required to play',
				};
				response.write(JSON.stringify(message));
			}
		}, () => {
			response.writeHead(400, { 'Content-Type': 'application/json' });
			const message = {
				id: 'Bad Request',
				message: 'No body present in request',
			};
			response.write(JSON.stringify(message));
		});
};

// Set a player's ready state to true
const playerReady = (request, response) => {
	postRequest(request, response,
		(properties) => {
			// console.log(properties);
			if (properties.name !== undefined) {
				// Name is defined
				const message = {
					id: '',
					message: '',
				};

				if (game.hasPlayer(properties.name)) {
					// User is in game
					game.getPlayer(properties.name).setReady(true);
					response.writeHead(202, { 'Content-Type': 'application/json' });
					message.id = 'Updated';
					message.message = `Player ${properties.name} is now ready`;
				} else {
					// User is not in game
					response.writeHead(409, { 'Content-Type': 'application/json' });
					message.id = 'Conflict';
					message.message = `The player ${properties.name} is not in this game`;
				}

				response.write(JSON.stringify(message));
			} else {
				// Name is undefined
				response.writeHead(400, { 'Content-Type': 'application/json' });
				const message = {
					id: 'Bad Request',
					message: 'Name required to update a player',
				};
				response.write(JSON.stringify(message));
			}
		}, () => {
			response.writeHead(400, { 'Content-Type': 'application/json' });
			const message = {
				id: 'Bad Request',
				message: 'No body present in request',
			};
			response.write(JSON.stringify(message));
		});
};

const readyAll = (request, response) => {
	response.writeHead(200, { 'Content-Type': 'application/json' });

	if (request.method.toLowerCase() !== 'head') {
		for (let i = 0; i < game.players.length; i++) {
			game.players[i].setReady(true);
		}
		const message = {
			id: 'Success',
			message: "All players set to ready",
		};

		response.write(JSON.stringify(message));
	}

	response.end();
}

// Return the current state of the game to the player
// This method will also act as a sort of "heartbeat"
const pollGame = (request, response) => {
	const method = request.method.toLowerCase();

	if (game.hasResult()) {
		response.writeHead(200, { 'Content-Type': 'application/json' });

		if (method !== 'head') {
			// console.log("WINNER FOUND IN RESPONSE");
			let winners = "";
			for (let i = 0; i < game.winner.length; i++){
				winners += game.winner[i].name + " ";
			}
			const message = {
				id: 'Winner found',
				message: `The winner is ${winners}`,
			};

			response.write(JSON.stringify(message));
		}
	} else {
		response.writeHead(204, { 'Content-Type': 'application/json' });

		if (method !== 'head') {
			const message = {
				id: 'No winners',
				message: 'The game is not over yet',
			};

			response.write(JSON.stringify(message));
		}
	}
	response.end();
};

const reset = (request, response) => {
	response.writeHead(200, { 'Content-Type': 'application/json' });

	game = new Game();

	if (request.method.toLowerCase() !== 'head') {
		const message = {
			id: 'Success',
			message: 'The game has been reset'
		};

		response.write(JSON.stringify(message));
	}

	response.end();
}

module.exports.getNotReal = getNotReal;
module.exports.getCards = getCards;
module.exports.joinGame = joinGame;
module.exports.playerReady = playerReady;
module.exports.pollGame = pollGame;
module.exports.getPlayers = getPlayers;
module.exports.getHands = getHands;
module.exports.readyAll = readyAll;
module.exports.reset = reset;
