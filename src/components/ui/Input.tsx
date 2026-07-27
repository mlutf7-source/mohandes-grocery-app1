import { clsx } from 'clsx';
import { forwardRef, useRef, type InputHTMLAttributes } from 'react';

interface InputProps extends InputHTMLAttributes<HTMLInputElement> {
  label?: string;
    error?: string;
    }

    const Input = forwardRef<HTMLInputElement, InputProps>(
      ({ label, error, className, id, onKeyDown, ...props }, ref) => {
          const inputId = id || label?.replace(/\s/g, '-').toLowerCase();
              const inputRef = useRef<HTMLInputElement | null>(null);

                  const handleKeyDown = (e: React.KeyboardEvent<HTMLInputElement>) => {
                        if (e.key === 'Enter') {
                                e.preventDefault();
                                        const form = inputRef.current?.closest('form') || inputRef.current?.closest('.space-y-3, .space-y-4');
                                                if (form) {
                                                          const inputs = Array.from(form.querySelectorAll('input:not([disabled]):not([readonly]):not([type="hidden"]), select:not([disabled]), textarea:not([disabled])'));
                                                                    const idx = inputs.indexOf(inputRef.current!);
                                                                              if (idx > -1 && idx < inputs.length - 1) {
                                                                                          (inputs[idx + 1] as HTMLElement).focus();
                                                                                                    }
                                                                                                            }
                                                                                                                  }
                                                                                                                        onKeyDown?.(e);
                                                                                                                            };

                                                                                                                                return (
                                                                                                                                      <div className="w-full">
                                                                                                                                              {label && (
                                                                                                                                                        <label htmlFor={inputId} className="block text-sm font-semibold text-text-primary mb-1">
                                                                                                                                                                    {label}
                                                                                                                                                                              </label>
                                                                                                                                                                                      )}
                                                                                                                                                                                              <input
                                                                                                                                                                                                        ref={(node) => {
                                                                                                                                                                                                                    inputRef.current = node;
                                                                                                                                                                                                                                if (typeof ref === 'function') ref(node);
                                                                                                                                                                                                                                            else if (ref) ref.current = node;
                                                                                                                                                                                                                                                      }}
                                                                                                                                                                                                                                                                id={inputId}
                                                                                                                                                                                                                                                                          onKeyDown={handleKeyDown}
                                                                                                                                                                                                                                                                                    className={clsx(
                                                                                                                                                                                                                                                                                                'input-field',
                                                                                                                                                                                                                                                                                                            error && 'border-danger focus:border-danger focus:ring-danger',
                                                                                                                                                                                                                                                                                                                        props.type === 'number' && 'text-left dir-ltr',
                                                                                                                                                                                                                                                                                                                                    className
                                                                                                                                                                                                                                                                                                                                              )}
                                                                                                                                                                                                                                                                                                                                                        inputMode={props.type === 'number' ? 'decimal' : undefined}
                                                                                                                                                                                                                                                                                                                                                                  onFocus={(e) => props.type === 'number' && e.target.select()}
                                                                                                                                                                                                                                                                                                                                                                            {...props}
                                                                                                                                                                                                                                                                                                                                                                                    />
                                                                                                                                                                                                                                                                                                                                                                                            {error && <p className="text-danger text-small mt-1">{error}</p>}
                                                                                                                                                                                                                                                                                                                                                                                                  </div>
                                                                                                                                                                                                                                                                                                                                                                                                      );
                                                                                                                                                                                                                                                                                                                                                                                                        }
                                                                                                                                                                                                                                                                                                                                                                                                        );

                                                                                                                                                                                                                                                                                                                                                                                                        Input.displayName = 'Input';

                                                                                                                                                                                                                                                                                                                                                                                                        export default Input;