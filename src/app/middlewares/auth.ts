import { NextFunction, Request, Response } from 'express';

import httpStatus from 'http-status-codes';
import jwt, { JwtPayload } from 'jsonwebtoken';

import { TRole } from '../modules/user/user.interface';
import { User } from '../modules/user/user.model';

import catchAsync from '../utils/catchAsync';
import AppError from '../errors/AppError';
import config from '../config';

const auth = (...requiredRoles: TRole[]) => {
  return catchAsync(async (req: Request, res: Response, next: NextFunction) => {
    const authHeader = req.headers.authorization;
    if (!authHeader || !authHeader.startsWith('Bearer ')) {
      throw new AppError(
        httpStatus.UNAUTHORIZED,
        'No token was provided or invalid token',
      );
    }

    // SPLIT TOKEN FROM BEARER
    const token = authHeader.split(' ')[1];

    if (!token)
      throw new AppError(httpStatus.UNAUTHORIZED, 'You are not authorized');

    const decoded = jwt.verify(
      token as string,
      config.jwt_access_secret as string,
    ) as JwtPayload;
    // console.log('Token Expiry:', new Date(Number(decoded?.exp) * 1000));

    // eslint-disable-next-line @typescript-eslint/no-unused-vars, no-unused-vars
    const { role, email, iat } = decoded;

    const user = await User.isUserExistByEmail(email);
    if (!user) throw new AppError(httpStatus.NOT_FOUND, 'User not found!');

    if (requiredRoles && !requiredRoles.includes(role)) {
      throw new AppError(
        httpStatus.UNAUTHORIZED,
        'You are not authorized to access this route',
      );
    }

    req.user = decoded as JwtPayload & { role: string };

    next();
  });
};

export default auth;
