import express from 'express';

import { MealController } from './meal.controller';
import auth from '../../middlewares/auth';
import { USER_ROLE } from '../auth/auth.constant';
import validateRequest from '../../middlewares/validateRequest';
import { MealValidationSchema } from './meal.validation';

const router = express.Router();

router.get('/', MealController.getAllMeals);

router.get('/cusine', MealController.getAllCuisine);
router.get('/dieteryPreference', MealController.getDietaryPreference);

router.get(
  '/provider-meals',
  auth(USER_ROLE.provider),
  MealController.getProviderSpecificMeals,
);

router.get('/:userId/preffered', MealController.getPreferredMeals);

router.post(
  '/:userId/create',
  auth(USER_ROLE.provider),
  validateRequest(MealValidationSchema.CreateMealValidationSchema),
  MealController.createAMeal,
);

router.put(
  '/:mealId/:providerId',
  auth(USER_ROLE.provider),
  validateRequest(MealValidationSchema.UpdateMealValidationSchema),
  MealController.updateMealMenu,
);
router.delete(
  '/:mealId/:providerId',
  auth(USER_ROLE.provider),
  validateRequest(MealValidationSchema.UpdateMealValidationSchema),
  MealController.deleteMealMenu,
);

export const MealRoute = router;
