import type { FC } from 'react';
import { useState } from 'react';
import { useQuery } from '@tanstack/react-query';
import { Button } from '@/lib/components/button';
import { useTranslate } from '@/lib/i18n/use-translate';
import { SceneShotReview } from '@/features/shots/components/scene-shot-review';
import { ShotsGaps } from '@/features/shots/components/shots-gaps';
import { productionScenesQueryOptions } from '@/features/storyboard/api/production-scenes.query';
import type { ShotReviewQueueProps } from './shot-review-queue.interface';
import './shot-review-queue.css';

export const ShotReviewQueue: FC<ShotReviewQueueProps> = ({ productionId }) => {
  const translate = useTranslate();
  const [awaitingOnly, setAwaitingOnly] = useState(false);
  const scenes = useQuery(productionScenesQueryOptions(productionId));

  return (
    <div className="shot-review-queue">
      <header className="shot-review-queue__header">
        <h1 className="shot-review-queue__title">{translate('shots.title')}</h1>
        <p className="shot-review-queue__description">
          {translate('shots.description')}
        </p>
        <Button
          type="button"
          variant="secondary"
          size="sm"
          aria-pressed={awaitingOnly}
          onClick={() => setAwaitingOnly(!awaitingOnly)}
        >
          {translate(
            awaitingOnly ? 'shots.filter.all' : 'shots.filter.awaiting',
          )}
        </Button>
      </header>

      {scenes.error && scenes.data === undefined ? (
        <p className="shot-review-queue__note">
          {translate('shots.scenes.error')}
        </p>
      ) : null}

      {scenes.isPending ? (
        <p className="shot-review-queue__note">
          {translate('shots.scenes.loading')}
        </p>
      ) : null}

      {scenes.data === undefined ? null : scenes.data.length === 0 ? (
        <p className="shot-review-queue__note">
          {translate('shots.scenes.empty')}
        </p>
      ) : (
        <ul className="shot-review-queue__scenes">
          {[...scenes.data]
            .sort((a, b) => a.order - b.order)
            .map((scene) => (
              <SceneShotReview
                key={scene.id}
                scene={scene}
                awaitingOnly={awaitingOnly}
              />
            ))}
        </ul>
      )}

      <ShotsGaps />
    </div>
  );
};
