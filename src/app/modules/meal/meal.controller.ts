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

export const MealController = {
  createAMeal,
  getAllMeals,
};
