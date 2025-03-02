import { CarModel } from '../car/car.model';

import OrderModel from './order.model';
import { orderUtils } from './order.utils';

import { User } from '../user/user.model';

import AppError from '../../errors/AppError';
import QueryBuilder from '../../builder/QueryBuilder';

import httpStatus from 'http-status-codes';
import { JwtPayload } from 'jsonwebtoken';
import { MealModel } from '../meal/meal.model';
import { MealProvider } from '../meal_provider/meal_provider.model';

const createOrder = async (
  user: JwtPayload,
  payload: {
    meals: { meal: string; quantity: number }[];
    address?: {
      address: string;
      city: string;
      phone: string;
    };
    scheduledDelivery: Date;
    providerId: string;
    dietaryPreferences?: string[];
    spiceLevel?: string[];
    extraSauce?: string[];
  },
  client_ip: string,
) => {
  if (!payload?.meals?.length)
    throw new AppError(httpStatus.NOT_ACCEPTABLE, 'Order is not specified');

  const meals = payload.meals;

  let totalPrice = 0;
  const mealDetails = await Promise.all(
    meals.map(async (item) => {
      const meal = await MealModel.findById(item.meal);
      if (meal) {
        if (!meal.availability) {
          throw new AppError(
            httpStatus.BAD_REQUEST,
            'Meal is not available, can not place an order',
          );
        }
        const subtotal = (meal.price || 0) * item.quantity;
        totalPrice += subtotal;

        await meal.save();

        return { meal: item.meal, quantity: Number(item.quantity) }; // ✅ Ensure quantity is a number
      }
    }),
  );

  const userDetails = await User.findOne({ email: user.email });
  console.log('user details', userDetails);

  const address = {
    address: userDetails?.address || payload?.address?.address || '',
    city: userDetails?.city || payload?.address?.city || '',
    phone: userDetails?.phone || payload?.address?.phone || '',
  };

  console.log(address);

  // let order = await OrderModel.create({
  //   user: userDetails?._id,
  //   meals: mealDetails,
  //   totalPrice,
  // });

  const scheduledDelivery = payload.scheduledDelivery;

  let order = await OrderModel.create({
    customerId: userDetails?._id,
    providerId: payload.providerId,
    mealId: meals.map((item) => item.meal),
    quantity: meals.map((item) => item.quantity),
    totalPrice,
    address: address.address,
    scheduledDelivery,
    dietaryPreferences: payload.dietaryPreferences,
    spiceLevel: payload.spiceLevel,
    extraSauce: payload.extraSauce,
    transaction: {},
  });

  // payment integration
  const shurjopayPayload = {
    amount: totalPrice,
    order_id: order._id,
    currency: 'BDT',
    customer_name: userDetails?.name,
    customer_address: address?.address,
    customer_email: userDetails?.email,
    customer_phone: address?.phone,
    customer_city: address?.city,
    client_ip,
  };
  // console.log('inside order service', shurjopayPayload);

  const payment = await orderUtils.makePaymentAsync(shurjopayPayload);

  // console.log(payment);

  if (payment?.transactionStatus) {
    order = await order.updateOne({
      transaction: {
        id: payment.sp_order_id,
        transactionStatus: payment.transactionStatus,
      },
    });
  }

  return payment.checkout_url;
};

const verifyPayment = async (order_id: string) => {
  console.log(order_id);
  const verifiedPayment = await orderUtils.verifyPaymentAsync(order_id);

  // console.log(verifiedPayment);

  if (verifiedPayment.length) {
    await OrderModel.findOneAndUpdate(
      {
        'transaction.id': order_id,
      },
      {
        'transaction.bank_status': verifiedPayment[0].bank_status,
        'transaction.sp_code': verifiedPayment[0].sp_code,
        'transaction.sp_message': verifiedPayment[0].sp_message,
        'transaction.transactionStatus': verifiedPayment[0].transaction_status,
        'transaction.method': verifiedPayment[0].method,
        'transaction.date_time': verifiedPayment[0].date_time,
        status:
          verifiedPayment[0].bank_status == 'Success'
            ? 'Pending'
            : verifiedPayment[0].bank_status == 'Failed'
              ? 'Pending'
              : verifiedPayment[0].bank_status == 'Cancel'
                ? 'Cancelled'
                : '',
      },
    );
  }

  // console.log(verifiedPayment);
  return verifiedPayment;
};

// GET ALL ORDERS : ADMIN
const getAllOrders = async (
  providerData: JwtPayload,
  query: Record<string, unknown>,
) => {
  const user = await User.findOne({ email: providerData.email });
  if (!user) throw new AppError(httpStatus.NOT_FOUND, 'User not found');

  const orderQuery = new QueryBuilder(
    OrderModel.find({ providerId: user._id })
      .populate('customerId')
      .populate('mealId'),
    query,
  )
    .filter()
    .sort()
    .paginate()
    .fields();

  const result = await orderQuery.modelQuery;
  const paginationMetaData = await orderQuery.countTotal();

  return { result, paginationMetaData };
};

// USER SPECIFIC ORDERS
const getUserOrders = async (
  userData: JwtPayload,
  query: Record<string, unknown>,
) => {
  const user = await User.findOne({ email: userData.email });
  if (!user) throw new AppError(httpStatus.NOT_FOUND, 'User not found');

  const userBookingQuery = new QueryBuilder(
    OrderModel.find({ customerId: user._id })
      .populate('customerId')
      .populate('mealId'),
    query,
  )
    .filter()
    .sort()
    .paginate()
    .fields();

  const result = await userBookingQuery.modelQuery;
  const paginationMetaData = await userBookingQuery.countTotal();

  return { result, paginationMetaData };
};

const cancelOrder = async (orderId: string) => {
  const order = await OrderModel.findById(orderId);

  if (!order) throw new AppError(httpStatus.NOT_FOUND, 'Order not found');

  if (order.status === 'Delivered') {
    throw new AppError(
      httpStatus.BAD_REQUEST,
      'Cannot cancel an order that is already shipped or delivered',
    );
  }

  // Update the status to 'Cancelled'
  order.status = 'Cancelled';
  await order.save();

  return order;
};

type OrderStatus = 'Pending' | 'In progress' | 'Delivered' | 'Cancelled';

const updateOrderStatus = async (
  orderId: string,
  providerId: string,
  status: OrderStatus,
  deliveryDate: string,
) => {
  const validStatuses = ['Pending', 'In progress', 'Delivered', 'Cancelled'];

  if (!validStatuses.includes(status))
    throw new AppError(httpStatus.BAD_REQUEST, 'Invalid status');

  const order = await OrderModel.findById({ _id: orderId, providerId });

  if (!order) throw new AppError(httpStatus.NOT_FOUND, 'Order not found');

  // Update the status and delivery date
  order.status = status;
  if (deliveryDate) order.deliveryDate = deliveryDate;

  await order.save();

  return order;
};

const deleteSelectedOrder = async (orderId: string, providerId: string) => {
  const isOrderExists = await OrderModel.findById(orderId);

  if (!isOrderExists)
    throw new AppError(httpStatus.BAD_REQUEST, 'Order does not exist');

  const deletedOrder = await OrderModel.findByIdAndDelete({
    _id: orderId,
    providerId,
  });

  return deletedOrder;
};

export const OrderService = {
  createOrder,
  verifyPayment,
  getAllOrders,
  getUserOrders,
  cancelOrder,
  updateOrderStatus,
  deleteSelectedOrder,
};
