import type { FC } from 'react';
import { useQuery } from '@tanstack/react-query';
import { useTranslate } from '@/lib/i18n/use-translate';
import { productionScenesQueryOptions } from '@/features/storyboard/api/production-scenes.query';
import { AudioGaps } from '@/features/audio/components/audio-gaps';
import { DialogueTiming } from '@/features/audio/components/dialogue-timing';
import { SceneDialogue } from '@/features/audio/components/scene-dialogue';
import type { DialogueReviewProps } from './dialogue-review.interface';
import './dialogue-review.css';

export const DialogueReview: FC<DialogueReviewProps> = ({
  projectId,
  productionId,
}) => {
  const translate = useTranslate();
  const scenes = useQuery(productionScenesQueryOptions(productionId));

  return (
    <div className="dialogue-review">
      <header className="dialogue-review__header">
        <h1 className="dialogue-review__title">{translate('audio.title')}</h1>
        <p className="dialogue-review__description">
          {translate('audio.description')}
        </p>
      </header>

      <DialogueTiming productionId={productionId} />

      {scenes.error && scenes.data === undefined ? (
        <p className="dialogue-review__note">
          {translate('audio.scenes.error')}
        </p>
      ) : null}

      {scenes.isPending ? (
        <p className="dialogue-review__note">
          {translate('audio.scenes.loading')}
        </p>
      ) : null}

      {scenes.data === undefined ? null : scenes.data.length === 0 ? (
        <p className="dialogue-review__note">
          {translate('audio.scenes.empty')}
        </p>
      ) : (
        <ul className="dialogue-review__scenes">
          {scenes.data.map((scene) => (
            <SceneDialogue key={scene.id} projectId={projectId} scene={scene} />
          ))}
        </ul>
      )}

      <AudioGaps />
    </div>
  );
};
