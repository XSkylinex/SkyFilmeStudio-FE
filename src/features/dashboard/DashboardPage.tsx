import type { FC } from 'react';
import { Link } from 'react-router-dom';
import { EmptyState } from '@/lib/components/empty-state';
import { useTranslate } from '@/lib/i18n/use-translate';
import { SystemReadiness } from '@/shell/system-readiness';
import { systemPath } from '@/shell/routes/routes.constants';
import './dashboard-page.css';

export const DashboardPage: FC = () => {
  const translate = useTranslate();

  return (
    <div className="dashboard-page">
      <h1 className="dashboard-page__title">
        {translate('page.dashboard.title')}
      </h1>
      <p className="dashboard-page__description">
        {translate('page.dashboard.description')}
      </p>
      <SystemReadiness />
      <p className="dashboard-page__system-link">
        <Link to={systemPath()}>{translate('dashboard.openSystem')}</Link>
      </p>
      <EmptyState
        title={translate('dashboard.projectData.title')}
        description={translate('dashboard.projectData.description')}
      />
    </div>
  );
};
