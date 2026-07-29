import { clsx } from 'clsx';
import type { ReactNode, CSSProperties } from 'react';

interface CardProps {
  children: ReactNode;
  variant?: 'default' | 'accent' | 'icon'; // ⭐ إضافة variant جديد
  className?: string;
  onClick?: (e: React.MouseEvent) => void;
  style?: CSSProperties;
}

export default function Card({ children, variant = 'default', className, onClick, style }: CardProps) {
  const baseClasses = onClick ? 'cursor-pointer active:shadow-card-hover transition-shadow' : '';
  
  // تحديد الكلاسات بناءً على المتغير
  const variantClasses = variant === 'icon' 
    ? 'bg-white rounded-icon shadow-icon flex flex-col items-center justify-center w-[56px] h-[56px] gap-1 transition-all hover:shadow-card-hover'
    : variant === 'accent' 
      ? 'card-accent' 
      : 'card';

  return (
    <div
      className={clsx(variantClasses, baseClasses, className)}
      onClick={onClick}
      style={style}
    >
      {children}
    </div>
  );
}
