const fs = require('fs');

const clubIcon = fs.readFileSync(`${__dirname}/../client/media/club_icon.png`);
const diamondIcon = fs.readFileSync(`${__dirname}/../client/media/diamond_icon.png`);
const heartIcon = fs.readFileSync(`${__dirname}/../client/media/heart_icon.png`);
const spadeIcon = fs.readFileSync(`${__dirname}/../client/media/spade_icon.png`);

const getClub = (request, response) => {
	response.writeHead(200, { 'Content-Type': 'image/png' });
	response.write(clubIcon);
	response.end();
};
const getDiamond = (request, response) => {
	response.writeHead(200, { 'Content-Type': 'image/png' });
	response.write(diamondIcon);
	response.end();
};
const getHeart = (request, response) => {
	response.writeHead(200, { 'Content-Type': 'image/png' });
	response.write(heartIcon);
	response.end();
};
const getSpade = (request, response) => {
	response.writeHead(200, { 'Content-Type': 'image/png' });
	response.write(spadeIcon);
	response.end();
};

module.exports.getClub = getClub;
module.exports.getDiamond = getDiamond;
module.exports.getHeart = getHeart;
module.exports.getSpade = getSpade;
