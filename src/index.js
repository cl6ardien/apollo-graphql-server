const { ApolloServer } = require('apollo-server');
const mongoose = require('mongoose');
const { AtlasURL } = require('./config');
const Post = require('./models/Post');

// graphql
const typeDefs = require('./graphql/typeDefs');
const resolvers = require('./graphql/resolvers');

const server = new ApolloServer({
	typeDefs,
	resolvers,
	context: ({ req }) => ({ req })
});

mongoose.connect(AtlasURL, { useCreateIndex: true, useNewUrlParser: true })
.then(() => console.log('** MongoDB connection established'))
.then(server.listen({ port: 5000 }).then(({url}) => {
  console.log(`** Server ready at ${url}`);
}));