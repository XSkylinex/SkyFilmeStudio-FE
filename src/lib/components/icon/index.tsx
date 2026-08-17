import type { FC } from 'react';
import type { IconProps } from './icon.interface';
import './icon.css';

export const Icon: FC<IconProps> = ({ name }) => (
  <span className="icon" data-icon={name} aria-hidden="true" />
);
