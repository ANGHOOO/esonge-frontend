import { forwardRef, type TextareaHTMLAttributes, useEffect, useRef, useCallback } from 'react';
import styles from './Textarea.module.css';

export interface TextareaProps extends TextareaHTMLAttributes<HTMLTextAreaElement> {
  error?: string;
  label?: string;
  helperText?: string;
  fullWidth?: boolean;
  showCount?: boolean;
  autoResize?: boolean;
}

export const Textarea = forwardRef<HTMLTextAreaElement, TextareaProps>(
  (
    {
      error,
      label,
      helperText,
      fullWidth = false,
      showCount = false,
      autoResize = false,
      disabled,
      className = '',
      id,
      maxLength,
      value,
      onChange,
      ...props
    },
    ref
  ) => {
    const textareaId = id || `textarea-${Math.random().toString(36).substring(2, 9)}`;
    const hasError = Boolean(error);
    const internalRef = useRef<HTMLTextAreaElement>(null);

    const textareaRef = (ref || internalRef) as React.RefObject<HTMLTextAreaElement>;

    const adjustHeight = useCallback(() => {
      const textarea = textareaRef.current;
      if (textarea && autoResize) {
        textarea.style.height = 'auto';
        textarea.style.height = `${textarea.scrollHeight}px`;
      }
    }, [autoResize, textareaRef]);

    useEffect(() => {
      adjustHeight();
    }, [value, adjustHeight]);

    const handleChange = (e: React.ChangeEvent<HTMLTextAreaElement>) => {
      if (autoResize) {
        adjustHeight();
      }
      onChange?.(e);
    };

    const containerClassNames = [styles.container, fullWidth ? styles.fullWidth : '', className]
      .filter(Boolean)
      .join(' ');

    const textareaClassNames = [
      styles.textarea,
      hasError ? styles.error : '',
      disabled ? styles.disabled : '',
      autoResize ? styles.autoResize : '',
    ]
      .filter(Boolean)
      .join(' ');

    const currentLength = typeof value === 'string' ? value.length : 0;

    return (
      <div className={containerClassNames}>
        {label && (
          <label htmlFor={textareaId} className={styles.label}>
            {label}
          </label>
        )}
        <textarea
          ref={textareaRef}
          id={textareaId}
          className={textareaClassNames}
          disabled={disabled}
          value={value}
          maxLength={maxLength}
          onChange={handleChange}
          aria-invalid={hasError}
          aria-describedby={
            error ? `${textareaId}-error` : helperText ? `${textareaId}-helper` : undefined
          }
          {...props}
        />
        <div className={styles.footer}>
          <div>
            {error && (
              <span id={`${textareaId}-error`} className={styles.errorText} role="alert">
                {error}
              </span>
            )}
            {!error && helperText && (
              <span id={`${textareaId}-helper`} className={styles.helperText}>
                {helperText}
              </span>
            )}
          </div>
          {showCount && maxLength && (
            <span className={styles.count}>
              {currentLength}/{maxLength}
            </span>
          )}
        </div>
      </div>
    );
  }
);

Textarea.displayName = 'Textarea';
