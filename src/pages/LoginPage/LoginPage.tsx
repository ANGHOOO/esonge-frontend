import { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { Eye, EyeOff, Mail, Lock } from 'lucide-react';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { z } from 'zod';
import { ROUTES } from '@/constants/routes';
import { Button, Input, Checkbox } from '@/components/ui';
import styles from './LoginPage.module.css';

const loginSchema = z.object({
  email: z.string().min(1, '이메일을 입력해주세요').email('올바른 이메일 형식이 아닙니다'),
  password: z.string().min(1, '비밀번호를 입력해주세요'),
  rememberMe: z.boolean().optional(),
});

type LoginFormData = z.infer<typeof loginSchema>;

export function LoginPage() {
  const navigate = useNavigate();
  const [showPassword, setShowPassword] = useState(false);
  const [isLoading, setIsLoading] = useState(false);

  const {
    register,
    handleSubmit,
    formState: { errors },
  } = useForm<LoginFormData>({
    resolver: zodResolver(loginSchema),
    defaultValues: {
      email: '',
      password: '',
      rememberMe: false,
    },
  });

  const onSubmit = async (data: LoginFormData) => {
    setIsLoading(true);
    // TODO: Implement actual login with Zustand auth store
    console.log('Login data:', data);
    await new Promise((resolve) => setTimeout(resolve, 1000)); // Simulate API call
    setIsLoading(false);
    navigate(ROUTES.HOME);
  };

  return (
    <div className={styles.page}>
      <div className={styles.container}>
        <div className={styles.card}>
          <div className={styles.header}>
            <h1 className={styles.title}>로그인</h1>
            <p className={styles.subtitle}>계정에 로그인하여 쇼핑을 시작하세요</p>
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

            <div className={styles.options}>
              <Checkbox label="로그인 상태 유지" {...register('rememberMe')} />
              <Link to={ROUTES.FORGOT_PASSWORD} className={styles.forgotPassword}>
                비밀번호 찾기
              </Link>
            </div>

            <Button type="submit" size="lg" fullWidth loading={isLoading}>
              로그인
            </Button>
          </form>

          <div className={styles.divider}>
            <span>또는</span>
          </div>

          <div className={styles.socialButtons}>
            <button
              type="button"
              className={styles.socialButton}
              style={{ backgroundColor: '#03C75A' }}
            >
              네이버로 로그인
            </button>
            <button
              type="button"
              className={styles.socialButton}
              style={{ backgroundColor: '#FEE500', color: '#000' }}
            >
              카카오로 로그인
            </button>
          </div>

          <p className={styles.registerPrompt}>
            계정이 없으신가요?{' '}
            <Link to={ROUTES.REGISTER} className={styles.registerLink}>
              회원가입
            </Link>
          </p>
        </div>
      </div>
    </div>
  );
}
