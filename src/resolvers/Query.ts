import { Context } from '..';

export const Query = {
	posts: (_: any, __: any, { prisma }: Context) => {
		return prisma.post.findMany({
			// added this to check for published is true, remove if not needed in future
			where: {
				published: true,
			},
			orderBy: [
				{
					createdAt: 'desc',
				},
			],
		});
	},
	personal: (_: any, ___: any, { prisma, userInfo }: Context) => {
		if (!userInfo) return null;

		return prisma.user.findUnique({
			where: {
				id: userInfo.userId,
			},
		});
	},
	profile: (_: any, { userId }: { userId: string }, { prisma }: Context) => {
		return prisma.profile.findUnique({
			where: {
				userId: Number(userId),
			},
		});
	},
};
