import type { FC } from 'react';
import { StatusDot } from '@/lib/components/status-dot';
import type { BadgeProps } from './badge.interface';
import './badge.css';

export const Badge: FC<BadgeProps> = ({ tone, label }) => (
  <span className="badge" data-tone={tone}>
    <StatusDot tone={tone} />
    <span className="badge__label">{label}</span>
  </span>
);
