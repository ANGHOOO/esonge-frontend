import { useState } from 'react';
import { Link } from 'react-router-dom';
import { Package, Truck, ChevronDown, ChevronUp, X } from 'lucide-react';
import { ROUTES } from '@/constants/routes';
import { Button } from '@/components/ui';
import type { Order } from '@/mocks/orders';
import { ORDER_STATUS_LABELS } from '@/mocks/orders';
import styles from './OrderCard.module.css';

export interface OrderCardProps {
  order: Order;
  onCancelOrder?: (orderId: string) => void;
}

export function OrderCard({ order, onCancelOrder }: OrderCardProps) {
  const [isExpanded, setIsExpanded] = useState(false);

  const formatPrice = (price: number) => {
    return new Intl.NumberFormat('ko-KR').format(price);
  };

  const formatDate = (dateString: string) => {
    return new Date(dateString).toLocaleDateString('ko-KR', {
      year: 'numeric',
      month: 'long',
      day: 'numeric',
    });
  };

  const getStatusClass = () => {
    switch (order.status) {
      case 'delivered':
        return styles.statusDelivered;
      case 'shipping':
        return styles.statusShipping;
      case 'cancelled':
        return styles.statusCancelled;
      default:
        return styles.statusPending;
    }
  };

  const canCancel = order.status === 'pending' || order.status === 'confirmed';
  const firstItem = order.items[0];
  const additionalItemsCount = order.items.length - 1;

  return (
    <div className={styles.card}>
      {/* Header */}
      <div className={styles.header}>
        <div className={styles.orderInfo}>
          <span className={styles.orderNumber}>{order.orderNumber}</span>
          <span className={styles.orderDate}>{formatDate(order.orderedAt)}</span>
        </div>
        <span className={`${styles.status} ${getStatusClass()}`}>
          {ORDER_STATUS_LABELS[order.status]}
        </span>
      </div>

      {/* Main Item */}
      <div className={styles.mainItem}>
        <Link to={`${ROUTES.PRODUCTS}/${firstItem.product.id}`} className={styles.imageLink}>
          <img
            src={firstItem.product.images[0]}
            alt={firstItem.product.name}
            className={styles.image}
          />
        </Link>
        <div className={styles.itemInfo}>
          <Link to={`${ROUTES.PRODUCTS}/${firstItem.product.id}`} className={styles.itemName}>
            {firstItem.product.name}
          </Link>
          <div className={styles.itemMeta}>
            <span>{formatPrice(firstItem.price)}원</span>
            <span className={styles.quantity}>수량: {firstItem.quantity}개</span>
          </div>
          {additionalItemsCount > 0 && (
            <button
              type="button"
              className={styles.expandButton}
              onClick={() => setIsExpanded(!isExpanded)}
            >
              외 {additionalItemsCount}개 상품
              {isExpanded ? <ChevronUp size={16} /> : <ChevronDown size={16} />}
            </button>
          )}
        </div>
      </div>

      {/* Expanded Items */}
      {isExpanded && order.items.length > 1 && (
        <div className={styles.expandedItems}>
          {order.items.slice(1).map((item) => (
            <div key={item.product.id} className={styles.expandedItem}>
              <Link
                to={`${ROUTES.PRODUCTS}/${item.product.id}`}
                className={styles.expandedImageLink}
              >
                <img
                  src={item.product.images[0]}
                  alt={item.product.name}
                  className={styles.expandedImage}
                />
              </Link>
              <div className={styles.expandedItemInfo}>
                <Link
                  to={`${ROUTES.PRODUCTS}/${item.product.id}`}
                  className={styles.expandedItemName}
                >
                  {item.product.name}
                </Link>
                <div className={styles.expandedItemMeta}>
                  <span>{formatPrice(item.price)}원</span>
                  <span>수량: {item.quantity}개</span>
                </div>
              </div>
            </div>
          ))}
        </div>
      )}

      {/* Shipping Info */}
      {order.status === 'shipping' && order.trackingNumber && (
        <div className={styles.shippingInfo}>
          <Truck size={16} />
          <span>
            {order.carrier} {order.trackingNumber}
          </span>
        </div>
      )}

      {order.status === 'delivered' && order.deliveredAt && (
        <div className={styles.deliveredInfo}>
          <Package size={16} />
          <span>{formatDate(order.deliveredAt)} 배송 완료</span>
        </div>
      )}

      {/* Footer */}
      <div className={styles.footer}>
        <div className={styles.totalAmount}>
          <span className={styles.totalLabel}>결제금액</span>
          <span className={styles.totalPrice}>
            {formatPrice(order.totalAmount + order.shippingFee)}원
          </span>
        </div>
        <div className={styles.actions}>
          {canCancel && onCancelOrder && (
            <Button variant="outline" size="sm" onClick={() => onCancelOrder(order.id)}>
              <X size={14} />
              주문 취소
            </Button>
          )}
          <Link to={`${ROUTES.ORDERS}/${order.id}`}>
            <Button variant="secondary" size="sm">
              주문 상세
            </Button>
          </Link>
        </div>
      </div>
    </div>
  );
}
