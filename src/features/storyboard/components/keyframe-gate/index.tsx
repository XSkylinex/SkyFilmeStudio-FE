import type { FC } from 'react';
import { useQuery } from '@tanstack/react-query';
import { Badge } from '@/lib/components/badge';
import { ContentText } from '@/lib/components/content-text';
import { useTranslate } from '@/lib/i18n/use-translate';
import { STATUS_TONE } from '@/lib/status-tone.constants';
import { shotKeyframeStatusQueryOptions } from '@/features/storyboard/api/shot-keyframe-status.query';
import { KEYFRAME_REQUIREMENT_LABEL } from '@/features/storyboard/storyboard.constants';
import type { KeyframeGateProps } from './keyframe-gate.interface';
import './keyframe-gate.css';

export const KeyframeGate: FC<KeyframeGateProps> = ({ shotId }) => {
  const translate = useTranslate();
  const { data, error, isPending } = useQuery(
    shotKeyframeStatusQueryOptions(shotId),
  );

  if (error && data === undefined) {
    return (
      <p className="keyframe-gate__note">
        {translate('storyboard.gate.error')}
      </p>
    );
  }

  if (isPending) {
    return null;
  }

  return (
    <section className="keyframe-gate">
      <div className="keyframe-gate__header">
        <h4 className="keyframe-gate__title">
          {translate('storyboard.gate.title')}
        </h4>
        <Badge
          tone={data.videoPermitted ? STATUS_TONE.SUCCESS : STATUS_TONE.WARNING}
          label={translate(
            data.videoPermitted
              ? 'storyboard.gate.permitted'
              : 'storyboard.gate.blocked',
          )}
        />
      </div>

      <p className="keyframe-gate__detail">
        <ContentText>{data.detail}</ContentText>
      </p>

      <dl className="keyframe-gate__facts">
        <div className="keyframe-gate__fact">
          <dt>{translate('storyboard.gate.requirement')}</dt>
          <dd>
            {translate(KEYFRAME_REQUIREMENT_LABEL[data.keyframeRequirement])}
          </dd>
        </div>
      </dl>

      {data.waiverId === undefined ? null : (
        <p className="keyframe-gate__note">
          {translate('storyboard.gate.waiver')}
        </p>
      )}
    </section>
  );
};
