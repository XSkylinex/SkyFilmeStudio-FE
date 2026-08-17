import type { FC } from 'react';
import { useRouteError } from 'react-router-dom';
import { ErrorState } from '@/lib/components/error-state';
import { parseRouteErrorPayload } from '@/shell/helpers/parse-route-error-payload';
import { toRouteErrorResponse } from '@/shell/helpers/to-route-error-response';
import {
  ROUTE_ERROR_CODE_MESSAGE,
  ROUTE_ERROR_DEFAULT_MESSAGE,
} from '@/shell/route-error-messages.fixture';
import './route-error-boundary.css';

const ROUTE_ERROR_BOUNDARY_TITLE = "This page couldn't load";

export const RouteErrorBoundary: FC = () => {
  const error = useRouteError();
  const errorResponse = toRouteErrorResponse(error);

  if (errorResponse) {
    const payload = parseRouteErrorPayload(errorResponse.data);
    const code =
      payload?.code ??
      errorResponse.statusText ??
      `HTTP_${errorResponse.status}`;
    const description =
      ROUTE_ERROR_CODE_MESSAGE[code] ??
      (payload
        ? ROUTE_ERROR_DEFAULT_MESSAGE
        : `The orchestrator responded with ${errorResponse.status} ${errorResponse.statusText}.`);

    return (
      <div className="route-error-boundary">
        <ErrorState
          title={ROUTE_ERROR_BOUNDARY_TITLE}
          description={description}
          detail={code}
        />
      </div>
    );
  }

  const detail = error instanceof Error ? error.message : String(error);

  return (
    <div className="route-error-boundary">
      <ErrorState
        title={ROUTE_ERROR_BOUNDARY_TITLE}
        description="Something failed while rendering this page. The rest of Local AI Studio is unaffected."
        detail={detail}
      />
    </div>
  );
};
