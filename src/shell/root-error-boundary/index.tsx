import type { FC } from 'react';
import { useRouteError } from 'react-router-dom';
import { resolveRouteErrorView } from '@/shell/helpers/resolve-route-error-view';
import { FatalErrorView } from '@/shell/fatal-error-view';

export const RootErrorBoundary: FC = () => {
  const error = useRouteError();
  const { detail, description, isUnknownError } = resolveRouteErrorView(error);

  return (
    <FatalErrorView
      detail={detail}
      description={isUnknownError ? undefined : description}
    />
  );
};
