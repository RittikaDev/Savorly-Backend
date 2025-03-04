import express from 'express';
import auth from '../../middlewares/auth';
import validateRequest from '../../middlewares/validateRequest';
import { USER_ROLE } from './user.constant';
import { MealController } from '../meal/meal.controller';
import { MealValidationSchema } from '../meal/meal.validation';
import { OrderController } from '../order/order.controller';

const router = express.Router();

router.post(
  '/menu',
  auth(USER_ROLE.provider),
  validateRequest(MealValidationSchema.CreateMealValidationSchema),
  MealController.createAMeal,
);

router.put(
  '/menu',
  auth(USER_ROLE.provider),
  validateRequest(MealValidationSchema.UpdateMealValidationSchema),
  MealController.updateMealMenu,
);

router
  .route('/orders')
  .get(auth(USER_ROLE.provider), OrderController.getAllOrders);

router.put(
  //   '/response/:orderId/:providerId',
  '/response',
  auth(USER_ROLE.provider),
  OrderController.updateOrderStatus,
);

export const ProviderRoute = router;
