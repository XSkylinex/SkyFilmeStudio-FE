import type { FC } from 'react';
import { useQuery } from '@tanstack/react-query';
import { Badge } from '@/lib/components/badge';
import { Button } from '@/lib/components/button';
import { ErrorState } from '@/lib/components/error-state';
import { HEADING_TAG } from '@/lib/heading-level.constants';
import { formatBytes } from '@/lib/format/format-bytes';
import { formatDateTime } from '@/lib/format/format-date-time';
import { useTranslate } from '@/lib/i18n/use-translate';
import { preflightQueryOptions } from '@/shell/api/preflight.query';
import { composeRouteErrorDescription } from '@/shell/helpers/compose-route-error-description';
import { resolveRouteErrorView } from '@/shell/helpers/resolve-route-error-view';
import { selectInterfaceLanguage } from '@/shell/shell.slice';
import { useAppSelector } from '@/shell/store/hooks';
import { resolveSystemReadiness } from './helpers/resolve-system-readiness';
import {
  SYSTEM_READINESS_DESCRIPTION_KEY,
  SYSTEM_READINESS_LABEL_KEY,
  SYSTEM_READINESS_TONE,
} from './system-readiness.constants';
import type { SystemReadinessProps } from './system-readiness.interface';
import './system-readiness.css';

const SYSTEM_READINESS_DEFAULT_HEADING_LEVEL = 2;

export const SystemReadiness: FC<SystemReadinessProps> = ({
  headingLevel = SYSTEM_READINESS_DEFAULT_HEADING_LEVEL,
}) => {
  const translate = useTranslate();
  const interfaceLanguage = useAppSelector(selectInterfaceLanguage);
  const { data, error, isFetching, refetch } = useQuery(
    preflightQueryOptions(),
  );
  const Heading = HEADING_TAG[headingLevel];
  const { state, failed, total } = resolveSystemReadiness(data);

  const rerunControl = (
    <Button
      variant="secondary"
      size="sm"
      disabled={isFetching}
      onClick={() => {
        void refetch();
      }}
    >
      {isFetching
        ? translate('readiness.rerunning')
        : translate('readiness.rerun')}
    </Button>
  );

  if (error) {
    const view = resolveRouteErrorView(error);

    return (
      <div className="system-readiness" data-state="unknown">
        <ErrorState
          title={translate('readiness.error.title')}
          description={composeRouteErrorDescription(view, translate)}
          detail={view.detail}
          action={rerunControl}
          headingLevel={headingLevel}
        />
      </div>
    );
  }

  return (
    <section className="system-readiness" data-state={state}>
      <div className="system-readiness__headline">
        <Heading className="system-readiness__title">
          {translate('readiness.title')}
        </Heading>
        <Badge
          tone={SYSTEM_READINESS_TONE[state]}
          label={translate(SYSTEM_READINESS_LABEL_KEY[state], {
            failed,
            total,
          })}
        />
        {rerunControl}
      </div>
      <p className="system-readiness__description">
        {translate(SYSTEM_READINESS_DESCRIPTION_KEY[state], { failed, total })}
      </p>
      {data && !data.diskGate.passed ? (
        <p className="system-readiness__shortfall">
          {translate('readiness.diskShortfall', {
            shortfall: formatBytes(data.diskGate.shortfallBytes),
          })}
        </p>
      ) : null}
      {data ? (
        <p className="system-readiness__checked">
          {translate('readiness.checkedAt', {
            time: formatDateTime(data.checkedAt, interfaceLanguage),
          })}
        </p>
      ) : null}
    </section>
  );
};
