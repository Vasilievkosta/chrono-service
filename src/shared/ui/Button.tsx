import type { ButtonHTMLAttributes } from 'react';

type ButtonProps = ButtonHTMLAttributes<HTMLButtonElement>;

export function Button({ className = '', ...props }: ButtonProps) {
  const buttonClassName = ['button', className].filter(Boolean).join(' ');

  return <button className={buttonClassName} {...props} />;
}
