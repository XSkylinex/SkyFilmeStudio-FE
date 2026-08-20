import type { FC } from 'react';
import { useRouteError } from 'react-router-dom';
import { useTranslate } from '@/lib/i18n/use-translate';
import { composeRouteErrorDescription } from '@/shell/helpers/compose-route-error-description';
import { resolveRouteErrorView } from '@/shell/helpers/resolve-route-error-view';
import { FatalErrorView } from '@/shell/fatal-error-view';

export const RootErrorBoundary: FC = () => {
  const error = useRouteError();
  const translate = useTranslate();
  const view = resolveRouteErrorView(error);

  return (
    <FatalErrorView
      detail={view.detail}
      description={
        view.isUnknownError
          ? undefined
          : composeRouteErrorDescription(view, translate)
      }
    />
  );
};
