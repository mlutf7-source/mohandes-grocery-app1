import { clsx } from 'clsx';
import type { ButtonHTMLAttributes, ReactNode } from 'react';

interface ButtonProps extends ButtonHTMLAttributes<HTMLButtonElement> {
  variant?: 'primary' | 'secondary' | 'danger';
    children: ReactNode;
      fullWidth?: boolean;
        loading?: boolean;
        }

        export default function Button({
          variant = 'primary',
            children,
              fullWidth = false,
                loading = false,
                  disabled,
                    className,
                      ...props
                      }: ButtonProps) {
                        const baseClasses = 'btn-primary';
                          const variantClasses = {
                              primary: 'btn-primary',
                                  secondary: 'btn-secondary',
                                      danger: 'btn-danger',
                                        };

                                          return (
                                              <button
                                                    className={clsx(
                                                            variantClasses[variant],
                                                                    fullWidth && 'w-full',
                                                                            'flex items-center justify-center gap-2',
                                                                                    className
                                                                                          )}
                                                                                                disabled={disabled || loading}
                                                                                                      {...props}
                                                                                                          >
                                                                                                                {loading && (
                                                                                                                        <svg className="animate-spin h-5 w-5" viewBox="0 0 24 24">
                                                                                                                                  <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4" fill="none" />
                                                                                                                                            <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4z" />
                                                                                                                                                    </svg>
                                                                                                                                                          )}
                                                                                                                                                                {children}
                                                                                                                                                                    </button>
                                                                                                                                                                      );
                                                                                                                                                                      }