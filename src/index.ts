import { ApolloServer } from '@apollo/server';
import { startStandaloneServer } from '@apollo/server/standalone';
import { typeDefs } from './schema';
import { Query } from './resolvers';

const server = new ApolloServer({
	typeDefs,
	resolvers: {
		Query,
	},
});

const { url } = await startStandaloneServer(server);

console.log(`🚀 Server ready at ${url}`);
