export const Mutation = {
    postCreate: async (_, { title, content }, { prisma }) => {
        if (!title || !content) {
            return {
                userErrors: [
                    {
                        message: 'You must provide title and content to make a post',
                    },
                ],
                post: null,
            };
        }
        const post = await prisma.post.create({
            data: {
                title,
                content,
                authorId: 1,
            },
        });
        return {
            userErrors: [],
            post: post,
        };
    },
};
