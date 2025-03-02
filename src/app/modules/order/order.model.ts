import { model, Schema } from 'mongoose';
import { IOrder } from './order.interface';

const OrderSchema = new Schema<IOrder>(
  {
    customerId: {
      type: Schema.Types.ObjectId,
      ref: 'User',
      required: true,
    },
    mealId: {
      type: Schema.Types.ObjectId,
      ref: 'Meal',
      required: true,
    },
    providerId: {
      type: Schema.Types.ObjectId,
      ref: 'User',
      required: true,
    },
    quantity: { type: [Number], required: true, default: [1] },
    dietaryPreferences: { type: [String], default: [] },
    spiceLevel: { type: [String], default: [] },
    extraSauce: { type: [String], default: [] },
    status: {
      type: String,
      enum: ['Pending', 'In progress', 'Delivered', 'Cancelled'],
      default: 'Pending',
    },
    scheduledDelivery: { type: Date, required: true },
    totalPrice: { type: Number, required: true },
    address: { type: String, required: true },
    transaction: {
      id: { type: String },
      transactionStatus: { type: String },
      bank_status: { type: String },
      sp_code: { type: String },
      sp_message: { type: String },
      method: { type: String }, // E.g., 'SurjoPay', 'Credit Card', etc.
      date_time: { type: Date }, // Store this as a proper Date
    },
    isPaid: { type: Boolean, default: false },
    cancelledAt: { type: Date },
    updatedStatus: { type: String }, // For tracking status changes
    deliveryDate: { type: String },
  },
  { timestamps: true },
);

const OrderModel = model<IOrder>('Order', OrderSchema);

export default OrderModel;
