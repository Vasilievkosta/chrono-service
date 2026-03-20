import { useGetUsersQuery } from '../../../entities/user/api/userApi';
import { DataTable } from '../../../shared/ui/DataTable';

export function UsersTab() {
  const { data = [], isLoading, isError } = useGetUsersQuery();

  if (isLoading) {
    return <div className="dashboard-state">Загрузка пользователей...</div>;
  }

  if (isError) {
    return <div className="dashboard-state dashboard-state--error">Не удалось загрузить пользователей.</div>;
  }

  return (
    <div className="dashboard-panel">
      <DataTable
        rows={data}
        getRowKey={(row) => row.id}
        columns={[
          {
            key: 'name',
            header: 'Name',
            render: (row) => row.username,
          },
          {
            key: 'email',
            header: 'Email',
            render: (row) => row.email,
          },
          {
            key: 'city',
            header: 'City',
            render: (row) => row.title,
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
