import * as z from 'zod';

// Reusable validation schemas
export const emailSchema = z.string().email('올바른 이메일 형식이 아닙니다');

export const phoneSchema = z
  .string()
  .regex(/^010-?\d{4}-?\d{4}$/, '올바른 전화번호 형식이 아닙니다 (010-XXXX-XXXX)');

export const passwordSchema = z
  .string()
  .min(8, '비밀번호는 최소 8자 이상이어야 합니다')
  .regex(/[A-Z]/, '대문자를 포함해야 합니다')
  .regex(/[a-z]/, '소문자를 포함해야 합니다')
  .regex(/[0-9]/, '숫자를 포함해야 합니다')
  .regex(/[^A-Za-z0-9]/, '특수문자를 포함해야 합니다');

export const koreanNameSchema = z
  .string()
  .min(2, '이름은 최소 2자 이상이어야 합니다')
  .max(20, '이름은 최대 20자까지 가능합니다')
  .regex(/^[가-힣]+$/, '한글만 입력 가능합니다');
