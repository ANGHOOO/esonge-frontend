export interface ProductDetail {
  longDescription: string;
  storageMethod: string;
  shelfLife: string;
  manufacturer: string;
  origin: string;
  nutritionInfo?: {
    calories?: string;
    protein?: string;
    fat?: string;
    carbohydrates?: string;
    sodium?: string;
  };
}

export interface Product {
  id: string;
  name: string;
  price: number;
  originalPrice?: number;
  images: string[];
  category: string;
  categoryName: string;
  origin: '국내산' | '수입산';
  grade: '특상' | '상' | '중';
  freeShipping: boolean;
  stock: number;
  description?: string;
  weight?: string;
  createdAt: string;
  salesCount: number;
  rating: number;
  reviewCount: number;
  detail?: ProductDetail;
}

export const CATEGORIES = [
  { id: 'premium-gift', name: '선물용 명품', slug: 'premium-gift' },
  { id: 'natural-songi', name: '자연산 송이 가정용', slug: 'natural-songi' },
  { id: 'frozen-mushroom', name: '냉동송이/능이버섯', slug: 'frozen-mushroom' },
  { id: 'wild-mushroom', name: '능이/싸리/곰버섯', slug: 'wild-mushroom' },
  { id: 'wild-ginseng', name: '산삼/산양산삼', slug: 'wild-ginseng' },
  { id: 'deodeok-doraji', name: '더덕/도라지', slug: 'deodeok-doraji' },
  { id: 'apple-plum', name: '사과/자두', slug: 'apple-plum' },
] as const;

export type CategoryId = (typeof CATEGORIES)[number]['id'];

export const products: Product[] = [
  // 선물용 명품 (premium-gift)
  {
    id: 'pg-001',
    name: '특선 자연산 송이버섯 선물세트 1kg',
    price: 890000,
    originalPrice: 990000,
    images: [
      '/images/products/songi-gift-1.jpg',
      '/images/products/songi-gift-1-2.jpg',
      '/images/products/songi-gift-1-3.jpg',
      '/images/products/songi-gift-1-4.jpg',
    ],
    category: 'premium-gift',
    categoryName: '선물용 명품',
    origin: '국내산',
    grade: '특상',
    freeShipping: true,
    stock: 10,
    description: '강원도 청정지역에서 채취한 최상급 자연산 송이버섯 선물세트입니다.',
    weight: '1kg',
    createdAt: '2024-09-01',
    salesCount: 156,
    rating: 4.9,
    reviewCount: 48,
    detail: {
      longDescription: `강원도 청정 자연에서 직접 채취한 최상급 자연산 송이버섯입니다.

송이버섯은 가을철 소나무 숲에서만 자라는 귀한 버섯으로, 독특하고 진한 향이 특징입니다.
본 제품은 숙련된 채취 전문가가 직접 산에서 채취하여 신선도를 최대한 유지한 상태로 배송됩니다.

【제품 특징】
• 강원도 청정지역 자연산 100%
• 당일 채취, 당일 발송 원칙
• 고급 선물 포장으로 제공
• 특상급만 엄선하여 구성

【추천 요리법】
1. 송이구이 - 얇게 썰어 소금만 살짝 뿌려 구워 드시면 송이 본연의 맛을 느낄 수 있습니다.
2. 송이밥 - 쌀과 함께 지으면 향긋한 송이밥을 즐길 수 있습니다.
3. 송이전골 - 소고기와 함께 전골로 끓여 드시면 깊은 맛을 느낄 수 있습니다.`,
      storageMethod: '냉장 보관 (0~5°C), 신문지에 싸서 보관하면 더 오래 보관 가능',
      shelfLife: '냉장 보관 시 5~7일 (가급적 빨리 드시는 것을 권장)',
      manufacturer: '동성유통',
      origin: '강원도 양양군/인제군',
    },
  },
  {
    id: 'pg-002',
    name: '프리미엄 송이버섯 선물세트 500g',
    price: 490000,
    originalPrice: 550000,
    images: [
      '/images/products/songi-gift-2.jpg',
      '/images/products/songi-gift-2-2.jpg',
      '/images/products/songi-gift-2-3.jpg',
    ],
    category: 'premium-gift',
    categoryName: '선물용 명품',
    origin: '국내산',
    grade: '특상',
    freeShipping: true,
    stock: 15,
    description: '명절 선물로 최적의 프리미엄 송이버섯 세트입니다.',
    weight: '500g',
    createdAt: '2024-09-05',
    salesCount: 234,
    rating: 4.8,
    reviewCount: 72,
    detail: {
      longDescription: `프리미엄 송이버섯 선물세트는 명절과 특별한 날을 위한 최고의 선택입니다.

【제품 구성】
• 특상급 자연산 송이버섯 500g
• 고급 나무 선물상자
• 송이버섯 활용 레시피 카드

【특징】
• 강원도 청정지역에서 당일 채취
• 엄격한 품질 선별 과정을 거친 특상급만 선별
• 신선도 유지를 위한 특수 포장

명절 부모님 선물, 감사의 마음을 전하는 특별한 선물로 추천드립니다.`,
      storageMethod: '냉장 보관 (0~5°C)',
      shelfLife: '냉장 보관 시 5~7일',
      manufacturer: '동성유통',
      origin: '강원도 양양군',
    },
  },
  {
    id: 'pg-003',
    name: '산양산삼 선물세트 10뿌리',
    price: 1200000,
    images: ['/images/products/sansam-gift-1.jpg'],
    category: 'premium-gift',
    categoryName: '선물용 명품',
    origin: '국내산',
    grade: '특상',
    freeShipping: true,
    stock: 5,
    description: '7년근 이상 산양산삼 엄선 10뿌리 고급 선물세트입니다.',
    weight: '100g',
    createdAt: '2024-08-20',
    salesCount: 89,
    rating: 5.0,
    reviewCount: 31,
  },

  // 자연산 송이 가정용 (natural-songi)
  {
    id: 'ns-001',
    name: '자연산 송이버섯 가정용 300g',
    price: 180000,
    originalPrice: 220000,
    images: ['/images/products/songi-home-1.jpg'],
    category: 'natural-songi',
    categoryName: '자연산 송이 가정용',
    origin: '국내산',
    grade: '상',
    freeShipping: true,
    stock: 25,
    description: '가정에서 즐기기 좋은 중간 크기의 자연산 송이버섯입니다.',
    weight: '300g',
    createdAt: '2024-09-10',
    salesCount: 412,
    rating: 4.7,
    reviewCount: 156,
  },
  {
    id: 'ns-002',
    name: '자연산 송이버섯 가정용 500g',
    price: 280000,
    originalPrice: 330000,
    images: ['/images/products/songi-home-2.jpg'],
    category: 'natural-songi',
    categoryName: '자연산 송이 가정용',
    origin: '국내산',
    grade: '상',
    freeShipping: true,
    stock: 18,
    description: '온 가족이 즐기기 좋은 넉넉한 양의 자연산 송이버섯입니다.',
    weight: '500g',
    createdAt: '2024-09-08',
    salesCount: 289,
    rating: 4.6,
    reviewCount: 98,
  },
  {
    id: 'ns-003',
    name: '자연산 송이버섯 실속형 200g',
    price: 120000,
    images: ['/images/products/songi-home-3.jpg'],
    category: 'natural-songi',
    categoryName: '자연산 송이 가정용',
    origin: '국내산',
    grade: '중',
    freeShipping: false,
    stock: 30,
    description: '합리적인 가격의 실속형 자연산 송이버섯입니다.',
    weight: '200g',
    createdAt: '2024-09-12',
    salesCount: 567,
    rating: 4.5,
    reviewCount: 203,
  },

  // 냉동송이/능이버섯 (frozen-mushroom)
  {
    id: 'fm-001',
    name: '냉동 송이버섯 슬라이스 500g',
    price: 85000,
    originalPrice: 100000,
    images: ['/images/products/frozen-songi-1.jpg'],
    category: 'frozen-mushroom',
    categoryName: '냉동송이/능이버섯',
    origin: '국내산',
    grade: '상',
    freeShipping: true,
    stock: 50,
    description: '신선한 송이버섯을 급속 냉동한 제품으로 사계절 즐길 수 있습니다.',
    weight: '500g',
    createdAt: '2024-08-15',
    salesCount: 723,
    rating: 4.4,
    reviewCount: 287,
  },
  {
    id: 'fm-002',
    name: '냉동 능이버섯 1kg',
    price: 120000,
    images: ['/images/products/frozen-neungi-1.jpg'],
    category: 'frozen-mushroom',
    categoryName: '냉동송이/능이버섯',
    origin: '국내산',
    grade: '상',
    freeShipping: true,
    stock: 40,
    description: '향이 진한 능이버섯을 급속 냉동하여 신선함을 그대로 보존했습니다.',
    weight: '1kg',
    createdAt: '2024-08-10',
    salesCount: 456,
    rating: 4.6,
    reviewCount: 178,
  },
  {
    id: 'fm-003',
    name: '냉동 송이버섯 홀 300g',
    price: 65000,
    images: ['/images/products/frozen-songi-2.jpg'],
    category: 'frozen-mushroom',
    categoryName: '냉동송이/능이버섯',
    origin: '국내산',
    grade: '중',
    freeShipping: false,
    stock: 60,
    description: '송이버섯 원형 그대로 냉동한 제품입니다.',
    weight: '300g',
    createdAt: '2024-09-01',
    salesCount: 334,
    rating: 4.3,
    reviewCount: 122,
  },

  // 능이/싸리/곰버섯 (wild-mushroom)
  {
    id: 'wm-001',
    name: '자연산 능이버섯 500g',
    price: 95000,
    originalPrice: 110000,
    images: ['/images/products/neungi-1.jpg'],
    category: 'wild-mushroom',
    categoryName: '능이/싸리/곰버섯',
    origin: '국내산',
    grade: '특상',
    freeShipping: true,
    stock: 20,
    description: '깊은 산에서 채취한 향긋한 자연산 능이버섯입니다.',
    weight: '500g',
    createdAt: '2024-09-05',
    salesCount: 198,
    rating: 4.8,
    reviewCount: 67,
  },
  {
    id: 'wm-002',
    name: '자연산 싸리버섯 300g',
    price: 45000,
    images: ['/images/products/ssari-1.jpg'],
    category: 'wild-mushroom',
    categoryName: '능이/싸리/곰버섯',
    origin: '국내산',
    grade: '상',
    freeShipping: false,
    stock: 35,
    description: '쫄깃한 식감이 일품인 자연산 싸리버섯입니다.',
    weight: '300g',
    createdAt: '2024-09-08',
    salesCount: 267,
    rating: 4.5,
    reviewCount: 89,
  },
  {
    id: 'wm-003',
    name: '자연산 곰버섯 200g',
    price: 38000,
    images: ['/images/products/gom-1.jpg'],
    category: 'wild-mushroom',
    categoryName: '능이/싸리/곰버섯',
    origin: '국내산',
    grade: '상',
    freeShipping: false,
    stock: 28,
    description: '귀한 자연산 곰버섯으로 특별한 요리를 만들어보세요.',
    weight: '200g',
    createdAt: '2024-09-03',
    salesCount: 145,
    rating: 4.6,
    reviewCount: 54,
  },

  // 산삼/산양산삼 (wild-ginseng)
  {
    id: 'wg-001',
    name: '산양산삼 5뿌리 세트',
    price: 580000,
    originalPrice: 650000,
    images: ['/images/products/sansam-1.jpg'],
    category: 'wild-ginseng',
    categoryName: '산삼/산양산삼',
    origin: '국내산',
    grade: '특상',
    freeShipping: true,
    stock: 8,
    description: '7년근 이상 엄선된 산양산삼 5뿌리 세트입니다.',
    weight: '50g',
    createdAt: '2024-08-25',
    salesCount: 78,
    rating: 4.9,
    reviewCount: 28,
  },
  {
    id: 'wg-002',
    name: '산양산삼 3뿌리 세트',
    price: 350000,
    images: ['/images/products/sansam-2.jpg'],
    category: 'wild-ginseng',
    categoryName: '산삼/산양산삼',
    origin: '국내산',
    grade: '특상',
    freeShipping: true,
    stock: 12,
    description: '부모님 건강을 위한 산양산삼 3뿌리 세트입니다.',
    weight: '30g',
    createdAt: '2024-09-01',
    salesCount: 112,
    rating: 4.8,
    reviewCount: 41,
  },
  {
    id: 'wg-003',
    name: '산양산삼 1뿌리 (대)',
    price: 150000,
    images: ['/images/products/sansam-3.jpg'],
    category: 'wild-ginseng',
    categoryName: '산삼/산양산삼',
    origin: '국내산',
    grade: '상',
    freeShipping: false,
    stock: 20,
    description: '큰 사이즈의 산양산삼 1뿌리입니다.',
    weight: '15g',
    createdAt: '2024-09-10',
    salesCount: 189,
    rating: 4.7,
    reviewCount: 63,
  },

  // 더덕/도라지 (deodeok-doraji)
  {
    id: 'dd-001',
    name: '자연산 더덕 1kg',
    price: 75000,
    originalPrice: 85000,
    images: ['/images/products/deodeok-1.jpg'],
    category: 'deodeok-doraji',
    categoryName: '더덕/도라지',
    origin: '국내산',
    grade: '특상',
    freeShipping: true,
    stock: 45,
    description: '강원도 청정지역에서 캐낸 향긋한 자연산 더덕입니다.',
    weight: '1kg',
    createdAt: '2024-09-05',
    salesCount: 345,
    rating: 4.7,
    reviewCount: 134,
  },
  {
    id: 'dd-002',
    name: '자연산 도라지 500g',
    price: 35000,
    images: ['/images/products/doraji-1.jpg'],
    category: 'deodeok-doraji',
    categoryName: '더덕/도라지',
    origin: '국내산',
    grade: '상',
    freeShipping: false,
    stock: 55,
    description: '깊은 맛의 자연산 도라지입니다.',
    weight: '500g',
    createdAt: '2024-09-08',
    salesCount: 423,
    rating: 4.5,
    reviewCount: 167,
  },
  {
    id: 'dd-003',
    name: '더덕 선물세트 2kg',
    price: 140000,
    originalPrice: 160000,
    images: ['/images/products/deodeok-gift-1.jpg'],
    category: 'deodeok-doraji',
    categoryName: '더덕/도라지',
    origin: '국내산',
    grade: '특상',
    freeShipping: true,
    stock: 25,
    description: '선물용으로 엄선한 프리미엄 더덕 세트입니다.',
    weight: '2kg',
    createdAt: '2024-08-28',
    salesCount: 178,
    rating: 4.8,
    reviewCount: 56,
  },

  // 사과/자두 (apple-plum)
  {
    id: 'ap-001',
    name: '강원 부사 사과 5kg',
    price: 45000,
    originalPrice: 52000,
    images: ['/images/products/apple-1.jpg'],
    category: 'apple-plum',
    categoryName: '사과/자두',
    origin: '국내산',
    grade: '특상',
    freeShipping: true,
    stock: 80,
    description: '아삭하고 달콤한 강원도 부사 사과입니다.',
    weight: '5kg',
    createdAt: '2024-09-15',
    salesCount: 567,
    rating: 4.6,
    reviewCount: 234,
  },
  {
    id: 'ap-002',
    name: '강원 부사 사과 10kg',
    price: 85000,
    originalPrice: 98000,
    images: ['/images/products/apple-2.jpg'],
    category: 'apple-plum',
    categoryName: '사과/자두',
    origin: '국내산',
    grade: '특상',
    freeShipping: true,
    stock: 60,
    description: '온 가족이 넉넉히 즐길 수 있는 대용량 사과입니다.',
    weight: '10kg',
    createdAt: '2024-09-12',
    salesCount: 389,
    rating: 4.7,
    reviewCount: 156,
  },
  {
    id: 'ap-003',
    name: '자두 3kg 실속 팩',
    price: 32000,
    images: ['/images/products/plum-1.jpg'],
    category: 'apple-plum',
    categoryName: '사과/자두',
    origin: '국내산',
    grade: '상',
    freeShipping: false,
    stock: 0,
    description: '달콤하고 새콤한 제철 자두입니다.',
    weight: '3kg',
    createdAt: '2024-08-20',
    salesCount: 234,
    rating: 4.4,
    reviewCount: 89,
  },
  {
    id: 'ap-004',
    name: '사과 선물세트 프리미엄 5kg',
    price: 65000,
    images: ['/images/products/apple-gift-1.jpg'],
    category: 'apple-plum',
    categoryName: '사과/자두',
    origin: '국내산',
    grade: '특상',
    freeShipping: true,
    stock: 35,
    description: '명절 선물용 프리미엄 사과 세트입니다.',
    weight: '5kg',
    createdAt: '2024-09-10',
    salesCount: 278,
    rating: 4.8,
    reviewCount: 98,
  },
];

export function getProductById(id: string): Product | undefined {
  return products.find((product) => product.id === id);
}

export function getProductsByCategory(categoryId: string): Product[] {
  return products.filter((product) => product.category === categoryId);
}

export function getCategoryById(categoryId: string) {
  return CATEGORIES.find((category) => category.id === categoryId);
}

export function searchProducts(query: string): Product[] {
  const lowerQuery = query.toLowerCase();
  return products.filter(
    (product) =>
      product.name.toLowerCase().includes(lowerQuery) ||
      product.categoryName.toLowerCase().includes(lowerQuery) ||
      product.description?.toLowerCase().includes(lowerQuery)
  );
}
