import React from 'react';
import { Badge as BadgeType } from '../types';

interface BadgeProps extends BadgeType {
  className?: string;
}

export default function Badge({ label, variant = 'primary', className = '' }: BadgeProps) {
  return (
    <span className={`badge bg-${variant} ${className}`}>
      {label}
    </span>
  );
}
