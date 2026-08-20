import type { FC } from 'react';
import { useRouteError } from 'react-router-dom';
import { ErrorState } from '@/lib/components/error-state';
import { useTranslate } from '@/lib/i18n/use-translate';
import { composeRouteErrorDescription } from '@/shell/helpers/compose-route-error-description';
import { resolveRouteErrorView } from '@/shell/helpers/resolve-route-error-view';
import './route-error-boundary.css';

export const RouteErrorBoundary: FC = () => {
  const error = useRouteError();
  const translate = useTranslate();
  const view = resolveRouteErrorView(error);

  return (
    <div className="route-error-boundary">
      <ErrorState
        title={translate('error.pageTitle')}
        description={composeRouteErrorDescription(view, translate)}
        detail={view.detail}
      />
    </div>
  );
};
