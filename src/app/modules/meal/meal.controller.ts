import { Request, Response } from 'express';

import httpStatus from 'http-status-codes';

import { MealService } from './meal.service';

import sendResponse from '../../utils/sendResponse';
import catchAsync from '../../utils/catchAsync';

// CREATE A NEW MEAL MENU
const createAMeal = catchAsync(async (req: Request, res: Response) => {
  // const { userId } = req.params;

  const user = req.user;

  const mealData = req.body;
  // const result = await MealService.createMealMenu(userId, mealData);
  const result = await MealService.createMealMenu(user!, mealData);

  sendResponse(res, {
    statusCode: httpStatus.OK,
    success: true,
    message: 'Meal created successfully',
    data: result,
  });
});

const updateMealMenu = catchAsync(async (req: Request, res: Response) => {
  // const { mealId, providerId } = req.params;
  const user = req.user;
  const updateData = req.body;
  const mealId = updateData._id;

  // console.log(mealId, updateData);

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

  const result = await MealService.updateMealMenu(mealId, user!, updateData);

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

const getAllCuisine = catchAsync(async (req, res) => {
  const result = await MealService.getAllCuisine();

  sendResponse(res, {
    statusCode: httpStatus.OK,
    success: true,
    message: 'Cuisine Types  are retrieved successfully',
    paginationMetaData: result.meta,
    data: result.result,
  });
});

const getDietaryPreference = catchAsync(async (req, res) => {
  const result = await MealService.getDietaryPreference();
  console.log(result);

  sendResponse(res, {
    statusCode: httpStatus.OK,
    success: true,
    message: 'Dietery Preferred meals are retrieved successfully',
    paginationMetaData: result.meta,
    data: result.result,
  });
});

export const MealController = {
  createAMeal,

  updateMealMenu,
  deleteMealMenu,

  getAllMeals,
  getProviderSpecificMeals,
  getPreferredMeals,

  getAllCuisine,
  getDietaryPreference,
};
