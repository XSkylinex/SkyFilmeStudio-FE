import type { FC } from 'react';
import { useTranslate } from '@/lib/i18n/use-translate';
import { SystemReadiness } from '@/shell/system-readiness';
import { DiskGatePanel } from '@/features/system/components/disk-gate-panel';
import { HardwareProfilePanel } from '@/features/system/components/hardware-profile-panel';
import { ModelSetupPanel } from '@/features/system/components/model-setup-panel';
import { OperatingModePanel } from '@/features/system/components/operating-mode-panel';
import { PreflightChecksPanel } from '@/features/system/components/preflight-checks-panel';
import { SystemPanel } from '@/features/system/components/system-panel';
import './system-page.css';

export const SystemPage: FC = () => {
  const translate = useTranslate();

  return (
    <div className="system-page">
      <h1 className="system-page__title">{translate('page.system.title')}</h1>
      <p className="system-page__description">
        {translate('page.system.description')}
      </p>

      <SystemReadiness />

      <div className="system-page__panels">
        <HardwareProfilePanel />
        <DiskGatePanel />
        <OperatingModePanel />

        <SystemPanel title={translate('system.pressure.title')}>
          <p className="system-page__unpublished">
            {translate('system.pressure.unavailable')}
          </p>
        </SystemPanel>

        <SystemPanel title={translate('system.runtimes.title')}>
          <p className="system-page__unpublished">
            {translate('system.runtimes.unavailable')}
          </p>
        </SystemPanel>
      </div>

      <PreflightChecksPanel />
      <ModelSetupPanel />
    </div>
  );
};
