import type { FC } from 'react';
import { HEADING_TAG } from '@/lib/heading-level.constants';
import type { ErrorStateProps } from './error-state.interface';
import './error-state.css';

const ERROR_STATE_DEFAULT_HEADING_LEVEL = 2;

export const ErrorState: FC<ErrorStateProps> = ({
  title,
  description,
  detail,
  action,
  headingLevel = ERROR_STATE_DEFAULT_HEADING_LEVEL,
}) => {
  const Heading = HEADING_TAG[headingLevel];

  return (
    <div className="error-state">
      <Heading className="error-state__title">{title}</Heading>
      {description ? (
        <p className="error-state__description">{description}</p>
      ) : null}
      {detail ? (
        <code className="error-state__detail" dir="ltr">
          {detail}
        </code>
      ) : null}
      {action ? <div className="error-state__action">{action}</div> : null}
    </div>
  );
};
