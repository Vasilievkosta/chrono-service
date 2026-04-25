import styles from "./HomePage.module.css"

import { OrderForm } from "../../features/order-form/ui/OrderForm"

export function HomePage() {
  return (
    <section className={`page ${styles.page}`}>
      <div className={styles.content}>
        <OrderForm />
      </div>
    </section>
  )
}
