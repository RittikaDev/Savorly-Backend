import { model, Schema } from 'mongoose';
import { IOrder } from './order.interface';

const OrderSchema = new Schema<IOrder>(
  {
    user: {
      type: Schema.Types.ObjectId,
      ref: 'User',
    },
    products: [
      {
        product: {
          type: Schema.Types.ObjectId,
          ref: 'Car',
          required: true,
        },
        quantity: {
          type: Number,
          required: true,
        },
      },
    ],
    totalPrice: {
      type: Number,
      required: true,
    },
    status: {
      type: String,
      enum: ['Pending', 'Processing', 'Shipped', 'Delivered', 'Cancelled'],
      default: 'Pending',
    },
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
  {
    timestamps: true,
  },
);

const OrderModel = model<IOrder>('Order', OrderSchema);

export default OrderModel;
