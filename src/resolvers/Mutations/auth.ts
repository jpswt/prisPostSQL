import { Context } from '../../index';
import validator from 'validator';
import bcrypt from 'bcrypt';
import JWT from 'jsonwebtoken';
import { JWT_SECRET } from '../../keys';

interface SignupArgs {
	credentials: {
		email: string;
		password: string;
	};
	name: string;
	bio: string;
}

interface SigninArgs {
	credentials: {
		email: string;
		password: string;
	};
}

interface UserPayloadType {
	userErrors: {
		message: string;
	}[];
	token: string | null;
}

export const authResolvers = {
	signup: async (
		_: any,
		{ credentials, name, bio }: SignupArgs,
		{ prisma }: Context
	): Promise<UserPayloadType> => {
		const { email, password } = credentials;
		const isEmail = validator.isEmail(email);

		if (!isEmail) {
			return {
				userErrors: [
					{
						message: 'Email is not valid',
					},
				],
				token: null,
			};
		}

		const isPassword = validator.isLength(password, { min: 5 });

		if (!isPassword) {
			return {
				userErrors: [
					{
						message: 'Password is not long enough',
					},
				],
				token: null,
			};
		}

		if (!name || !bio) {
			return {
				userErrors: [
					{
						message: 'Invalid name or bio',
					},
				],
				token: null,
			};
		}

		const hashedPW = await bcrypt.hash(password, 10);

		const user = await prisma.user.create({
			data: {
				email,
				name,
				password: hashedPW,
			},
		});

		await prisma.profile.create({
			data: {
				bio,
				userId: user.id,
			},
		});

		const token = await JWT.sign(
			{
				userId: user.id,
				userName: user.name,
			},
			JWT_SECRET
		);

		return {
			userErrors: [],
			token,
		};
	},
	signin: async (
		_: any,
		{ credentials }: SigninArgs,
		{ prisma }: Context
	): Promise<UserPayloadType> => {
		const { email, password } = credentials;

		const user = await prisma.user.findUnique({
			where: {
				email,
			},
		});

		if (!user) {
			return {
				userErrors: [
					{
						message: 'Invalid credentials',
					},
				],
				token: null,
			};
		}

		const isMatch = await bcrypt.compare(password, user.password);

		if (!isMatch) {
			return {
				userErrors: [
					{
						message: 'Invalid credentials',
					},
				],
				token: null,
			};
		}

		return {
			userErrors: [],
			token: JWT.sign({ userId: user.id, userName: user.name }, JWT_SECRET),
		};
	},
};
