import { zodResolver } from "@hookform/resolvers/zod"
import { Controller, useForm } from "react-hook-form"
import { useEffect } from "react"
import { z } from "zod"

import type { OrderItem } from "../../../entities/order/api/orderApi"
import { Button } from "../../../shared/ui/Button"
import { DatePickerField } from "../../../shared/ui/DatePickerField"
import { FormField } from "../../../shared/ui/FormField"
import { RadioGroup } from "../../../shared/ui/RadioGroup"
import { SelectField } from "../../../shared/ui/SelectField"
import { timeOptions } from "../lib/orderSchedule"
import { watchSizes } from "../model/orderFormSchema"

const watchSizeLabels: Record<(typeof watchSizes)[number], string> = {
  large: "Большие",
  medium: "Средние",
  small: "Маленькие",
}

const durationToWatchSize: Record<number, (typeof watchSizes)[number]> = {
  1: "small",
  2: "medium",
  3: "large",
}

const orderEditSchema = z.object({
  repairDate: z.date({
    required_error: "Select a date",
    invalid_type_error: "Select a date",
  }),
  repairTime: z.string().trim().min(1, "Select a time"),
  watchSize: z.enum(watchSizes, {
    errorMap: () => ({ message: "Select a watch size" }),
  }),
})

type OrderEditValues = z.infer<typeof orderEditSchema>

interface OrderEditFormProps {
  order: OrderItem
  isSubmitting: boolean
  submitError?: string
  onSubmit: (values: OrderEditValues) => void
}

function parseDate(value: string) {
  const parsed = new Date(value)
  parsed.setHours(0, 0, 0, 0)
  return parsed
}

function getWatchSize(duration: number): (typeof watchSizes)[number] {
  return durationToWatchSize[duration] ?? "medium"
}

export function OrderEditForm({ order, isSubmitting, submitError, onSubmit }: OrderEditFormProps) {
  const {
    control,
    register,
    handleSubmit,
    reset,
    formState: { errors },
  } = useForm<OrderEditValues>({
    resolver: zodResolver(orderEditSchema),
    defaultValues: {
      repairDate: parseDate(order.date),
      repairTime: `${String(order.time).padStart(2, "0")}:00`,
      watchSize: getWatchSize(order.duration),
    },
  })

  useEffect(() => {
    reset({
      repairDate: parseDate(order.date),
      repairTime: `${String(order.time).padStart(2, "0")}:00`,
      watchSize: getWatchSize(order.duration),
    })
  }, [order, reset])

  return (
    <form className="modal-form" onSubmit={handleSubmit(onSubmit)}>
      <div className="readonly-block">
        <strong>Пользователь</strong>
        <div>{order.user.name}</div>
        <div>{order.user.email}</div>
      </div>

      <div className="readonly-block">
        <strong>Текущий мастер</strong>
        <div>{order.master.name}</div>
      </div>

      <div className="readonly-block">
        <strong>Город</strong>
        <div>{order.city.title}</div>
      </div>

      <div className="dashboard-state">При изменении полей ниже, потребуется выбрать мастера заново.</div>

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
        <SelectField {...register("repairTime")}>
          <option value="">Выберите время</option>
          {timeOptions.map((time) => (
            <option key={time.value} value={time.value}>
              {time.label}
            </option>
          ))}
        </SelectField>
      </FormField>

      <FormField label="Размер часов" error={errors.watchSize?.message} required>
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

      {submitError ? <div className="modal-error">{submitError}</div> : null}

      <div className="modal-actions">
        <Button type="submit" disabled={isSubmitting}>
          {isSubmitting ? "Ищем мастеров..." : "Save"}
        </Button>
      </div>
    </form>
  )
}
