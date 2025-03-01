import express from 'express';
import { OrderController } from './order.controller';
import auth from '../../middlewares/auth';
import { USER_ROLE } from '../auth/auth.constant';

const router = express.Router();

// router.post('/', auth(USER_ROLE.user), OrderController.createOrder);
router
  .route('/')
  .post(auth(USER_ROLE.user), OrderController.createOrder)
  .get(auth(USER_ROLE.provider), OrderController.getAllOrders);

router.get('/verify', auth(USER_ROLE.user), OrderController.verifyPayment);
router.get('/my-bookings', auth(USER_ROLE.user), OrderController.getUserOrders);

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
router.patch(
  '/:orderId/:providerId/status',
  auth(USER_ROLE.provider),
  OrderController.updateOrderStatus,
);

export const OrderRoute = router;
