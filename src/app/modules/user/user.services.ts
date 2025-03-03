import { JwtPayload } from 'jsonwebtoken';
import config from '../../config';
import { User } from './user.model';

import bcrypt from 'bcrypt';
import AppError from '../../errors/AppError';
import httpStatus from 'http-status-codes';
import { TUser, UserModel } from './user.interface';
import QueryBuilder from '../../builder/QueryBuilder';
// import { searchableUsers } from '../car/car.constants';
export const searchableUsers = ['name', 'email'];

const changePassword = async (
  userData: JwtPayload,
  payload: { oldPassword: string; newPassword: string },
) => {
  // checking if the user is exist
  const user = await User.isUserExistByEmail(userData.email);

  if (!user) {
    throw new AppError(httpStatus.NOT_FOUND, 'This user is not found !');
  }

  // checking if the user is blocked

  const userStatus = user?.isBlocked;

  if (userStatus)
    throw new AppError(httpStatus.FORBIDDEN, 'This user is blocked ! !');

  //checking if the password is correct

  if (
    !(await User.isPasswordMatched(
      payload.oldPassword,
      user?.password as string,
    ))
  )
    throw new AppError(httpStatus.FORBIDDEN, 'Password do not match');

  //hash new password
  const newHashedPassword = await bcrypt.hash(
    payload.newPassword,
    Number(config.bcrypt_salt_round),
  );

  // console.log('change pass service', newHashedPassword);
  // console.log(userData);

  await User.findOneAndUpdate(
    {
      email: userData.email,
      role: userData.role,
    },
    {
      password: newHashedPassword,
      passwordChangedAt: new Date(),
    },
  );

  return null;
};

const updateProfile = async (userData: JwtPayload, payload: TUser) => {
  const user = await User.isUserExistByEmail(userData.email);
  if (!user) throw new AppError(httpStatus.NOT_FOUND, 'User not found');
  // console.log(payload);
  const updatedUser = await User.findByIdAndUpdate(user._id, payload, {
    new: true,
    runValidators: true,
  });
  if (!updatedUser) throw new AppError(httpStatus.BAD_REQUEST, 'Update failed');

  return updatedUser;
};

const getAllUsers = async (query: Record<string, unknown>) => {
  const carQuery = new QueryBuilder(User.find({}), query)
    .filter()
    .sort()
    .paginate()
    .fields()
    .search(searchableUsers);

  const result = await carQuery.modelQuery;
  const paginationMetaData = await carQuery.countTotal();

  return { result, paginationMetaData };
};

// MANAGING USERS
const manageUserStatus = async (
  id: string,
  payload: Pick<TUser, 'isBlocked'>,
) => {
  const user = await User.findByIdAndUpdate(id, payload, {
    new: true,
    runValidators: true,
  });

  if (!user) throw new AppError(httpStatus.NOT_FOUND, 'User not found');

  return user;
};

export const UserService = {
  changePassword,
  updateProfile,
  getAllUsers,
  manageUserStatus,
};
