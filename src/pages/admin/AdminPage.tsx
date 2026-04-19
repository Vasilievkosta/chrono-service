import styles from './AdminPage.module.css';

import { AdminLoginForm } from '../../features/auth/ui/AdminLoginForm';

export function AdminPage() {
  return (
    <section className={`page ${styles.page}`}>
      <div className={`info-card ${styles.card}`}>
        <div className={`form-intro ${styles.intro}`}>
          <h1 className={styles.title}>Admin login</h1>
          <p className={styles.description}>Форма входа администратора пока работает только на клиенте.</p>
        </div>

        <AdminLoginForm />
      </div>
    </section>
  );
}
