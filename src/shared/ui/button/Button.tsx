import { ButtonHTMLAttributes } from "react"
import styles from "./Button.module.css"

type Variant = "primary" | "secondary" | "icon" | "close"

type ButtonProps = ButtonHTMLAttributes<HTMLButtonElement> & {
  variant?: Variant
}

export function Button({ variant = "primary", className = "", ...props }: ButtonProps) {
  const buttonClassName = [
    styles.button,
    variant === "secondary" && styles.secondaryButton,
    variant === "icon" && styles.iconButton,
    variant === "close" && styles.closeButton,
    className,
  ]
    .filter(Boolean)
    .join(" ")

  return <button className={buttonClassName} {...props} />
}
