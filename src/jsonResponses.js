const users = {};

const getUser = (request, response) => {
	response.writeHead(200, { 'Content-Type': 'application/json' });

	const message = {
		id: 'Success',
		message: JSON.stringify(users),
	};

	response.write(JSON.stringify(message));
	response.end();
};
const getNotReal = (request, response) => {
	response.writeHead(404, { 'Content-Type': 'application/json' });

	const message = {
		id: 'Not Found',
		message: 'Page not found',
	};

	response.write(JSON.stringify(message));
	response.end();
};
const getAddUser = (request, response) => {
	let body = '';
	request.on('data', (chunk) => {
		body += chunk;
	});
	request.on('end', () => {
		let badRequest = true;
		if (body !== '') {
			const props = JSON.parse(body);
			const message = {
				id: '',
				message: '',
			};

			if (props.name !== undefined && props.age !== undefined) {
				badRequest = false;

				if (users[props.name] !== undefined) {
					// If users already has this user
					users[props.name].age = props.age;
					response.writeHead(204, { 'Content-Type': 'application/json' });
					message.id = 'Updated';
					message.message = ' ';
				} else {
					// Adding new user to data
					users[props.name] = {
						name: props.name,
						age: props.age,
					};
					response.writeHead(201, { 'Content-Type': 'application/json' });
					message.id = 'Create';
					message.message = 'New user created successfully';
				}

				response.write(JSON.stringify(message));
			}
		}

		if (badRequest) {
			// Incorrect data
			response.writeHead(400, { 'Content-Type': 'application/json' });
			const message = {
				id: 'Bad Request',
				message: 'Name and age both required',
			};
			response.write(JSON.stringify(message));
		}

		response.end();
	});
	// console.log(Object.getOwnPropertyNames(request.client));
	// getUser(request, response);
	// let user = "";
	// if (users.hasOwnProperty(user)){

	// }
};

module.exports.getUser = getUser;
module.exports.getNotReal = getNotReal;
module.exports.getAddUser = getAddUser;
