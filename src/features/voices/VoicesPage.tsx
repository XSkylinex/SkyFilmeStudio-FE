import type { FC } from 'react';
import { useParams } from 'react-router-dom';
import { projectIdSchema } from 'sky-filme-studio-be/contracts';
import { ErrorState } from '@/lib/components/error-state';
import { useTranslate } from '@/lib/i18n/use-translate';
import { PROJECT_ID_PARAM } from '@/shell/routes/routes.constants';
import { VoiceList } from '@/features/voices/components/voice-list';
import { PronunciationDictionaries } from '@/features/voices/components/pronunciation-dictionaries';
import './voices-page.css';

export const VoicesPage: FC = () => {
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
    <section className="voices-page">
      <h1 className="voices-page__title">{translate('page.voices.title')}</h1>
      <p className="voices-page__preview">{translate('voices.noPreview')}</p>
      <VoiceList projectId={projectId.data} />
      <h2 className="voices-page__section">
        {translate('voices.dictionaries.title')}
      </h2>
      <PronunciationDictionaries projectId={projectId.data} />
    </section>
  );
};
