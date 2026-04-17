import React from 'react';

interface IconProps {
  className?: string;
  size?: number;
}

export const ProjectIcon = ({ className = '', size = 24 }: IconProps) => (
  <svg width={size} height={size} viewBox="0 0 24 24" className={className} fill="none" stroke="currentColor">
    <rect x="3" y="3" width="18" height="18" rx="2" ry="2" />
    <line x1="3" y1="9" x2="21" y2="9" />
  </svg>
);

export const CheckIcon = ({ className = '', size = 24 }: IconProps) => (
  <svg width={size} height={size} viewBox="0 0 24 24" className={className} fill="none" stroke="currentColor">
    <polyline points="20 6 9 17 4 12" />
  </svg>
);

export const StarIcon = ({ className = '', size = 24 }: IconProps) => (
  <svg width={size} height={size} viewBox="0 0 24 24" className={className} fill="currentColor">
    <polygon points="12 2 15.09 10.26 24 10.27 17.18 16.91 20.16 25.12 12 19.54 3.84 25.12 6.82 16.91 0 10.27 8.91 10.26 12 2" />
  </svg>
);
