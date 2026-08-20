import type { FC } from 'react';
import { useEffect } from 'react';
import { useMatches } from 'react-router-dom';
import { useTranslate } from '@/lib/i18n/use-translate';
import { resolveCurrentRouteTitle } from '@/shell/helpers/resolve-current-route-title';
import { applyDocumentTitle } from '@/shell/helpers/apply-document-title';
import { APP_NAME } from '@/shell/app-shell/app-shell.constants';

export const RouteTitle: FC = () => {
  const matches = useMatches();
  const translate = useTranslate();
  const pageTitleKey = resolveCurrentRouteTitle(matches);
  const pageTitle = pageTitleKey ? translate(pageTitleKey) : undefined;
  const documentTitle = pageTitle ? `${pageTitle} · ${APP_NAME}` : APP_NAME;

  useEffect(() => {
    applyDocumentTitle(documentTitle);
  }, [documentTitle]);

  return null;
};
