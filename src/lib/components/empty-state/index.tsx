import type { FC } from 'react';
import type { EmptyStateProps } from './empty-state.interface';
import './empty-state.css';

export const EmptyState: FC<EmptyStateProps> = ({
  title,
  description,
  action,
}) => (
  <div className="empty-state">
    <h2 className="empty-state__title">{title}</h2>
    {description ? (
      <p className="empty-state__description">{description}</p>
    ) : null}
    {action ? <div className="empty-state__action">{action}</div> : null}
  </div>
);
