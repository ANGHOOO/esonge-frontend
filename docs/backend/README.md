# 백엔드 개발 일정 및 요구사항

## 개요

이 문서는 Esonge 쇼핑몰 프론트엔드와 연동을 위한 백엔드 개발 일정 및 요구사항을 정의합니다.

**프로젝트 기간**: 25주 (약 6개월)
**프론트엔드 연동 시작**: Week 4부터

## 문서 구조

각 주차별 문서는 ISSUE TICKET 형태로 구성되어 있으며, 백엔드 개발자가 즉시 작업할 수 있도록 상세한 task 단위로 나뉘어 있습니다.

### 주차별 문서

1. **[Week 1-2: 프로젝트 초기 설정](./week-01-02.md)**
   - 개발 환경 구축
   - 데이터베이스 설계
   - API 문서화 시스템 구축
   - CI/CD 파이프라인 설정

2. **[Week 3-4: 사용자 인증 시스템 (로컬)](./week-03-04.md)**
   - JWT 기반 인증 구현 (로컬)
   - 사용자 프로필 관리
   - 배송지 관리
   - 회원 탈퇴 (Soft Delete)

3. **[Week 5-8: 상품 및 카테고리 관리](./week-05-08.md)**
   - 상품 CRUD API
   - 카테고리 관리
   - 검색 및 필터링 시스템
   - 상품 이미지 처리 (AWS S3)

4. **[Week 9-12: 멤버십 및 혜택 시스템](./week-09-12.md)**
   - 적립금 시스템
   - 예치금 시스템
   - 쿠폰 관리
   - 회원 등급 관리
   - 위시리스트

5. **[Week 13-17: 장바구니 및 주문 시스템 (로컬)](./week-13-17.md)**
   - 장바구니 API
   - 주문 생성 및 관리 (로컬)
   - 배송비 계산 (로컬 로직)
   - 주문 상태 관리

6. **[Week 18-21: 주문 관리 및 고객 서비스](./week-18-21.md)**
   - 주문 내역 조회
   - 반품/교환 처리
   - 고객 문의 시스템
   - 공지사항 및 FAQ

7. **[Week 22-25: 리뷰 및 외부 연동](./week-22-25.md)**
   - 리뷰 시스템
   - 상품 Q&A
   - 소셜 로그인 (네이버, 카카오)
   - SMS 인증 연동
   - 이메일 발송 연동
   - 결제 게이트웨이 연동
   - 배송 추적 연동
   - 성능 최적화
   - 보안 강화

## 기술 스택

### 백엔드 프레임워크

- **Java 17+**
- **Spring Boot 3.x**
- **Spring Web MVC** (RESTful API)
- **Spring Data JPA** (데이터베이스 접근)
- **Spring Security** (인증/인가)
- **Hibernate** (JPA 구현체)

### 데이터베이스

- **PostgreSQL 15+** (메인 데이터베이스)
- **Redis** (캐싱, 세션 관리)

### 인프라 (AWS)

- **AWS EC2** (애플리케이션 서버)
- **AWS RDS PostgreSQL** (관리형 데이터베이스)
- **AWS ElastiCache Redis** (관리형 Redis)
- **AWS S3** (이미지 및 파일 저장)
- **AWS CloudFront** (CDN)
- **AWS Load Balancer** (로드 밸런싱)
- **Docker** (컨테이너화)

### 개발 도구

- **Gradle** (빌드 도구)
- **Lombok** (보일러플레이트 코드 감소)
- **MapStruct** (DTO 매핑)
- **SpringDoc OpenAPI** (Swagger 문서화)
- **JUnit 5 + Mockito** (테스트)

### 외부 서비스 연동 (Week 22-25에 구현)

- **결제**: PG사 (이니시스, 토스페이먼츠 등), 카카오페이, 네이버페이
- **소셜 로그인**: 네이버 OAuth 2.0, 카카오 OAuth 2.0
- **배송**: 우체국 택배 API, 로젠택배, CJ대한통운 등
- **알림**: AWS SES (이메일), SMS 발송 서비스

## 핵심 API 도메인

### 1. 인증 및 사용자 (Auth & User)

- 회원가입, 로그인, 로그아웃 (로컬 인증)
- 프로필 관리
- 배송지 관리
- 소셜 로그인 (Week 22-25)

### 2. 상품 (Product)

- 상품 목록 (페이지네이션, 필터링, 정렬)
- 상품 상세 정보
- 카테고리 관리
- 검색 및 자동완성

### 3. 장바구니 (Cart)

- 장바구니 아이템 추가/수정/삭제
- 게스트 장바구니 병합
- 재고 검증

### 4. 주문 (Order)

- 주문 생성 (로컬)
- 주문 내역 조회
- 주문 상태 변경
- 배송 추적 (Week 22-25)

### 5. 결제 (Payment)

- 결제 처리 (로컬 스텁, Week 22-25에 실제 PG 연동)
- 환불 처리

### 6. 멤버십 (Membership)

- 적립금 적립/사용
- 예치금 충전/사용
- 쿠폰 발급/사용
- 회원 등급 관리

### 7. 리뷰 (Review)

- 리뷰 작성/수정/삭제
- 리뷰 목록 조회
- 리뷰 추천

### 8. 고객 서비스 (Customer Service)

- 상품 문의 (Q&A)
- 공지사항
- FAQ
- 1:1 문의

## 개발 우선순위 (외부 연동 최소화)

### 🔴 Phase 1: 로컬 개발 가능한 핵심 기능 (Week 1-21)

**외부 API 연동 없이 로컬 환경에서 개발 가능**

- Week 1-2: 프로젝트 초기 설정 및 인프라
- Week 3-4: 사용자 인증 (로컬 JWT 인증)
- Week 5-8: 상품 및 카테고리 관리
- Week 9-12: 멤버십 및 혜택 시스템
- Week 13-17: 장바구니 및 주문 (결제 스텁)
- Week 18-21: 주문 관리 및 고객 서비스

### 🟡 Phase 2: 외부 연동 및 최적화 (Week 22-25)

**외부 API 연동 및 실제 서비스 준비**

- 소셜 로그인 (네이버, 카카오)
- SMS 인증
- 이메일 발송
- 결제 게이트웨이 연동
- 배송 추적 연동
- 성능 최적화
- 보안 강화

### 🟢 Post-MVP (런칭 후)

- 고급 검색 기능 (Elasticsearch)
- 추천 시스템
- 실시간 알림
- 관리자 대시보드
- 통계 및 분석

## 프론트엔드 연동 일정

| Week  | 프론트엔드 작업       | 백엔드 제공 API                 | 외부 연동 여부              |
| ----- | --------------------- | ------------------------------- | --------------------------- |
| 4-7   | 인증 및 사용자 프로필 | User Auth APIs (로컬 JWT)       | ❌ 없음                     |
| 8-12  | 상품 카탈로그         | Product APIs                    | ❌ 없음 (AWS S3만)          |
| 13-17 | 장바구니 및 결제      | Cart, Order APIs + Payment 스텁 | ❌ 없음                     |
| 18-21 | 주문 관리             | Order Management APIs           | ❌ 없음                     |
| 22-25 | 리뷰 및 외부 연동     | Review, Q&A + 외부 API 연동     | ✅ 소셜로그인, 결제, SMS 등 |

## API 문서화

모든 API는 **OpenAPI 3.0 (Swagger)** 스펙으로 문서화되어야 하며, 다음 정보를 포함해야 합니다:

- 엔드포인트 URL 및 HTTP 메서드
- 요청/응답 스키마
- 인증 요구사항
- 에러 코드 및 메시지
- 예제 요청/응답

## 보안 요구사항

1. **인증**: JWT 기반 인증 (Access Token + Refresh Token)
2. **암호화**: 비밀번호는 BCryptPasswordEncoder로 해싱
3. **HTTPS**: 모든 API는 HTTPS로만 통신 (프로덕션)
4. **CORS**: 프론트엔드 도메인만 허용 (Spring Security CORS 설정)
5. **Rate Limiting**: API 요청 제한 (Bucket4j 또는 Spring Cloud Gateway)
6. **Input Validation**: JSR-303 Bean Validation (@Valid, @NotNull 등)
7. **SQL Injection 방지**: JPA/Hibernate JPQL 사용
8. **XSS 방지**: Spring Security XSS Protection

## 성능 요구사항

- **응답 시간**: 평균 200ms 이하
- **동시 접속**: 최소 1,000명 처리 가능
- **데이터베이스**: 쿼리 최적화, 인덱싱
- **캐싱**: Redis를 활용한 자주 조회되는 데이터 캐싱
- **이미지 최적화**: CDN 사용, WebP 포맷 지원

## 테스트 요구사항

- **Unit Test**: JUnit 5 + Mockito (Service 계층, 커버리지 > 70%)
- **Integration Test**: @SpringBootTest + MockMvc (Controller 계층)
- **Repository Test**: @DataJpaTest (JPA Repository 테스트)
- **E2E Test**: RestAssured (주요 사용자 플로우)
- **Load Test**: Gatling 또는 JMeter

## 모니터링 및 로깅

- **로깅**: Logback + SLF4J (JSON 포맷)
- **모니터링**: Spring Boot Actuator + Micrometer
- **알림**: AWS CloudWatch Alarms (중요 에러 발생 시)
- **추적**: Spring Cloud Sleuth (분산 추적)

## 배포 전략

1. **개발 환경**: 로컬 Docker Compose (PostgreSQL + Redis)
2. **스테이징 환경**: AWS EC2 + RDS + ElastiCache (Week 3부터)
3. **프로덕션 환경**: AWS Multi-AZ 구성 (Week 30 런칭)

### CI/CD 파이프라인

- **GitHub Actions** (빌드, 테스트, 배포 자동화)
- **Docker** (컨테이너 이미지 빌드)
- **AWS ECR** (Docker 이미지 저장소)
- **AWS EC2 / ECS** (컨테이너 실행 환경)

## 문의 및 협업

- **API 스펙 변경**: 프론트엔드 팀과 사전 협의 필수
- **긴급 이슈**: 즉시 소통 채널을 통해 공유
- **정기 회의**: 주 1회 프론트엔드-백엔드 싱크업

---

각 주차별 문서를 참고하여 세부 작업을 진행하시기 바랍니다.
