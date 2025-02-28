import { z } from 'zod';

// DEFINING THE TUser SCHEMA WITH CUSTOM ERROR MESSAGE
const CreateUserValidationSchema = z.object({
  body: z.object({
    name: z.string().min(1, { message: 'Name is required' }),
    email: z
      .string()
      .email({ message: 'Invalid email address' })
      .nonempty({ message: 'Email is required' }),
    password: z
      .string()
      .min(6, { message: 'Password must be at least 6 characters long' })
      .nonempty({ message: 'Password is required' }),
    phone: z.string().optional(),
    address: z.string().optional(),
    city: z.string().optional(),
    role: z.enum(['admin', 'user']).optional().default('user'),
    isBlocked: z.boolean().optional().default(false),
  }),
});

const UpdateUserValidationSchema = z.object({
  body: z.object({
    name: z.string().min(1, { message: 'Name is required' }).optional(),
    email: z
      .string()
      .email({ message: 'Invalid email address' })
      .nonempty({ message: 'Email is required' })
      .optional(),
    password: z
      .string()
      .min(6, { message: 'Password must be at least 6 characters long' })
      .nonempty({ message: 'Password is required' })
      .optional(),
    phone: z.string().optional().optional(),
    address: z.string().optional().optional(),
    city: z.string().optional().optional(),
    role: z.enum(['admin', 'user']).optional().default('user'),
    isBlocked: z.boolean().optional().default(false).optional(),
  }),
});

const ManageStatusValidationSchema = z.object({
  body: z
    .object({
      isBlocked: z.boolean(),
    })
    .strict(),
});

const loginValidationSchema = z.object({
  body: z.object({
    email: z.string({ required_error: 'Email is required' }),
    password: z.string({ required_error: ' Password is required' }),
  }),
});

const updatePassValidationSchema = z.object({
  body: z.object({
    password: z.string({ required_error: ' Password is required' }),
  }),
});

const changePasswordValidationSchema = z.object({
  body: z.object({
    oldPassword: z.string({
      required_error: 'Old password is required',
    }),
    newPassword: z.string({ required_error: 'Password is required' }),
  }),
});

const refreshTokenValidationSchema = z.object({
  cookies: z.object({
    refreshToken: z.string({
      required_error: 'refresh token is required',
    }),
  }),
});

export const UserValidations = {
  CreateUserValidationSchema,
  UpdateUserValidationSchema,
  ManageStatusValidationSchema,
  loginValidationSchema,
  updatePassValidationSchema,
  changePasswordValidationSchema,
  refreshTokenValidationSchema,
};
