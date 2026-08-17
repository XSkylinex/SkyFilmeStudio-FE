import type { FC } from 'react';
import { useEffect } from 'react';
import { useMatches } from 'react-router-dom';
import { resolveCurrentRouteTitle } from '@/shell/helpers/resolve-current-route-title';
import { applyDocumentTitle } from '@/shell/helpers/apply-document-title';
import { APP_NAME } from '@/shell/app-shell/app-shell.constants';

export const RouteTitle: FC = () => {
  const matches = useMatches();
  const pageTitle = resolveCurrentRouteTitle(matches);
  const documentTitle = pageTitle ? `${pageTitle} · ${APP_NAME}` : APP_NAME;

  useEffect(() => {
    applyDocumentTitle(documentTitle);
  }, [documentTitle]);

  return null;
};
