import type { FC } from 'react';
import { Skeleton } from '@/lib/components/skeleton';
import { useTranslate } from '@/lib/i18n/use-translate';
import './route-hydrate-fallback.css';

export const RouteHydrateFallback: FC = () => {
  const translate = useTranslate();

  return (
    <output
      className="route-hydrate-fallback"
      aria-label={translate('shell.loadingPage')}
    >
      <Skeleton shape="rect" />
      <Skeleton shape="text" />
      <Skeleton shape="text" />
    </output>
  );
};
