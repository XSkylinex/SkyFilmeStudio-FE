import type { FC } from 'react';
import { useQuery } from '@tanstack/react-query';
import { Badge } from '@/lib/components/badge';
import { ErrorState } from '@/lib/components/error-state';
import { Skeleton } from '@/lib/components/skeleton';
import { useTranslate } from '@/lib/i18n/use-translate';
import { systemModeQueryOptions } from '@/shell/api/system-mode.query';
import { composeRouteErrorDescription } from '@/shell/helpers/compose-route-error-description';
import { resolveRouteErrorView } from '@/shell/helpers/resolve-route-error-view';
import { SystemPanel } from '@/features/system/components/system-panel';
import type { SystemSectionProps } from '@/features/system/interfaces/system-section';
import { OPERATING_MODE_FLAGS } from './operating-mode-panel.constants';
import './operating-mode-panel.css';

export const OperatingModePanel: FC<SystemSectionProps> = ({
  headingLevel,
}) => {
  const translate = useTranslate();
  const { data, error } = useQuery(systemModeQueryOptions());
  const errorView = error ? resolveRouteErrorView(error) : undefined;

  return (
    <SystemPanel
      title={translate('system.mode.title')}
      headingLevel={headingLevel}
    >
      {errorView ? (
        <ErrorState
          title={translate('system.mode.error.title')}
          description={composeRouteErrorDescription(errorView, translate)}
          detail={errorView.detail}
          headingLevel={headingLevel}
        />
      ) : null}

      {!errorView && !data ? <Skeleton shape="rect" /> : null}

      {data ? (
        <>
          <p className="operating-mode-panel__resolved">
            <code dir="ltr">{data.operatingMode}</code>
          </p>
          <ul className="operating-mode-panel__flags">
            {OPERATING_MODE_FLAGS.map((flag) => {
              const isOn = flag.read(data);

              return (
                <li className="operating-mode-panel__flag" key={flag.labelKey}>
                  <span className="operating-mode-panel__flag-label">
                    {translate(flag.labelKey)}
                  </span>
                  <Badge
                    tone={isOn ? flag.onTone : flag.offTone}
                    label={translate(
                      isOn ? 'system.value.on' : 'system.value.off',
                    )}
                  />
                  {flag.noteKey ? (
                    <p className="operating-mode-panel__flag-note">
                      {translate(flag.noteKey)}
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
