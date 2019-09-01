const User = require('../../models/User');
const bcrypt = require('bcryptjs');
const jwt = require('jsonwebtoken');
const { UserInputError } = require('apollo-server');
const { validateRegisterInput, validateLoginInput } = require('../../util/validators');

const { SECRET_KEY } = require('../../config');

const genUserToken = (user) => {
	return jwt.sign({
		user: user.id,
		username: user.username,
		email: user.email
	}, SECRET_KEY, { expiresIn: '12h' });
}

module.exports = {
	Mutation: {
		async login(_, { username, password }){
			const errors = validateLoginInput(username, password);
			if(Object.keys(errors).length > 0){
				throw new UserInputError('Errors', { errors });
			}

			const user = await User.findOne({ username });
			
			if(!user){
				// error string prevents user enumeration
				errors.username = 'Invalid username and/or password';
				throw new UserInputError('Errors', { errors });	
			}

			const match = await bcrypt.compare(password, user.password);
			if(match === false){
				errors.username = 'Invalid username and/or password';
				throw new UserInputError('Errors', { errors });
			}

			const token = genUserToken(user);

			return {
				id: user.id,
			    email: user.email,
			    token,
			    username: user.username,
			    createdAt: user.createdAt
			}
		},

		async register(_, { input: { username, password, confirmPassword, email } }){
			
			const errors = validateRegisterInput(username, password, confirmPassword, email);

			if( Object.keys(errors).length > 0 ){
				throw new UserInputError('Errors', { errors });
			}

			const isUser = await User.findOne({ username });
			if(isUser){
				throw new UserInputError('Username already taken', {
					errors: {
						username: 'This username is already taken'
					}
				});
			}


			const salt = bcrypt.genSaltSync(10);
			password = bcrypt.hashSync(password, salt);

			const newUser = new User({
				email,
				username,
				password,
				createdAt: new Date().toISOString()
			});

			const res = await newUser.save();

			const token = genUserToken(res);

			
			return {
				id: res.id,
			    email: res.email,
			    token,
			    username: res.username,
			    createdAt: res.createdAt
			}			
		}
	}
}