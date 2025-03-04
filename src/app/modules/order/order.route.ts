import express from 'express';
import { OrderController } from './order.controller';
import auth from '../../middlewares/auth';
import { USER_ROLE } from '../auth/auth.constant';

const router = express.Router();

router.get('/verify', auth(USER_ROLE.user), OrderController.verifyPayment);

router.patch(
  '/cancel-order/:orderId',
  auth(USER_ROLE.user),
  OrderController.cancelOrder,
);

router.delete(
  '/:orderId/:providerIddelete-order',
  auth(USER_ROLE.provider),
  OrderController.deleteSelectedOrder,
);

export const OrderRoute = router;
