import { Link } from 'react-router-dom';
import { Phone, Mail, MapPin } from 'lucide-react';
import { ROUTES } from '@/constants/routes';
import styles from './Footer.module.css';

export function Footer() {
  const currentYear = new Date().getFullYear();

  return (
    <footer className={styles.footer}>
      <div className={styles.container}>
        <div className={styles.grid}>
          {/* Company Info */}
          <div className={styles.section}>
            <h3 className={styles.sectionTitle}>동성유통</h3>
            <p className={styles.companyDescription}>
              강원도 송이 전문 유통업체로서 최고 품질의 수산물과 농산물을 제공합니다.
            </p>
            <div className={styles.contactInfo}>
              <div className={styles.contactItem}>
                <Phone className={styles.contactIcon} />
                <a href="tel:033-644-6077" className={styles.contactLink}>
                  033-644-6077
                </a>
              </div>
              <div className={styles.contactItem}>
                <Mail className={styles.contactIcon} />
                <a href="mailto:support@esonge.co.kr" className={styles.contactLink}>
                  support@esonge.co.kr
                </a>
              </div>
              <div className={styles.contactItem}>
                <MapPin className={styles.contactIcon} />
                <span className={styles.contactText}>강원도</span>
              </div>
            </div>
          </div>

          {/* Quick Links */}
          <div className={styles.section}>
            <h4 className={styles.sectionTitle}>쇼핑 안내</h4>
            <ul className={styles.linkList}>
              <li>
                <Link to={ROUTES.PRODUCTS} className={styles.link}>
                  전체 상품
                </Link>
              </li>
              <li>
                <Link to={`${ROUTES.PRODUCTS}?category=seafood`} className={styles.link}>
                  수산물
                </Link>
              </li>
              <li>
                <Link to={`${ROUTES.PRODUCTS}?category=dried-seafood`} className={styles.link}>
                  건수산물
                </Link>
              </li>
              <li>
                <Link to={`${ROUTES.PRODUCTS}?category=agricultural`} className={styles.link}>
                  농산물
                </Link>
              </li>
            </ul>
          </div>

          {/* Customer Service */}
          <div className={styles.section}>
            <h4 className={styles.sectionTitle}>고객 서비스</h4>
            <ul className={styles.linkList}>
              <li>
                <Link to="/faq" className={styles.link}>
                  자주 묻는 질문
                </Link>
              </li>
              <li>
                <Link to="/notices" className={styles.link}>
                  공지사항
                </Link>
              </li>
              <li>
                <Link to="/contact" className={styles.link}>
                  문의하기
                </Link>
              </li>
              <li>
                <Link to={ROUTES.ORDERS} className={styles.link}>
                  주문 조회
                </Link>
              </li>
            </ul>
          </div>

          {/* Business Hours */}
          <div className={styles.section}>
            <h4 className={styles.sectionTitle}>영업 시간</h4>
            <div className={styles.businessHours}>
              <p>평일: 09:00 - 18:00</p>
              <p>토요일: 09:00 - 13:00</p>
              <p>일요일 및 공휴일 휴무</p>
            </div>
          </div>
        </div>

        {/* Bottom Bar */}
        <div className={styles.bottomBar}>
          <div className={styles.legal}>
            <Link to="/terms" className={styles.legalLink}>
              이용약관
            </Link>
            <span className={styles.divider}>|</span>
            <Link to="/privacy" className={styles.legalLink}>
              개인정보처리방침
            </Link>
          </div>
          <p className={styles.copyright}>
            &copy; {currentYear} Esonge 동성유통. All rights reserved.
          </p>
        </div>
      </div>
    </footer>
  );
}
