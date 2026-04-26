import type { Master } from "../../../entities/master/api/masterApi"
import { Button } from "../../../shared/ui/button/Button"
import { Modal } from "../../../shared/ui/Modal"
import styles from "./MasterSelectModal.module.css"

interface MasterSelectModalProps {
  isOpen: boolean
  masters: Master[]
  isSubmittingOrder: boolean
  onClose: () => void
  onSelect: (master: Master) => void
}

export function MasterSelectModal({ isOpen, masters, isSubmittingOrder, onClose, onSelect }: MasterSelectModalProps) {
  return (
    <Modal title="Выберите мастера" isOpen={isOpen} onClose={onClose}>
      {masters.length === 0 ? (
        <div className={styles.empty}>Нет доступных мастеров на выбранное время</div>
      ) : (
        <div className={styles.list}>
          {masters.map((master) => (
            <div key={master.id} className={styles.card}>
              <div>
                <div className={styles.name}>{master.name}</div>
                <div className={styles.meta}>Рейтинг: {master.rating_id}</div>
              </div>

              <Button type="button" disabled={isSubmittingOrder} onClick={() => onSelect(master)}>
                {isSubmittingOrder ? "Создание заказа..." : "Выбрать"}
              </Button>
            </div>
          ))}
        </div>
      )}
    </Modal>
  )
}