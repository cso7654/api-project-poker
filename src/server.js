const http = require('http');
const htmlHandler = require('./htmlResponses.js');
const cssHandler = require('./cssResponses.js');
const jsonHandler = require('./jsonResponses.js');

const port = process.env.PORT || process.env.NODE_PORT || 3000;

const onRequest = (request, response) => {
	switch (request.url.split('?')[0]) {
	default:
	case '/':
		htmlHandler.getIndex(request, response);
		break;
	case '/style.css':
		cssHandler.getIndex(request, response);
		break;
	case '/getUsers':
		jsonHandler.getUser(request, response);
		break;
	case '/notReal':
		jsonHandler.getNotReal(request, response);
		break;
	case '/addUser':
		jsonHandler.getAddUser(request, response);
		break;
	}
};

http.createServer(onRequest).listen(port);

console.log(`Listening on 127.0.0.1:${port}`);
