import { useState } from 'react';

import { CitiesTab } from '../../features/admin/ui/CitiesTab';
import { MastersTab } from '../../features/admin/ui/MastersTab';
import { OrdersTab } from '../../features/admin/ui/OrdersTab';
import { UsersTab } from '../../features/admin/ui/UsersTab';

const tabs = [
  { id: 'masters', label: 'Masters' },
  { id: 'cities', label: 'Cities' },
  { id: 'users', label: 'Users' },
  { id: 'orders', label: 'Orders' },
] as const;

type DashboardTab = (typeof tabs)[number]['id'];

export function AdminDashboardPage() {
  const [activeTab, setActiveTab] = useState<DashboardTab>('masters');

  return (
    <section className="page">
      <div className="info-card">
        <div className="form-intro">
          <h1>Admin dashboard</h1>
          <p>Управление мастерами, городами, пользователями и заказами.</p>
        </div>

        <div className="dashboard-tabs">
          {tabs.map((tab) => (
            <button
              key={tab.id}
              type="button"
              className={activeTab === tab.id ? 'dashboard-tab active' : 'dashboard-tab'}
              onClick={() => setActiveTab(tab.id)}
            >
              {tab.label}
            </button>
          ))}
        </div>

        {activeTab === 'masters' ? <MastersTab /> : null}
        {activeTab === 'cities' ? <CitiesTab /> : null}
        {activeTab === 'users' ? <UsersTab /> : null}
        {activeTab === 'orders' ? <OrdersTab /> : null}
      </div>
    </section>
  );
}
