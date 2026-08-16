import type { FC } from 'react';
import type { ErrorStateProps } from './error-state.interface';
import './error-state.css';

export const ErrorState: FC<ErrorStateProps> = ({
  title,
  description,
  detail,
  action,
}) => (
  <div className="error-state">
    <h2 className="error-state__title">{title}</h2>
    {description ? (
      <p className="error-state__description">{description}</p>
    ) : null}
    {detail ? <code className="error-state__detail">{detail}</code> : null}
    {action ? <div className="error-state__action">{action}</div> : null}
  </div>
);
