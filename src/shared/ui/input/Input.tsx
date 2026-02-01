import { forwardRef, type InputHTMLAttributes, useId } from 'react';
import styles from './Input.module.scss';

export interface InputProps extends InputHTMLAttributes<HTMLInputElement> {
  label?: string;
  error?: string;
  helperText?: string;
  leftIcon?: React.ReactNode;
  rightIcon?: React.ReactNode;
  onRightIconClick?: () => void;
  rightIconLabel?: string;
  rightIconTestId?: string;
  fullWidth?: boolean;
}

export const Input = forwardRef<HTMLInputElement, InputProps>(
  (
    {
      label,
      error,
      helperText,
      leftIcon,
      rightIcon,
      onRightIconClick,
      rightIconLabel = 'Clear input',
      rightIconTestId,
      fullWidth = false,
      className = '',
      id: providedId,
      ...props
    },
    ref
  ) => {
    const generatedId = useId();
    const id = providedId || generatedId;
    const errorId = `${id}-error`;
    const helperId = `${id}-helper`;

    const hasError = Boolean(error);

    const containerClasses = [styles.container, fullWidth && styles.fullWidth, className]
      .filter(Boolean)
      .join(' ');

    const inputWrapperClasses = [
      styles.inputWrapper,
      hasError && styles.hasError,
      leftIcon && styles.hasLeftIcon,
      rightIcon && styles.hasRightIcon,
    ]
      .filter(Boolean)
      .join(' ');

    return (
      <div className={containerClasses}>
        {label && (
          <label htmlFor={id} className={styles.label}>
            {label}
          </label>
        )}
        <div className={inputWrapperClasses}>
          {leftIcon && (
            <span className={styles.leftIcon} aria-hidden="true">
              {leftIcon}
            </span>
          )}
          <input
            ref={ref}
            id={id}
            className={styles.input}
            aria-invalid={hasError}
            aria-describedby={hasError ? errorId : helperText ? helperId : undefined}
            {...props}
          />
          {rightIcon && (
            <button
              type="button"
              className={styles.rightIcon}
              onClick={onRightIconClick}
              tabIndex={onRightIconClick ? 0 : -1}
              aria-label={rightIconLabel}
              data-testid={rightIconTestId}
            >
              {rightIcon}
            </button>
          )}
        </div>
        {hasError && (
          <span id={errorId} className={styles.error} role="alert">
            {error}
          </span>
        )}
        {helperText && !hasError && (
          <span id={helperId} className={styles.helperText}>
            {helperText}
          </span>
        )}
      </div>
    );
  }
);

Input.displayName = 'Input';
