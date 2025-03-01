import { Request, Response } from 'express';
import { MealProviderService } from './meal_provider.service';
import catchAsync from '../../utils/catchAsync';
import sendResponse from '../../utils/sendResponse';
import httpStatus from 'http-status-codes';

// CREATE MEAL PROVIDER PROFILE
const createMealProviderProfile = catchAsync(
  async (req: Request, res: Response) => {
    const { userId } = req.params;
    const profileData = req.body;

    const result = await MealProviderService.createMealProviderProfile(
      userId,
      profileData,
    );

    sendResponse(res, {
      statusCode: httpStatus.CREATED,
      success: true,
      message: 'Meal provider profile created successfully',
      data: result,
    });
  },
);

// UPDATE MEAL PROVIDER PROFILE
const updateMealProviderProfile = catchAsync(
  async (req: Request, res: Response) => {
    const { userId } = req.params;
    const profileData = req.body;

    const result = await MealProviderService.updateMealProviderProfile(
      userId,
      profileData,
    );

    sendResponse(res, {
      statusCode: httpStatus.OK,
      success: true,
      message: 'Meal provider profile updated successfully',
      data: result,
    });
  },
);

// GET MEAL PROVIDER PROFILE
const getMealProviderProfile = catchAsync(
  async (req: Request, res: Response) => {
    const { userId } = req.params;

    const result = await MealProviderService.getMealProviderProfile(userId);

    sendResponse(res, {
      statusCode: httpStatus.OK,
      success: true,
      message: 'Meal provider profile fetched successfully',
      data: result,
    });
  },
);

export const MealProviderController = {
  createMealProviderProfile,
  updateMealProviderProfile,
  getMealProviderProfile,
};
