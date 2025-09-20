import * as yup from 'yup';

// Common validation schemas
export const phoneSchema = yup
  .string()
  .required('Phone number is required')
  .matches(/^\d{10}$/, 'Phone number must be exactly 10 digits');

export const emailSchema = yup
  .string()
  .email('Invalid email format')
  .required('Email is required');

export const nameSchema = yup
  .string()
  .required('Name is required')
  .min(2, 'Name must be at least 2 characters')
  .max(50, 'Name must be less than 50 characters');

export const passwordSchema = yup
  .string()
  .required('Password is required')
  .min(6, 'Password must be at least 6 characters');

export const amountSchema = yup
  .number()
  .required('Amount is required')
  .positive('Amount must be positive')
  .min(1, 'Minimum amount is $1')
  .max(10000, 'Maximum amount is $10,000');

export const balanceSchema = yup
  .number()
  .required('Balance is required')
  .min(0, 'Balance cannot be negative');

// Form validation schemas
export const loginSchema = yup.object({
  phoneNumber: phoneSchema,
  role: yup
    .string()
    .oneOf(['USER', 'ADMIN'], 'Invalid role')
    .required('Role is required'),
});

export const registerSchema = yup.object({
  name: nameSchema,
  phoneNumber: phoneSchema,
  email: emailSchema,
  role: yup
    .string()
    .oneOf(['USER', 'ADMIN'], 'Invalid role')
    .required('Role is required'),
});

export const rechargeSchema = yup.object({
  amount: amountSchema,
  paymentMethod: yup
    .string()
    .required('Payment method is required')
    .oneOf(['credit_card', 'debit_card', 'paypal', 'bank_transfer'], 'Invalid payment method'),
});

export const gameSchema = yup.object({
  name: yup
    .string()
    .required('Game name is required')
    .min(2, 'Game name must be at least 2 characters')
    .max(100, 'Game name must be less than 100 characters'),
  price: yup
    .number()
    .required('Price is required')
    .min(0, 'Price cannot be negative')
    .max(1000, 'Maximum price is $1,000'),
  description: yup
    .string()
    .required('Description is required')
    .min(10, 'Description must be at least 10 characters')
    .max(500, 'Description must be less than 500 characters'),
  genre: yup
    .string()
    .required('Genre is required')
    .oneOf([
      'action', 'adventure', 'rpg', 'strategy', 'simulation', 
      'sports', 'racing', 'puzzle', 'arcade', 'fighting'
    ], 'Invalid genre'),
  status: yup
    .string()
    .required('Status is required')
    .oneOf(['active', 'inactive', 'coming_soon'], 'Invalid status'),
});

export const productSchema = yup.object({
  name: yup
    .string()
    .required('Product name is required')
    .min(2, 'Product name must be at least 2 characters')
    .max(100, 'Product name must be less than 100 characters'),
  description: yup
    .string()
    .required('Description is required')
    .min(10, 'Description must be at least 10 characters')
    .max(500, 'Description must be less than 500 characters'),
  category: yup
    .string()
    .required('Category is required')
    .oneOf([
      'accessories', 'hardware', 'software', 'merchandise', 
      'gift_cards', 'subscriptions'
    ], 'Invalid category'),
  tags: yup
    .string()
    .required('Tags are required')
    .min(2, 'At least one tag is required'),
  price: yup
    .number()
    .required('Price is required')
    .min(0, 'Price cannot be negative')
    .max(5000, 'Maximum price is $5,000'),
  stock: yup
    .number()
    .required('Stock is required')
    .integer('Stock must be a whole number')
    .min(0, 'Stock cannot be negative')
    .max(10000, 'Maximum stock is 10,000'),
});

export const memberSchema = yup.object({
  name: nameSchema,
  phoneNumber: phoneSchema,
  email: emailSchema,
  balance: balanceSchema,
  isActive: yup.boolean().required('Active status is required'),
});

// Utility functions
export const validatePhoneNumber = (phone: string): boolean => {
  return /^\d{10}$/.test(phone);
};

export const validateEmail = (email: string): boolean => {
  return /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email);
};

export const validateAmount = (amount: number): boolean => {
  return amount > 0 && amount <= 10000;
};

export const validatePassword = (password: string): boolean => {
  return password.length >= 6;
};

// Custom validation messages
export const getValidationMessage = (error: any): string => {
  if (typeof error === 'string') return error;
  if (error?.message) return error.message;
  return 'Invalid input';
};
