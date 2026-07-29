import { clsx } from 'clsx';
import type { ReactNode, CSSProperties } from 'react';

interface CardProps {
  children: ReactNode;
  variant?: 'default' | 'accent' | 'icon';
  accent?: boolean; // ✅ تمت إعادتها للتوافق العكسي مع الملفات القديمة
  className?: string;
  onClick?: (e: React.MouseEvent) => void;
  style?: CSSProperties;
}

export default function Card({ children, variant = 'default', accent = false, className, onClick, style }: CardProps) {
  // فئة أساسية للأزرار القابلة للنقر
  const baseClasses = onClick ? 'cursor-pointer active:shadow-card-hover transition-shadow' : '';
  
  // تحديد الفئة بناءً على الـ variant مع تفعيل التوافق العكسي
  const variantClasses = variant === 'icon' 
    ? 'bg-white rounded-icon shadow-icon flex flex-col items-center justify-center w-[56px] h-[56px] gap-1 transition-all hover:shadow-card-hover'
    : (variant === 'accent' || accent) // ✅ إذا كان accent=true أو variant="accent"
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
