import { useMemo, useState } from 'react';
import { useForm } from 'react-hook-form';

import { useGetCitiesQuery } from '../../../entities/city/api/cityApi';
import {
  type AppUser,
  useDeleteUserMutation,
  useGetUsersQuery,
  useUpdateUserMutation,
} from '../../../entities/user/api/userApi';
import { Button } from '../../../shared/ui/Button';
import { DataTable } from '../../../shared/ui/DataTable';
import { Modal } from '../../../shared/ui/Modal';
import { TextInput } from '../../../shared/ui/TextInput';

type UserModalMode = 'edit' | 'delete' | null;

type UserFormValues = {
  userName: string;
  email: string;
  cityId: string;
};

function getUserCityId(user: AppUser, cities: Array<{ id: number; title: string }>) {
  if (user.city_id) {
    return String(user.city_id);
  }

  const city = cities.find((item) => item.title === user.title);
  return city ? String(city.id) : '';
}

function getRtkErrorMessage(error: unknown) {
  if (typeof error === 'object' && error !== null && 'data' in error) {
    const data = (error as { data?: unknown }).data;

    if (typeof data === 'string') {
      return data;
    }

    if (typeof data === 'object' && data !== null && 'message' in data) {
      const message = (data as { message?: unknown }).message;

      if (typeof message === 'string') {
        return message;
      }
    }
  }

  return 'Не удалось выполнить действие. Попробуйте позже.';
}

export function UsersTab() {
  const { data: users = [], isLoading, isError } = useGetUsersQuery();
  const { data: cities = [] } = useGetCitiesQuery();
  const [updateUser, { isLoading: isUpdating }] = useUpdateUserMutation();
  const [deleteUser, { isLoading: isDeleting }] = useDeleteUserMutation();
  const [modalMode, setModalMode] = useState<UserModalMode>(null);
  const [selectedUser, setSelectedUser] = useState<AppUser | null>(null);
  const [modalError, setModalError] = useState('');

  const isMutating = isUpdating || isDeleting;

  const {
    register,
    handleSubmit,
    reset,
    formState: { errors },
  } = useForm<UserFormValues>({
    defaultValues: {
      userName: '',
      email: '',
      cityId: '',
    },
  });

  const modalTitle = useMemo(() => {
    if (modalMode === 'edit') {
      return 'Редактировать пользователя';
    }

    if (modalMode === 'delete') {
      return 'Удалить пользователя';
    }

    return '';
  }, [modalMode]);

  const openEditModal = (user: AppUser) => {
    setModalMode('edit');
    setSelectedUser(user);
    setModalError('');
    reset({
      userName: user.username,
      email: user.email,
      cityId: getUserCityId(user, cities),
    });
  };

  const openDeleteModal = (user: AppUser) => {
    setModalMode('delete');
    setSelectedUser(user);
    setModalError('');
  };

  const closeModal = () => {
    if (isMutating) {
      return;
    }

    setModalMode(null);
    setSelectedUser(null);
    setModalError('');
    reset({
      userName: '',
      email: '',
      cityId: '',
    });
  };

  const onSubmit = async (values: UserFormValues) => {
    if (!selectedUser) {
      return;
    }

    setModalError('');

    try {
      await updateUser({
        id: selectedUser.id,
        userName: values.userName.trim(),
        email: values.email.trim(),
        city_id: Number(values.cityId),
      }).unwrap();

      closeModal();
    } catch (error) {
      setModalError(getRtkErrorMessage(error));
    }
  };

  const handleDelete = async () => {
    if (!selectedUser) {
      return;
    }

    setModalError('');

    try {
      await deleteUser(selectedUser.id).unwrap();
      closeModal();
    } catch (error) {
      setModalError(getRtkErrorMessage(error));
    }
  };

  if (isLoading) {
    return <div className="dashboard-state">Загрузка пользователей...</div>;
  }

  if (isError) {
    return <div className="dashboard-state dashboard-state--error">Не удалось загрузить пользователей.</div>;
  }

  return (
    <>
      <div className="dashboard-panel">
        <DataTable
          rows={users}
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
            <p>Удалить пользователя {selectedUser?.username}?</p>
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
                placeholder="Имя пользователя"
                {...register('userName', { required: 'Введите имя пользователя.' })}
              />
              {errors.userName ? <div className="modal-error">{errors.userName.message}</div> : null}
            </div>

            <div>
              <TextInput
                type="email"
                placeholder="Email"
                {...register('email', { required: 'Введите email.' })}
              />
              {errors.email ? <div className="modal-error">{errors.email.message}</div> : null}
            </div>

            <div>
              <select className="form-control" {...register('cityId', { required: 'Выберите город.' })}>
                <option value="">Выберите город</option>
                {cities.map((city) => (
                  <option key={city.id} value={String(city.id)}>
                    {city.title}
                  </option>
                ))}
              </select>
              {errors.cityId ? <div className="modal-error">{errors.cityId.message}</div> : null}
            </div>

            {modalError ? <div className="modal-error">{modalError}</div> : null}

            <div className="modal-actions">
              <Button type="submit" disabled={isMutating}>
                {isUpdating ? 'Saving...' : 'Save'}
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
