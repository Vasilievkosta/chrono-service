import { useMemo, useState } from 'react';

import {
  type City,
  useCreateCityMutation,
  useDeleteCityMutation,
  useGetCitiesQuery,
  useUpdateCityMutation,
} from '../../../entities/city/api/cityApi';
import { Button } from '../../../shared/ui/Button';
import { DataTable } from '../../../shared/ui/DataTable';
import { Modal } from '../../../shared/ui/Modal';
import { TextInput } from '../../../shared/ui/TextInput';

type CityModalMode = 'create' | 'edit' | 'delete' | null;

export function CitiesTab() {
  const { data = [], isLoading, isError } = useGetCitiesQuery();
  const [createCity, { isLoading: isCreating }] = useCreateCityMutation();
  const [updateCity, { isLoading: isUpdating }] = useUpdateCityMutation();
  const [deleteCity, { isLoading: isDeleting }] = useDeleteCityMutation();
  const [modalMode, setModalMode] = useState<CityModalMode>(null);
  const [selectedCity, setSelectedCity] = useState<City | null>(null);
  const [cityTitle, setCityTitle] = useState('');
  const [modalError, setModalError] = useState('');

  const isMutating = isCreating || isUpdating || isDeleting;

  const modalTitle = useMemo(() => {
    if (modalMode === 'create') {
      return 'Создать город';
    }

    if (modalMode === 'edit') {
      return 'Редактировать город';
    }

    if (modalMode === 'delete') {
      return 'Удалить город';
    }

    return '';
  }, [modalMode]);

  const openCreateModal = () => {
    setModalMode('create');
    setSelectedCity(null);
    setCityTitle('');
    setModalError('');
  };

  const openEditModal = (city: City) => {
    setModalMode('edit');
    setSelectedCity(city);
    setCityTitle(city.title);
    setModalError('');
  };

  const openDeleteModal = (city: City) => {
    setModalMode('delete');
    setSelectedCity(city);
    setCityTitle(city.title);
    setModalError('');
  };

  const closeModal = () => {
    if (isMutating) {
      return;
    }

    setModalMode(null);
    setSelectedCity(null);
    setCityTitle('');
    setModalError('');
  };

  const handleConfirm = async () => {
    setModalError('');

    try {
      if (modalMode === 'create') {
        const value = cityTitle.trim();

        if (!value) {
          setModalError('Введите название города.');
          return;
        }

        await createCity({ newTitle: value }).unwrap();
        closeModal();
        return;
      }

      if (modalMode === 'edit' && selectedCity) {
        const value = cityTitle.trim();

        if (!value) {
          setModalError('Введите название города.');
          return;
        }

        await updateCity({
          cityId: selectedCity.id,
          newTitle: value,
        }).unwrap();
        closeModal();
        return;
      }

      if (modalMode === 'delete' && selectedCity) {
        await deleteCity(selectedCity.id).unwrap();
        closeModal();
      }
    } catch {
      setModalError('Не удалось выполнить действие. Попробуйте позже.');
    }
  };

  if (isLoading) {
    return <div className="dashboard-state">Загрузка городов...</div>;
  }

  if (isError) {
    return <div className="dashboard-state dashboard-state--error">Не удалось загрузить города.</div>;
  }

  return (
    <>
      <div className="dashboard-panel">
        <div className="dashboard-toolbar">
          <Button type="button" onClick={openCreateModal}>
            Add City
          </Button>
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
              render: (row) => (
                <div className="table-actions">
                  <button type="button" className="icon-button" onClick={() => openEditModal(row)}>
                    ✏️
                  </button>
                  <button type="button" className="icon-button" onClick={() => openDeleteModal(row)}>
                    🗑
                  </button>
                </div>
              ),
            },
          ]}
        />
      </div>

      <Modal title={modalTitle} isOpen={modalMode !== null} onClose={closeModal}>
        {modalMode === 'delete' ? (
          <p>Удалить город {selectedCity?.title}?</p>
        ) : (
          <div className="modal-form">
            <TextInput
              value={cityTitle}
              onChange={(event) => setCityTitle(event.target.value)}
              placeholder="Название города"
            />
          </div>
        )}

        {modalError ? <div className="modal-error">{modalError}</div> : null}

        <div className="modal-actions">
          {modalMode === 'create' ? (
            <>
              <Button type="button" onClick={handleConfirm} disabled={isMutating}>
                {isCreating ? 'Creating...' : 'Create'}
              </Button>
              <Button type="button" className="button button--secondary" onClick={closeModal} disabled={isMutating}>
                Cancel
              </Button>
            </>
          ) : null}

          {modalMode === 'edit' ? (
            <>
              <Button type="button" onClick={handleConfirm} disabled={isMutating}>
                {isUpdating ? 'Saving...' : 'Save'}
              </Button>
              <Button type="button" className="button button--secondary" onClick={closeModal} disabled={isMutating}>
                Cancel
              </Button>
            </>
          ) : null}

          {modalMode === 'delete' ? (
            <>
              <Button type="button" onClick={handleConfirm} disabled={isMutating}>
                {isDeleting ? 'Deleting...' : 'Yes'}
              </Button>
              <Button type="button" className="button button--secondary" onClick={closeModal} disabled={isMutating}>
                No
              </Button>
            </>
          ) : null}
        </div>
      </Modal>
    </>
  );
}
