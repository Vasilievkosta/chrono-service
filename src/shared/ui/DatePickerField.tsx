import { useEffect, useRef, useState } from 'react';
import { DayPicker } from 'react-day-picker';

import 'react-day-picker/style.css';

interface DatePickerFieldProps {
  value?: Date;
  onChange: (value?: Date) => void;
  placeholder?: string;
}

function formatDate(value?: Date) {
  if (!value) {
    return '';
  }

  return value.toLocaleDateString('en-CA');
}

export function DatePickerField({
  value,
  onChange,
  placeholder = 'Select date',
}: DatePickerFieldProps) {
  const [isOpen, setIsOpen] = useState(false);
  const rootRef = useRef<HTMLDivElement | null>(null);

  useEffect(() => {
    function handleClickOutside(event: MouseEvent) {
      if (!rootRef.current?.contains(event.target as Node)) {
        setIsOpen(false);
      }
    }

    document.addEventListener('mousedown', handleClickOutside);

    return () => {
      document.removeEventListener('mousedown', handleClickOutside);
    };
  }, []);

  return (
    <div ref={rootRef} className="date-picker">
      <button
        type="button"
        className="form-control date-picker__trigger"
        onClick={() => setIsOpen((open) => !open)}
      >
        {value ? formatDate(value) : placeholder}
      </button>

      {isOpen ? (
        <div className="date-picker__popover">
          <DayPicker
            mode="single"
            selected={value}
            onSelect={(selectedDate) => {
              onChange(selectedDate);
              setIsOpen(false);
            }}
          />
        </div>
      ) : null}
    </div>
  );
}
