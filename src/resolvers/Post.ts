import { Context } from '..';
import { userLoader } from '../loaders/userLoader';

interface PostParent {
	authorId: number;
	bio: string;
	userId: number;
}

// to find user info within Posts aka all posts for user with give id
// export const Post = {
// 	user: (parent: PostParent, _: any, { userInfo, prisma }: Context) => {
// 		return prisma.user.findUnique({
// 			where: {
// 				id: parent.authorId,
// 			},
// 		});
// 	},
// };

// With Dataloader
export const Post = {
	user: (parent: PostParent, _: any, { userInfo, prisma }: Context) => {
		return userLoader.load(parent.authorId);
	},
};
