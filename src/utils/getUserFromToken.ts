import JWT from 'jsonwebtoken';
import { JWT_SECRET } from '../keys';

export const getUserFromToken = (token: string) => {
	try {
		return JWT.verify(token, JWT_SECRET) as {
			userId: number;
			userName: string;
		};
	} catch (err) {
		return null;
	}
};
