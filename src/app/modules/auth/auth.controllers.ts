import httpStatus from 'http-status-codes';
import catchAsync from '../../utils/catchAsync';
import sendResponse from '../../utils/sendResponse';
import { AuthService } from './auth.services';
import config from '../../config';

const createUser = catchAsync(async (req, res) => {
  const userData = req.body;

  const user = await AuthService.createUserIntoDB(userData);

  const responseData = {
    _id: user._id,
    name: user.name,
    email: user.email,
  };

  sendResponse(res, {
    success: true,
    message: 'User registered successfully',
    statusCode: httpStatus.CREATED,
    data: responseData,
  });
});

const registerUser = catchAsync(async (req, res) => {
  const result = await AuthService.registerUser(req.body);

  const { refreshToken, accessToken } = result;

  res.cookie('refreshToken', refreshToken, {
    secure: config.NODE_ENV === 'production',
    httpOnly: true,
    sameSite: 'none',
    maxAge: 1000 * 60 * 60 * 24 * 365,
  });

  sendResponse(res, {
    statusCode: httpStatus.CREATED,
    success: true,
    message: 'User registration completed successfully!',
    data: {
      accessToken,
      refreshToken,
    },
  });
});

const loginUser = catchAsync(async (req, res) => {
  const result = await AuthService.loginUser(req.body);
  const { refreshToken, accessToken } = result;

  res.cookie('refreshToken', refreshToken, {
    secure: config.NODE_ENV === 'production',
    httpOnly: true,
    sameSite: 'none',
    maxAge: 1000 * 60 * 60 * 24 * 365,
  });

  sendResponse(res, {
    statusCode: httpStatus.OK,
    success: true,
    message: 'User logged in successfully!',
    data: {
      accessToken,
      refreshToken,
    },
  });
});

// login user
// const signInUser = catchAsync(async (req, res) => {
//   console.log(req.body);
//   const result = await AuthService.userSignIntoDB(req.body);
//   const { refreshToken, accessToken } = result;

//   res.cookie('refreshToken', refreshToken, {
//     secure: config.NODE_ENV === 'production',
//     httpOnly: true,
//     sameSite: 'none',
//     maxAge: 1000 * 60 * 60 * 24 * 365,
//   });

//   sendResponse(res, {
//     statusCode: httpStatus.OK,
//     success: true,
//     message: 'Login successful',
//     data: {
//       token: `${accessToken}`,
//     },
//   });
// });

const getCurrentUser = catchAsync(async (req, res) => {
  // console.log(req.body);
  const user = await AuthService.getCurrentUser(req.body);
  sendResponse(res, {
    success: true,
    statusCode: httpStatus.OK,
    message: 'User fetched successfully',
    data: user,
  });
});

// refresh Token
const refreshToken = catchAsync(async (req, res) => {
  const { refreshToken } = req.cookies;
  const result = await AuthService.refreshToken(refreshToken);
  sendResponse(res, {
    statusCode: httpStatus.OK,
    success: true,
    message: 'Access token retrived successfully',
    data: result,
  });
});

// ADMIN PARTS
const blockAUser = catchAsync(async (req, res) => {
  // console.log(req);
  const { id } = req.params;
  await AuthService.blockUserFromDB(id);

  sendResponse(res, {
    statusCode: httpStatus.OK,
    success: true,
    message: 'User blocked successfully',
  });
});

export const AuthControllers = {
  createUser,

  registerUser,
  loginUser,

  // signInUser,

  getCurrentUser,

  refreshToken,

  blockAUser,
};
