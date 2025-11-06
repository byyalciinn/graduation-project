import { z } from 'zod';

export const registerSchema = z.object({
  name: z.string().min(2, 'Name must be at least 2 characters'),
  email: z.string().email('Invalid email address'),
  password: z.string().min(6, 'Password must be at least 6 characters'),
  confirmPassword: z.string(),
}).refine((data) => data.password === data.confirmPassword, {
  message: "Passwords don't match",
  path: ['confirmPassword'],
});

export const loginSchema = z.object({
  email: z.string().email('Invalid email address'),
  password: z.string().min(1, 'Password is required'),
});

export const onboardingSchema = z.object({
  role: z.enum(['buyer', 'seller'], {
    required_error: 'Please select a role',
  }),
  categories: z.array(z.string()).min(1, 'Select at least one category'),
  city: z.string().min(1, 'City is required'),
  postalCode: z.string().optional(),
  notifications: z.boolean().default(true),
  bio: z.string().max(150, 'Bio must be 150 characters or less').optional(),
});

export type RegisterInput = z.infer<typeof registerSchema>;
export type LoginInput = z.infer<typeof loginSchema>;
export type OnboardingInput = z.infer<typeof onboardingSchema>;
