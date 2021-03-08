const http = require('http');
const htmlHandler = require('./htmlResponses.js');
const cssHandler = require('./cssResponses.js');
const jsonHandler = require('./jsonResponses.js');

const port = process.env.PORT || process.env.NODE_PORT || 3000;

const onRequest = (request, response) => {
	switch (request.url.split('?')[0]) {
	case '/':
		htmlHandler.getIndex(request, response);
		break;
	case '/style.css':
		cssHandler.getIndex(request, response);
		break;
	case '/getCards':
		jsonHandler.getCards(request, response);
		break;
	case '/getHands':
		jsonHandler.getHands(request, response);
		break;
	case '/joinGame':
		jsonHandler.joinGame(request, response);
		break;
	case '/playerReady':
		jsonHandler.playerReady(request, response);
		break;
	case '/readyAll':
		jsonHandler.readyAll(request, response);
		break;
	case '/pollGame':
		jsonHandler.pollGame(request, response);
		break;
	case '/getPlayers':
		jsonHandler.getPlayers(request, response);
		break;
	case '/reset':
		jsonHandler.reset(request, response);
		break;

	default:
		jsonHandler.getNotReal(request, response);
		break;
	}
};

http.createServer(onRequest).listen(port);

console.log(`Listening on 127.0.0.1:${port}`);
