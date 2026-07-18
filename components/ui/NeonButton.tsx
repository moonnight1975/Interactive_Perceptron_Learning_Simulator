import { ReactNode, ButtonHTMLAttributes } from 'react';
import clsx from 'clsx';

type Variant = 'primary' | 'secondary' | 'success' | 'danger' | 'ghost';
type Size = 'sm' | 'md' | 'lg';

interface NeonButtonProps extends ButtonHTMLAttributes<HTMLButtonElement> {
  variant?: Variant;
  size?: Size;
  children: ReactNode;
  fullWidth?: boolean;
}

const SIZE_CLASSES: Record<Size, string> = {
  sm: 'px-4 py-2 text-[13px]',
  md: 'px-6 py-3 text-[14px]',
  lg: 'px-8 py-4 text-[15px]',
};

export default function NeonButton({
  variant = 'primary',
  size = 'md',
  children,
  fullWidth = false,
  className,
  ...props
}: NeonButtonProps) {
  return (
    <button
      className={clsx(
        'neon-btn',
        `neon-btn-${variant}`,
        SIZE_CLASSES[size],
        fullWidth && 'w-full',
        className
      )}
      {...props}
    >
      {children}
    </button>
  );
}
