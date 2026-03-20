import { z } from 'zod';

export const adminLoginSchema = z.object({
  email: z
    .string()
    .trim()
    .min(1, 'Email is required')
    .email('Enter a valid email'),
  password: z.string().trim().min(1, 'Password is required'),
});

export type AdminLoginValues = z.infer<typeof adminLoginSchema>;
