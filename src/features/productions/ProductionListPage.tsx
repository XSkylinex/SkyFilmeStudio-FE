import type { FC } from 'react';
import { useParams } from 'react-router-dom';
import { projectIdSchema } from 'sky-filme-studio-be/contracts';
import { ErrorState } from '@/lib/components/error-state';
import { useTranslate } from '@/lib/i18n/use-translate';
import { PROJECT_ID_PARAM } from '@/shell/routes/routes.constants';
import { ProductionLibrary } from '@/features/productions/components/production-library';
import { ProductionProfileList } from '@/features/productions/components/production-profile-list';
import './production-list-page.css';

export const ProductionListPage: FC = () => {
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
    <section className="production-list-page">
      <h1 className="production-list-page__title">
        {translate('page.productions.title')}
      </h1>
      <ProductionLibrary projectId={projectId.data} />
      <ProductionProfileList projectId={projectId.data} />
    </section>
  );
};
