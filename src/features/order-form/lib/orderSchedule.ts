export const timeOptions = Array.from({ length: 24 }, (_, hour) => {
  const value = `${String(hour).padStart(2, '0')}:00`;

  return {
    value,
    label: value,
  };
});

export const durationOptions = [
  { value: '1', label: '1' },
  { value: '2', label: '2' },
  { value: '3', label: '3' },
];

export function formatDate(value: Date) {
  return value.toISOString().slice(0, 10);
}

export function formatHour(value: string) {
  return +value.slice(0, 2) + '';
}
