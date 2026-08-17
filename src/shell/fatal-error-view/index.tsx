import type { FC } from 'react';
import { Button } from '@/lib/components/button';
import { ErrorState } from '@/lib/components/error-state';
import type { FatalErrorViewProps } from './fatal-error-view.interface';

const FATAL_ERROR_VIEW_TITLE = 'Local AI Studio hit an unrecoverable error';
const FATAL_ERROR_VIEW_DEFAULT_DESCRIPTION =
  'Reload the app. If this keeps happening, check that the orchestrator is still running.';

const handleReload = (): void => {
  window.location.reload();
};

export const FatalErrorView: FC<FatalErrorViewProps> = ({
  detail,
  description,
}) => (
  <div className="fatal-boundary">
    <ErrorState
      title={FATAL_ERROR_VIEW_TITLE}
      description={description ?? FATAL_ERROR_VIEW_DEFAULT_DESCRIPTION}
      detail={detail}
      action={
        <Button variant="primary" size="md" onClick={handleReload}>
          Reload
        </Button>
      }
    />
  </div>
);
