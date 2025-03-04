import express from 'express';
import auth from '../../middlewares/auth';
import validateRequest from '../../middlewares/validateRequest';
import { USER_ROLE } from './user.constant';
import { UserController } from './user.controller';
import { UserValidations } from './user.validation';
import { OrderController } from '../order/order.controller';

const router = express.Router();

router.put(
  '/profile',
  auth(USER_ROLE.user),
  validateRequest(UserValidations.UpdateUserValidationSchema),
  UserController.updateProfile,
);

router.route('/order').post(auth(USER_ROLE.user), OrderController.createOrder);

router.get('/orders', auth(USER_ROLE.user), OrderController.getUserOrders);

export const CustomerRoute = router;
