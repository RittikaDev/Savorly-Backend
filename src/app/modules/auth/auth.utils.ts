import jwt, { JwtPayload } from 'jsonwebtoken';
import { IJwtPayload } from '../user/user.interface';

export const createToken = (
  // jwtPayload: { userEmail: string; role: string },
  jwtPayload: IJwtPayload,
  secret: string,
  expiresIn: string,
) => {
  return jwt.sign(jwtPayload, secret, { expiresIn });
};

export const verifyToken = (token: string, secret: string) => {
  return jwt.verify(token, secret) as JwtPayload;
};
