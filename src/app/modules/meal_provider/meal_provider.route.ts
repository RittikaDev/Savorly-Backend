import express from 'express';
import { MealProviderController } from './meal_provider.controller';

const router = express.Router();

// CREATE MEAL PROVIDER PROFILE
router.post(
  '/:userId/create',
  MealProviderController.createMealProviderProfile,
);

// UPDATE MEAL PROVIDER PROFILE
router.put('/:userId/update', MealProviderController.updateMealProviderProfile);

// GET MEAL PROVIDER PROFILE
router.get('/:userId', MealProviderController.getMealProviderProfile);

export const MealProviderRoutes = router;
