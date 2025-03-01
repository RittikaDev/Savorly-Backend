import { Request, Response } from 'express';

import { OrderService } from './order.service';

import catchAsync from '../../utils/catchAsync';
import sendResponse from '../../utils/sendResponse';

import httpStatus from 'http-status-codes';

const createOrder = catchAsync(async (req, res) => {
  const user = req.user;

  if (!user)
    res.status(401).json({
      success: false,
      message: 'User is not authenticated',
    });
  else {
    const order = await OrderService.createOrder(user, req.body, req.ip!);

    sendResponse(res, {
      statusCode: httpStatus.CREATED,
      success: true,
      message: 'Order placed successfully',
      data: order,
    });
  }
});

const verifyPayment = catchAsync(async (req, res) => {
  console.log(req);
  const order = await OrderService.verifyPayment(req.query.order_id as string);

  sendResponse(res, {
    statusCode: httpStatus.CREATED,
    success: true,
    message: 'Order verified successfully',
    data: order,
  });
});

const getAllOrders = catchAsync(async (req, res) => {
  const newQuery = { ...req.query };

  const { paginationMetaData, result } = await OrderService.getAllOrders(
    req.user!,
    newQuery,
  );

  sendResponse(res, {
    success: true,
    statusCode: httpStatus.OK,
    message: 'Bookings retrieved successfully',
    paginationMetaData,
    data: result,
  });
});

const getUserOrders = catchAsync(async (req, res) => {
  const newQuery = { ...req.query };

  const { paginationMetaData, result } = await OrderService.getUserOrders(
    req.user!,
    newQuery,
  );
  if (result.length === 0)
    sendResponse(res, {
      success: true,
      statusCode: httpStatus.NOT_FOUND,
      message: 'No bookings found under this user',
      paginationMetaData,
      data: result,
    });
  else
    sendResponse(res, {
      success: true,
      statusCode: httpStatus.OK,
      message: 'Bookings retrieved successfully',
      paginationMetaData,
      data: result,
    });
});

const cancelOrder = catchAsync(async (req, res) => {
  const { orderId } = req.params;

  const updatedOrder = await OrderService.cancelOrder(orderId);
  sendResponse(res, {
    statusCode: httpStatus.CREATED,
    success: true,
    message: 'Order placed successfully',
    data: updatedOrder,
  });
});
const updateOrderStatus = catchAsync(async (req, res) => {
  const { orderId, providerId } = req.params;
  const { status, deliveryDate } = req.body;

  const parsedDeliveryDate = deliveryDate ? new Date(deliveryDate) : null;

  const updatedOrder = await OrderService.updateOrderStatus(
    orderId,
    providerId,
    status,
    parsedDeliveryDate?.toString()!,
  );

  sendResponse(res, {
    statusCode: httpStatus.CREATED,
    success: true,
    message: 'Order status updated',
    data: updatedOrder,
  });
});

const deleteSelectedOrder = catchAsync(async (req: Request, res: Response) => {
  const { orderId, providerId } = req.params;
  const result = await OrderService.deleteSelectedOrder(orderId, providerId);
  sendResponse(res, {
    statusCode: httpStatus.OK,
    success: true,
    message: 'Car deleted successfully',
    data: result,
  });
});

export const OrderController = {
  createOrder,
  verifyPayment,
  getAllOrders,
  getUserOrders,
  cancelOrder,
  updateOrderStatus,
  deleteSelectedOrder,
};
