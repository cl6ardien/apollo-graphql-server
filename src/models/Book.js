const mongoose = require('mongoose');

const booksSchema = new mongoose.Schema({ 
	title: String,
	author: String
});

module.exports = model('Book', booksSchema);