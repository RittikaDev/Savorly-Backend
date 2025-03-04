import QueryBuilder from '../../builder/QueryBuilder';
import { searchableFields } from './meal.constants';
import { IMeal } from './meal.interface';
import { MealModel } from './meal.model';

import AppError from '../../errors/AppError';
import httpStatus from 'http-status-codes';
import { MealProvider } from '../meal_provider/meal_provider.model';
import { MealPreference } from '../meal_preference/meal_preference.model';
import { JwtPayload } from 'jsonwebtoken';
import { User } from '../user/user.model';

// CREATE A NEW MEAL
const createMealMenu = async (
  user: JwtPayload,
  mealData: IMeal,
): Promise<IMeal> => {
  const userDetails = await User.findOne({ email: user.email });

  const providerExists = await MealProvider.findOne({
    userId: userDetails?._id,
  });

  if (!providerExists)
    throw new AppError(httpStatus.NOT_FOUND, 'Provider does not exist');

  const result = await MealModel.create({
    ...mealData,
    providerId: providerExists._id,
  });
  return result;
};

// UPDATE PROVIDER BASED MEAL
const updateMealMenu = async (
  mealId: string,
  user: JwtPayload,
  updatedData: Partial<IMeal>,
): Promise<IMeal | null> => {
  const userDetails = await User.findOne({ email: user.email });

  const providerExists = await MealProvider.findOne({
    userId: userDetails?._id,
  });

  if (!providerExists)
    throw new AppError(httpStatus.NOT_FOUND, 'Provider does not exist');

  // const providerExists = await MealProvider.findOne({ userId: providerId });
  // console.log(providerExists, mealId, providerId);

  // Check if the meal exists and belongs to the provider
  const meal = await MealModel.findOne({
    _id: mealId,
    providerId: providerExists._id,
  });

  if (!meal)
    throw new AppError(httpStatus.NOT_FOUND, 'Meal not found or unauthorized');

  // Update the meal with the new data
  const updatedMeal = await MealModel.findByIdAndUpdate(
    mealId,
    { $set: updatedData },
    { new: true, runValidators: true },
  );

  return updatedMeal;
};

// DELETE PROVIDER BASED MENU
const deleteMealMenu = async (
  mealId: string,
  providerId: string,
): Promise<IMeal | null> => {
  // Check if the meal exists and belongs to the provider
  const meal = await MealModel.findOne({ _id: mealId, providerId });

  if (!meal)
    throw new AppError(httpStatus.NOT_FOUND, 'Meal not found or unauthorized');

  // Delete the meal
  const deletedMeal = await MealModel.findByIdAndDelete(mealId);

  return deletedMeal;
};

// GET ALL MEALS
const getAllMealsFromDB = async (query: Record<string, unknown>) => {
  const carQuery = new QueryBuilder(MealModel.find({}), query)
    .filter()
    .sort()
    .paginate()
    .fields()
    .search(searchableFields);

  const result = await carQuery.modelQuery;
  const paginationMetaData = await carQuery.countTotal();

  return { result, paginationMetaData };
};

// GET PROVIDER SPECEFIC MEALS
const getProviderSpecificMeals = async (
  providerData: JwtPayload,
  query: Record<string, unknown>,
) => {
  console.log(providerData);
  const user = await User.findOne({ email: providerData.email });
  if (!user) throw new AppError(httpStatus.NOT_FOUND, 'User not found');

  const providerExists = await MealProvider.findOne({ userId: user._id });
  if (!providerExists)
    throw new AppError(httpStatus.NOT_FOUND, 'Provider does not exist');

  const mealQuery = new QueryBuilder(
    MealModel.find({ providerId: providerExists._id }),
    query,
  )
    .filter()
    .sort()
    .paginate()
    .fields()
    .search(searchableFields);

  const result = await mealQuery.modelQuery;
  const paginationMetaData = await mealQuery.countTotal();

  // console.log(paginationMetaData);

  return { result, paginationMetaData };
};

// GET AVAILABLE MEALS BASED ON PREFERENCE SET
export const getPreferredMealsFromDB = async (
  userId: string,
  query: Record<string, unknown>,
) => {
  // First, check if the user has preferences
  const preferences = await MealPreference.findOne({ userId });

  let mealQuery = MealModel.find({});

  // If preferences exist, filter meals based on them
  if (preferences) {
    const { dietaryRestrictions, preferredCuisines, portionSize } = preferences;

    if (dietaryRestrictions && dietaryRestrictions.length > 0)
      mealQuery = mealQuery.where('dietaryPreferences').in(dietaryRestrictions);

    if (preferredCuisines && preferredCuisines.length > 0)
      mealQuery = mealQuery.where('cuisineType').in(preferredCuisines);

    if (portionSize)
      mealQuery = mealQuery.where('portionSize').equals(portionSize);
  }

  const mealQueryBuilder = new QueryBuilder(mealQuery, query)
    .filter()
    .sort()
    .paginate()
    .fields()
    .search(searchableFields);

  const result = await mealQueryBuilder.modelQuery;
  const paginationMetaData = await mealQueryBuilder.countTotal();

  return { result, paginationMetaData };
};

// GET MEALS BASED ON CUISINE, DIETERY PREFERENCE, RATINGS AND AVAILABILITY
const getAllCuisine = async () => {
  const uniqueCuisines = await MealModel.distinct('cuisineType'); // Get distinct cuisines
  return {
    meta: { total: uniqueCuisines.length }, // Meta info with total unique cuisines
    result: uniqueCuisines,
  };
};
const getDietaryPreference = async () => {
  const uniqueDietaryPreferences = await MealModel.aggregate([
    { $unwind: '$dietaryPreferences' }, // Flatten the array
    { $group: { _id: '$dietaryPreferences' } }, // Group by unique values
    { $sort: { _id: 1 } }, // Sort alphabetically
    { $project: { _id: 0, dietaryPreference: '$_id' } }, // Restructure output
  ]);

  // console.log('Diet Pre', uniqueDietaryPreferences);

  return {
    meta: { total: uniqueDietaryPreferences.length },
    result: uniqueDietaryPreferences.map((d) => d.dietaryPreference), // Extract values
  };
};

export const MealService = {
  createMealMenu,

  updateMealMenu,
  deleteMealMenu,

  getAllMealsFromDB,
  getProviderSpecificMeals,
  getPreferredMealsFromDB,

  getAllCuisine,
  getDietaryPreference,
};
