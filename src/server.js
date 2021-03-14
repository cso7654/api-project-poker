const http = require('http');
const htmlHandler = require('./htmlResponses.js');
const cssHandler = require('./cssResponses.js');
const jsonHandler = require('./jsonResponses.js');
const imageHandler = require('./imageResponses.js');

const port = process.env.PORT || process.env.NODE_PORT || 3000;

const onRequest = (request, response) => {
	switch (request.url.split('?')[0]) {
	case '/':
		htmlHandler.getIndex(request, response);
		break;
	case '/style.css':
		cssHandler.getIndex(request, response);
		break;

	case '/media/club_icon.png':
		imageHandler.getClub(request, response);
		break;
	case '/media/diamond_icon.png':
		imageHandler.getDiamond(request, response);
		break;
	case '/media/heart_icon.png':
		imageHandler.getHeart(request, response);
		break;
	case '/media/spade_icon.png':
		imageHandler.getSpade(request, response);
		break;

	case '/getCards':
		jsonHandler.getCards(request, response);
		break;
	case '/getHand':
		jsonHandler.getHand(request, response);
		break;
	case '/joinGame':
		jsonHandler.joinGame(request, response);
		break;
	case '/leaveGame':
		jsonHandler.leaveGame(request, response);
		break;
	case '/playerReady':
		jsonHandler.playerReady(request, response);
		break;
	case '/exchangeCards':
		jsonHandler.exchangeCards(request, response);
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

	case '/checkName':
		jsonHandler.checkName(request, response);
		break;

	default:
		jsonHandler.getNotReal(request, response);
		break;
	}
};

http.createServer(onRequest).listen(port);

console.log(`Listening on 127.0.0.1:${port}`);
