import { useState, useRef, useEffect } from 'react';
import type { Product } from '@/mocks/products';
import styles from './ProductTabs.module.css';

export type TabId = 'description' | 'reviews' | 'qa' | 'shipping';

export interface ProductTabsProps {
  product: Product;
  activeTab?: TabId;
  onTabChange?: (tab: TabId) => void;
}

interface Tab {
  id: TabId;
  label: string;
  badge?: number;
}

export function ProductTabs({
  product,
  activeTab: controlledActiveTab,
  onTabChange,
}: ProductTabsProps) {
  const [internalActiveTab, setInternalActiveTab] = useState<TabId>('description');
  const tabsRef = useRef<HTMLDivElement>(null);

  const activeTab = controlledActiveTab ?? internalActiveTab;

  const tabs: Tab[] = [
    { id: 'description', label: '상품설명' },
    { id: 'reviews', label: '리뷰', badge: product.reviewCount },
    { id: 'qa', label: 'Q&A', badge: 0 },
    { id: 'shipping', label: '배송/교환/반품' },
  ];

  const handleTabClick = (tabId: TabId) => {
    if (onTabChange) {
      onTabChange(tabId);
    } else {
      setInternalActiveTab(tabId);
    }
  };

  useEffect(() => {
    if (tabsRef.current) {
      const activeButton = tabsRef.current.querySelector(`.${styles.active}`) as HTMLButtonElement;
      if (activeButton) {
        activeButton.scrollIntoView({
          behavior: 'smooth',
          block: 'nearest',
          inline: 'center',
        });
      }
    }
  }, [activeTab]);

  const renderStars = (rating: number) => {
    const stars = [];
    const fullStars = Math.floor(rating);

    for (let i = 0; i < 5; i++) {
      if (i < fullStars) {
        stars.push(
          <svg key={i} xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="currentColor">
            <path
              fillRule="evenodd"
              d="M10.788 3.21c.448-1.077 1.976-1.077 2.424 0l2.082 5.006 5.404.434c1.164.093 1.636 1.545.749 2.305l-4.117 3.527 1.257 5.273c.271 1.136-.964 2.033-1.96 1.425L12 18.354 7.373 21.18c-.996.608-2.231-.29-1.96-1.425l1.257-5.273-4.117-3.527c-.887-.76-.415-2.212.749-2.305l5.404-.434 2.082-5.005Z"
              clipRule="evenodd"
            />
          </svg>
        );
      } else {
        stars.push(
          <svg
            key={i}
            xmlns="http://www.w3.org/2000/svg"
            fill="none"
            viewBox="0 0 24 24"
            strokeWidth={1.5}
            stroke="currentColor"
            style={{ color: 'var(--color-neutral-300)' }}
          >
            <path
              strokeLinecap="round"
              strokeLinejoin="round"
              d="M11.48 3.499a.562.562 0 0 1 1.04 0l2.125 5.111a.563.563 0 0 0 .475.345l5.518.442c.499.04.701.663.321.988l-4.204 3.602a.563.563 0 0 0-.182.557l1.285 5.385a.562.562 0 0 1-.84.61l-4.725-2.885a.562.562 0 0 0-.586 0L6.982 20.54a.562.562 0 0 1-.84-.61l1.285-5.386a.562.562 0 0 0-.182-.557l-4.204-3.602a.562.562 0 0 1 .321-.988l5.518-.442a.563.563 0 0 0 .475-.345L11.48 3.5Z"
            />
          </svg>
        );
      }
    }

    return stars;
  };

  const renderTabContent = () => {
    switch (activeTab) {
      case 'description':
        return (
          <div className={styles.infoSection}>
            {/* Long Description */}
            {product.detail?.longDescription && (
              <div className={styles.infoBlock}>
                <p className={styles.description}>{product.detail.longDescription}</p>
              </div>
            )}

            {/* Product Info Table */}
            <div className={styles.infoBlock}>
              <h3 className={styles.infoTitle}>상품 정보</h3>
              <table className={styles.infoTable}>
                <tbody>
                  <tr>
                    <th>상품명</th>
                    <td>{product.name}</td>
                  </tr>
                  <tr>
                    <th>원산지</th>
                    <td>{product.detail?.origin || product.origin}</td>
                  </tr>
                  <tr>
                    <th>중량</th>
                    <td>{product.weight || '-'}</td>
                  </tr>
                  <tr>
                    <th>등급</th>
                    <td>{product.grade}급</td>
                  </tr>
                  {product.detail?.manufacturer && (
                    <tr>
                      <th>판매자</th>
                      <td>{product.detail.manufacturer}</td>
                    </tr>
                  )}
                  {product.detail?.storageMethod && (
                    <tr>
                      <th>보관방법</th>
                      <td>{product.detail.storageMethod}</td>
                    </tr>
                  )}
                  {product.detail?.shelfLife && (
                    <tr>
                      <th>유통기한</th>
                      <td>{product.detail.shelfLife}</td>
                    </tr>
                  )}
                </tbody>
              </table>
            </div>

            {/* Nutrition Info */}
            {product.detail?.nutritionInfo && (
              <div className={styles.infoBlock}>
                <h3 className={styles.infoTitle}>영양 정보</h3>
                <table className={styles.nutritionTable}>
                  <tbody>
                    {product.detail.nutritionInfo.calories && (
                      <tr>
                        <th>열량</th>
                        <td>{product.detail.nutritionInfo.calories}</td>
                      </tr>
                    )}
                    {product.detail.nutritionInfo.protein && (
                      <tr>
                        <th>단백질</th>
                        <td>{product.detail.nutritionInfo.protein}</td>
                      </tr>
                    )}
                    {product.detail.nutritionInfo.fat && (
                      <tr>
                        <th>지방</th>
                        <td>{product.detail.nutritionInfo.fat}</td>
                      </tr>
                    )}
                    {product.detail.nutritionInfo.carbohydrates && (
                      <tr>
                        <th>탄수화물</th>
                        <td>{product.detail.nutritionInfo.carbohydrates}</td>
                      </tr>
                    )}
                    {product.detail.nutritionInfo.sodium && (
                      <tr>
                        <th>나트륨</th>
                        <td>{product.detail.nutritionInfo.sodium}</td>
                      </tr>
                    )}
                  </tbody>
                </table>
              </div>
            )}
          </div>
        );

      case 'reviews':
        return (
          <div className={styles.reviewSection}>
            {/* Review Summary */}
            <div className={styles.reviewSummary}>
              <div className={styles.reviewScore}>
                <span className={styles.scoreValue}>{product.rating.toFixed(1)}</span>
                <div className={styles.scoreStars}>{renderStars(product.rating)}</div>
                <span className={styles.reviewCount}>
                  {product.reviewCount.toLocaleString()}개의 리뷰
                </span>
              </div>
            </div>

            {/* Review List - placeholder for now */}
            {product.reviewCount === 0 ? (
              <div className={styles.emptyReviews}>
                <svg
                  className={styles.emptyIcon}
                  xmlns="http://www.w3.org/2000/svg"
                  fill="none"
                  viewBox="0 0 24 24"
                  strokeWidth={1.5}
                  stroke="currentColor"
                >
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    d="M7.5 8.25h9m-9 3H12m-9.75 1.51c0 1.6 1.123 2.994 2.707 3.227 1.129.166 2.27.293 3.423.379.35.026.67.21.865.501L12 21l2.755-4.133a1.14 1.14 0 0 1 .865-.501 48.172 48.172 0 0 0 3.423-.379c1.584-.233 2.707-1.626 2.707-3.228V6.741c0-1.602-1.123-2.995-2.707-3.228A48.394 48.394 0 0 0 12 3c-2.392 0-4.744.175-7.043.513C3.373 3.746 2.25 5.14 2.25 6.741v6.018Z"
                  />
                </svg>
                <p className={styles.emptyText}>
                  아직 리뷰가 없습니다.
                  <br />첫 번째 리뷰를 작성해 주세요!
                </p>
              </div>
            ) : (
              <div className={styles.emptyReviews}>
                <svg
                  className={styles.emptyIcon}
                  xmlns="http://www.w3.org/2000/svg"
                  fill="none"
                  viewBox="0 0 24 24"
                  strokeWidth={1.5}
                  stroke="currentColor"
                >
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    d="M7.5 8.25h9m-9 3H12m-9.75 1.51c0 1.6 1.123 2.994 2.707 3.227 1.129.166 2.27.293 3.423.379.35.026.67.21.865.501L12 21l2.755-4.133a1.14 1.14 0 0 1 .865-.501 48.172 48.172 0 0 0 3.423-.379c1.584-.233 2.707-1.626 2.707-3.228V6.741c0-1.602-1.123-2.995-2.707-3.228A48.394 48.394 0 0 0 12 3c-2.392 0-4.744.175-7.043.513C3.373 3.746 2.25 5.14 2.25 6.741v6.018Z"
                  />
                </svg>
                <p className={styles.emptyText}>리뷰 목록은 추후 개발 예정입니다.</p>
              </div>
            )}
          </div>
        );

      case 'qa':
        return (
          <div className={styles.qaSection}>
            <div className={styles.qaHeader}>
              <h3 className={styles.qaTitle}>상품 Q&A</h3>
              <button className={styles.qaButton} type="button">
                <svg
                  xmlns="http://www.w3.org/2000/svg"
                  fill="none"
                  viewBox="0 0 24 24"
                  strokeWidth={2}
                  stroke="currentColor"
                >
                  <path strokeLinecap="round" strokeLinejoin="round" d="M12 4.5v15m7.5-7.5h-15" />
                </svg>
                <span>질문하기</span>
              </button>
            </div>

            <div className={styles.emptyQa}>
              <svg
                className={styles.emptyIcon}
                xmlns="http://www.w3.org/2000/svg"
                fill="none"
                viewBox="0 0 24 24"
                strokeWidth={1.5}
                stroke="currentColor"
              >
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  d="M9.879 7.519c1.171-1.025 3.071-1.025 4.242 0 1.172 1.025 1.172 2.687 0 3.712-.203.179-.43.326-.67.442-.745.361-1.45.999-1.45 1.827v.75M21 12a9 9 0 1 1-18 0 9 9 0 0 1 18 0Zm-9 5.25h.008v.008H12v-.008Z"
                />
              </svg>
              <p className={styles.emptyText}>
                등록된 질문이 없습니다.
                <br />
                궁금하신 점이 있으시면 질문해 주세요!
              </p>
            </div>
          </div>
        );

      case 'shipping':
        return (
          <div className={styles.shippingSection}>
            <div className={styles.shippingBlock}>
              <h3 className={styles.shippingTitle}>배송 안내</h3>
              <ul className={styles.shippingList}>
                <li>
                  배송비: {product.freeShipping ? '무료' : '3,000원'} (50,000원 이상 구매 시
                  무료배송)
                </li>
                <li>배송 지역: 전국 (제주 및 도서산간 지역 추가 배송비 발생)</li>
                <li>배송 기간: 결제 완료 후 1~3일 이내 출고</li>
                <li>
                  당일 발송: 오후 2시 이전 결제 완료 시 당일 발송 (재고 상황에 따라 변동 가능)
                </li>
              </ul>
            </div>

            <div className={styles.shippingBlock}>
              <h3 className={styles.shippingTitle}>교환/반품 안내</h3>
              <ul className={styles.shippingList}>
                <li>교환/반품 신청 기간: 상품 수령 후 7일 이내 (신선식품의 경우 수령 당일)</li>
                <li>교환/반품 배송비: 고객 변심의 경우 왕복 6,000원 부담</li>
                <li>
                  교환/반품 불가 사유:
                  <ul>
                    <li>상품 수령 후 7일 경과</li>
                    <li>고객 책임으로 인한 상품 손상</li>
                    <li>신선식품 개봉 후 단순 변심</li>
                  </ul>
                </li>
              </ul>
            </div>

            <div className={styles.shippingBlock}>
              <h3 className={styles.shippingTitle}>환불 안내</h3>
              <p className={styles.shippingContent}>
                환불은 교환/반품 상품 도착 후 검수 완료 시 처리되며, 결제 수단에 따라 3~5영업일
                소요될 수 있습니다. 신용카드 결제의 경우 카드사 정책에 따라 환불 일정이 달라질 수
                있습니다.
              </p>
            </div>

            <div className={styles.shippingBlock}>
              <h3 className={styles.shippingTitle}>고객센터</h3>
              <p className={styles.shippingContent}>
                전화: 033-644-6077
                <br />
                휴대폰: 010-3811-6000
                <br />
                운영시간: 평일 09:00 ~ 18:00 (점심시간 12:00 ~ 13:00)
                <br />
                토/일/공휴일 휴무
              </p>
            </div>
          </div>
        );

      default:
        return null;
    }
  };

  return (
    <div className={styles.container}>
      {/* Tab Navigation */}
      <div className={styles.tabNav} ref={tabsRef}>
        {tabs.map((tab) => (
          <button
            key={tab.id}
            className={`${styles.tabButton} ${activeTab === tab.id ? styles.active : ''}`}
            onClick={() => handleTabClick(tab.id)}
            type="button"
          >
            {tab.label}
            {tab.badge !== undefined && tab.badge > 0 && (
              <span className={styles.tabBadge}>{tab.badge > 99 ? '99+' : tab.badge}</span>
            )}
          </button>
        ))}
      </div>

      {/* Tab Content */}
      <div className={styles.tabContent}>{renderTabContent()}</div>
    </div>
  );
}
