import type { PropsWithChildren } from "react"

import { Button } from "./button/Button"
import styles from "./Modal.module.css"

interface ModalProps extends PropsWithChildren {
  title: string
  isOpen: boolean
  onClose: () => void
}

export function Modal({ title, isOpen, onClose, children }: ModalProps) {
  if (!isOpen) {
    return null
  }

  return (
    <div className={`modal ${styles.modal}`} role="dialog" aria-modal="true" aria-label={title}>
      <div className={`modal__backdrop ${styles.backdrop}`} onClick={onClose} />
      <div className={`modal__content ${styles.content}`}>
        <div className={`modal__header ${styles.header}`}>
          <h3 className={styles.title}>{title}</h3>
          <Button variant="close" type="button" className={`modal__close ${styles.close}`} onClick={onClose}>
            &#10006;
          </Button>
        </div>
        <div className={`modal__body ${styles.body}`}>{children}</div>
      </div>
    </div>
  )
}
