import { ApolloServer } from '@apollo/server';
import { startStandaloneServer } from '@apollo/server/standalone';
import { typeDefs } from './schema';
import { Query, Mutation } from './resolvers';
import { PrismaClient } from '@prisma/client';
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
