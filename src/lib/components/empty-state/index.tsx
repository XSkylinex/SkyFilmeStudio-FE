import type { FC } from 'react';
import { HEADING_TAG } from '@/lib/heading-level.constants';
import type { EmptyStateProps } from './empty-state.interface';
import './empty-state.css';

const EMPTY_STATE_DEFAULT_HEADING_LEVEL = 2;

export const EmptyState: FC<EmptyStateProps> = ({
  title,
  description,
  action,
  headingLevel = EMPTY_STATE_DEFAULT_HEADING_LEVEL,
}) => {
  const Heading = HEADING_TAG[headingLevel];

  return (
    <div className="empty-state">
      <Heading className="empty-state__title">{title}</Heading>
      {description ? (
        <p className="empty-state__description">{description}</p>
      ) : null}
      {action ? <div className="empty-state__action">{action}</div> : null}
    </div>
  );
};
