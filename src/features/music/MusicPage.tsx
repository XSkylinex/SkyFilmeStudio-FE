import type { FC } from 'react';
import { useParams } from 'react-router-dom';
import { projectIdSchema } from 'sky-filme-studio-be/contracts';
import { ErrorState } from '@/lib/components/error-state';
import { useTranslate } from '@/lib/i18n/use-translate';
import { PROJECT_ID_PARAM } from '@/shell/routes/routes.constants';
import { MusicLibrary } from '@/features/music/components/music-library';
import { MusicRenders } from '@/features/music/components/music-renders';
import { OpeningEndingLibrary } from '@/features/music/components/opening-ending-library';
import { MUSIC_GAP_KEYS } from '@/features/music/music.constants';
import './music-page.css';

export const MusicPage: FC = () => {
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
    <div className="music-page">
      <h1 className="music-page__title">{translate('page.music.title')}</h1>
      <p className="music-page__description">
        {translate('page.music.description')}
      </p>

      <MusicLibrary projectId={projectId.data} />

      <MusicRenders projectId={projectId.data} />

      <OpeningEndingLibrary projectId={projectId.data} />

      <section className="music-page__gaps">
        <h2 className="music-page__gaps-title">
          {translate('music.gaps.heading')}
        </h2>
        <ul className="music-page__gaps-list">
          {MUSIC_GAP_KEYS.map((key) => (
            <li key={key}>{translate(key)}</li>
          ))}
        </ul>
      </section>
    </div>
  );
};
