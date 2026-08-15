import type { FC } from 'react';
import type { SkeletonProps } from './skeleton.interface';
import './skeleton.css';

export const Skeleton: FC<SkeletonProps> = ({ shape }) => (
  <div className="skeleton" data-shape={shape} aria-hidden="true" />
);
