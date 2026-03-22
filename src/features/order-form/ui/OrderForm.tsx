import { zodResolver } from '@hookform/resolvers/zod';
import { Controller, useForm } from 'react-hook-form';
import { useState } from 'react';

import { useGetCitiesQuery } from '../../../entities/city/api/cityApi';
import { useGetAvailableMastersMutation, type Master } from '../../../entities/master/api/masterApi';
import { useCreateOrderMutation } from '../../../entities/order/api/orderApi';
import { Button } from '../../../shared/ui/Button';
import { DatePickerField } from '../../../shared/ui/DatePickerField';
import { FormField } from '../../../shared/ui/FormField';
import { RadioGroup } from '../../../shared/ui/RadioGroup';
import { SelectField } from '../../../shared/ui/SelectField';
import { TextInput } from '../../../shared/ui/TextInput';
import { formatDate, formatHour, timeOptions } from '../lib/orderSchedule';
import { orderFormSchema, type OrderFormValues, watchSizes } from '../model/orderFormSchema';
import { MasterSelectModal } from './MasterSelectModal';

const watchSizeLabels: Record<(typeof watchSizes)[number], string> = {
  large: 'Большие',
  medium: 'Средние',
  small: 'Маленькие',
};

const durationBySize: Record<(typeof watchSizes)[number], number> = {
  large: 3,
  medium: 2,
  small: 1,
};

export function OrderForm() {
  const [masters, setMasters] = useState<Master[]>([]);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [pendingValues, setPendingValues] = useState<OrderFormValues | null>(null);
  const [submitError, setSubmitError] = useState('');
  const [successMessage, setSuccessMessage] = useState('');
  const {
    control,
    register,
    handleSubmit,
    reset,
    formState: { errors, isSubmitting },
  } = useForm<OrderFormValues>({
    resolver: zodResolver(orderFormSchema),
    defaultValues: {
      name: '',
      email: '',
      city: '',
      watchSize: 'medium',
      repairDate: undefined,
      repairTime: '',
    },
  });

  const { data: cities = [], isLoading, isError } = useGetCitiesQuery();
  const [getAvailableMasters, { isLoading: isLoadingMasters }] = useGetAvailableMastersMutation();
  const [createOrder, { isLoading: isCreatingOrder }] = useCreateOrderMutation();

  const onSubmit = async (values: OrderFormValues) => {
    setSubmitError('');
    setSuccessMessage('');

    try {
      const duration = durationBySize[values.watchSize];
      const availableMasters = await getAvailableMasters({
        cityId: values.city,
        date: formatDate(values.repairDate),
        time: formatHour(values.repairTime),
        duration,
      }).unwrap();

      setPendingValues(values);
      setMasters(availableMasters);
      setIsModalOpen(true);
    } catch {
      setSubmitError('Не удалось получить список мастеров. Попробуйте позже.');
    }
  };

  const handleSelectMaster = async (master: Master) => {
    if (!pendingValues) {
      return;
    }

    setSubmitError('');

    try {
      const duration = durationBySize[pendingValues.watchSize];

      await createOrder({
        date: formatDate(pendingValues.repairDate),
        time: formatHour(pendingValues.repairTime),
        duration,
        city_id: pendingValues.city,
        master_id: master.id,
        userName: pendingValues.name,
        email: pendingValues.email,
      }).unwrap();

      setIsModalOpen(false);
      setPendingValues(null);
      setMasters([]);
      setSuccessMessage('Заказ успешно создан.');
      reset({
        name: '',
        email: '',
        city: '',
        watchSize: 'medium',
        repairDate: undefined,
        repairTime: '',
      });
      alert('Заказ успешно создан');
    } catch {
      setSubmitError('Не удалось создать заказ. Попробуйте позже.');
    }
  };

  const handleCloseModal = () => {
    if (isCreatingOrder) {
      return;
    }

    setIsModalOpen(false);
    setPendingValues(null);
    setMasters([]);
  };

  const cityErrorMessage = errors.city?.message ?? (isError ? 'Не удалось загрузить города' : undefined);

  return (
    <>
      <section className="info-card">
        <div className="form-intro">
          <h2>Create repair order</h2>
          <p>Города подгружаются с backend через RTK Query.</p>
        </div>

        <form className="order-form" onSubmit={handleSubmit(onSubmit)} noValidate>
          <FormField label="Имя" error={errors.name?.message} required>
            <TextInput placeholder="Введите имя" autoComplete="name" {...register('name')} />
          </FormField>

          <FormField label="Email" error={errors.email?.message} required>
            <TextInput type="email" placeholder="name@example.com" autoComplete="email" {...register('email')} />
          </FormField>

          <FormField label="Город" error={cityErrorMessage} required>
            <SelectField {...register('city')} disabled={isLoading || isError}>
              <option value="">
                {isLoading ? 'Загрузка городов...' : isError ? 'Ошибка загрузки' : 'Выберите город'}
              </option>
              {cities.map((city) => (
                <option key={city.id} value={String(city.id)}>
                  {city.title}
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

          <FormField label="Дата" error={errors.repairDate?.message} required>
            <Controller
              name="repairDate"
              control={control}
              render={({ field }) => (
                <DatePickerField value={field.value} onChange={field.onChange} placeholder="Выберите дату" />
              )}
            />
          </FormField>

          <FormField label="Время" error={errors.repairTime?.message} required>
            <SelectField {...register('repairTime')}>
              <option value="">Выберите время</option>
              {timeOptions.map((time) => (
                <option key={time.value} value={time.value}>
                  {time.label}
                </option>
              ))}
            </SelectField>
          </FormField>

          <Button type="submit" disabled={isSubmitting || isLoading || isError || isLoadingMasters || isCreatingOrder}>
            {isLoadingMasters ? 'Ищем мастеров...' : isCreatingOrder ? 'Создаем заказ...' : 'Заказать'}
          </Button>

          {submitError ? <div className="form-submit-error">{submitError}</div> : null}
          {successMessage ? <div className="form-submit-success">{successMessage}</div> : null}
        </form>
      </section>

      <MasterSelectModal
        isOpen={isModalOpen}
        masters={masters}
        isSubmittingOrder={isCreatingOrder}
        onClose={handleCloseModal}
        onSelect={handleSelectMaster}
      />
    </>
  );
}
