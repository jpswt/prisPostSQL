import { Post, Prisma } from '@prisma/client';
import { Context } from '../..';
import { canUserMutatePost } from '../../utils/canMutatePost';

interface PostArgs {
	post: {
		title?: string;
		content?: string;
	};
}

interface PostPayloadType {
	userErrors: {
		message: string;
	}[];
	post: Post | Prisma.Prisma__PostClient<Post> | null;
}

export const postResolvers = {
	postCreate: async (
		_: any,
		{ post }: PostArgs,
		{ prisma, userInfo }: Context
	): Promise<PostPayloadType> => {
		const { title, content } = post;

		if (!userInfo) {
			return {
				userErrors: [
					{
						message: 'User is not authenticated',
					},
				],
				post: null,
			};
		}

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

		return {
			userErrors: [],
			post: await prisma.post.create({
				data: {
					title,
					content,
					authorId: userInfo.userId,
				},
			}),
		};
	},
	postUpdate: async (
		_: any,
		{ post, postId }: { postId: string; post: PostArgs['post'] },
		{ prisma, userInfo }: Context
	): Promise<PostPayloadType> => {
		const { title, content } = post;

		// middleware
		if (!userInfo) {
			return {
				userErrors: [
					{
						message: 'User is not authenticated',
					},
				],
				post: null,
			};
		}
		const error = await canUserMutatePost({
			userId: userInfo.userId,
			postId: Number(postId),
			prisma,
		});

		if (error) return error;
		//
		if (!title && !content) {
			return {
				userErrors: [
					{
						message: 'Need to have a minimum of one field updated',
					},
				],
				post: null,
			};
		}
		const existingPost = await prisma.post.findUnique({
			where: {
				id: Number(postId),
			},
		});
		if (!existingPost) {
			return {
				userErrors: [
					{
						message: 'Post does not exist',
					},
				],
				post: null,
			};
		}

		const updatePayload = {
			title,
			content,
		};

		if (!title) delete updatePayload.title;
		if (!content) delete updatePayload.content;

		return {
			userErrors: [],
			post: prisma.post.update({
				data: {
					...updatePayload,
				},
				where: {
					id: Number(postId),
				},
			}),
		};
	},

	postDelete: async (
		_: any,
		{ postId }: { postId: string },
		{ prisma, userInfo }: Context
	): Promise<PostPayloadType> => {
		const post = await prisma.post.findUnique({
			where: {
				id: Number(postId),
			},
		});

		// middleware
		if (!userInfo) {
			return {
				userErrors: [
					{
						message: 'User is not authenticated',
					},
				],
				post: null,
			};
		}
		const error = await canUserMutatePost({
			userId: userInfo.userId,
			postId: Number(postId),
			prisma,
		});

		if (error) return error;
		//
		if (!post) {
			return {
				userErrors: [
					{
						message: 'Post does not exist',
					},
				],
				post: null,
			};
		}

		await prisma.post.delete({
			where: {
				id: Number(postId),
			},
		});

		return {
			userErrors: [
				{
					message: 'Post Deleted',
				},
			],
			post: null,
		};
	},
	postPublish: async (
		_: any,
		{ postId }: { postId: string },
		{ prisma, userInfo }: Context
	): Promise<PostPayloadType> => {
		if (!userInfo) {
			return {
				userErrors: [
					{
						message: 'Forbidden access (unauthenticated)',
					},
				],
				post: null,
			};
		}

		const error = await canUserMutatePost({
			userId: userInfo.userId,
			postId: Number(postId),
			prisma,
		});

		if (error) return error;

		return {
			userErrors: [],
			post: prisma.post.update({
				where: {
					id: Number(postId),
				},
				data: {
					published: true,
				},
			}),
		};
	},
	postUnpublish: async (
		_: any,
		{ postId }: { postId: string },
		{ prisma, userInfo }: Context
	): Promise<PostPayloadType> => {
		if (!userInfo) {
			return {
				userErrors: [
					{
						message: 'Forbidden access (unauthenticated)',
					},
				],
				post: null,
			};
		}

		const error = await canUserMutatePost({
			userId: userInfo.userId,
			postId: Number(postId),
			prisma,
		});

		if (error) return error;

		return {
			userErrors: [],
			post: prisma.post.update({
				where: {
					id: Number(postId),
				},
				data: {
					published: false,
				},
			}),
		};
	},
};
