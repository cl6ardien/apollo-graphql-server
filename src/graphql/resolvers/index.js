const postsResolvers = require('./posts');
const usersResolvers = require('./users');
const commentsResolvers = require('./comments');

module.exports = {
	Post: {
		nofComments: parent => {
			return parent.comments.length;
		},
		nofLikes: parent => {
			return parent.likes.length;
		}
	},
	Query: {
		...postsResolvers.Query,
	},
	Mutation: {
		...usersResolvers.Mutation,
		...postsResolvers.Mutation,
		...commentsResolvers.Mutation
	}
}