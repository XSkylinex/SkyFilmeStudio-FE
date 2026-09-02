import type { FC } from 'react';
import { useQuery } from '@tanstack/react-query';
import { EmptyState } from '@/lib/components/empty-state';
import { ErrorState } from '@/lib/components/error-state';
import { Skeleton } from '@/lib/components/skeleton';
import { useTranslate } from '@/lib/i18n/use-translate';
import { composeRouteErrorDescription } from '@/shell/helpers/compose-route-error-description';
import { resolveRouteErrorView } from '@/shell/helpers/resolve-route-error-view';
import { musicCuesQueryOptions } from '@/features/music/api/music-cues.query';
import { MusicCueCard } from '@/features/music/components/music-cue-card';
import { MUSIC_CARD_SKELETON_COUNT } from '@/features/music/music.constants';
import type { MusicLibraryProps } from './music-library.interface';
import './music-library.css';

export const MusicLibrary: FC<MusicLibraryProps> = ({ projectId }) => {
  const translate = useTranslate();
  const { data, error, isPending } = useQuery(musicCuesQueryOptions(projectId));

  if (error && data === undefined) {
    const view = resolveRouteErrorView(error);

    return (
      <ErrorState
        title={translate('music.error.title')}
        description={composeRouteErrorDescription(view, translate)}
        detail={view.detail}
        headingLevel={2}
      />
    );
  }

  if (isPending) {
    return (
      <div className="music-library">
        <output className="music-library__loading">
          {translate('music.loading')}
        </output>
        <ul className="music-library__list">
          {Array.from({ length: MUSIC_CARD_SKELETON_COUNT }, (_, index) => (
            <li className="music-library__placeholder" key={index}>
              <Skeleton shape="rect" />
            </li>
          ))}
        </ul>
      </div>
    );
  }

  return (
    <div className="music-library">
      {data.items.length === 0 ? (
        <EmptyState
          title={translate('music.empty.title')}
          description={translate('music.empty.description')}
          headingLevel={2}
        />
      ) : (
        <ul className="music-library__list">
          {data.items.map((cue) => (
            <MusicCueCard key={cue.id} projectId={projectId} cue={cue} />
          ))}
        </ul>
      )}

      {data.nextCursor === undefined ? null : (
        <p className="music-library__truncated">
          {translate('music.truncated')}
        </p>
      )}
    </div>
  );
};
