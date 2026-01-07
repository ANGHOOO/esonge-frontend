import { forwardRef, type InputHTMLAttributes, type ReactNode } from 'react';
import { Check } from 'lucide-react';
import styles from './Checkbox.module.css';

export interface CheckboxProps extends Omit<InputHTMLAttributes<HTMLInputElement>, 'type'> {
  label?: ReactNode;
  error?: string;
}

export const Checkbox = forwardRef<HTMLInputElement, CheckboxProps>(
  ({ label, error, disabled, className = '', id, ...props }, ref) => {
    const checkboxId = id || `checkbox-${Math.random().toString(36).substring(2, 9)}`;
    const hasError = Boolean(error);

    const containerClassNames = [
      styles.container,
      disabled ? styles.disabled : '',
      hasError ? styles.error : '',
      className,
    ]
      .filter(Boolean)
      .join(' ');

    return (
      <div className={containerClassNames}>
        <div className={styles.wrapper}>
          <input
            ref={ref}
            type="checkbox"
            id={checkboxId}
            className={styles.input}
            disabled={disabled}
            aria-invalid={hasError}
            {...props}
          />
          <span className={styles.checkbox}>
            <Check className={styles.checkIcon} />
          </span>
          {label && (
            <label htmlFor={checkboxId} className={styles.label}>
              {label}
            </label>
          )}
        </div>
        {error && (
          <span className={styles.errorText} role="alert">
            {error}
          </span>
        )}
      </div>
    );
  }
);

Checkbox.displayName = 'Checkbox';
