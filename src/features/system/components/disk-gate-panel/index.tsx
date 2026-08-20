import type { FC } from 'react';
import { useQuery } from '@tanstack/react-query';
import { ErrorState } from '@/lib/components/error-state';
import { Skeleton } from '@/lib/components/skeleton';
import { formatBytes } from '@/lib/format/format-bytes';
import { useTranslate } from '@/lib/i18n/use-translate';
import { preflightQueryOptions } from '@/shell/api/preflight.query';
import { composeRouteErrorDescription } from '@/shell/helpers/compose-route-error-description';
import { resolveRouteErrorView } from '@/shell/helpers/resolve-route-error-view';
import { SystemPanel } from '@/features/system/components/system-panel';
import type { SystemSectionProps } from '@/features/system/interfaces/system-section';
import { DISK_GATE_FIGURES } from './disk-gate-panel.constants';
import './disk-gate-panel.css';

export const DiskGatePanel: FC<SystemSectionProps> = ({ headingLevel }) => {
  const translate = useTranslate();
  const { data, error } = useQuery(preflightQueryOptions());
  const errorView = error ? resolveRouteErrorView(error) : undefined;

  return (
    <SystemPanel
      title={translate('system.disk.title')}
      headingLevel={headingLevel}
    >
      {errorView ? (
        <ErrorState
          title={translate('readiness.error.title')}
          description={composeRouteErrorDescription(errorView, translate)}
          detail={errorView.detail}
          headingLevel={headingLevel}
        />
      ) : null}

      {!errorView && !data ? <Skeleton shape="rect" /> : null}

      {data ? (
        <>
          <p
            className="disk-gate-panel__verdict"
            data-passed={data.diskGate.passed}
          >
            {data.diskGate.passed ? (
              translate('system.disk.passed')
            ) : (
              <>
                {translate('readiness.diskShortfall')}{' '}
                <span className="disk-gate-panel__notation" dir="ltr">
                  {formatBytes(data.diskGate.shortfallBytes)}
                </span>
              </>
            )}
          </p>
          <dl className="disk-gate-panel__figures">
            {DISK_GATE_FIGURES.map((figure) => (
              <div className="disk-gate-panel__figure" key={figure.labelKey}>
                <dt>{translate(figure.labelKey)}</dt>
                <dd>
                  <span className="disk-gate-panel__notation" dir="ltr">
                    {formatBytes(figure.read(data.diskGate))}
                  </span>
                </dd>
              </div>
            ))}
            {data.diskGate.shortfallBytes > 0 ? (
              <div
                className="disk-gate-panel__figure"
                data-shortfall="true"
                key="shortfall"
              >
                <dt>{translate('system.disk.shortfall')}</dt>
                <dd>
                  <span className="disk-gate-panel__notation" dir="ltr">
                    {formatBytes(data.diskGate.shortfallBytes)}
                  </span>
                </dd>
              </div>
            ) : null}
          </dl>
        </>
      ) : null}
    </SystemPanel>
  );
};
