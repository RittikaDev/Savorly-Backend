import express from 'express';

import auth from '../../middlewares/auth';
import { USER_ROLE } from '../auth/auth.constant';
import { MealPreferenceController } from './meal_preference.controller';

const router = express.Router();

router.get('/:userId', MealPreferenceController.getAllMealPreference);
router.post(
  '/:userId/set',
  auth(USER_ROLE.user),
  MealPreferenceController.setMealPreferences,
);

export const MealPreferenceRoute = router;
