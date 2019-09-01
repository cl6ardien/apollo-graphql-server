const Post = require('../../models/Post');
const { verifyToken } = require('../../util/is_authenticated');
const { AuthenticationError, UserInputError } = require('apollo-server');

module.exports = {
  Query: {
    posts: async () => {
      try{
        const posts = await Post.find();
        return posts;
      } catch(err) {
        throw new Error(err);
      }
    },

    getPost: async (_, { id }) => {
      try {
        const post = Post.findById(id);
        if (post){
          return post;  
        } else {
          throw new Error('Post not found');
        }
      } catch(err) {
        throw new Error(err);
      }
    }
  },

  Mutation: {
    createPost: async (_, { body, username }, context) => {
      const auth = verifyToken(context);

      if (!auth) {
        throw new AuthenticationError('An authentication header must be provided');
      }

      if(body.trim() === ''){
        throw new UserInputError('Post\'s body must not be empty');
      }

      const newPost = new Post({
        body,
        username,
        createdAt: new Date().toISOString()
      });

      const res = await newPost.save();

      return {
        id: res.id,
        body: res.body,
        username: res.username,
        createdAt: res.createdAt
      }
    },

    deletePost: async (_, { postId }, context) => {
      console.log(postId, context.req.headers);

      try{
        const auth = verifyToken(context);

        if (!auth) {
          throw new AuthenticationError('An authentication header must be provided');
        }

        const post = await Post.findById(postId);

        if(!post){
          throw new Error('Post not found');
        }

        if(auth.username != post.username){
          throw new AuthenticationError('You are not allowed to delete this post');
        }

        await post.delete();
        return 'Post deleted successfully';
      } catch(err) {
        throw new Error(err);
      }
    },

    likePost: async (_, { postId }, context) => {
      const user = verifyToken(context);
      if(user){
        const post = await Post.findById(postId);
        if(!post){
          throw new Error('Post not found');
        }

        const like = await post.likes.find(like => like.username === user.username);

        if(like !== undefined){
          try{
            post.likes = await post.likes.filter(i => i !== like);
            await post.save();

          } catch(err) {
            throw new Error(err);
          }
          return post;

        } else{
          await post.likes.unshift({
            username: user.username,
            postId: postId,
            createdAt: new Date().toISOString()
          });

          await post.save();
          return post;

        }

      }else {
        throw new AuthenticationError('An authentication header must be provided');
      }
    }
   }
};