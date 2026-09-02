import type { FC } from 'react';
import { useQuery } from '@tanstack/react-query';
import { ContentText } from '@/lib/components/content-text';
import { formatMilliseconds } from '@/lib/format/format-milliseconds';
import { useTranslate } from '@/lib/i18n/use-translate';
import { productionScoreQueryOptions } from '@/features/audio/api/production-score.query';
import { musicCuesQueryOptions } from '@/features/music/api/music-cues.query';
import type { SceneScoreProps } from './scene-score.interface';
import './scene-score.css';

export const SceneScore: FC<SceneScoreProps> = ({
  projectId,
  productionId,
  sceneId,
}) => {
  const translate = useTranslate();
  const score = useQuery(productionScoreQueryOptions(productionId));
  const cues = useQuery(musicCuesQueryOptions(projectId));

  const placements = (score.data ?? [])
    .filter((cue) => cue.sceneId === sceneId)
    .sort((a, b) => a.order - b.order);

  if (score.data === undefined) {
    return null;
  }

  return (
    <section className="scene-score">
      <h4 className="scene-score__title">
        {translate('audio.score.scene.heading')}
      </h4>

      {placements.length === 0 ? (
        <p className="scene-score__note">
          {translate('audio.score.scene.none')}
        </p>
      ) : (
        <ul className="scene-score__cues">
          {placements.map((placement) => {
            const cue = cues.data?.items.find(
              (candidate) => candidate.id === placement.musicCueId,
            );

            return (
              <li className="scene-score__cue" key={placement.id}>
                <h5 className="scene-score__cue-name">
                  {cue === undefined ? (
                    <span className="scene-score__note">
                      {translate('audio.score.cue.unknown')}
                    </span>
                  ) : (
                    <ContentText>{cue.name}</ContentText>
                  )}
                </h5>
                <dl className="scene-score__facts">
                  <dt>{translate('audio.score.cue.startsAt')}</dt>
                  <dd>
                    <span className="scene-score__notation" dir="ltr">
                      {formatMilliseconds(placement.startOffsetMs)}
                    </span>
                  </dd>
                  <dt>{translate('audio.score.cue.gain')}</dt>
                  <dd>
                    <span className="scene-score__notation" dir="ltr">
                      {placement.gainDb} dB
                    </span>
                  </dd>
                  <dt>{translate('audio.score.cue.loop')}</dt>
                  <dd>
                    {translate(
                      placement.loop
                        ? 'audio.score.cue.loop.yes'
                        : 'audio.score.cue.loop.no',
                    )}
                  </dd>
                  <dt>{translate('audio.score.cue.fades')}</dt>
                  <dd>
                    <span className="scene-score__notation" dir="ltr">
                      {translate('audio.score.cue.fades.value', {
                        fadeIn: formatMilliseconds(placement.fadeInMs),
                        fadeOut: formatMilliseconds(placement.fadeOutMs),
                      })}
                    </span>
                  </dd>
                </dl>
              </li>
            );
          })}
        </ul>
      )}
    </section>
  );
};
