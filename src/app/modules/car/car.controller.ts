import { Request, Response } from 'express';

import httpStatus from 'http-status-codes';

import { CarService } from './car.service';

import sendResponse from '../../utils/sendResponse';
import catchAsync from '../../utils/catchAsync';

const createACar = catchAsync(async (req: Request, res: Response) => {
  const result = await CarService.createCarIntoDB(req.body);

  sendResponse(res, {
    statusCode: httpStatus.OK,
    success: true,
    message: 'Car created successfully',
    data: result,
  });
});

const getFeaturedCars = catchAsync(async (req: Request, res: Response) => {
  const result = await CarService.getFeaturedCarsFromDB();

  sendResponse(res, {
    success: true,
    statusCode: httpStatus.OK,
    message: 'Featured cars retrieved successfully',
    data: result,
  });
});
const getCarBrandCatModel = catchAsync(async (req: Request, res: Response) => {
  const result = await CarService.getCarBrandCatModel();

  sendResponse(res, {
    success: true,
    statusCode: httpStatus.OK,
    message: 'Brand names retrieved successfully',
    data: result,
  });
});

const getAllCars = catchAsync(async (req: Request, res: Response) => {
  const { paginationMetaData, result } = await CarService.getAllCarsFromDB(
    req.query,
  );

  sendResponse(res, {
    success: true,
    statusCode: httpStatus.OK,
    message: 'Cars retrieved successfully',
    paginationMetaData,
    data: result,
  });
});

const getSingleCar = catchAsync(async (req: Request, res: Response) => {
  const { carId } = req.params;
  const result = await CarService.getSingleCarFromDB(carId);

  if (result != null) {
    sendResponse(res, {
      statusCode: httpStatus.OK,
      success: true,
      message: 'Car retrieved successfully',
      data: result,
    });
  } else
    sendResponse(res, {
      statusCode: httpStatus.NOT_FOUND,
      success: false,
      message: 'No Data Found',
      data: [],
    });
});

const updateACar = catchAsync(async (req: Request, res: Response) => {
  const { carId } = req.params;
  const updateData = req.body;

  // AT LEAST HAS TO BE PROVIDED
  if (Object.keys(updateData).length === 0) {
    sendResponse(res, {
      statusCode: httpStatus.BAD_REQUEST,
      success: false,
      message: 'At least one field must be provided for update',
      data: [],
    });
    return;
  }

  const result = await CarService.updateACarIntoDB(carId, updateData);

  sendResponse(res, {
    statusCode: httpStatus.OK,
    success: true,
    message: 'Car updated successfully',
    data: result,
  });
});

const deleteACar = catchAsync(async (req: Request, res: Response) => {
  const { carId } = req.params;
  const result = await CarService.deleteACarFromDB(carId);
  sendResponse(res, {
    statusCode: httpStatus.OK,
    success: true,
    message: 'Car deleted successfully',
    data: result,
  });
});

export const CarController = {
  createACar,
  getFeaturedCars,
  getCarBrandCatModel,
  getAllCars,
  getSingleCar,
  updateACar,
  deleteACar,
};
