import type { PropsWithChildren } from 'react';

interface FormFieldProps extends PropsWithChildren {
  label: string;
  error?: string;
  required?: boolean;
}

export function FormField({
  label,
  error,
  required = false,
  children,
}: FormFieldProps) {
  return (
    <label className="form-field">
      <span className="form-field__label">
        {label}
        {required ? <span className="form-field__required"> *</span> : null}
      </span>
      {children}
      {error ? <span className="form-field__error">{error}</span> : null}
    </label>
  );
}
