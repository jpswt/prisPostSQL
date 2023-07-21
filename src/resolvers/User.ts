import { Context } from '..';

interface UserParent {
	id: number;
}

// to find user info within Posts aka all posts for user with give id
export const User = {
	posts: (parent: UserParent, _: any, { userInfo, prisma }: Context) => {
		const isOwnProfile = parent.id === userInfo?.userId;

		if (isOwnProfile) {
			return prisma.post.findMany({
				where: {
					authorId: parent.id,
				},
				orderBy: {
					createdAt: 'desc',
				},
			});
		} else {
			return prisma.post.findMany({
				where: {
					authorId: parent.id,
					published: true,
				},
				orderBy: {
					createdAt: 'desc',
				},
			});
		}
	},
};
