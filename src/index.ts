import { ApolloServer } from '@apollo/server';
import { startStandaloneServer } from '@apollo/server/standalone';
import { typeDefs } from './schema';
import { Query, Mutation, Profile, Post, User } from './resolvers';
import { PrismaClient, Prisma } from '@prisma/client';
import { DefaultArgs } from '@prisma/client/runtime';
import { getUserFromToken } from './utils/getUserFromToken';
import express from 'express';
import cors from 'cors';
import { expressMiddleware as apolloMiddleware } from '@apollo/server/express4';

const PORT = 4000;

const app = express();
app.use(cors(), express.json());
export interface Context {
	prisma: PrismaClient;
	userInfo: {
		userId: number;
		userName: string;
	} | null;
}

export const prisma = new PrismaClient();

// const server = new ApolloServer({
// 	typeDefs,
// 	resolvers: {
// 		Query,
// 		Mutation,
// 		Profile,
// 		Post,
// 		User,
// 	},
// });
const apolloServer = new ApolloServer({
	typeDefs,
	resolvers: {
		Query,
		Mutation,
		Profile,
		Post,
		User,
	},
});

await apolloServer.start();
app.use(
	'/graphql',
	apolloMiddleware(apolloServer, {
		context: async ({ req }: any): Promise<Context> => {
			const userInfo = await getUserFromToken(req.headers.authorization);
			return {
				prisma,
				userInfo,
			};
		},
	})
);

app.use('/', (req, res) => {
	res.json('welcome to my server');
});

app.listen({ port: PORT }, () => {
	console.log(`Server running on port ${PORT}`);
	console.log(`Graphql endpoint is http://localhost:${PORT}/graphql`);
});

// const { url } = await startStandaloneServer(server, {
// 	context: async ({ req }: any): Promise<Context> => {
// 		const userInfo = await getUserFromToken(req.headers.authorization);
// 		return {
// 			prisma,
// 			userInfo,
// 		};
// 	},
// });

// console.log(`🚀 Server ready at ${url}graphql`);
