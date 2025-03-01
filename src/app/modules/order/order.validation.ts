import { z } from 'zod';

const CreateOrderValidationSchema = z.object({
  body: z.object({
    customerId: z.string().min(1, 'Customer ID is required'), // Must be a valid ObjectId (string)
    mealId: z.string().min(1, 'Meal ID is required'),
    providerId: z.string().min(1, 'Provider ID is required'),
    quantity: z.number().int().positive().default(1),
    dietaryPreferences: z.array(z.string()).optional(), // Optional array of dietary preferences
    status: z
      .enum(['Pending', 'In progress', 'Delivered', 'Cancelled'])
      .default('Pending'),
    scheduledDelivery: z.coerce.date(), // Ensures it's a valid date
    totalPrice: z.number().positive(),
    address: z.string().min(5, 'Address is required'),
    transaction: z
      .object({
        id: z.string().optional(),
        transactionStatus: z.string().optional(),
        bank_status: z.string().optional(),
        sp_code: z.string().optional(),
        sp_message: z.string().optional(),
        method: z.string().optional(),
        date_time: z.coerce.date().optional(), // Ensures it's a valid date
      })
      .optional(),
    isPaid: z.boolean().default(false),
    cancelledAt: z.coerce.date().optional(),
    updatedStatus: z.string().optional(),
    deliveryDate: z.string().optional(),
  }),
});

const UpdateOrderValidationSchema = z.object({
  body: z.object({
    customerId: z.string().min(1).optional(),
    mealId: z.string().min(1).optional(),
    providerId: z.string().min(1).optional(),
    quantity: z.number().int().positive().optional(),
    dietaryPreferences: z.array(z.string()).optional(),
    status: z
      .enum(['Pending', 'In progress', 'Delivered', 'Cancelled'])
      .optional(),
    scheduledDelivery: z.coerce.date().optional(),
    totalPrice: z.number().positive().optional(),
    address: z.string().min(5).optional(),
    transaction: z
      .object({
        id: z.string().optional(),
        transactionStatus: z.string().optional(),
        bank_status: z.string().optional(),
        sp_code: z.string().optional(),
        sp_message: z.string().optional(),
        method: z.string().optional(),
        date_time: z.coerce.date().optional(),
      })
      .optional(),
    isPaid: z.boolean().optional(),
    cancelledAt: z.coerce.date().optional(),
    updatedStatus: z.string().optional(),
    deliveryDate: z.string().optional(),
  }),
});

export const OrderValidationSchema = {
  CreateOrderValidationSchema,
  UpdateOrderValidationSchema,
};
