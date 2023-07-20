import { ApolloServer } from '@apollo/server';
import { startStandaloneServer } from '@apollo/server/standalone';
import { typeDefs } from './schema';
import { Query, Mutation } from './resolvers';
import { PrismaClient, Prisma } from '@prisma/client';
import { DefaultArgs } from '@prisma/client/runtime';

export interface Context {
	prisma: PrismaClient;
}

const prisma = new PrismaClient();

const server = new ApolloServer({
	typeDefs,
	resolvers: {
		Query,
		Mutation,
	},
});

const { url } = await startStandaloneServer(server, {
	context: async () => ({
		prisma,
	}),
});

console.log(`🚀 Server ready at ${url}`);
