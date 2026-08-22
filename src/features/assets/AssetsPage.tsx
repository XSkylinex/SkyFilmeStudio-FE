import type { FC } from 'react';
import { useParams } from 'react-router-dom';
import { projectIdSchema } from 'sky-filme-studio-be/contracts';
import { ErrorState } from '@/lib/components/error-state';
import { useTranslate } from '@/lib/i18n/use-translate';
import { PROJECT_ID_PARAM } from '@/shell/routes/routes.constants';
import { AssetLibrary } from '@/features/assets/components/asset-library';
import { CaptureGuidePanel } from '@/features/assets/components/capture-guide-panel';
import './assets-page.css';

export const AssetsPage: FC = () => {
  const translate = useTranslate();
  const params = useParams();
  const projectId = projectIdSchema.safeParse(params[PROJECT_ID_PARAM]);

  if (!projectId.success) {
    return (
      <ErrorState
        title={translate('project.invalidId.title')}
        description={translate('project.invalidId.description')}
        headingLevel={1}
      />
    );
  }

  return (
    <section className="assets-page">
      <h1 className="assets-page__title">{translate('assets.title')}</h1>
      <CaptureGuidePanel />
      <AssetLibrary projectId={projectId.data} />
    </section>
  );
};
