import { clsx } from 'clsx';
import type { ReactNode, CSSProperties } from 'react';

interface CardProps {
  children: ReactNode;
    accent?: boolean;
      className?: string;
        onClick?: (e: React.MouseEvent) => void;
          style?: CSSProperties;
          }

          export default function Card({ children, accent = false, className, onClick, style }: CardProps) {
            return (
                <div
                      className={clsx(
                              accent ? 'card-accent' : 'card',
                                      onClick && 'cursor-pointer active:shadow-card-hover transition-shadow',
                                              className
                                                    )}
                                                          onClick={onClick}
                                                                style={style}
                                                                    >
                                                                          {children}
                                                                              </div>
                                                                                );
                                                                                }