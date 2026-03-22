import { useState } from 'react';

import { type Master, useGetAvailableMastersMutation } from '../../../entities/master/api/masterApi';
import {
  type OrderItem,
  useDeleteOrderMutation,
  useGetOrdersQuery,
  useUpdateOrderMutation,
} from '../../../entities/order/api/orderApi';
import { Button } from '../../../shared/ui/Button';
import { DataTable } from '../../../shared/ui/DataTable';
import { Modal } from '../../../shared/ui/Modal';
import { formatDate, formatHour } from '../../order-form/lib/orderSchedule';
import { OrderEditForm } from '../../order-form/ui/OrderEditForm';
import { MasterSelectModal } from '../../order-form/ui/MasterSelectModal';

type OrderEditValues = {
  repairDate: Date;
  repairTime: string;
  watchSize: 'large' | 'medium' | 'small';
};

interface PendingOrderUpdate {
  orderId: number;
  userId: number;
  cityId: number;
  date: string;
  time: string;
  duration: number;
}

const durationBySize: Record<OrderEditValues['watchSize'], number> = {
  large: 3,
  medium: 2,
  small: 1,
};

function getOrderUserId(order: OrderItem) {
  return order.user.id ?? order.user_id;
}

function getOrderCityId(order: OrderItem) {
  return order.city.id ?? order.city_id;
}

export function OrdersTab() {
  const { data = [], isLoading, isError } = useGetOrdersQuery();
  const [getAvailableMasters, { isLoading: isLoadingMasters }] = useGetAvailableMastersMutation();
  const [updateOrder, { isLoading: isUpdatingOrder }] = useUpdateOrderMutation();
  const [deleteOrder, { isLoading: isDeletingOrder }] = useDeleteOrderMutation();
  const [selectedOrder, setSelectedOrder] = useState<OrderItem | null>(null);
  const [pendingOrder, setPendingOrder] = useState<PendingOrderUpdate | null>(null);
  const [masters, setMasters] = useState<Master[]>([]);
  const [isEditModalOpen, setIsEditModalOpen] = useState(false);
  const [isDeleteModalOpen, setIsDeleteModalOpen] = useState(false);
  const [isMasterModalOpen, setIsMasterModalOpen] = useState(false);
  const [submitError, setSubmitError] = useState('');
  const [deleteError, setDeleteError] = useState('');

  const openEditModal = (order: OrderItem) => {
    setSelectedOrder(order);
    setSubmitError('');
    setIsEditModalOpen(true);
  };

  const openDeleteModal = (order: OrderItem) => {
    setSelectedOrder(order);
    setDeleteError('');
    setIsDeleteModalOpen(true);
  };

  const closeEditModal = () => {
    if (isLoadingMasters || isUpdatingOrder) {
      return;
    }

    setIsEditModalOpen(false);
    setSelectedOrder(null);
    setSubmitError('');
  };

  const closeDeleteModal = () => {
    if (isDeletingOrder) {
      return;
    }

    setIsDeleteModalOpen(false);
    setSelectedOrder(null);
    setDeleteError('');
  };

  const handleEditSubmit = async (values: OrderEditValues) => {
    if (!selectedOrder) {
      return;
    }

    const userId = getOrderUserId(selectedOrder);
    const cityId = getOrderCityId(selectedOrder);

    if (!userId || !cityId) {
      setSubmitError('Не удалось определить пользователя или город заказа.');
      return;
    }

    setSubmitError('');

    try {
      const payload = {
        orderId: selectedOrder.id,
        userId,
        cityId,
        date: formatDate(values.repairDate),
        time: formatHour(values.repairTime),
        duration: durationBySize[values.watchSize],
      };

      const availableMasters = await getAvailableMasters({
        cityId: String(payload.cityId),
        date: payload.date,
        time: payload.time,
        duration: payload.duration,
      }).unwrap();

      setPendingOrder(payload);
      setMasters(availableMasters);
      setIsMasterModalOpen(true);
    } catch {
      setSubmitError('Не удалось получить доступных мастеров. Попробуйте позже.');
    }
  };

  const handleSelectMaster = async (master: Master) => {
    if (!pendingOrder) {
      return;
    }

    setSubmitError('');

    try {
      await updateOrder({
        orderId: pendingOrder.orderId,
        date: pendingOrder.date,
        time: pendingOrder.time,
        duration: pendingOrder.duration,
        user_id: pendingOrder.userId,
        master_id: master.id,
      }).unwrap();

      setIsMasterModalOpen(false);
      setIsEditModalOpen(false);
      setSelectedOrder(null);
      setPendingOrder(null);
      setMasters([]);
    } catch {
      setSubmitError('Не удалось обновить заказ. Попробуйте позже.');
    }
  };

  const handleDeleteOrder = async () => {
    if (!selectedOrder) {
      return;
    }

    setDeleteError('');

    try {
      await deleteOrder(selectedOrder.id).unwrap();
      setIsDeleteModalOpen(false);
      setSelectedOrder(null);
    } catch {
      setDeleteError('Не удалось удалить заказ. Попробуйте позже.');
    }
  };

  const closeMasterModal = () => {
    if (isUpdatingOrder) {
      return;
    }

    setIsMasterModalOpen(false);
    setPendingOrder(null);
    setMasters([]);
  };

  if (isLoading) {
    return <div className="dashboard-state">Загрузка заказов...</div>;
  }

  if (isError) {
    return <div className="dashboard-state dashboard-state--error">Не удалось загрузить заказы.</div>;
  }

  return (
    <>
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

      <Modal title="Редактировать заказ" isOpen={isEditModalOpen && !!selectedOrder} onClose={closeEditModal}>
        {selectedOrder ? (
          <OrderEditForm
            order={selectedOrder}
            isSubmitting={isLoadingMasters}
            submitError={submitError}
            onSubmit={handleEditSubmit}
          />
        ) : null}
      </Modal>

      <Modal title="Удалить заказ" isOpen={isDeleteModalOpen && !!selectedOrder} onClose={closeDeleteModal}>
        {selectedOrder ? (
          <>
            <p>Вы точно хотите удалить заказ пользователя {selectedOrder.user.name}?</p>
            {deleteError ? <div className="modal-error">{deleteError}</div> : null}
            <div className="modal-actions">
              <Button type="button" onClick={handleDeleteOrder} disabled={isDeletingOrder}>
                {isDeletingOrder ? 'Deleting...' : 'Yes'}
              </Button>
              <Button
                type="button"
                className="button button--secondary"
                onClick={closeDeleteModal}
                disabled={isDeletingOrder}
              >
                No
              </Button>
            </div>
          </>
        ) : null}
      </Modal>

      <MasterSelectModal
        isOpen={isMasterModalOpen}
        masters={masters}
        isSubmittingOrder={isUpdatingOrder}
        onClose={closeMasterModal}
        onSelect={handleSelectMaster}
      />
    </>
  );
}
