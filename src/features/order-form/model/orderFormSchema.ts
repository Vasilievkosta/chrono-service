import { z } from 'zod';

export const cities = ['Dnipro', 'Odesa', 'Uzhhorod'] as const;
export const watchSizes = ['large', 'medium', 'small'] as const;

export const orderFormSchema = z.object({
  name: z.string().trim().min(1, 'Name is required'),
  email: z
    .string()
    .trim()
    .min(1, 'Email is required')
    .email('Enter a valid email'),
  city: z.enum(cities, {
    errorMap: () => ({ message: 'Select a city' }),
  }),
  watchSize: z.enum(watchSizes, {
    errorMap: () => ({ message: 'Select a watch size' }),
  }),
  repairDate: z.date({
    required_error: 'Select a date',
    invalid_type_error: 'Select a date',
  }),
});

export type OrderFormValues = z.infer<typeof orderFormSchema>;
