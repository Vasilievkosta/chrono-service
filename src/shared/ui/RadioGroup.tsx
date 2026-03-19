interface RadioOption {
  value: string;
  label: string;
}

interface RadioGroupProps {
  name: string;
  value?: string;
  options: RadioOption[];
  onChange: (value: string) => void;
}

export function RadioGroup({
  name,
  value,
  options,
  onChange,
}: RadioGroupProps) {
  return (
    <div className="radio-group">
      {options.map((option) => (
        <label key={option.value} className="radio-card">
          <input
            className="radio-card__input"
            type="radio"
            name={name}
            value={option.value}
            checked={value === option.value}
            onChange={() => onChange(option.value)}
          />
          <span>{option.label}</span>
        </label>
      ))}
    </div>
  );
}
