import { Request, Response } from 'express';

import httpStatus from 'http-status-codes';

import { MealService } from './meal.service';

import sendResponse from '../../utils/sendResponse';
import catchAsync from '../../utils/catchAsync';

// CREATE A NEW MEAL MENU
const createAMeal = catchAsync(async (req: Request, res: Response) => {
  const { providerId } = req.params;
  const mealData = req.body;
  const result = await MealService.createMealMenu(providerId, mealData);

  sendResponse(res, {
    statusCode: httpStatus.OK,
    success: true,
    message: 'Meal created successfully',
    data: result,
  });
});

const updateMealMenu = catchAsync(async (req: Request, res: Response) => {
  const { mealId, providerId } = req.params;
  const updateData = req.body;

  // AT LEAST HAS TO BE PROVIDED
  if (Object.keys(updateData).length === 0) {
    sendResponse(res, {
      statusCode: httpStatus.BAD_REQUEST,
      success: false,
      message: 'At least one field must be provided for update',
      data: [],
    });
    return;
  }

  const result = await MealService.updateMealMenu(
    mealId,
    providerId,
    updateData,
  );

  sendResponse(res, {
    statusCode: httpStatus.OK,
    success: true,
    message: 'Meal updated successfully',
    data: result,
  });
});

const deleteMealMenu = catchAsync(async (req: Request, res: Response) => {
  const { mealId, providerId } = req.params;
  const result = await MealService.deleteMealMenu(mealId, providerId);
  sendResponse(res, {
    statusCode: httpStatus.OK,
    success: true,
    message: 'Meal deleted successfully',
    data: result,
  });
});

const getAllMeals = catchAsync(async (req: Request, res: Response) => {
  const { paginationMetaData, result } = await MealService.getAllMealsFromDB(
    req.query,
  );

  sendResponse(res, {
    success: true,
    statusCode: httpStatus.OK,
    message: 'Meals retrieved successfully',
    paginationMetaData,
    data: result,
  });
});

const getProviderSpecificMeals = catchAsync(
  async (req: Request, res: Response) => {
    const { paginationMetaData, result } =
      await MealService.getProviderSpecificMeals(req.user!, req.query);

    sendResponse(res, {
      success: true,
      statusCode: httpStatus.OK,
      message: 'Meals retrieved successfully',
      paginationMetaData,
      data: result,
    });
  },
);

const getPreferredMeals = catchAsync(async (req: Request, res: Response) => {
  const { userId } = req.params;
  const { paginationMetaData, result } =
    await MealService.getPreferredMealsFromDB(userId, req.query);

  sendResponse(res, {
    success: true,
    statusCode: httpStatus.OK,
    message: 'Preferred meals retrieved successfully',
    paginationMetaData,
    data: result,
  });
});

export const MealController = {
  createAMeal,

  updateMealMenu,
  deleteMealMenu,

  getAllMeals,
  getProviderSpecificMeals,
  getPreferredMeals,
};
