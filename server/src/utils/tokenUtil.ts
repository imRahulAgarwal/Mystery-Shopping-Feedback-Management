import jwt, { type JwtPayload, type SignOptions } from "jsonwebtoken";

const getJwtSecret = (): string => {
	const secret = process.env.JWT_SECRET;
	if (!secret) {
		throw new Error("JWT_SECRET is not defined");
	}

	return secret;
};

export const generateToken = (payload: string | JwtPayload, expiresIn: number = 86400): string => {
	const options: SignOptions = { expiresIn };
	return jwt.sign(payload, getJwtSecret(), options);
};

export const verifyToken = (token: string): string | JwtPayload => {
	return jwt.verify(token, getJwtSecret());
};
