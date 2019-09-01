const jwt = require('jsonwebtoken');
const { SECRET_KEY } = require('../config');

const verifyToken = context => {
	const header = context.req.headers.authorization;

	if (header){
		try{
			const token = header.split('Bearer ')[1];
			const user = jwt.verify(token, SECRET_KEY);
			if (!user) {
				throw new Error('Invalid/Expired token provided');
			} else {
				return user;
			}
		} catch(err) {
			throw new Error('Invalid/Expired token provided');
		}
	} else {
		throw new Error('An authorization header must be provided');
	}

}

module.exports = {
	verifyToken
};