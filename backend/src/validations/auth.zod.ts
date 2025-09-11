import { z } from 'zod';

export const registerSchema = z.object({
  name: z
    .string('Name is required')
    .min(2, 'Name must be at least 2 characters long'),
  email: z.email('Invalid email address'),
  password: z
    .string('Password is required')
    .min(6, 'Password must be at least 6 characters long')
    .max(100, 'Password must be at most 100 characters long')
    .regex(/^(?=.*\d)(?=.*[a-z])(?=.*[A-Z])(?=.*[a-zA-Z]).{8,}$/, {
      message:
        'Password should contain at-least one uppercase, one lowercase, one number and one special character',
    }),
});

export const loginSchema = z.object({
  email: z.email('Invalid email address'),
  password: z.string('Password is required'),
});

export type registerType = z.infer<typeof registerSchema>;
export type loginType = z.infer<typeof loginSchema>;
