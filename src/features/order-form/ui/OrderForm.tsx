import { zodResolver } from '@hookform/resolvers/zod';
import { Controller, useForm } from 'react-hook-form';

import { Button } from '../../../shared/ui/Button';
import { DatePickerField } from '../../../shared/ui/DatePickerField';
import { FormField } from '../../../shared/ui/FormField';
import { RadioGroup } from '../../../shared/ui/RadioGroup';
import { SelectField } from '../../../shared/ui/SelectField';
import { TextInput } from '../../../shared/ui/TextInput';
import {
  cities,
  orderFormSchema,
  type OrderFormValues,
  watchSizes,
} from '../model/orderFormSchema';

const cityLabels: Record<(typeof cities)[number], string> = {
  Dnipro: 'Днепр',
  Odesa: 'Одесса',
  Uzhhorod: 'Ужгород',
};

const watchSizeLabels: Record<(typeof watchSizes)[number], string> = {
  large: 'Большие',
  medium: 'Средние',
  small: 'Маленькие',
};

export function OrderForm() {
  const {
    control,
    register,
    handleSubmit,
    formState: { errors, isSubmitting },
  } = useForm<OrderFormValues>({
    resolver: zodResolver(orderFormSchema),
    defaultValues: {
      name: '',
      email: '',
      city: 'Dnipro',
      watchSize: 'medium',
      repairDate: undefined,
    },
  });

  const onSubmit = (values: OrderFormValues) => {
    console.log({
      ...values,
      repairDate: values.repairDate.toISOString().slice(0, 10),
    });
  };

  return (
    <section className="info-card">
      <div className="form-intro">
        <h2>Create repair order</h2>
        <p>Validation is fully client-side. RTK Query is not used in this form.</p>
      </div>

      <form className="order-form" onSubmit={handleSubmit(onSubmit)} noValidate>
        <FormField label="Имя" error={errors.name?.message} required>
          <TextInput
            placeholder="Введите имя"
            autoComplete="name"
            {...register('name')}
          />
        </FormField>

        <FormField label="Email" error={errors.email?.message} required>
          <TextInput
            type="email"
            placeholder="name@example.com"
            autoComplete="email"
            {...register('email')}
          />
        </FormField>

        <FormField label="Город" error={errors.city?.message}>
          <SelectField {...register('city')}>
            {cities.map((city) => (
              <option key={city} value={city}>
                {cityLabels[city]}
              </option>
            ))}
          </SelectField>
        </FormField>

        <FormField label="Размер часов" error={errors.watchSize?.message}>
          <Controller
            name="watchSize"
            control={control}
            render={({ field }) => (
              <RadioGroup
                name={field.name}
                value={field.value}
                onChange={field.onChange}
                options={watchSizes.map((size) => ({
                  value: size,
                  label: watchSizeLabels[size],
                }))}
              />
            )}
          />
        </FormField>

        <FormField label="Дата" error={errors.repairDate?.message}>
          <Controller
            name="repairDate"
            control={control}
            render={({ field }) => (
              <DatePickerField
                value={field.value}
                onChange={field.onChange}
                placeholder="Выберите дату"
              />
            )}
          />
        </FormField>

        <Button type="submit" disabled={isSubmitting}>
          Заказать
        </Button>
      </form>
    </section>
  );
}
