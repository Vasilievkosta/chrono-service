import type { Master } from '../../../entities/master/api/masterApi';
import { Button } from '../../../shared/ui/Button';
import { Modal } from '../../../shared/ui/Modal';

interface MasterSelectModalProps {
  isOpen: boolean;
  masters: Master[];
  isSubmittingOrder: boolean;
  onClose: () => void;
  onSelect: (master: Master) => void;
}

export function MasterSelectModal({
  isOpen,
  masters,
  isSubmittingOrder,
  onClose,
  onSelect,
}: MasterSelectModalProps) {
  return (
    <Modal title="Выберите мастера" isOpen={isOpen} onClose={onClose}>
      {masters.length === 0 ? (
        <div className="modal-empty">Нет доступных мастеров на выбранное время</div>
      ) : (
        <div className="master-list">
          {masters.map((master) => (
            <div key={master.id} className="master-card">
              <div>
                <div className="master-card__name">{master.name}</div>
                <div className="master-card__meta">Рейтинг: {master.rating_id}</div>
              </div>

              <Button
                type="button"
                disabled={isSubmittingOrder}
                onClick={() => onSelect(master)}
              >
                {isSubmittingOrder ? 'Создание заказа...' : 'Выбрать'}
              </Button>
            </div>
          ))}
        </div>
      )}
    </Modal>
  );
}
