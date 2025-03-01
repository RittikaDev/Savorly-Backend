import express from 'express';
import validateRequest from '../../middlewares/validateRequest';

import auth from '../../middlewares/auth';
import { USER_ROLE } from './user.constant';
import { UserController } from './user.controller';
import { UserValidations } from './user.validation';

const router = express.Router();

router.post(
  '/update-password',
  auth(USER_ROLE.user, USER_ROLE.provider),
  validateRequest(UserValidations.changePasswordValidationSchema),
  UserController.changePassword,
);

router.patch(
  '/update-profile',
  auth(USER_ROLE.user, USER_ROLE.provider),
  validateRequest(UserValidations.UpdateUserValidationSchema),
  UserController.updateProfile,
);

router.get('/all-users', auth(USER_ROLE.admin), UserController.getAllUsers);

router.patch(
  '/:id/manage-status',
  auth(USER_ROLE.admin),
  validateRequest(UserValidations.ManageStatusValidationSchema),
  UserController.manageUserStatus,
);

export const UserRoute = router;
