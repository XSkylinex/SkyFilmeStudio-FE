import type { FC } from 'react';
import { useState } from 'react';
import { useQuery } from '@tanstack/react-query';
import { Button } from '@/lib/components/button';
import { ContentText } from '@/lib/components/content-text';
import { useTranslate } from '@/lib/i18n/use-translate';
import { ShotQcCard } from '@/features/shots/components/shot-qc-card';
import { AWAITING_REVIEW_STATES } from '@/features/shots/shots.constants';
import { sceneShotsQueryOptions } from '@/features/storyboard/api/scene-shots.query';
import type { SceneShotReviewProps } from './scene-shot-review.interface';
import './scene-shot-review.css';

export const SceneShotReview: FC<SceneShotReviewProps> = ({
  scene,
  awaitingOnly,
}) => {
  const translate = useTranslate();
  const [open, setOpen] = useState(false);

  const shots = useQuery({
    ...sceneShotsQueryOptions(scene.id),
    enabled: open,
  });

  const toggleLabel = translate(open ? 'shots.scene.hide' : 'shots.scene.show');
  const visible = (shots.data ?? [])
    .filter(
      (shot) => !awaitingOnly || AWAITING_REVIEW_STATES.includes(shot.state),
    )
    .sort((a, b) => a.order - b.order);

  return (
    <li className="scene-shot-review">
      <div className="scene-shot-review__header">
        <h2 className="scene-shot-review__title">
          {translate('shots.scene.label', { order: String(scene.order) })}
        </h2>
        <Button
          type="button"
          variant="secondary"
          size="sm"
          aria-expanded={open}
          aria-label={`${toggleLabel} ${translate('shots.scene.toggleContext', { order: String(scene.order) })}`}
          onClick={() => setOpen(!open)}
        >
          {toggleLabel}
        </Button>
      </div>

      {scene.slugline === undefined ? null : (
        <p className="scene-shot-review__slugline">
          <ContentText>{scene.slugline}</ContentText>
        </p>
      )}

      {open ? (
        <div className="scene-shot-review__detail">
          {shots.error && shots.data === undefined ? (
            <p className="scene-shot-review__note">
              {translate('shots.list.error')}
            </p>
          ) : null}

          {shots.isPending ? (
            <p className="scene-shot-review__note">
              {translate('shots.list.loading')}
            </p>
          ) : null}

          {shots.data === undefined ? null : shots.data.length === 0 ? (
            <p className="scene-shot-review__note">
              {translate('shots.list.empty')}
            </p>
          ) : visible.length === 0 ? (
            <p className="scene-shot-review__note">
              {translate('shots.list.noneAwaiting')}
            </p>
          ) : (
            <ul className="scene-shot-review__shots">
              {visible.map((shot) => (
                <ShotQcCard key={shot.id} shot={shot} sceneId={scene.id} />
              ))}
            </ul>
          )}
        </div>
      ) : null}
    </li>
  );
};
