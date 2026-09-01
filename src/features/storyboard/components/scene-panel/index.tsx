import type { FC } from 'react';
import { useState } from 'react';
import { useQuery } from '@tanstack/react-query';
import { Button } from '@/lib/components/button';
import { ContentText } from '@/lib/components/content-text';
import { formatDuration } from '@/lib/format/format-duration';
import { useTranslate } from '@/lib/i18n/use-translate';
import { sceneShotsQueryOptions } from '@/features/storyboard/api/scene-shots.query';
import { SceneContinuity } from '@/features/storyboard/components/scene-continuity';
import { ShotCard } from '@/features/storyboard/components/shot-card';
import type { ScenePanelProps } from './scene-panel.interface';
import './scene-panel.css';

export const ScenePanel: FC<ScenePanelProps> = ({ productionId, scene }) => {
  const translate = useTranslate();
  const [open, setOpen] = useState(false);

  const shots = useQuery({
    ...sceneShotsQueryOptions(scene.id),
    enabled: open,
  });

  const label = translate('storyboard.scene.label', {
    order: String(scene.order),
  });
  const toggleLabel = translate(
    open ? 'storyboard.scene.hide' : 'storyboard.scene.show',
  );

  return (
    <li className="scene-panel">
      <div className="scene-panel__header">
        <h2 className="scene-panel__title">{label}</h2>
        <span className="scene-panel__duration" dir="ltr">
          {formatDuration(scene.targetDurationSeconds)}
        </span>
        <Button
          type="button"
          variant="secondary"
          size="sm"
          aria-expanded={open}
          aria-label={`${toggleLabel} ${translate('storyboard.scene.toggleContext', { order: String(scene.order) })}`}
          onClick={() => setOpen(!open)}
        >
          {toggleLabel}
        </Button>
      </div>

      {scene.slugline === undefined ? null : (
        <p className="scene-panel__slugline">
          <ContentText>{scene.slugline}</ContentText>
        </p>
      )}

      <dl className="scene-panel__facts">
        <div className="scene-panel__fact">
          <dt>{translate('storyboard.scene.purpose')}</dt>
          <dd>
            <ContentText>{scene.purpose}</ContentText>
          </dd>
        </div>
        {scene.emotionalBeat === undefined ? null : (
          <div className="scene-panel__fact">
            <dt>{translate('storyboard.scene.emotionalBeat')}</dt>
            <dd>
              <ContentText>{scene.emotionalBeat}</ContentText>
            </dd>
          </div>
        )}
        {scene.timeOfDay === undefined ? null : (
          <div className="scene-panel__fact">
            <dt>{translate('storyboard.scene.timeOfDay')}</dt>
            <dd>
              <ContentText>{scene.timeOfDay}</ContentText>
            </dd>
          </div>
        )}
        <div className="scene-panel__fact">
          <dt>{translate('storyboard.scene.continuityIn')}</dt>
          <dd>
            <ContentText>{scene.continuityIn}</ContentText>
          </dd>
        </div>
        <div className="scene-panel__fact">
          <dt>{translate('storyboard.scene.continuityOut')}</dt>
          <dd>
            <ContentText>{scene.continuityOut}</ContentText>
          </dd>
        </div>
      </dl>

      {open ? (
        <div className="scene-panel__detail">
          <SceneContinuity productionId={productionId} sceneId={scene.id} />

          {shots.error && shots.data === undefined ? (
            <p className="scene-panel__note">
              {translate('storyboard.shots.error')}
            </p>
          ) : null}

          {shots.isPending ? (
            <p className="scene-panel__note">
              {translate('storyboard.shots.loading')}
            </p>
          ) : null}

          {shots.data === undefined ? null : shots.data.length === 0 ? (
            <p className="scene-panel__note">
              {translate('storyboard.shots.empty')}
            </p>
          ) : (
            <ul className="scene-panel__shots">
              {shots.data.map((shot) => (
                <ShotCard key={shot.id} shot={shot} />
              ))}
            </ul>
          )}
        </div>
      ) : null}
    </li>
  );
};
