import { Request, Response } from 'express';

import httpStatus from 'http-status-codes';

import sendResponse from '../../utils/sendResponse';
import catchAsync from '../../utils/catchAsync';
import { MealPreferenceService } from './meal_preference.service';

const getAllMealPreference = catchAsync(async (req: Request, res: Response) => {
  const { userId } = req.params;
  const result = await MealPreferenceService.getMealPreferences(userId);

  sendResponse(res, {
    success: true,
    statusCode: httpStatus.OK,
    message: 'Meals retrieved successfully',
    data: result,
  });
});

const setMealPreferences = catchAsync(async (req: Request, res: Response) => {
  const { userId } = req.params;
  const { dietaryRestrictions, preferredCuisines, portionSize } = req.body;

  // Save or update the meal preferences for the user
  const updatedPreferences = await MealPreferenceService.setMealPreferences(
    userId,
    {
      dietaryRestrictions,
      preferredCuisines,
      portionSize,
    },
  );

  sendResponse(res, {
    success: true,
    statusCode: httpStatus.OK,
    message: 'Meal preferences set successfully',
    data: updatedPreferences,
  });
});

export const MealPreferenceController = {
  getAllMealPreference,
  setMealPreferences,
};
