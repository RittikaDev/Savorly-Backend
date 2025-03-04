import catchAsync from '../../utils/catchAsync';
import sendResponse from '../../utils/sendResponse';
import { UserService } from './user.services';
import httpStatus from 'http-status-codes';

const changePassword = catchAsync(async (req, res) => {
  const { ...passwordData } = req.body;

  const result = await UserService.changePassword(req.user!, passwordData);
  sendResponse(res, {
    statusCode: httpStatus.OK,
    success: true,
    message: 'Password is updated succesfully!',
    data: result,
  });
});

// USER: UPDATE PROFILE
const updateProfile = catchAsync(async (req, res) => {
  const updatedUser = await UserService.updateProfile(req.user!, req.body);
  sendResponse(res, {
    success: true,
    statusCode: httpStatus.OK,
    message: 'User profile updated successfully',
    data: updatedUser,
  });
});

const getAllProviders = catchAsync(async (req, res) => {
  const { paginationMetaData, result } = await UserService.getAllProviders(
    req.query,
  );

  sendResponse(res, {
    success: true,
    statusCode: httpStatus.OK,
    message: 'Cars retrieved successfully',
    paginationMetaData,
    data: result,
  });
});
const getAllUsers = catchAsync(async (req, res) => {
  const { paginationMetaData, result } = await UserService.getAllUsers(
    req.query,
  );

  sendResponse(res, {
    success: true,
    statusCode: httpStatus.OK,
    message: 'Cars retrieved successfully',
    paginationMetaData,
    data: result,
  });
});

// MANAGING USERS
const manageUserStatus = catchAsync(async (req, res) => {
  const { id } = req.params;
  const updatedUser = await UserService.manageUserStatus(id, req.body);
  sendResponse(res, {
    success: true,
    statusCode: httpStatus.OK,
    message: 'User status updated successfully',
    data: updatedUser,
  });
});

export const UserController = {
  updateProfile,
  changePassword,
  getAllUsers,
  manageUserStatus,
  getAllProviders,
};
