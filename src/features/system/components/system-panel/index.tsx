import type { FC } from 'react';
import { HEADING_TAG } from '@/lib/heading-level.constants';
import type { SystemPanelProps } from './system-panel.interface';
import './system-panel.css';

const SYSTEM_PANEL_DEFAULT_HEADING_LEVEL = 2;

export const SystemPanel: FC<SystemPanelProps> = ({
  title,
  headingLevel = SYSTEM_PANEL_DEFAULT_HEADING_LEVEL,
  children,
}) => {
  const Heading = HEADING_TAG[headingLevel];

  return (
    <section className="system-panel">
      <Heading className="system-panel__title">{title}</Heading>
      <div className="system-panel__body">{children}</div>
    </section>
  );
};
