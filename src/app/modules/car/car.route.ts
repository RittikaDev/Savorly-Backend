import express from 'express';

import { CarController } from './car.controller';
import { CarValidationSchema } from './car.validation';

import validateRequest from '../../middlewares/validateRequest';
import auth from '../../middlewares/auth';
import { USER_ROLE } from '../auth/auth.constant';

const router = express.Router();

router.post(
  '/',
  auth(USER_ROLE.admin),
  validateRequest(CarValidationSchema.createCarValidationSchema),
  CarController.createACar,
);
router.get('/featured', CarController.getFeaturedCars);
router.get('/brands', CarController.getCarBrandCatModel);
router.get('/', CarController.getAllCars);
router.get('/:carId', CarController.getSingleCar);
router.put(
  '/:carId',
  auth(USER_ROLE.admin),
  validateRequest(CarValidationSchema.updateCarValidationSchema),
  CarController.updateACar,
);
router.delete(
  '/:carId',
  auth(USER_ROLE.admin),
  validateRequest(CarValidationSchema.updateCarValidationSchema),
  CarController.deleteACar,
);

export const CarRoute = router;
