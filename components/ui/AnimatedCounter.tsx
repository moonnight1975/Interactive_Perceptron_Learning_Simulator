'use client';
import { useEffect, useRef, useState } from 'react';

interface AnimatedCounterProps {
  value: number;
  decimals?: number;
  duration?: number;
  className?: string;
  prefix?: string;
  suffix?: string;
  highlight?: 'success' | 'danger' | 'primary' | null;
}

export default function AnimatedCounter({
  value,
  decimals = 4,
  duration = 300,
  className = '',
  prefix = '',
  suffix = '',
  highlight = null,
}: AnimatedCounterProps) {
  const [displayValue, setDisplayValue] = useState(value);
  const [isChanging, setIsChanging] = useState(false);
  const prevValue = useRef(value);
  const rafRef = useRef<number | null>(null);

  useEffect(() => {
    if (prevValue.current === value) return;
    setIsChanging(true);
    const start = prevValue.current;
    const end = value;
    const startTime = performance.now();

    const animate = (currentTime: number) => {
      const elapsed = currentTime - startTime;
      const progress = Math.min(elapsed / duration, 1);
      const eased = 1 - Math.pow(1 - progress, 3);
      setDisplayValue(start + (end - start) * eased);
      if (progress < 1) {
        rafRef.current = requestAnimationFrame(animate);
      } else {
        setDisplayValue(end);
        prevValue.current = end;
        setTimeout(() => setIsChanging(false), 100);
      }
    };
    if (rafRef.current) cancelAnimationFrame(rafRef.current);
    rafRef.current = requestAnimationFrame(animate);
    return () => { if (rafRef.current) cancelAnimationFrame(rafRef.current); };
  }, [value, duration]);

  const colorClass = isChanging && highlight
    ? highlight === 'success' ? 'text-[#00FF94]'
    : highlight === 'danger' ? 'text-[#FF4444]'
    : 'text-[#6C63FF]'
    : '';

  return (
    <span className={`font-mono transition-colors duration-300 ${colorClass} ${className}`}>
      {prefix}{displayValue.toFixed(decimals)}{suffix}
    </span>
  );
}
