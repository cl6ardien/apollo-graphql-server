const { gql } = require('apollo-server');

module.exports = gql`
  # Comments in GraphQL are defined with the hash (#) symbol.

  type Comment {
    id: ID!
    body: String!
    username: String!
    createdAt: String!
  }

  type Like {
    id: ID!
    postId: String!
    username: String!
    createdAt: String!
  }

  type Post {
    id: ID!
    body: String!
    username: String!
    createdAt: String!
    comments: [Comment]
    likes: [Like]
    nofComments: Int
    nofLikes: Int
  }

  type User {
    id: ID!
    email: String!
    token: String!
    username: String!
    createdAt: String!
  }

  type Query {
    posts: [Post]!
    getPost(id: String!): Post!
  }

  input RegisterInput {
    username: String!
    password: String!
    confirmPassword: String!
    email: String!
  }

  type Mutation {
    register(input: RegisterInput): User!
    login(username: String!, password: String!): User!
    createPost(body: String!, username: String!): Post
    deletePost(postId: String!): String
    postComment(postId: String!, body: String!): Post!
    deleteComment(postId: String!, commentId: String!): Post!
    likePost(postId: String!): Post!
  }

`;