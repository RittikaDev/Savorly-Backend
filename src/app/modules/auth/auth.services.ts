/* eslint-disable @typescript-eslint/no-unused-vars */
/* eslint-disable no-unused-vars */

import httpStatus from 'http-status-codes';

import { IJwtPayload, TUser, TUserAuth } from '../user/user.interface';
import { User } from '../user/user.model';

import AppError from '../../errors/AppError';
import config from '../../config';
import { createToken, verifyToken } from './auth.utils';
import mongoose from 'mongoose';

// eslint-disable-next-line no-undef
export interface IUserDocument extends TUser, Document {}
const createUserIntoDB = async (payload: TUser) => {
  const isUserExits = await User.findOne({ email: payload.email });
  if (isUserExits) {
    throw new AppError(httpStatus.NOT_FOUND, 'User with this email id exists');
  }

  try {
    const userData: Partial<TUser> = payload;

    userData.password = payload.password || (config.default_password as string);

    const newUser = await User.create(userData);

    if (!newUser) {
      throw new AppError(httpStatus.BAD_REQUEST, 'Failed to create a new user');
    }

    return newUser;
  } catch (err) {
    throw new AppError(httpStatus.BAD_REQUEST, 'Failed to create a user');
  }
};

// Function to register user
const registerUser = async (userData: TUser) => {
  const session = await mongoose.startSession();

  try {
    session.startTransaction();

    // Check if the user already exists by email
    const existingUser = await User.findOne({ email: userData.email }).session(
      session,
    );
    if (existingUser) {
      throw new AppError(
        httpStatus.NOT_ACCEPTABLE,
        'User is already registered',
      );
    }

    // Create the user
    const user = new User(userData);
    const createdUser = await user.save({ session });

    await session.commitTransaction();

    return await AuthService.loginUser({
      email: createdUser.email,
      password: userData.password,
    });
  } catch (error) {
    if (session.inTransaction()) await session.abortTransaction();

    throw error;
  } finally {
    session.endSession();
  }
};

const loginUser = async (payload: any) => {
  try {
    const user = await User.isUserExistByEmail(payload.email);
    if (!user) {
      throw new AppError(httpStatus.NOT_FOUND, 'This user is not found!');
    }

    if (user.isBlocked) {
      throw new AppError(httpStatus.FORBIDDEN, 'This user is not active!');
    }
    console.log(payload.password, user, user?.password);
    if (
      !(await User.isPasswordMatched(
        payload.password as string,
        user?.password as string,
      ))
    ) {
      throw new AppError(httpStatus.FORBIDDEN, 'Password does not match');
    }

    const jwtPayload: IJwtPayload = {
      userId: user._id as string,
      name: user.name as string,
      email: user.email as string,
      phone: user.phone as string,
      isBlocked: user.isBlocked,
      role: user.role,
    };

    const accessToken = createToken(
      jwtPayload,
      config.jwt_access_secret as string,
      config.jwt_access_expires_in as string,
    );

    const refreshToken = createToken(
      jwtPayload,
      config.jwt_refresh_secret as string,
      config.jwt_refresh_expires_in as string,
    );

    return {
      accessToken,
      refreshToken,
    };
  } catch (error) {
    throw error;
  }
};

// USER LOGIN
// const userSignIntoDB = async (payload: TUserAuth) => {
//   const user = await User.isUserExistByEmail(payload.email);

//   if (!user) throw new AppError(httpStatus.NOT_FOUND, 'User not found');

//   if (typeof payload.password !== 'string')
//     throw new AppError(httpStatus.BAD_REQUEST, 'Please provide a password');

//   if (
//     !(await User.isPasswordMatched(payload.password, user?.password as string))
//   )
//     throw new AppError(httpStatus.UNAUTHORIZED, 'Invalid credentials');

//   if (user.isBlocked)
//     throw new AppError(
//       httpStatus.FORBIDDEN,
//       'Your account is blocked, you are not allowed to login',
//     );

//   const jwtPayload = {
//     userEmail: user.email,
//     role: user.role,
//   };

//   const accessToken = createToken(
//     jwtPayload,
//     config.jwt_access_secret as string,
//     config.jwt_access_expires_in as string,
//   );
//   const refreshToken = createToken(
//     jwtPayload,
//     config.jwt_refresh_secret as string,
//     config.jwt_refresh_expires_in as string,
//   );

//   // SENT USER DATA WITHOUT PASSWORD
//   const { password, ...userWithoutPassword } = user;

//   return {
//     accessToken,
//     refreshToken,
//     user: userWithoutPassword,
//   };
// };

const getCurrentUser = async (payload: { email: string }) => {
  const user = await User.findOne({ email: payload.email });
  if (!user) throw new AppError(httpStatus.NOT_FOUND, 'User not found');

  return user;
};

const refreshToken = async (token: string) => {
  const decoded = verifyToken(token, config.jwt_refresh_secret as string);

  const { userEmail, iat } = decoded;

  const user = await User.isUserExistByEmail(userEmail);
  if (!user) throw new AppError(httpStatus.NOT_FOUND, 'user is not register');

  if (
    user.passwordChangedAt &&
    User.isJWTIssuedBeforePasswordChanged(user.passwordChangedAt, iat as number)
  ) {
    throw new AppError(httpStatus.UNAUTHORIZED, 'You are not authorized !');
  }

  const jwtPayload = {
    // userEmail: user.email,
    // role: user.role,
    userId: user._id as string,
    name: user.name as string,
    email: user.email as string,
    phone: user.phone as string,
    isBlocked: user.isBlocked,
    role: user.role,
  };

  const accessToken = createToken(
    jwtPayload,
    config.jwt_access_secret as string,
    config.jwt_access_expires_in as string,
  );

  return {
    accessToken,
  };
};

// ADMIN PARTS
const blockUserFromDB = async (id: string) => {
  const deletedStudent = await User.findByIdAndUpdate(
    id,
    { isBlocked: true },
    { new: true },
  );

  if (!deletedStudent)
    throw new AppError(httpStatus.BAD_REQUEST, 'Failed to block the user');

  return deletedStudent;
};

export const AuthService = {
  createUserIntoDB,

  registerUser,
  loginUser,

  // userSignIntoDB,

  getCurrentUser,

  refreshToken,

  blockUserFromDB,
};
