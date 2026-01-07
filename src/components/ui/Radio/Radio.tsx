import { forwardRef, type InputHTMLAttributes } from 'react';
import styles from './Radio.module.css';

export interface RadioProps extends Omit<InputHTMLAttributes<HTMLInputElement>, 'type'> {
  label?: string;
  error?: string;
}

export const Radio = forwardRef<HTMLInputElement, RadioProps>(
  ({ label, error, disabled, className = '', id, ...props }, ref) => {
    const radioId = id || `radio-${Math.random().toString(36).substring(2, 9)}`;
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
            type="radio"
            id={radioId}
            className={styles.input}
            disabled={disabled}
            aria-invalid={hasError}
            {...props}
          />
          <span className={styles.radio}>
            <span className={styles.dot} />
          </span>
          {label && (
            <label htmlFor={radioId} className={styles.label}>
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

Radio.displayName = 'Radio';
