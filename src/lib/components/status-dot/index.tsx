import type { FC } from 'react';
import type { StatusTone } from '@/lib/interfaces/status-tone';
import type { StatusDotProps } from './status-dot.interface';
import './status-dot.css';

type StatusDotForm = 'solid' | 'ring' | 'half' | 'dashed' | 'cross' | 'diamond';

const STATUS_DOT_FORM = {
  neutral: 'ring',
  ready: 'half',
  checking: 'dashed',
  active: 'half',
  processing: 'ring',
  success: 'solid',
  warning: 'dashed',
  danger: 'cross',
  stale: 'dashed',
  attention: 'diamond',
} satisfies Record<StatusTone, StatusDotForm>;

export const StatusDot: FC<StatusDotProps> = ({ tone }) => (
  <span
    className="status-dot"
    data-tone={tone}
    data-form={STATUS_DOT_FORM[tone]}
    aria-hidden="true"
  />
);
