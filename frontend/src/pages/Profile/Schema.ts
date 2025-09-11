import { z } from 'zod';

const genderOptions = ['Male', 'Female', 'Other'] as const;

export const SocialLinksSchema = z.object({
  platform: z
    .object({
      label: z.string(),
      value: z.string(),
    })
    .nullable()
    .refine(val => val !== null, {
      message: 'Please select a social platform',
    }),

  url: z.string({ required_error: 'URL is required ' }).url('Please enter a valid URL'),
});

export const editProfileSchema = z.object({
  firstName: z
    .string({ required_error: 'Enter a valid First Name' })
    .min(1, { message: 'Enter a valid First Name' }),

  username: z.string().optional(),

  description: z
    .string({ required_error: 'Please enter at least 5 words' })
    .min(1, { message: 'Please enter at least 5 words' }),

  gender: z.enum(genderOptions, {
    errorMap: () => ({ message: 'Please select your gender' }),
  }),

  email: z
    .string({ required_error: 'Email is required' })
    .email({ message: 'Enter a valid email' }),

  phone: z
    .string({ required_error: 'Please enter your phone number' })
    .min(10, { message: 'Phone number must be at least 10 digits' }),

  dob: z.date({ required_error: 'Please select your date of birth' }),

  addressline1: z
    .string({ required_error: 'Please enter your address' })
    .min(1, { message: 'Please enter your address' }),

  city: z.string({ required_error: 'Please select your city' }),

  state: z.string({ required_error: 'Please select your state' }),

  pincode: z
    .string({ required_error: 'PIN Code is required' })
    .min(6, 'PIN Code must be 6 digits')
    .max(6, 'PIN Code must be 6 digits')
    .regex(/^\d{6}$/, 'Enter a valid 6-digit PIN Code'),

  country: z.string({ required_error: 'Please select your country' }),
});

export type EditProfileFormValues = z.infer<typeof editProfileSchema>;
