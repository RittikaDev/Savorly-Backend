import express from 'express';
import { UserValidations } from '../user/user.validation';
import validateRequest from '../../middlewares/validateRequest';
import auth from '../../middlewares/auth';
import { USER_ROLE } from './auth.constant';
import { AuthControllers } from './auth.controllers';

const router = express.Router();

router.post(
  '/register',
  validateRequest(UserValidations.CreateUserValidationSchema),
  AuthControllers.createUser,
);
router.post('/login', AuthControllers.loginUser);
// router.post(
//   '/login',
//   validateRequest(UserValidations.CreateUserValidationSchema),
//   AuthControllers.registerUser,
// );

// router.post(
//   '/login',
//   validateRequest(UserValidations.loginValidationSchema),
//   AuthControllers.signInUser,
// );

router.post('/current-user', AuthControllers.getCurrentUser);

router.post(
  '/refresh-token',
  validateRequest(UserValidations.refreshTokenValidationSchema),
  AuthControllers.refreshToken,
);

// ADMIN
router.patch('/:id/block', auth(USER_ROLE.admin), AuthControllers.blockAUser);

export const AuthRoutes = router;
