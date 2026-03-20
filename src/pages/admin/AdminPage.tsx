import { AdminLoginForm } from '../../features/auth/ui/AdminLoginForm';

export function AdminPage() {
  return (
    <section className="page">
      <div className="info-card">
        <div className="form-intro">
          <h1>Admin login</h1>
          <p>Форма входа администратора пока работает только на клиенте.</p>
        </div>

        <AdminLoginForm />
      </div>
    </section>
  );
}
