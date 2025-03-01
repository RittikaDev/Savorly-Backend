import { MealProvider } from './meal_provider.model';
import { IMealProvider } from './meal_provider.interface';

import AppError from '../../errors/AppError';
import httpStatus from 'http-status-codes';

// CREATE MEAL PROVIDER PROFILE
const createMealProviderProfile = async (
  userId: string,
  profileData: IMealProvider,
) => {
  const existingProvider = await MealProvider.findOne({ userId });
  if (existingProvider)
    throw new AppError(
      httpStatus.BAD_REQUEST,
      'Provider profile already exists',
    );

  const mealProvider = await MealProvider.create({
    ...profileData,
    userId,
  });

  return mealProvider;
};

// UPDATE MEAL PROVIDER PROFILE
const updateMealProviderProfile = async (
  userId: string,
  profileData: IMealProvider,
) => {
  const existingProvider = await MealProvider.findOneAndUpdate(
    { userId },
    profileData,
    { new: true, runValidators: true },
  );

  if (!existingProvider) {
    throw new AppError(httpStatus.NOT_FOUND, 'Provider profile not found');
  }

  return existingProvider;
};

// GET MEAL PROVIDER PROFILE
const getMealProviderProfile = async (userId: string) => {
  const providerProfile = await MealProvider.findOne({ userId }).populate(
    'menu',
  );
  if (!providerProfile)
    throw new AppError(httpStatus.NOT_FOUND, 'Provider profile not found');

  return providerProfile;
};

export const MealProviderService = {
  createMealProviderProfile,
  updateMealProviderProfile,
  getMealProviderProfile,
};
