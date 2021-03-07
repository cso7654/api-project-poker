const fs = require('fs');

const indexCSS = fs.readFileSync(`${__dirname}/../client/style.css`);

const getIndex = (request, response) => {
	response.writeHead(200, { 'Content-Type': 'text/css' });
	response.write(indexCSS);
	response.end();
};

module.exports.getIndex = getIndex;
