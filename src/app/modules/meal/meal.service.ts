import QueryBuilder from '../../builder/QueryBuilder';
import { searchableFields } from './meal.constants';
import { IMeal } from './meal.interface';
import { MealModel } from './meal.model';

import AppError from '../../errors/AppError';
import httpStatus from 'http-status-codes';
import { MealProvider } from '../meal_provider/meal_provider.model';

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

export const MealService = {
  createMealMenu,
  getAllMealsFromDB,
};
