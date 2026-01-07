import { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { Eye, EyeOff, Mail, Lock, User, Phone } from 'lucide-react';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { z } from 'zod';
import { ROUTES } from '@/constants/routes';
import { Button, Input, Checkbox } from '@/components/ui';
import styles from './RegisterPage.module.css';

const registerSchema = z
  .object({
    email: z.string().min(1, '이메일을 입력해주세요').email('올바른 이메일 형식이 아닙니다'),
    password: z
      .string()
      .min(8, '비밀번호는 8자 이상이어야 합니다')
      .regex(/[A-Z]/, '대문자를 포함해야 합니다')
      .regex(/[a-z]/, '소문자를 포함해야 합니다')
      .regex(/[0-9]/, '숫자를 포함해야 합니다')
      .regex(/[^A-Za-z0-9]/, '특수문자를 포함해야 합니다'),
    confirmPassword: z.string().min(1, '비밀번호 확인을 입력해주세요'),
    name: z
      .string()
      .min(2, '이름은 2자 이상이어야 합니다')
      .max(20, '이름은 20자 이하여야 합니다')
      .regex(/^[가-힣]+$/, '한글 이름만 입력 가능합니다'),
    phone: z.string().regex(/^010-\d{4}-\d{4}$/, '올바른 전화번호 형식이 아닙니다 (010-0000-0000)'),
    agreeTerms: z.literal(true, {
      errorMap: () => ({ message: '이용약관에 동의해주세요' }),
    }),
    agreePrivacy: z.literal(true, {
      errorMap: () => ({ message: '개인정보처리방침에 동의해주세요' }),
    }),
    agreeMarketing: z.boolean().optional(),
  })
  .refine((data) => data.password === data.confirmPassword, {
    message: '비밀번호가 일치하지 않습니다',
    path: ['confirmPassword'],
  });

type RegisterFormData = z.infer<typeof registerSchema>;

export function RegisterPage() {
  const navigate = useNavigate();
  const [showPassword, setShowPassword] = useState(false);
  const [showConfirmPassword, setShowConfirmPassword] = useState(false);
  const [isLoading, setIsLoading] = useState(false);

  const {
    register,
    handleSubmit,
    watch,
    formState: { errors },
  } = useForm<RegisterFormData>({
    resolver: zodResolver(registerSchema),
    defaultValues: {
      email: '',
      password: '',
      confirmPassword: '',
      name: '',
      phone: '',
      agreeTerms: false as unknown as true,
      agreePrivacy: false as unknown as true,
      agreeMarketing: false,
    },
  });

  const password = watch('password');

  const getPasswordStrength = (pwd: string) => {
    let strength = 0;
    if (pwd.length >= 8) strength++;
    if (/[A-Z]/.test(pwd)) strength++;
    if (/[a-z]/.test(pwd)) strength++;
    if (/[0-9]/.test(pwd)) strength++;
    if (/[^A-Za-z0-9]/.test(pwd)) strength++;
    return strength;
  };

  const passwordStrength = getPasswordStrength(password || '');

  const onSubmit = async (data: RegisterFormData) => {
    setIsLoading(true);
    // TODO: Implement actual registration with Zustand auth store
    console.log('Register data:', data);
    await new Promise((resolve) => setTimeout(resolve, 1000)); // Simulate API call
    setIsLoading(false);
    navigate(ROUTES.LOGIN);
  };

  return (
    <div className={styles.page}>
      <div className={styles.container}>
        <div className={styles.card}>
          <div className={styles.header}>
            <h1 className={styles.title}>회원가입</h1>
            <p className={styles.subtitle}>계정을 만들고 다양한 혜택을 누리세요</p>
          </div>

          <form onSubmit={handleSubmit(onSubmit)} className={styles.form}>
            <Input
              label="이메일"
              type="email"
              placeholder="이메일을 입력하세요"
              leftIcon={<Mail />}
              error={errors.email?.message}
              fullWidth
              {...register('email')}
            />

            <div className={styles.passwordField}>
              <Input
                label="비밀번호"
                type={showPassword ? 'text' : 'password'}
                placeholder="비밀번호를 입력하세요"
                leftIcon={<Lock />}
                rightIcon={
                  <button
                    type="button"
                    onClick={() => setShowPassword(!showPassword)}
                    className={styles.passwordToggle}
                    tabIndex={-1}
                  >
                    {showPassword ? <EyeOff /> : <Eye />}
                  </button>
                }
                error={errors.password?.message}
                fullWidth
                {...register('password')}
              />
              {password && (
                <div className={styles.passwordStrength}>
                  <div className={styles.strengthBars}>
                    {[1, 2, 3, 4, 5].map((level) => (
                      <div
                        key={level}
                        className={`${styles.strengthBar} ${passwordStrength >= level ? styles[`strength${passwordStrength}`] : ''}`}
                      />
                    ))}
                  </div>
                  <span className={styles.strengthText}>
                    {passwordStrength <= 2 ? '약함' : passwordStrength <= 4 ? '보통' : '강함'}
                  </span>
                </div>
              )}
            </div>

            <Input
              label="비밀번호 확인"
              type={showConfirmPassword ? 'text' : 'password'}
              placeholder="비밀번호를 다시 입력하세요"
              leftIcon={<Lock />}
              rightIcon={
                <button
                  type="button"
                  onClick={() => setShowConfirmPassword(!showConfirmPassword)}
                  className={styles.passwordToggle}
                  tabIndex={-1}
                >
                  {showConfirmPassword ? <EyeOff /> : <Eye />}
                </button>
              }
              error={errors.confirmPassword?.message}
              fullWidth
              {...register('confirmPassword')}
            />

            <Input
              label="이름"
              type="text"
              placeholder="이름을 입력하세요"
              leftIcon={<User />}
              error={errors.name?.message}
              fullWidth
              {...register('name')}
            />

            <Input
              label="전화번호"
              type="tel"
              placeholder="010-0000-0000"
              leftIcon={<Phone />}
              error={errors.phone?.message}
              fullWidth
              {...register('phone')}
            />

            <div className={styles.agreements}>
              <Checkbox
                label={
                  <>
                    <Link to={ROUTES.TERMS} target="_blank">
                      이용약관
                    </Link>
                    에 동의합니다 (필수)
                  </>
                }
                error={errors.agreeTerms?.message}
                {...register('agreeTerms')}
              />
              <Checkbox
                label={
                  <>
                    <Link to={ROUTES.PRIVACY} target="_blank">
                      개인정보처리방침
                    </Link>
                    에 동의합니다 (필수)
                  </>
                }
                error={errors.agreePrivacy?.message}
                {...register('agreePrivacy')}
              />
              <Checkbox
                label="마케팅 정보 수신에 동의합니다 (선택)"
                {...register('agreeMarketing')}
              />
            </div>

            <Button type="submit" size="lg" fullWidth loading={isLoading}>
              회원가입
            </Button>
          </form>

          <p className={styles.loginPrompt}>
            이미 계정이 있으신가요?{' '}
            <Link to={ROUTES.LOGIN} className={styles.loginLink}>
              로그인
            </Link>
          </p>
        </div>
      </div>
    </div>
  );
}
