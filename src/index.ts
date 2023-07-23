import { ApolloServer } from '@apollo/server';
import { startStandaloneServer } from '@apollo/server/standalone';
import { typeDefs } from './schema';
import { Query, Mutation, Profile, Post, User } from './resolvers';
import { PrismaClient, Prisma } from '@prisma/client';
import { DefaultArgs } from '@prisma/client/runtime';
import { getUserFromToken } from './utils/getUserFromToken';

export interface Context {
	prisma: PrismaClient;
	userInfo: {
		userId: number;
		userName: string;
	} | null;
}

export const prisma = new PrismaClient();

const server = new ApolloServer({
	typeDefs,
	resolvers: {
		Query,
		Mutation,
		Profile,
		Post,
		User,
	},
});

const { url } = await startStandaloneServer(server, {
	context: async ({ req }: any): Promise<Context> => {
		const userInfo = await getUserFromToken(req.headers.authorization);
		return {
			prisma,
			userInfo,
		};
	},
});

console.log(`🚀 Server ready at ${url}graphql`);
