import { useGetMastersOfCitiesQuery } from '../../../entities/master/api/masterApi';
import { Button } from '../../../shared/ui/Button';
import { DataTable } from '../../../shared/ui/DataTable';

export function MastersTab() {
  const { data = [], isLoading, isError } = useGetMastersOfCitiesQuery();

  if (isLoading) {
    return <div className="dashboard-state">Загрузка мастеров...</div>;
  }

  if (isError) {
    return <div className="dashboard-state dashboard-state--error">Не удалось загрузить мастеров.</div>;
  }

  return (
    <div className="dashboard-panel">
      <div className="dashboard-toolbar">
        <Button type="button">Добавить</Button>
      </div>

      <DataTable
        rows={data}
        getRowKey={(row) => row.master_id}
        columns={[
          {
            key: 'name',
            header: 'Name',
            render: (row) => row.master_name,
          },
          {
            key: 'city',
            header: 'City',
            render: (row) => row.cities[0]?.title ?? '—',
          },
          {
            key: 'rating',
            header: 'Rating',
            render: (row) => row.master_rating,
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
