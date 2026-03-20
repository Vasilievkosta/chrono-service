import { Controller, useForm } from 'react-hook-form';
import { useMemo, useState } from 'react';
import Select from 'react-select';

import { type City, useGetCitiesQuery } from '../../../entities/city/api/cityApi';
import {
  type MasterOfCities,
  useCreateMasterMutation,
  useDeleteMasterMutation,
  useGetMastersQuery,
  useGetRatingsQuery,
  useUpdateMasterMutation,
} from '../../../entities/master/api/masterApi';
import { Button } from '../../../shared/ui/Button';
import { DataTable } from '../../../shared/ui/DataTable';
import { Modal } from '../../../shared/ui/Modal';
import { TextInput } from '../../../shared/ui/TextInput';

type MasterModalMode = 'create' | 'edit' | 'delete' | null;

type CityOption = {
  label: string;
  value: number;
};

type MasterFormValues = {
  name: string;
  ratingId: string;
  cities: CityOption[];
};

function mapCitiesToOptions(cities: City[]): CityOption[] {
  return cities.map((city) => ({
    label: city.title,
    value: city.id,
  }));
}

function mapMasterCitiesToOptions(master: MasterOfCities): CityOption[] {
  return master.cities.map((city) => ({
    label: city.title,
    value: city.id,
  }));
}

export function MastersTab() {
  const { data: masters = [], isLoading, isError } = useGetMastersQuery();
  const { data: cities = [] } = useGetCitiesQuery();
  const { data: ratings = [] } = useGetRatingsQuery();
  const [createMaster, { isLoading: isCreating }] = useCreateMasterMutation();
  const [updateMaster, { isLoading: isUpdating }] = useUpdateMasterMutation();
  const [deleteMaster, { isLoading: isDeleting }] = useDeleteMasterMutation();
  const [modalMode, setModalMode] = useState<MasterModalMode>(null);
  const [selectedMaster, setSelectedMaster] = useState<MasterOfCities | null>(null);
  const [modalError, setModalError] = useState('');

  const isMutating = isCreating || isUpdating || isDeleting;
  const cityOptions = useMemo(() => mapCitiesToOptions(cities), [cities]);

  const {
    register,
    control,
    handleSubmit,
    reset,
    formState: { errors },
  } = useForm<MasterFormValues>({
    defaultValues: {
      name: '',
      ratingId: '',
      cities: [],
    },
  });

  const modalTitle = useMemo(() => {
    if (modalMode === 'create') {
      return 'Добавить мастера';
    }

    if (modalMode === 'edit') {
      return 'Редактировать мастера';
    }

    if (modalMode === 'delete') {
      return 'Удалить мастера';
    }

    return '';
  }, [modalMode]);

  const openCreateModal = () => {
    setModalMode('create');
    setSelectedMaster(null);
    setModalError('');
    reset({
      name: '',
      ratingId: '',
      cities: [],
    });
  };

  const openEditModal = (master: MasterOfCities) => {
    setModalMode('edit');
    setSelectedMaster(master);
    setModalError('');
    reset({
      name: master.master_name,
      ratingId: String(master.master_rating),
      cities: mapMasterCitiesToOptions(master),
    });
  };

  const openDeleteModal = (master: MasterOfCities) => {
    setModalMode('delete');
    setSelectedMaster(master);
    setModalError('');
  };

  const closeModal = () => {
    if (isMutating) {
      return;
    }

    setModalMode(null);
    setSelectedMaster(null);
    setModalError('');
    reset({
      name: '',
      ratingId: '',
      cities: [],
    });
  };

  const onSubmit = async (values: MasterFormValues) => {
    setModalError('');

    try {
      if (modalMode === 'create') {
        const created = await createMaster({
          newName: values.name.trim(),
          arr: values.cities.map((city) => city.value),
          rating_id: String(values.ratingId),
        }).unwrap();

        const createdMaster = created[0];

        if (!createdMaster) {
          throw new Error('Empty create response');
        }

        closeModal();
        return;
      }

      if (modalMode === 'edit' && selectedMaster) {
        await updateMaster({
          masterId: selectedMaster.master_id,
          newName: values.name.trim(),
          ratingId: Number(values.ratingId),
          arr: values.cities.map((city) => city.value),
        }).unwrap();

        closeModal();
      }
    } catch {
      setModalError('Не удалось сохранить мастера. Попробуйте позже.');
    }
  };

  const handleDelete = async () => {
    if (!selectedMaster) {
      return;
    }

    setModalError('');

    try {
      await deleteMaster(selectedMaster.master_id).unwrap();
      closeModal();
    } catch {
      setModalError('Не удалось удалить мастера. Попробуйте позже.');
    }
  };

  if (isLoading) {
    return <div className="dashboard-state">Загрузка мастеров...</div>;
  }

  if (isError) {
    return <div className="dashboard-state dashboard-state--error">Не удалось загрузить мастеров.</div>;
  }

  return (
    <>
      <div className="dashboard-panel">
        <div className="dashboard-toolbar">
          <Button type="button" onClick={openCreateModal}>Добавить мастера</Button>
        </div>

        <DataTable
          rows={masters}
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
          <>
            <p>Удалить мастера {selectedMaster?.master_name}?</p>
            {modalError ? <div className="modal-error">{modalError}</div> : null}
            <div className="modal-actions">
              <Button type="button" onClick={handleDelete} disabled={isMutating}>
                {isDeleting ? 'Deleting...' : 'Yes'}
              </Button>
              <Button type="button" className="button button--secondary" onClick={closeModal} disabled={isMutating}>
                No
              </Button>
            </div>
          </>
        ) : (
          <form className="modal-form" onSubmit={handleSubmit(onSubmit)}>
            <div>
              <TextInput
                placeholder="Имя мастера"
                {...register('name', { required: 'Введите имя мастера.' })}
              />
              {errors.name ? <div className="modal-error">{errors.name.message}</div> : null}
            </div>

            <div>
              <select
                className="form-control"
                {...register('ratingId', { required: 'Выберите рейтинг.' })}
              >
                <option value="">Выберите рейтинг</option>
                {ratings.map((rating) => (
                  <option key={rating.id} value={String(rating.id)}>
                    {rating.rating}
                  </option>
                ))}
              </select>
              {errors.ratingId ? <div className="modal-error">{errors.ratingId.message}</div> : null}
            </div>

            <div>
              <Controller
                name="cities"
                control={control}
                rules={{
                  validate: (value) => value.length > 0 || 'Выберите хотя бы один город.',
                }}
                render={({ field }) => (
                  <Select
                    isMulti
                    classNamePrefix="master-select"
                    options={cityOptions}
                    value={field.value}
                    onChange={(value) => field.onChange(value)}
                    placeholder="Выберите города"
                  />
                )}
              />
              {errors.cities ? <div className="modal-error">{errors.cities.message}</div> : null}
            </div>

            {modalError ? <div className="modal-error">{modalError}</div> : null}

            <div className="modal-actions">
              <Button type="submit" disabled={isMutating}>
                {modalMode === 'create'
                  ? isCreating ? 'Creating...' : 'Create'
                  : isUpdating ? 'Saving...' : 'Save'}
              </Button>
              <Button type="button" className="button button--secondary" onClick={closeModal} disabled={isMutating}>
                Cancel
              </Button>
            </div>
          </form>
        )}
      </Modal>
    </>
  );
}
