import React from 'react';
import { clsx } from 'clsx';

interface BadgeProps extends React.HTMLAttributes<HTMLSpanElement> {
  variant?: 'default' | 'success' | 'warning' | 'danger' | 'outline';
}

export function Badge({ children, className, variant = 'default', ...props }: BadgeProps) {
  const variantStyles = {
    default: 'bg-brand-indigo-light text-brand-indigo',
    success: 'bg-emerald-50 text-feedback-success border border-emerald-200',
    warning: 'bg-amber-50 text-feedback-warning border border-amber-200',
    danger: 'bg-rose-50 text-feedback-danger border border-rose-200',
    outline: 'border border-neutral-border text-neutral-muted'
  };

  return (
    <span
      className={clsx(
        'inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-semibold',
        variantStyles[variant],
        className
      )}
      {...props}
    >
      {children}
    </span>
  );
}
