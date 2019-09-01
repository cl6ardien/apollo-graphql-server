const Post = require('../../models/Post');
const { verifyToken } = require('../../util/is_authenticated');
const { UserInputError, AuthenticationError } = require('apollo-server');

module.exports = {
	Mutation: {
		postComment: async (_, { postId, body }, context) => {
			const user = verifyToken(context);

			if(user){
				const post = await Post.findById(postId);
				if(!post){
					throw new Error('Post not found');
				}

				if(body.trim() === ''){
					throw new UserInputError('Comment\'s body must not be empty');
				}

				await post.comments.unshift({
					body,
					username: user.username,
					createdAt: new Date().toISOString()
				});

				await post.save();
				return post;
			} else {
				throw new AuthenticationError('An authentication header must be provided');
			}
		},
		deleteComment: async (_, { postId, commentId }, context) => {
			const user = verifyToken(context);
			if(user){
				const post = await Post.findById(postId);
				if(!post){
					throw new Error('Post not found');
				}

				post.comments = post.comments.filter(comment => comment.id !== commentId);
				await post.save();

				return post;
			} else {
				throw new AuthenticationError('An authentication header must be provided');
			}
		}
	}
}