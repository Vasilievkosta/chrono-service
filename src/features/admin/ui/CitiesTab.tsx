import { useGetCitiesQuery } from '../../../entities/city/api/cityApi';
import { Button } from '../../../shared/ui/Button';
import { DataTable } from '../../../shared/ui/DataTable';

export function CitiesTab() {
  const { data = [], isLoading, isError } = useGetCitiesQuery();

  if (isLoading) {
    return <div className="dashboard-state">Загрузка городов...</div>;
  }

  if (isError) {
    return <div className="dashboard-state dashboard-state--error">Не удалось загрузить города.</div>;
  }

  return (
    <div className="dashboard-panel">
      <div className="dashboard-toolbar">
        <Button type="button">Добавить</Button>
      </div>

      <DataTable
        rows={data}
        getRowKey={(row) => row.id}
        columns={[
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
