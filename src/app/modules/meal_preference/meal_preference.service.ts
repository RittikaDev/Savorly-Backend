import { MealPreference } from './meal_preference.model';
const getMealPreferences = async (userId: string) => {
  return await MealPreference.findOne({ userId }).exec();
};

// SET USER BASED MEAL PREFERENCE
const setMealPreferences = async (userId: string, preferences: any) => {
  const { dietaryRestrictions, preferredCuisines, portionSize } = preferences;

  // CHECK IF PREFERENCES EXIST FOR THIS USER
  const existingPreferences = await MealPreference.findOne({ userId });

  if (existingPreferences) {
    // UPDATE EXISTING PREFERENCES
    existingPreferences.dietaryRestrictions =
      dietaryRestrictions || existingPreferences.dietaryRestrictions;
    existingPreferences.preferredCuisines =
      preferredCuisines || existingPreferences.preferredCuisines;
    existingPreferences.portionSize =
      portionSize || existingPreferences.portionSize;

    return await existingPreferences.save();
  } else {
    // CREATE NEW PREFERENCES IF THEY DO NOT EXIST
    const newPreferences = new MealPreference({
      userId,
      dietaryRestrictions,
      preferredCuisines,
      portionSize,
    });

    return await newPreferences.save();
  }
};

export const MealPreferenceService = {
  getMealPreferences,

  setMealPreferences,
};
