import { useEffect, useRef, useState } from "react"
import { DayPicker } from "react-day-picker"

import "react-day-picker/style.css"
import styles from "./DatePickerField.module.css"
import { Button } from "../button/Button"

interface DatePickerFieldProps {
  value?: Date
  onChange: (value?: Date) => void
  placeholder?: string
}

function formatDate(value?: Date) {
  if (!value) {
    return ""
  }

  return value.toLocaleDateString("en-CA")
}

function getToday() {
  const today = new Date()
  today.setHours(0, 0, 0, 0)
  return today
}

export function DatePickerField({ value, onChange, placeholder = "Select date" }: DatePickerFieldProps) {
  const [isOpen, setIsOpen] = useState(false)
  const rootRef = useRef<HTMLDivElement | null>(null)

  useEffect(() => {
    function handleClickOutside(event: MouseEvent) {
      if (!rootRef.current?.contains(event.target as Node)) {
        setIsOpen(false)
      }
    }

    document.addEventListener("mousedown", handleClickOutside)

    return () => {
      document.removeEventListener("mousedown", handleClickOutside)
    }
  }, [])

  return (
    <div ref={rootRef} className={`${styles.picker} date-picker`}>
      <Button
        type="button"
        variant="secondary"
        className={`${styles.trigger} date-picker__trigger`}
        onClick={() => setIsOpen((open) => !open)}
      >
        {value ? formatDate(value) : placeholder}
      </Button>

      {isOpen ? (
        <div className={`${styles.popover} date-picker__popover`}>
          <DayPicker
            mode="single"
            selected={value}
            disabled={{ before: getToday() }}
            onSelect={(selectedDate) => {
              onChange(selectedDate)
              setIsOpen(false)
            }}
          />
        </div>
      ) : null}
    </div>
  )
}
