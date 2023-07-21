import { Context } from '..';

interface ProfileParent {
	id: number;
	bio: string;
	userId: number;
}

// to find user info with Profile
export const Profile = {
	user: (parent: ProfileParent, _: any, { userInfo, prisma }: Context) => {
		return prisma.user.findUnique({
			where: {
				id: parent.userId,
			},
		});
	},
};
