const { Game } = require('./game');

let game = new Game();
const queryParams = require('./queryParams.js');

//Method for making a POST-only response
const postRequest = (request, response, bodyPresent, noBody = undefined) => {
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
				if (noBody) {
					noBody();
				} else if (method === 'head') {
					response.writeHead(400, { 'Content-Type': 'application/json' });
					response.end();
				} else {
					response.writeHead(400, { 'Content-Type': 'application/json' });
					const message = {
						id: 'Bad Request',
						message: 'No body was provided with the POST request',
					};
					response.write(JSON.stringify(message));
				}
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

//Get a default 404
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

//Get all the cards in the deck
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

//Get a player's hand
const getHand = (request, response) => {
	//DO this with a post request so people can't just type in a URL to cheat
	postRequest(request, response,
		(data) => {
			const method = request.method.toLowerCase();
			const message = { id: '', message: '' };

			if (!data.name) {
				// No name provided
				response.writeHead(400, { 'Content-Type': 'application/json' });
				message.id = 'Bad Request';
				message.message = 'A player name is required to get a hand';
			} else if (!game.hasPlayer(data.name)) {
				// Player not in game
				response.writeHead(409, { 'Content-Type': 'application/json' });
				message.id = 'Conflict';
				message.message = `The player ${data.name} is not in this game`;
			} else {
				// Game has player
				response.writeHead(200, { 'Content-Type': 'application/json' });
				message.id = 'Success';
				message.message = JSON.stringify(game.getPlayer(data.name).hand.cards);
			}

			if (method !== 'head') {
				response.write(JSON.stringify(message));
			}
			response.end();
		});
};

// Get a list of all players in the game
const getPlayers = (request, response) => {
	response.writeHead(200, { 'Content-Type': 'application/json' });

	if (request.method.toLowerCase() !== 'head') {
		const players = [];
		for (let i = 0; i < game.players.length; i++) {
			players.push(game.players[i].name);
		}
		const message = {
			id: 'Current Players',
			message: JSON.stringify(players),
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

				if (!game.hasPlayer(properties.name)) {
				// Adding new user to game
					game.addNewPlayer(properties.name);
					response.writeHead(201, { 'Content-Type': 'application/json' });
					message.id = 'Created';
					message.message = `Player ${properties.name} has been created and added to the game`;
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

// Remove a player from the game
const leaveGame = (request, response) => {
	postRequest(request, response,
		(properties) => {
			if (properties.name !== undefined) {
				const message = {
					id: '',
					message: '',
				};

				if (game.hasPlayer(properties.name)) {
					// Removing player from game
					game.removePlayerName(properties.name);
					response.writeHead(200, { 'Content-Type': 'application/json' });
					message.id = 'Updated';
					message.message = `Player ${properties.name} has left the game`;
				} else {
					// User not in game
					response.writeHead(409, { 'Content-Type': 'application/json' });
					message.id = 'Conflict';
					message.message = `The player ${properties.name} is not in this game`;
				}

				response.write(JSON.stringify(message));
			} else {
				response.writeHead(400, { 'Content-Type': 'application/json' });
				const message = {
					id: 'Bad Request',
					message: 'Name is required to exit',
				};
				response.write(JSON.stringify(message));
			}
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
					game.setPlayerReady(properties.name);
					response.writeHead(200, { 'Content-Type': 'application/json' });
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

// Debug: Sets all players to ready
const readyAll = (request, response) => {
	response.writeHead(200, { 'Content-Type': 'application/json' });

	if (request.method.toLowerCase() !== 'head') {
		for (let i = 0; i < game.players.length; i++) {
			game.setPlayerReady(game.players[i].name);
		}
		const message = {
			id: 'Success',
			message: 'All players set to ready',
		};

		response.write(JSON.stringify(message));
	}

	response.end();
};

// Return the current state of the game to the player
// This method will also act as a sort of "heartbeat"
const pollGame = (request, response) => {
	postRequest(request, response,
		(properties) => {
			if (properties.name !== undefined) {
				// Name is defined
				const message = {
					id: '',
					message: '',
				};

				if (game.hasPlayer(properties.name)) {
					// User is in game
					//Find any events that this user hasn't been updated with
					let relevantEvents = [];
					for (let i = 0; i < game.events.length; i++){
						if (game.events[i].players.includes(properties.name)){
							relevantEvents.push(game.events[i]);
						}
					}
					
					if (relevantEvents.length > 0){
						//If there is more than one event that the player must recieve
						response.writeHead(200, { 'Content-Type': 'application/json' });
						message.id = 'Update';
						message.message = JSON.stringify(relevantEvents);
						//Remove player's name from events
						for (let i = 0; i < relevantEvents.length; i++){
							let i2 = relevantEvents[i].players.indexOf(properties.name);
							if (i2 > -1) {
								relevantEvents[i].players.splice(i2, 1);
							}
						}
					}else{
						//Player is up-to-date on all events
						response.writeHead(201, { 'Content-Type': 'application/json' });
						message.id = 'No Content';
						message.message = `Player ${properties.name} is already up to date`;	
					}
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
					message: 'Name required to poll game events',
				};
				response.write(JSON.stringify(message));
			}
		});
};

// Overwrite the current Game object with a new one
const reset = (request, response) => {
	response.writeHead(200, { 'Content-Type': 'application/json' });

	game = new Game();

	if (request.method.toLowerCase() !== 'head') {
		const message = {
			id: 'Success',
			message: 'The game has been reset',
		};

		response.write(JSON.stringify(message));
	}

	response.end();
};

// See if a name provided in the params is available
const checkName = (request, response) => {
	const method = request.method.toLowerCase();

	const params = queryParams.parseURL(request.url);

	if (game.players.length >= game.maxPlayers) {
		// Game is full, tell the player they can't join
		response.writeHead(409, { 'Content-Type': 'application/json' });

		if (method !== 'head') {
			const message = {
				id: 'Conflict',
				message: 'The current game is full',
			};
			response.write(JSON.stringify(message));
		}
	} else if (params === undefined || params === {} || params.name === undefined) {
		// No name provided
		response.writeHead(400, { 'Content-Type': 'application/json' });

		if (method !== 'head') {
			const message = {
				id: 'Bad Request',
				message: 'No name provided',
			};
			response.write(JSON.stringify(message));
		}
	} else if (/^([0-9]|[A-z])+([0-9A-z]+)$/.test(params.name)) {
		// Name is alphanumeric. Check if the game already has this name
		if (!game.hasPlayer(params.name)) {
			response.writeHead(200, { 'Content-Type': 'application/json' });

			if (method !== 'head') {
				const message = {
					id: 'Success',
					message: `The name ${params.name} is available`,
				};
				response.write(JSON.stringify(message));
			}
		} else {
			response.writeHead(409, { 'Content-Type': 'application/json' });

			if (method !== 'head') {
				const message = {
					id: 'Conflict',
					message: `The name ${params.name} is already taken`,
				};
				response.write(JSON.stringify(message));
			}
		}
	} else {
		// Invalid name
		response.writeHead(400, { 'Content-Type': 'application/json' });

		if (method !== 'head') {
			const message = {
				id: 'Bad Request',
				message: 'Name must be alphanumeric only (uppercase letters, lowercase letters, and digits)',
			};
			response.write(JSON.stringify(message));
		}
	}

	response.end();
};

module.exports.getNotReal = getNotReal;
module.exports.getCards = getCards;
module.exports.joinGame = joinGame;
module.exports.leaveGame = leaveGame;
module.exports.playerReady = playerReady;
module.exports.pollGame = pollGame;
module.exports.getPlayers = getPlayers;
module.exports.readyAll = readyAll;
module.exports.reset = reset;
module.exports.checkName = checkName;
module.exports.getHand = getHand;
