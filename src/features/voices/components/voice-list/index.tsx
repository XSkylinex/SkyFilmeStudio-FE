import type { FC } from 'react';
import { useQuery } from '@tanstack/react-query';
import { EmptyState } from '@/lib/components/empty-state';
import { ErrorState } from '@/lib/components/error-state';
import { Skeleton } from '@/lib/components/skeleton';
import { useTranslate } from '@/lib/i18n/use-translate';
import { composeRouteErrorDescription } from '@/shell/helpers/compose-route-error-description';
import { resolveRouteErrorView } from '@/shell/helpers/resolve-route-error-view';
import { voiceProfilesQueryOptions } from '@/features/voices/api/voice-profiles.query';
import { splitBySubject } from '@/features/voices/helpers/split-by-subject';
import { VoiceCard } from '@/features/voices/components/voice-card';
import { VOICE_LIST_SKELETON_COUNT } from '@/features/voices/voices.constants';
import type { VoiceListProps } from './voice-list.interface';
import './voice-list.css';

export const VoiceList: FC<VoiceListProps> = ({ projectId }) => {
  const translate = useTranslate();
  const { data, error, isPending } = useQuery(
    voiceProfilesQueryOptions(projectId),
  );

  if (error) {
    const view = resolveRouteErrorView(error);

    return (
      <ErrorState
        title={translate('voices.error.title')}
        description={composeRouteErrorDescription(view, translate)}
        detail={view.detail}
        headingLevel={2}
      />
    );
  }

  if (isPending) {
    return (
      <div className="voice-list">
        <output className="voice-list__loading">
          {translate('voices.loading')}
        </output>
        <ul className="voice-list__items">
          {Array.from({ length: VOICE_LIST_SKELETON_COUNT }, (_, index) => (
            <li key={index} className="voice-list__placeholder">
              <Skeleton shape="rect" />
            </li>
          ))}
        </ul>
      </div>
    );
  }

  if (data.items.length === 0) {
    return (
      <EmptyState
        title={translate('voices.empty.title')}
        description={translate('voices.empty.description')}
        headingLevel={2}
      />
    );
  }

  const [forSubjects, standalone] = splitBySubject(data.items);

  return (
    <div className="voice-list">
      <p className="voice-list__rule">{translate('voices.onePerSubject')}</p>

      <h3 className="voice-list__group-title">
        {translate('voices.group.subjects')}
      </h3>
      {forSubjects.length === 0 ? (
        <p className="voice-list__none">
          {translate('voices.group.noneForSubjects')}
        </p>
      ) : (
        <ul className="voice-list__items">
          {forSubjects.map((voice) => (
            <VoiceCard key={voice.id} projectId={projectId} voice={voice} />
          ))}
        </ul>
      )}

      <h3 className="voice-list__group-title">
        {translate('voices.group.standalone')}
      </h3>
      {standalone.length === 0 ? (
        <p className="voice-list__none">
          {translate('voices.group.noneStandalone')}
        </p>
      ) : (
        <ul className="voice-list__items">
          {standalone.map((voice) => (
            <VoiceCard key={voice.id} projectId={projectId} voice={voice} />
          ))}
        </ul>
      )}

      {data.nextCursor === undefined ? null : (
        <p className="voice-list__truncated">{translate('voices.truncated')}</p>
      )}
    </div>
  );
};
