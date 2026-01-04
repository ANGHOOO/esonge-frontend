# Esonge Shopping Mall - Feature Breakdown by Domain

This document provides a detailed breakdown of all features organized by domain/module, following the cohesion principle from CLAUDE.md guidelines.

## Domain Architecture Overview

The application is organized into the following primary domains:

```
src/
├── domains/
│   ├── user/           # User authentication, profile, membership
│   ├── product/        # Product catalog, search, details
│   ├── cart/           # Shopping cart management
│   ├── order/          # Order processing, tracking, history
│   ├── payment/        # Payment processing and methods
│   ├── review/         # Product reviews and ratings
│   ├── customer-service/ # Q&A, notices, support
│   └── admin/          # Admin features (future phase)
├── components/         # Shared/common components
├── hooks/             # Shared/common hooks
├── utils/             # Shared utilities
└── services/          # API services and integrations
```

---

## 1. User Domain

**Responsibility**: All user-related functionality including authentication, profile management, and membership benefits.

### 1.1 Authentication Module

#### Features
- **User Registration**
  - Email/phone number registration
  - Password creation with strength validation
  - Terms of service and privacy policy acceptance
  - Email/SMS verification
  - Marketing consent options

- **User Login**
  - Email/password authentication
  - Social login (Naver, Kakao)
  - Remember me functionality
  - Session management with JWT
  - Auto-login capability

- **Password Management**
  - Forgot password flow
  - Password reset via email/SMS
  - Password change (authenticated users)
  - Password strength indicators

#### Components
```
user/
├── components/
│   ├── LoginForm/
│   │   ├── LoginForm.tsx
│   │   ├── SocialLoginButtons.tsx
│   │   └── RememberMeCheckbox.tsx
│   ├── RegisterForm/
│   │   ├── RegisterForm.tsx
│   │   ├── EmailVerification.tsx
│   │   ├── PasswordStrengthIndicator.tsx
│   │   └── TermsAgreement.tsx
│   └── PasswordRecovery/
│       ├── ForgotPasswordForm.tsx
│       └── ResetPasswordForm.tsx
├── hooks/
│   ├── useAuth.ts
│   ├── useLogin.ts
│   ├── useRegister.ts
│   ├── usePasswordReset.ts
│   └── useSocialLogin.ts
└── types/
    └── auth.types.ts
```

#### Key User Flows
1. **Registration Flow**: Form → Email Verification → Welcome → Auto-login
2. **Login Flow**: Credentials → Authentication → Redirect to intended page
3. **Password Recovery**: Email entry → Verification code → New password → Success

### 1.2 User Profile Module

#### Features
- **Profile Information Management**
  - View and edit personal details (name, phone, email)
  - Profile picture upload (optional)
  - Birthday and gender (for promotions)
  - Notification preferences

- **Address Management**
  - Add multiple shipping addresses
  - Set default address
  - Edit existing addresses
  - Delete addresses
  - Address validation (Korean postal code)

- **Account Settings**
  - Change password
  - Email notification preferences
  - SMS notification preferences
  - Marketing communication opt-in/out
  - Account deletion

#### Components
```
user/
├── components/
│   ├── Profile/
│   │   ├── ProfileView.tsx
│   │   ├── ProfileEditForm.tsx
│   │   └── ProfilePictureUpload.tsx
│   ├── Address/
│   │   ├── AddressList.tsx
│   │   ├── AddressCard.tsx
│   │   ├── AddressForm.tsx
│   │   └── PostalCodeSearch.tsx
│   └── Settings/
│       ├── NotificationSettings.tsx
│       ├── PasswordChangeForm.tsx
│       └── AccountDeletion.tsx
├── hooks/
│   ├── useUserProfile.ts
│   ├── useAddresses.ts
│   └── useAccountSettings.ts
```

### 1.3 Membership Benefits Module

#### Features
- **Mileage System (적립금)**
  - View mileage balance
  - Mileage earning rules display
  - Mileage transaction history
  - Mileage expiration tracking
  - Apply mileage during checkout

- **Deposit System (예치금)**
  - View deposit balance
  - Deposit transaction history
  - Apply deposit during checkout
  - Deposit refund requests

- **Membership Tiers**
  - Display current tier (Basic/VIP/Wholesale)
  - Show tier benefits
  - Progress to next tier
  - Tier-specific pricing visibility

- **Wishlist**
  - Add/remove products from wishlist
  - View wishlist
  - Move wishlist items to cart
  - Stock notifications for wishlist items

#### Components
```
user/
├── components/
│   ├── Membership/
│   │   ├── MileageBalance.tsx
│   │   ├── MileageHistory.tsx
│   │   ├── DepositBalance.tsx
│   │   ├── DepositHistory.tsx
│   │   └── TierBadge.tsx
│   └── Wishlist/
│       ├── WishlistPage.tsx
│       ├── WishlistItem.tsx
│       └── WishlistActions.tsx
├── hooks/
│   ├── useMileage.ts
│   ├── useDeposit.ts
│   ├── useMembershipTier.ts
│   └── useWishlist.ts
```

---

## 2. Product Domain

**Responsibility**: Product catalog browsing, search, filtering, and detailed product information display.

### 2.1 Product Catalog Module

#### Features
- **Category Navigation**
  - 8 main categories
  - Category hierarchy support
  - Breadcrumb navigation
  - Category landing pages

- **Product Listing**
  - Grid view (default, 4 columns desktop, 2 mobile)
  - List view option
  - Pagination (16 items per page default)
  - Infinite scroll option
  - Loading states and skeletons

- **Product Card Display**
  - Product thumbnail image
  - Product name
  - Price display (regular, sale, wholesale)
  - Free shipping badge
  - Origin information
  - Grade/quality indicator
  - Stock status
  - Quick add to cart button
  - Wishlist toggle

#### Components
```
product/
├── components/
│   ├── Catalog/
│   │   ├── ProductGrid.tsx
│   │   ├── ProductList.tsx
│   │   ├── ProductCard.tsx
│   │   ├── CategoryNavigation.tsx
│   │   └── Breadcrumbs.tsx
│   ├── Shared/
│   │   ├── PriceDisplay.tsx
│   │   ├── StockBadge.tsx
│   │   ├── FreeShippingBadge.tsx
│   │   └── GradeBadge.tsx
```

### 2.2 Product Search & Filter Module

#### Features
- **Search Functionality**
  - Full-text search
  - Search suggestions/autocomplete
  - Search history (logged-in users)
  - Recent searches
  - Popular search keywords
  - No results handling with suggestions

- **Filtering Options**
  - Category filter
  - Price range slider
  - Origin filter (multi-select)
  - Grade/quality filter
  - Stock availability filter
  - Free shipping filter

- **Sorting Options**
  - Newest arrivals
  - Price: Low to High
  - Price: High to Low
  - Best sellers
  - Highest rated
  - Name: A-Z

#### Components
```
product/
├── components/
│   ├── Search/
│   │   ├── SearchBar.tsx
│   │   ├── SearchSuggestions.tsx
│   │   ├── SearchResults.tsx
│   │   └── PopularKeywords.tsx
│   ├── Filter/
│   │   ├── FilterPanel.tsx
│   │   ├── PriceRangeFilter.tsx
│   │   ├── CategoryFilter.tsx
│   │   ├── OriginFilter.tsx
│   │   └── ActiveFilters.tsx
│   └── Sort/
│       └── SortDropdown.tsx
├── hooks/
│   ├── useProductSearch.ts
│   ├── useProductFilter.ts
│   └── useProductSort.ts
```

### 2.3 Product Detail Module

#### Features
- **Product Information Display**
  - Product image gallery (zoom, multiple images)
  - Product name and description
  - Comprehensive product details
  - Pricing information (all tiers)
  - Origin and sourcing information
  - Grade classification
  - Nutritional information
  - Storage and preparation guidelines

- **Product Options**
  - Weight/quantity selection
  - Grade selection (if applicable)
  - Packaging options
  - Gift wrapping option

- **Product Actions**
  - Add to cart (with quantity selector)
  - Buy now (direct checkout)
  - Add to wishlist
  - Share product (social sharing)
  - Print product information

- **Additional Information**
  - Shipping information
  - Return and exchange policy
  - Estimated delivery date
  - Stock availability
  - Related products
  - Frequently bought together

#### Components
```
product/
├── components/
│   ├── Detail/
│   │   ├── ProductDetailPage.tsx
│   │   ├── ImageGallery/
│   │   │   ├── ProductImageGallery.tsx
│   │   │   ├── ImageZoom.tsx
│   │   │   └── ThumbnailList.tsx
│   │   ├── ProductInfo/
│   │   │   ├── ProductTitle.tsx
│   │   │   ├── ProductDescription.tsx
│   │   │   ├── ProductPrice.tsx
│   │   │   ├── OriginInfo.tsx
│   │   │   └── NutritionInfo.tsx
│   │   ├── ProductOptions/
│   │   │   ├── QuantitySelector.tsx
│   │   │   ├── GradeSelector.tsx
│   │   │   └── PackagingSelector.tsx
│   │   ├── ProductActions/
│   │   │   ├── AddToCartButton.tsx
│   │   │   ├── BuyNowButton.tsx
│   │   │   ├── WishlistButton.tsx
│   │   │   └── ShareButton.tsx
│   │   └── RelatedProducts/
│   │       └── RelatedProductsCarousel.tsx
├── hooks/
│   ├── useProductDetail.ts
│   ├── useProductOptions.ts
│   └── useRelatedProducts.ts
```

### 2.4 Featured Products Module

#### Features
- **Best Products Section**
  - Top 16 best-selling products
  - Carousel/grid display
  - Auto-refresh based on sales data

- **New Arrivals Section**
  - Latest 16 products
  - Sorted by addition date
  - "New" badge indicator

- **Seasonal Promotions**
  - Holiday-specific collections
  - Limited-time offers
  - Banner promotions

#### Components
```
product/
├── components/
│   ├── Featured/
│   │   ├── BestProductsSection.tsx
│   │   ├── NewArrivalsSection.tsx
│   │   ├── PromotionalBanner.tsx
│   │   └── ProductCarousel.tsx
```

---

## 3. Cart Domain

**Responsibility**: Shopping cart management, cart persistence, and pre-checkout operations.

### 3.1 Shopping Cart Module

#### Features
- **Cart Management**
  - Add products to cart
  - Update product quantities
  - Remove individual items
  - Remove all items (empty cart)
  - Bundle product handling
  - Save cart (logged-in users)
  - Recover cart (session-based for guests)

- **Cart Display**
  - Cart item list
  - Product thumbnails
  - Product names and options
  - Unit prices and subtotals
  - Quantity selectors
  - Remove buttons
  - Free shipping indicators

- **Cart Summary**
  - Subtotal calculation
  - Shipping cost estimation
  - Discount calculations
  - Mileage application preview
  - Deposit application preview
  - Total amount display
  - Item count badge

- **Cart Validation**
  - Stock availability checks
  - Price updates
  - Out-of-stock notifications
  - Quantity limit warnings

#### Components
```
cart/
├── components/
│   ├── Cart/
│   │   ├── CartPage.tsx
│   │   ├── CartItemList.tsx
│   │   ├── CartItem.tsx
│   │   ├── QuantityControl.tsx
│   │   └── EmptyCart.tsx
│   ├── CartSummary/
│   │   ├── CartSummary.tsx
│   │   ├── PriceBreakdown.tsx
│   │   └── CheckoutButton.tsx
│   └── CartBadge/
│       └── CartBadge.tsx
├── hooks/
│   ├── useCart.ts
│   ├── useCartItems.ts
│   ├── useCartSummary.ts
│   └── useCartValidation.ts
└── types/
    └── cart.types.ts
```

#### Key User Flows
1. **Add to Cart**: Product detail → Select options → Add → Cart updated → Show notification
2. **Update Cart**: Cart view → Change quantity → Auto-update totals → Validate stock
3. **Checkout**: Cart review → Proceed to checkout → Redirect to checkout flow

---

## 4. Order Domain

**Responsibility**: Order creation, checkout process, order tracking, and order history management.

### 4.1 Checkout Module

#### Features
- **Checkout Flow**
  - Guest checkout option
  - Member checkout (pre-filled info)
  - Multi-step checkout process
    - Step 1: Shipping information
    - Step 2: Shipping method
    - Step 3: Payment method
    - Step 4: Order review
  - Progress indicator
  - Step validation

- **Shipping Information**
  - Select saved address or enter new
  - Recipient information
  - Contact phone number
  - Delivery instructions
  - Address validation

- **Shipping Method Selection**
  - Standard delivery (free for most items)
  - Express delivery (additional cost)
  - Scheduled delivery (date/time selection)
  - Delivery cost calculation

- **Discount & Benefits Application**
  - Coupon code entry
  - Mileage application
  - Deposit application
  - Automatic discount application
  - Promotion code validation

- **Order Summary Review**
  - Final product list
  - Final pricing breakdown
  - Shipping details confirmation
  - Payment method confirmation
  - Terms and conditions acceptance

#### Components
```
order/
├── components/
│   ├── Checkout/
│   │   ├── CheckoutPage.tsx
│   │   ├── CheckoutProgress.tsx
│   │   ├── ShippingForm/
│   │   │   ├── ShippingForm.tsx
│   │   │   ├── AddressSelector.tsx
│   │   │   └── DeliveryInstructions.tsx
│   │   ├── ShippingMethod/
│   │   │   ├── ShippingMethodSelector.tsx
│   │   │   └── DeliveryDatePicker.tsx
│   │   ├── DiscountSection/
│   │   │   ├── CouponInput.tsx
│   │   │   ├── MileageApplicator.tsx
│   │   │   └── DepositApplicator.tsx
│   │   └── OrderReview/
│   │       ├── OrderSummary.tsx
│   │       └── TermsAcceptance.tsx
├── hooks/
│   ├── useCheckout.ts
│   ├── useShippingForm.ts
│   └── useDiscountApplication.ts
```

### 4.2 Order History Module

#### Features
- **Order List View**
  - Chronological order list
  - Filtering by date range
  - Filtering by order status
  - Search by order number or product name
  - Pagination

- **Order Detail View**
  - Order number and date
  - Order status timeline
  - Product list with quantities and prices
  - Shipping information
  - Payment information
  - Total amount breakdown
  - Invoice download
  - Receipt download

- **Order Actions**
  - View details
  - Track delivery
  - Cancel order (if eligible)
  - Request return
  - Request exchange
  - Request refund
  - Reorder (add same items to cart)
  - Write review (after delivery)

#### Components
```
order/
├── components/
│   ├── History/
│   │   ├── OrderHistoryPage.tsx
│   │   ├── OrderList.tsx
│   │   ├── OrderCard.tsx
│   │   ├── OrderFilter.tsx
│   │   └── OrderSearch.tsx
│   ├── Detail/
│   │   ├── OrderDetailPage.tsx
│   │   ├── OrderStatusTimeline.tsx
│   │   ├── OrderProductList.tsx
│   │   ├── OrderShippingInfo.tsx
│   │   └── OrderPaymentInfo.tsx
│   └── Actions/
│       ├── CancelOrderButton.tsx
│       ├── ReturnRequestButton.tsx
│       ├── ExchangeRequestButton.tsx
│       └── ReorderButton.tsx
├── hooks/
│   ├── useOrderHistory.ts
│   ├── useOrderDetail.ts
│   ├── useOrderActions.ts
│   └── useOrderTracking.ts
```

### 4.3 Order Tracking Module

#### Features
- **Delivery Tracking**
  - Current delivery status
  - Estimated delivery date
  - Tracking number
  - Carrier information
  - Delivery status updates
  - GPS tracking (if available)
  - Delivery photo (upon completion)

- **Status Notifications**
  - Order confirmed
  - Preparing for shipment
  - Shipped
  - Out for delivery
  - Delivered
  - Email/SMS notifications

#### Components
```
order/
├── components/
│   ├── Tracking/
│   │   ├── TrackingPage.tsx
│   │   ├── TrackingTimeline.tsx
│   │   ├── DeliveryMap.tsx (future)
│   │   └── CarrierInfo.tsx
```

### 4.4 Returns & Exchanges Module

#### Features
- **Return Request**
  - Select products for return
  - Reason for return (dropdown)
  - Detailed explanation
  - Photo upload (product condition)
  - Refund method selection
  - Return shipping arrangement

- **Exchange Request**
  - Select products for exchange
  - Reason for exchange
  - Select replacement product/options
  - Photo upload
  - Exchange shipping arrangement

- **Request Tracking**
  - Request status
  - Approval/rejection notifications
  - Return shipping tracking
  - Refund processing status

#### Components
```
order/
├── components/
│   ├── Returns/
│   │   ├── ReturnRequestForm.tsx
│   │   ├── ReturnReasonSelector.tsx
│   │   ├── ReturnProductSelector.tsx
│   │   └── ReturnTracking.tsx
│   ├── Exchanges/
│   │   ├── ExchangeRequestForm.tsx
│   │   ├── ExchangeReasonSelector.tsx
│   │   └── ExchangeProductSelector.tsx
├── hooks/
│   ├── useReturnRequest.ts
│   ├── useExchangeRequest.ts
│   └── useReturnTracking.ts
```

---

## 5. Payment Domain

**Responsibility**: Payment method selection, payment processing, and payment verification.

### 5.1 Payment Method Module

#### Features
- **Bank Transfer**
  - Display bank account details
    - 농협 (NH Bank)
    - 기업 (IBK Bank)
    - 수협 (Suhyup Bank)
  - Payment instructions
  - Virtual account generation (optional)
  - Payment deadline

- **Credit/Debit Card**
  - Card information form
  - Secure card processing
  - 3D Secure authentication
  - Installment plan selection
  - Save card option (tokenization)

- **Mobile Payment**
  - Kakao Pay integration
  - Naver Pay integration
  - Samsung Pay (future)
  - Apple Pay (future)

- **Other Methods**
  - Mobile phone billing
  - Gift certificate

#### Components
```
payment/
├── components/
│   ├── Methods/
│   │   ├── PaymentMethodSelector.tsx
│   │   ├── BankTransfer/
│   │   │   ├── BankTransferForm.tsx
│   │   │   └── BankAccountInfo.tsx
│   │   ├── CreditCard/
│   │   │   ├── CreditCardForm.tsx
│   │   │   ├── CardInput.tsx
│   │   │   └── InstallmentSelector.tsx
│   │   └── MobilePayment/
│   │       ├── KakaoPayButton.tsx
│   │       └── NaverPayButton.tsx
├── hooks/
│   ├── usePaymentMethod.ts
│   └── usePaymentProcessing.ts
```

### 5.2 Payment Processing Module

#### Features
- **Payment Execution**
  - Payment gateway integration
  - Payment request creation
  - Real-time payment status
  - Payment success handling
  - Payment failure handling
  - Payment cancellation

- **Payment Verification**
  - Server-side verification
  - Amount verification
  - Fraud detection
  - Duplicate payment prevention

- **Payment Confirmation**
  - Success page
  - Failure page with retry options
  - Payment receipt generation
  - Email confirmation
  - Order confirmation page redirect

#### Components
```
payment/
├── components/
│   ├── Processing/
│   │   ├── PaymentProcessing.tsx
│   │   ├── PaymentSuccess.tsx
│   │   ├── PaymentFailure.tsx
│   │   └── PaymentReceipt.tsx
├── hooks/
│   ├── usePayment.ts
│   └── usePaymentVerification.ts
```

---

## 6. Review Domain

**Responsibility**: Product reviews, ratings, and review management.

### 6.1 Review Display Module

#### Features
- **Review List**
  - Product reviews on detail page
  - Star rating summary
  - Average rating display
  - Rating distribution chart
  - Review count
  - Sorting options (newest, highest rated, most helpful)
  - Filtering (by rating, verified purchases, photo reviews)

- **Review Card Display**
  - Reviewer name (anonymized)
  - Rating (1-5 stars)
  - Review text
  - Review photos (if available)
  - Purchase verification badge
  - Review date
  - Helpful/unhelpful votes
  - Admin response (if any)

#### Components
```
review/
├── components/
│   ├── Display/
│   │   ├── ReviewList.tsx
│   │   ├── ReviewCard.tsx
│   │   ├── ReviewSummary.tsx
│   │   ├── RatingDistribution.tsx
│   │   ├── ReviewPhotos.tsx
│   │   └── ReviewFilter.tsx
├── hooks/
│   ├── useProductReviews.ts
│   └── useReviewSummary.ts
```

### 6.2 Review Submission Module

#### Features
- **Write Review**
  - Only for purchased products
  - Star rating selection (1-5)
  - Review text (min/max character limits)
  - Photo upload (up to 5 photos)
  - Product option confirmation
  - Anonymous posting option
  - Review submission

- **Review Management**
  - View own reviews
  - Edit review (within time limit)
  - Delete review
  - Photo management

- **Review Incentives**
  - Mileage reward for reviews
  - Additional reward for photo reviews
  - Reward notification

#### Components
```
review/
├── components/
│   ├── Submission/
│   │   ├── ReviewForm.tsx
│   │   ├── StarRating.tsx
│   │   ├── ReviewTextarea.tsx
│   │   ├── PhotoUpload.tsx
│   │   └── ReviewSubmitButton.tsx
│   ├── Management/
│   │   ├── MyReviews.tsx
│   │   ├── ReviewEditForm.tsx
│   │   └── ReviewDeleteButton.tsx
├── hooks/
│   ├── useReviewSubmit.ts
│   ├── useReviewEdit.ts
│   └── useMyReviews.ts
```

---

## 7. Customer Service Domain

**Responsibility**: Customer support, Q&A, notices, and help resources.

### 7.1 Product Q&A Module

#### Features
- **Question Submission**
  - Product-specific questions
  - Public/private toggle
  - Question text input
  - Photo attachment (optional)
  - Email notification preference

- **Q&A Display**
  - Question list on product page
  - Answered/unanswered filter
  - Search functionality
  - Pagination
  - Admin responses

- **Question Management**
  - View own questions
  - Edit question (before answer)
  - Delete question
  - Notification for answers

#### Components
```
customer-service/
├── components/
│   ├── QA/
│   │   ├── QuestionList.tsx
│   │   ├── QuestionCard.tsx
│   │   ├── QuestionForm.tsx
│   │   ├── AnswerDisplay.tsx
│   │   └── MyQuestions.tsx
├── hooks/
│   ├── useProductQA.ts
│   ├── useQuestionSubmit.ts
│   └── useMyQuestions.ts
```

### 7.2 Notice Board Module

#### Features
- **Notice Display**
  - Notice list page
  - Important notices pinned
  - Notice categories
  - Search functionality
  - Pagination

- **Notice Detail**
  - Title and date
  - Category badge
  - Full content
  - Attachments download
  - Previous/next navigation

#### Components
```
customer-service/
├── components/
│   ├── Notices/
│   │   ├── NoticeList.tsx
│   │   ├── NoticeCard.tsx
│   │   ├── NoticeDetail.tsx
│   │   └── NoticeSearch.tsx
├── hooks/
│   └── useNotices.ts
```

### 7.3 FAQ Module

#### Features
- **FAQ Categories**
  - Order & Payment
  - Shipping & Delivery
  - Returns & Exchanges
  - Product Information
  - Account & Membership

- **FAQ Display**
  - Accordion-style Q&A
  - Search functionality
  - Category filtering
  - Popular FAQs
  - Related FAQs

#### Components
```
customer-service/
├── components/
│   ├── FAQ/
│   │   ├── FAQPage.tsx
│   │   ├── FAQCategory.tsx
│   │   ├── FAQItem.tsx
│   │   ├── FAQSearch.tsx
│   │   └── PopularFAQs.tsx
├── hooks/
│   └── useFAQs.ts
```

### 7.4 Contact & Support Module

#### Features
- **Contact Form**
  - Inquiry type selection
  - Subject and message
  - File attachments
  - Contact information
  - Submission confirmation

- **Support Information**
  - Phone number (033-644-6077)
  - Email address
  - Business hours
  - Average response time
  - Holiday schedule

#### Components
```
customer-service/
├── components/
│   ├── Contact/
│   │   ├── ContactForm.tsx
│   │   ├── InquiryTypeSelector.tsx
│   │   └── ContactInfo.tsx
├── hooks/
│   └── useContactSubmit.ts
```

---

## 8. Admin Domain (Future Phase)

**Responsibility**: Administrative functions for managing products, orders, and content.

### 8.1 Product Management (Future)
- Product CRUD operations
- Inventory management
- Bulk product upload
- Category management

### 8.2 Order Management (Future)
- Order processing
- Shipping label generation
- Return/exchange approval
- Refund processing

### 8.3 Customer Management (Future)
- Customer list and search
- Customer details and history
- Membership tier management
- Customer communication

### 8.4 Content Management (Future)
- Notice management
- FAQ management
- Banner management
- Promotion management

---

## Cross-Domain Features

### 9.1 Navigation & Layout

#### Features
- **Header**
  - Logo (link to home)
  - Category mega menu
  - Search bar
  - User menu (login/logout, my page)
  - Cart badge
  - Language selector (future)

- **Footer**
  - Company information
  - Quick links
  - Legal links (terms, privacy)
  - Contact information
  - Social media links
  - Back to top button

- **Breadcrumbs**
  - Navigation path
  - Current page indicator
  - Clickable ancestors

- **Mobile Navigation**
  - Hamburger menu
  - Bottom navigation bar
  - Search overlay
  - Category drawer

#### Components
```
components/
├── Layout/
│   ├── Header/
│   │   ├── Header.tsx
│   │   ├── Logo.tsx
│   │   ├── CategoryMenu.tsx
│   │   ├── SearchBar.tsx
│   │   └── UserMenu.tsx
│   ├── Footer/
│   │   ├── Footer.tsx
│   │   ├── CompanyInfo.tsx
│   │   └── QuickLinks.tsx
│   ├── Breadcrumbs/
│   │   └── Breadcrumbs.tsx
│   └── MobileNav/
│       ├── MobileHeader.tsx
│       ├── HamburgerMenu.tsx
│       └── BottomNav.tsx
```

### 9.2 Global Features

#### Features
- **Loading States**
  - Page loading spinner
  - Skeleton screens
  - Progress indicators
  - Button loading states

- **Error Handling**
  - Error boundaries
  - 404 page
  - 500 page
  - Network error handling
  - Form validation errors

- **Notifications**
  - Toast notifications
  - Success messages
  - Error alerts
  - Info messages
  - Warning messages

- **Modals & Dialogs**
  - Confirmation dialogs
  - Alert dialogs
  - Modal windows
  - Bottom sheets (mobile)

#### Components
```
components/
├── Loading/
│   ├── PageLoader.tsx
│   ├── Skeleton.tsx
│   └── ProgressBar.tsx
├── Error/
│   ├── ErrorBoundary.tsx
│   ├── NotFoundPage.tsx
│   └── ErrorPage.tsx
├── Notification/
│   ├── Toast.tsx
│   └── Alert.tsx
└── Modal/
    ├── Modal.tsx
    ├── ConfirmDialog.tsx
    └── BottomSheet.tsx
```

---

## Feature Priority Matrix

### Critical (MVP Required)
- User authentication and registration
- Product catalog and search
- Product detail pages
- Shopping cart
- Checkout flow
- Payment processing (bank transfer, card)
- Order history
- Basic customer service (Q&A, notices)

### High (Launch Phase)
- Wishlist
- Product reviews
- Mileage system
- Multiple addresses
- Order tracking
- Returns & exchanges
- FAQ section
- Mobile responsive design

### Medium (Post-Launch)
- Social login
- Deposit system
- Advanced search filters
- Notification preferences
- Gift wrapping
- Promotional banners
- Related products

### Low (Future Enhancements)
- Admin panel
- Live chat support
- Video demonstrations
- Advanced analytics
- Subscription orders
- Multi-language support
- Mobile app

---

## Dependencies Between Domains

```
User Domain
  ├─> Cart Domain (user-specific cart)
  ├─> Order Domain (user orders)
  ├─> Review Domain (user reviews)
  └─> Customer Service Domain (user questions)

Product Domain
  ├─> Cart Domain (add products)
  ├─> Order Domain (order items)
  ├─> Review Domain (product reviews)
  └─> Customer Service Domain (product Q&A)

Cart Domain
  └─> Order Domain (checkout)

Order Domain
  ├─> Payment Domain (payment processing)
  └─> Review Domain (post-purchase reviews)

Payment Domain
  └─> Order Domain (confirm order)
```

---

## Integration Points

### Backend API Endpoints Required
Each domain will require corresponding API endpoints:

- **/api/auth**: Login, register, token refresh
- **/api/users**: Profile, addresses, preferences
- **/api/products**: List, search, detail, categories
- **/api/cart**: Add, update, remove, get
- **/api/orders**: Create, list, detail, track, cancel
- **/api/payments**: Process, verify, confirm
- **/api/reviews**: Create, list, update, delete
- **/api/qa**: Submit question, list, answer
- **/api/notices**: List, detail
- **/api/contact**: Submit inquiry

### Third-Party Integrations
- Payment gateways (PG providers)
- Social login (Naver, Kakao OAuth)
- Shipping tracking (carrier APIs)
- SMS/Email services
- Analytics (Google Analytics, Naver Analytics)
- Error tracking (Sentry)

---

## Conclusion

This feature breakdown provides a comprehensive view of all functionality organized by domain. Each domain is self-contained with its own components, hooks, and types, following the cohesion principle from CLAUDE.md. This structure ensures:

1. **High Cohesion**: Related features are grouped together
2. **Low Coupling**: Domains are independent and communicate through well-defined interfaces
3. **Maintainability**: Features can be developed, tested, and modified independently
4. **Scalability**: New features can be added to appropriate domains without affecting others
5. **Team Collaboration**: Different team members can work on different domains in parallel

The next document will detail the component architecture and technical implementation strategies.
