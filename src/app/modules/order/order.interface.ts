import { Document, Types } from 'mongoose';

export interface IOrder extends Document {
  customerId: Types.ObjectId;
  mealId: [Types.ObjectId];
  providerId: Types.ObjectId;
  quantity: [number];
  dietaryPreferences?: string[]; // Example: ['vegan', 'gluten-free']
  spiceLevel?: string[]; // Example: ['vegan', 'gluten-free']
  extraSauce?: string[]; // Example: ['vegan', 'gluten-free']
  status: 'Pending' | 'In progress' | 'Delivered' | 'Cancelled';
  scheduledDelivery: string;
  totalPrice: number;
  address: string;
  transaction?: {
    id?: string;
    transactionStatus?: string;
    bank_status?: string;
    sp_code?: string;
    sp_message?: string;
    method?: string; // E.g., 'SurjoPay', 'Credit Card', etc.
    date_time?: Date;
  };
  isPaid: boolean;
  cancelledAt?: Date;
  updatedStatus?: string;
  deliveryDate?: string;
  createdAt?: Date;
  updatedAt?: Date;
}
