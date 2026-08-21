import type { FC } from 'react';
import { useQuery } from '@tanstack/react-query';
import { ErrorState } from '@/lib/components/error-state';
import { Skeleton } from '@/lib/components/skeleton';
import { useTranslate } from '@/lib/i18n/use-translate';
import { preflightQueryOptions } from '@/shell/api/preflight.query';
import { composeRouteErrorDescription } from '@/shell/helpers/compose-route-error-description';
import { resolveRouteErrorView } from '@/shell/helpers/resolve-route-error-view';
import { SystemPanel } from '@/features/system/components/system-panel';
import { nextHeadingLevel } from '@/features/system/helpers/next-heading-level';
import type { SystemSectionProps } from '@/features/system/interfaces/system-section';
import './hardware-profile-panel.css';

export const HardwareProfilePanel: FC<SystemSectionProps> = ({
  headingLevel,
}) => {
  const translate = useTranslate();
  const { data, error } = useQuery(preflightQueryOptions());
  const errorView = error ? resolveRouteErrorView(error) : undefined;

  return (
    <SystemPanel
      title={translate('system.hardware.title')}
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

      {!errorView && !data ? <Skeleton shape="text" /> : null}

      {data?.hardwareProfileId ? (
        <>
          <p className="hardware-profile-panel__id">
            <code dir="ltr">{data.hardwareProfileId}</code>
          </p>
          <p className="hardware-profile-panel__unpublished">
            {translate('system.hardware.unpublished')}
          </p>
        </>
      ) : null}

      {data && !data.hardwareProfileId ? (
        <ErrorState
          title={translate('system.hardware.unknown.title')}
          description={translate('system.hardware.unknown.description')}
          headingLevel={nextHeadingLevel(headingLevel)}
        />
      ) : null}
    </SystemPanel>
  );
};
