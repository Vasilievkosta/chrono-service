import { z } from 'zod';

export const watchSizes = ['large', 'medium', 'small'] as const;

export const orderFormSchema = z.object({
  name: z.string().trim().min(1, 'Name is required'),
  email: z
    .string()
    .trim()
    .min(1, 'Email is required')
    .email('Enter a valid email'),
  city: z.string().trim().min(1, 'Select a city'),
  watchSize: z.enum(watchSizes, {
    errorMap: () => ({ message: 'Select a watch size' }),
  }),
  repairDate: z.date({
    required_error: 'Select a date',
    invalid_type_error: 'Select a date',
  }),
  repairTime: z.string().trim().min(1, 'Select a time'),
});

export type OrderFormValues = z.infer<typeof orderFormSchema>;
