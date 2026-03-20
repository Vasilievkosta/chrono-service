import { useGetOrdersQuery } from '../../../entities/order/api/orderApi';
import { DataTable } from '../../../shared/ui/DataTable';

export function OrdersTab() {
  const { data = [], isLoading, isError } = useGetOrdersQuery();

  if (isLoading) {
    return <div className="dashboard-state">Загрузка заказов...</div>;
  }

  if (isError) {
    return <div className="dashboard-state dashboard-state--error">Не удалось загрузить заказы.</div>;
  }

  return (
    <div className="dashboard-panel">
      <DataTable
        rows={data}
        getRowKey={(row) => row.id}
        columns={[
          {
            key: 'date',
            header: 'Date',
            render: (row) => row.date,
          },
          {
            key: 'time',
            header: 'Time',
            render: (row) => row.time,
          },
          {
            key: 'hours',
            header: 'Hours',
            render: (row) => row.duration,
          },
          {
            key: 'user',
            header: 'User',
            render: (row) => row.user.name,
          },
          {
            key: 'email',
            header: 'Email',
            render: (row) => row.user.email,
          },
          {
            key: 'master',
            header: 'Master',
            render: (row) => row.master.name,
          },
          {
            key: 'city',
            header: 'City',
            render: (row) => row.city.title,
          },
          {
            key: 'actions',
            header: 'Actions',
            render: () => (
              <div className="table-actions">
                <button type="button" className="icon-button">✏️</button>
                <button type="button" className="icon-button">🗑</button>
              </div>
            ),
          },
        ]}
      />
    </div>
  );
}
