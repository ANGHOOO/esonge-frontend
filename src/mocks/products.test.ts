import { describe, it, expect } from 'vitest';
import {
  products,
  CATEGORIES,
  getProductById,
  getProductsByCategory,
  getCategoryById,
  searchProducts,
} from './products';

const ESONGE_IMAGE_BASE = 'https://esonge.cafe24.com/web/product/medium/';

describe('products mock data', () => {
  describe('image URLs', () => {
    it('모든 상품은 최소 1개 이상의 이미지를 가져야 한다', () => {
      products.forEach((product) => {
        expect(product.images.length).toBeGreaterThan(0);
      });
    });

    it('모든 상품 이미지는 esonge.cafe24.com 외부 URL이어야 한다', () => {
      products.forEach((product) => {
        product.images.forEach((imageUrl) => {
          expect(imageUrl).toMatch(/^https:\/\/esonge\.cafe24\.com\//);
        });
      });
    });

    it('로컬 경로(/images/products/)를 사용하는 상품이 없어야 한다', () => {
      products.forEach((product) => {
        product.images.forEach((imageUrl) => {
          expect(imageUrl).not.toMatch(/^\/images\/products\//);
        });
      });
    });

    it('모든 이미지 URL은 .jpg 확장자로 끝나야 한다', () => {
      products.forEach((product) => {
        product.images.forEach((imageUrl) => {
          expect(imageUrl).toMatch(/\.jpg$/);
        });
      });
    });

    it('모든 이미지 URL은 올바른 경로 형식이어야 한다', () => {
      products.forEach((product) => {
        product.images.forEach((imageUrl) => {
          expect(imageUrl).toMatch(
            new RegExp(`^${ESONGE_IMAGE_BASE.replace('.', '\\.')}\\d{6}/[a-zA-Z0-9_]+\\.jpg$`)
          );
        });
      });
    });
  });

  describe('카테고리별 이미지 검증', () => {
    it('선물용 명품(premium-gift) 상품들의 이미지가 설정되어 있어야 한다', () => {
      const giftProducts = getProductsByCategory('premium-gift');
      expect(giftProducts.length).toBeGreaterThan(0);
      giftProducts.forEach((product) => {
        expect(product.images[0]).toMatch(/^https:\/\/esonge\.cafe24\.com\//);
      });
    });

    it('자연산 송이 가정용(natural-songi) 상품들의 이미지가 설정되어 있어야 한다', () => {
      const songiProducts = getProductsByCategory('natural-songi');
      expect(songiProducts.length).toBeGreaterThan(0);
      songiProducts.forEach((product) => {
        expect(product.images[0]).toMatch(/^https:\/\/esonge\.cafe24\.com\//);
      });
    });

    it('냉동송이/능이버섯(frozen-mushroom) 상품들의 이미지가 설정되어 있어야 한다', () => {
      const frozenProducts = getProductsByCategory('frozen-mushroom');
      expect(frozenProducts.length).toBeGreaterThan(0);
      frozenProducts.forEach((product) => {
        expect(product.images[0]).toMatch(/^https:\/\/esonge\.cafe24\.com\//);
      });
    });

    it('능이/싸리/곰버섯(wild-mushroom) 상품들의 이미지가 설정되어 있어야 한다', () => {
      const wildMushroomProducts = getProductsByCategory('wild-mushroom');
      expect(wildMushroomProducts.length).toBeGreaterThan(0);
      wildMushroomProducts.forEach((product) => {
        expect(product.images[0]).toMatch(/^https:\/\/esonge\.cafe24\.com\//);
      });
    });

    it('산삼/산양산삼(wild-ginseng) 상품들의 이미지가 설정되어 있어야 한다', () => {
      const ginsengProducts = getProductsByCategory('wild-ginseng');
      expect(ginsengProducts.length).toBeGreaterThan(0);
      ginsengProducts.forEach((product) => {
        expect(product.images[0]).toMatch(/^https:\/\/esonge\.cafe24\.com\//);
      });
    });

    it('더덕/도라지(deodeok-doraji) 상품들의 이미지가 설정되어 있어야 한다', () => {
      const deodeokProducts = getProductsByCategory('deodeok-doraji');
      expect(deodeokProducts.length).toBeGreaterThan(0);
      deodeokProducts.forEach((product) => {
        expect(product.images[0]).toMatch(/^https:\/\/esonge\.cafe24\.com\//);
      });
    });

    it('사과/자두(apple-plum) 상품들의 이미지가 설정되어 있어야 한다', () => {
      const fruitProducts = getProductsByCategory('apple-plum');
      expect(fruitProducts.length).toBeGreaterThan(0);
      fruitProducts.forEach((product) => {
        expect(product.images[0]).toMatch(/^https:\/\/esonge\.cafe24\.com\//);
      });
    });
  });

  describe('상품 데이터 무결성', () => {
    it('총 22개의 상품이 있어야 한다', () => {
      expect(products.length).toBe(22);
    });

    it('모든 상품 ID는 고유해야 한다', () => {
      const ids = products.map((p) => p.id);
      const uniqueIds = new Set(ids);
      expect(uniqueIds.size).toBe(products.length);
    });

    it('모든 상품은 유효한 카테고리를 가져야 한다', () => {
      const validCategoryIds = CATEGORIES.map((c) => c.id);
      products.forEach((product) => {
        expect(validCategoryIds).toContain(product.category);
      });
    });

    it('모든 상품의 가격은 0보다 커야 한다', () => {
      products.forEach((product) => {
        expect(product.price).toBeGreaterThan(0);
      });
    });

    it('할인 상품의 originalPrice는 price보다 커야 한다', () => {
      products
        .filter((p) => p.originalPrice !== undefined)
        .forEach((product) => {
          expect(product.originalPrice!).toBeGreaterThan(product.price);
        });
    });
  });

  describe('getProductById', () => {
    it('존재하는 ID로 상품을 찾을 수 있어야 한다', () => {
      const product = getProductById('pg-001');
      expect(product).toBeDefined();
      expect(product?.id).toBe('pg-001');
    });

    it('존재하지 않는 ID는 undefined를 반환해야 한다', () => {
      expect(getProductById('not-exist')).toBeUndefined();
    });
  });

  describe('getProductsByCategory', () => {
    it('카테고리별로 상품을 필터링할 수 있어야 한다', () => {
      const result = getProductsByCategory('premium-gift');
      expect(result.every((p) => p.category === 'premium-gift')).toBe(true);
    });

    it('존재하지 않는 카테고리는 빈 배열을 반환해야 한다', () => {
      expect(getProductsByCategory('not-exist')).toEqual([]);
    });
  });

  describe('getCategoryById', () => {
    it('유효한 카테고리 ID로 카테고리 정보를 가져올 수 있어야 한다', () => {
      const category = getCategoryById('premium-gift');
      expect(category).toBeDefined();
      expect(category?.name).toBe('선물용 명품');
    });

    it('존재하지 않는 카테고리 ID는 undefined를 반환해야 한다', () => {
      expect(getCategoryById('not-exist')).toBeUndefined();
    });
  });

  describe('searchProducts', () => {
    it('상품 이름으로 검색할 수 있어야 한다', () => {
      const results = searchProducts('송이');
      expect(results.length).toBeGreaterThan(0);
      results.forEach((p) => {
        expect(
          p.name.includes('송이') ||
            p.categoryName.includes('송이') ||
            p.description?.includes('송이')
        ).toBe(true);
      });
    });

    it('검색어가 없으면 결과가 없어야 한다', () => {
      expect(searchProducts('존재하지않는검색어xyz')).toEqual([]);
    });

    it('대소문자를 구분하지 않아야 한다', () => {
      const lowerResult = searchProducts('송이버섯');
      expect(lowerResult.length).toBeGreaterThan(0);
    });
  });
});
