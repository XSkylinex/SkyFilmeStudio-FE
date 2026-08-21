import type { FC } from 'react';
import { useQuery } from '@tanstack/react-query';
import { Badge } from '@/lib/components/badge';
import { ContentText } from '@/lib/components/content-text';
import { ErrorState } from '@/lib/components/error-state';
import { Skeleton } from '@/lib/components/skeleton';
import { ERROR_CODE_GUIDANCE } from '@/lib/api/error-taxonomy';
import { useTranslate } from '@/lib/i18n/use-translate';
import { PREFLIGHT_STATUS_TONE } from '@/lib/status-tone/preflight-status.tone';
import { preflightQueryOptions } from '@/shell/api/preflight.query';
import { composeRouteErrorDescription } from '@/shell/helpers/compose-route-error-description';
import { resolveRouteErrorView } from '@/shell/helpers/resolve-route-error-view';
import { SystemPanel } from '@/features/system/components/system-panel';
import { nextHeadingLevel } from '@/features/system/helpers/next-heading-level';
import type { SystemSectionProps } from '@/features/system/interfaces/system-section';
import { PREFLIGHT_STATUS_LABEL_KEY } from './preflight-checks-panel.constants';
import './preflight-checks-panel.css';

export const PreflightChecksPanel: FC<SystemSectionProps> = ({
  headingLevel,
}) => {
  const translate = useTranslate();
  const { data, error } = useQuery(preflightQueryOptions());
  const errorView = error ? resolveRouteErrorView(error) : undefined;

  return (
    <SystemPanel
      title={translate('system.preflight.title')}
      headingLevel={headingLevel}
    >
      {errorView ? (
        <ErrorState
          title={translate('readiness.error.title')}
          description={composeRouteErrorDescription(errorView, translate)}
          detail={errorView.detail}
          headingLevel={nextHeadingLevel(headingLevel)}
        />
      ) : null}

      {!errorView && !data ? (
        <div className="preflight-checks-panel__skeleton">
          <Skeleton shape="text" />
          <Skeleton shape="text" />
          <Skeleton shape="text" />
        </div>
      ) : null}

      {data ? (
        <>
          <p className="preflight-checks-panel__note">
            {translate('system.preflight.notRunNote')}
          </p>
          <ul className="preflight-checks-panel__list">
            {data.checks.map((check) => {
              const { errorCode } = check;

              return (
                <li
                  className="preflight-checks-panel__row"
                  data-status={check.status}
                  key={check.id}
                >
                  <code className="preflight-checks-panel__check-id" dir="ltr">
                    {check.id}
                  </code>
                  <Badge
                    tone={PREFLIGHT_STATUS_TONE[check.status]}
                    label={translate(PREFLIGHT_STATUS_LABEL_KEY[check.status])}
                  />
                  <p className="preflight-checks-panel__detail">
                    <ContentText>{check.detail}</ContentText>
                  </p>
                  {errorCode ? (
                    <p className="preflight-checks-panel__guidance">
                      {translate(ERROR_CODE_GUIDANCE[errorCode].messageKey)}{' '}
                      <code
                        className="preflight-checks-panel__error-code"
                        dir="ltr"
                      >
                        {errorCode}
                      </code>
                    </p>
                  ) : null}
                </li>
              );
            })}
          </ul>
        </>
      ) : null}
    </SystemPanel>
  );
};
