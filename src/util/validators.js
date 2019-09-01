const validateRegisterInput = ( username, password, confirmPassword, email ) => {
	let errors = {};
	const eRgx = /^(([^<>()\[\]\\.,;:\s@"]+(\.[^<>()\[\]\\.,;:\s@"]+)*)|(".+"))@((\[[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}])|(([a-zA-Z\-0-9]+\.)+[a-zA-Z]{2,}))$/;

	if (username.trim() === ''){
		errors.username = 'Username must not be empty';
	}

	if (password.length < 8){
		errors.password = 'Password must be at least 8 characters long';
	}

	if (password != confirmPassword){
		errors.password = 'Passwords do not match';
	}

	if(email.trim() === ''){
		errors.password = 'Email must not be empty';
	} 

	if(!email.match(eRgx)){
		errors.email = 'Email must be a valid email address';
	}

	return errors;
};

validateLoginInput = (username, password) => {
	let errors = {};

	if (username.trim() === ''){
		errors.username = 'Username must not be empty';
	}

	if (password.trim() === ''){
		errors.username = 'Password must not be empty';
	}

	console.log(errors);

	return errors;
}

module.exports = {
	validateRegisterInput,
	validateLoginInput
};