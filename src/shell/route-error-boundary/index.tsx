import type { FC } from 'react';
import { useRouteError } from 'react-router-dom';
import { ErrorState } from '@/lib/components/error-state';
import { resolveRouteErrorView } from '@/shell/helpers/resolve-route-error-view';
import './route-error-boundary.css';

const ROUTE_ERROR_BOUNDARY_TITLE = "This page couldn't load";

export const RouteErrorBoundary: FC = () => {
  const error = useRouteError();
  const { detail, description } = resolveRouteErrorView(error);

  return (
    <div className="route-error-boundary">
      <ErrorState
        title={ROUTE_ERROR_BOUNDARY_TITLE}
        description={description}
        detail={detail}
      />
    </div>
  );
};
