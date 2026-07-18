import { ReactNode } from 'react';
import clsx from 'clsx';

interface GlassCardProps {
  children: ReactNode;
  className?: string;
  hover?: boolean;
  neonBorder?: 'primary' | 'secondary' | 'success' | 'danger' | 'accent' | 'none';
  padding?: string;
}

const BORDER_COLORS = {
  primary: 'border-[rgba(108,99,255,0.3)]',
  secondary: 'border-[rgba(0,212,255,0.3)]',
  success: 'border-[rgba(0,255,148,0.3)]',
  danger: 'border-[rgba(255,68,68,0.3)]',
  accent: 'border-[rgba(255,107,157,0.3)]',
  none: '',
};

export default function GlassCard({
  children,
  className,
  hover = false,
  neonBorder = 'none',
  padding = 'p-6',
}: GlassCardProps) {
  return (
    <div
      className={clsx(
        'glass-card',
        hover && 'glass-card-hover',
        neonBorder !== 'none' && ['border', BORDER_COLORS[neonBorder]],
        padding,
        className
      )}
    >
      {children}
    </div>
  );
}
