import QueryBuilder from '../../builder/QueryBuilder';
import { preferredFields, searchableFields } from './meal.constants';
import { IMeal } from './meal.interface';
import { MealModel } from './meal.model';

import AppError from '../../errors/AppError';
import httpStatus from 'http-status-codes';
import { MealProvider } from '../meal_provider/meal_provider.model';
import { MealPreference } from '../meal_preference/meal_preference.model';

// CREATE A NEW MEAL
const createMealMenu = async (
  providerId: string,
  mealData: IMeal,
): Promise<IMeal> => {
  const providerExists = await MealProvider.findOne({ _id: providerId });

  if (!providerExists)
    throw new AppError(httpStatus.NOT_FOUND, 'Provider does not exist');

  const result = await MealModel.create({
    ...mealData,
    providerId: providerId,
  });
  return result;
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

export const MealService = {
  createMealMenu,
  getAllMealsFromDB,
  getPreferredMealsFromDB,
};
