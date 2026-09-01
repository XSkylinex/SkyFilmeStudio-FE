import type { FC } from 'react';
import { useState } from 'react';
import { Badge } from '@/lib/components/badge';
import { Button } from '@/lib/components/button';
import { ContentText } from '@/lib/components/content-text';
import { formatDuration } from '@/lib/format/format-duration';
import { useTranslate } from '@/lib/i18n/use-translate';
import { SHOT_STATE_TONE } from '@/lib/status-tone/shot-state.tone';
import { KeyframeGate } from '@/features/storyboard/components/keyframe-gate';
import { ShotFrames } from '@/features/storyboard/components/shot-frames';
import {
  GENERATION_STRATEGY_LABEL,
  SHOT_STATE_LABEL,
  SHOT_TYPE_LABEL,
} from '@/features/storyboard/storyboard.constants';
import type { ShotCardProps } from './shot-card.interface';
import './shot-card.css';

export const ShotCard: FC<ShotCardProps> = ({ shot }) => {
  const translate = useTranslate();
  const [open, setOpen] = useState(false);

  const label = translate('storyboard.shot.label', {
    order: String(shot.order),
  });

  return (
    <li className="shot-card">
      <div className="shot-card__header">
        <h3 className="shot-card__title">{label}</h3>
        <Badge
          tone={SHOT_STATE_TONE[shot.state]}
          label={translate(SHOT_STATE_LABEL[shot.state])}
        />
        <Badge
          tone="neutral"
          label={translate(SHOT_TYPE_LABEL[shot.shotType])}
        />
        <span className="shot-card__duration" dir="ltr">
          {formatDuration(shot.targetDurationSeconds)}
        </span>
      </div>

      <dl className="shot-card__facts">
        <div className="shot-card__fact">
          <dt>{translate('storyboard.shot.framing')}</dt>
          <dd>
            <ContentText>{shot.framing}</ContentText>
          </dd>
        </div>
        <div className="shot-card__fact">
          <dt>{translate('storyboard.shot.camera')}</dt>
          <dd>
            <ContentText>{shot.camera}</ContentText>
          </dd>
        </div>
        <div className="shot-card__fact">
          <dt>{translate('storyboard.shot.intent')}</dt>
          <dd>
            <ContentText>{shot.actionOrVisualIntent}</ContentText>
          </dd>
        </div>
        <div className="shot-card__fact">
          <dt>{translate('storyboard.shot.strategy')}</dt>
          <dd>
            {translate(GENERATION_STRATEGY_LABEL[shot.generationStrategy])}
          </dd>
        </div>
      </dl>

      {shot.continuityRequirements.length === 0 ? null : (
        <div className="shot-card__continuity">
          <h4 className="shot-card__subtitle">
            {translate('storyboard.shot.continuity')}
          </h4>
          <ul className="shot-card__requirements">
            {shot.continuityRequirements.map((requirement) => (
              <li key={requirement}>
                <ContentText>{requirement}</ContentText>
              </li>
            ))}
          </ul>
        </div>
      )}

      <Button
        type="button"
        variant="ghost"
        size="sm"
        aria-expanded={open}
        aria-label={`${translate(
          open ? 'storyboard.scene.hide' : 'storyboard.scene.show',
        )} ${label}`}
        onClick={() => setOpen(!open)}
      >
        {translate(open ? 'storyboard.scene.hide' : 'storyboard.scene.show')}
      </Button>

      {open ? (
        <div className="shot-card__detail">
          <KeyframeGate shotId={shot.id} />
          <ShotFrames
            shotId={shot.id}
            sceneId={shot.sceneId}
            shotOrder={shot.order}
          />
        </div>
      ) : null}
    </li>
  );
};
