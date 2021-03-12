const parseURL = (url) => {
	const params = {};

	// Get the URL after the ?
	const rawParams = url.split('?', 2)[1];
	// Get an array of params split by &
	if (rawParams !== undefined) {
		const rawParamsArray = rawParams.split('&');
		// Loop through raw array and parse, storing in params

		for (let i = 0; i < rawParamsArray.length; i++) {
			const paramArray = rawParamsArray[i].split('=', 2);
			[params[paramArray[0]]] = [paramArray[1]];
		}
	}

	return params;
};

module.exports.parseURL = parseURL;
