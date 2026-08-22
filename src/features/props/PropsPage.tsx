import type { FC } from 'react';
import { useParams } from 'react-router-dom';
import { projectIdSchema } from 'sky-filme-studio-be/contracts';
import { ErrorState } from '@/lib/components/error-state';
import { useTranslate } from '@/lib/i18n/use-translate';
import { PROJECT_ID_PARAM } from '@/shell/routes/routes.constants';
import { PropList } from '@/features/props/components/prop-list';
import './props-page.css';

export const PropsPage: FC = () => {
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
    <section className="props-page">
      <h1 className="props-page__title">{translate('page.props.title')}</h1>
      <PropList projectId={projectId.data} />
    </section>
  );
};
