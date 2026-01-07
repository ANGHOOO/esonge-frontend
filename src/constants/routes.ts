// Route constants (CLAUDE.md: Named constants)
export const ROUTES = {
  // Public Routes
  HOME: '/',
  LOGIN: '/login',
  REGISTER: '/register',
  FORGOT_PASSWORD: '/forgot-password',

  // Product Routes
  PRODUCTS: '/products',
  PRODUCT_DETAIL: '/products/:id',

  // Shopping Routes
  CART: '/cart',
  CHECKOUT: '/checkout',
  CHECKOUT_SUCCESS: '/checkout/success',
  CHECKOUT_FAIL: '/checkout/fail',

  // Order Routes
  ORDERS: '/orders',
  ORDER_DETAIL: '/orders/:id',

  // User Routes
  PROFILE: '/profile',
  SETTINGS: '/settings',
  WISHLIST: '/wishlist',
  ADDRESSES: '/addresses',

  // Customer Service Routes
  NOTICES: '/notices',
  NOTICE_DETAIL: '/notices/:id',
  FAQ: '/faq',
  CONTACT: '/contact',

  // Legal Routes
  TERMS: '/terms',
  PRIVACY: '/privacy',
  ABOUT: '/about',
} as const;

export type RouteKey = keyof typeof ROUTES;
export type RouteValue = (typeof ROUTES)[RouteKey];

// Helper function to generate dynamic routes
export function getProductDetailPath(id: string | number): string {
  return ROUTES.PRODUCT_DETAIL.replace(':id', String(id));
}

export function getOrderDetailPath(id: string | number): string {
  return ROUTES.ORDER_DETAIL.replace(':id', String(id));
}

export function getNoticeDetailPath(id: string | number): string {
  return ROUTES.NOTICE_DETAIL.replace(':id', String(id));
}
