import express from 'express';

import { MealController } from './meal.controller';
import auth from '../../middlewares/auth';
import { USER_ROLE } from '../auth/auth.constant';
import validateRequest from '../../middlewares/validateRequest';
import { MealValidationSchema } from './meal.validation';

const router = express.Router();

router.get('/', MealController.getAllMeals);
router.post(
  '/:providerId/create',
  auth(USER_ROLE.provider),
  validateRequest(MealValidationSchema.CreateMealValidationSchema),
  MealController.createAMeal,
);

export const MealRoute = router;
