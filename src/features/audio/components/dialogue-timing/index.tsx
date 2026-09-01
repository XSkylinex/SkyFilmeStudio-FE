import type { FC } from 'react';
import { useMutation, useQueryClient } from '@tanstack/react-query';
import { Badge } from '@/lib/components/badge';
import { Button } from '@/lib/components/button';
import { ContentText } from '@/lib/components/content-text';
import { formatDuration } from '@/lib/format/format-duration';
import { focusWhenShown } from '@/lib/helpers/focus-when-shown';
import { useTranslate } from '@/lib/i18n/use-translate';
import { STATUS_TONE } from '@/lib/status-tone.constants';
import { composeRouteErrorDescription } from '@/shell/helpers/compose-route-error-description';
import { resolveRouteErrorView } from '@/shell/helpers/resolve-route-error-view';
import { dialogueTimingMutationOptions } from '@/features/audio/api/dialogue-timing.mutation';
import { SCENE_TIMING_STATUS_LABEL } from '@/features/audio/audio.constants';
import type { DialogueTimingProps } from './dialogue-timing.interface';
import './dialogue-timing.css';

const MEASURED = 'RETIMED';

export const DialogueTiming: FC<DialogueTimingProps> = ({ productionId }) => {
  const translate = useTranslate();
  const queryClient = useQueryClient();
  const retime = useMutation(
    dialogueTimingMutationOptions(productionId, queryClient),
  );

  const failure =
    retime.error === null ? null : resolveRouteErrorView(retime.error);
  const report = retime.data;

  return (
    <section className="dialogue-timing">
      <h2 className="dialogue-timing__title">
        {translate('audio.timing.title')}
      </h2>
      <p className="dialogue-timing__note">
        {translate('audio.timing.explain')}
      </p>

      <Button
        type="button"
        variant="primary"
        size="md"
        disabled={retime.isPending}
        onClick={() => retime.mutate(undefined)}
      >
        {translate(
          retime.isPending ? 'audio.timing.running' : 'audio.timing.run',
        )}
      </Button>

      {report === undefined ? (
        <p className="dialogue-timing__note">
          {translate('audio.timing.noReport')}
        </p>
      ) : (
        <output
          className="dialogue-timing__report"
          ref={focusWhenShown}
          tabIndex={-1}
        >
          <p className="dialogue-timing__counts">
            {translate('audio.timing.measured', {
              count: String(report.measuredSceneCount),
            })}
            {' · '}
            {translate('audio.timing.estimated', {
              count: String(report.estimatedSceneCount),
            })}
          </p>

          {report.estimatedSceneCount === 0 ? null : (
            <p className="dialogue-timing__note">
              {translate('audio.timing.estimatedWarning')}
            </p>
          )}

          <dl className="dialogue-timing__budget">
            <div className="dialogue-timing__fact">
              <dt>{translate('audio.timing.total')}</dt>
              <dd>
                <span dir="ltr">
                  {formatDuration(report.budget.totalSeconds)}
                </span>
              </dd>
            </div>
            <div className="dialogue-timing__fact">
              <dt>{translate('audio.timing.target')}</dt>
              <dd>
                <span dir="ltr">
                  {formatDuration(report.budget.targetRuntimeSeconds)}
                </span>
              </dd>
            </div>
          </dl>

          <ul className="dialogue-timing__scenes">
            {report.scenes.map((scene) => (
              <li key={scene.sceneId} className="dialogue-timing__scene">
                <span className="dialogue-timing__scene-label">
                  {translate('audio.timing.scene', {
                    order: String(scene.order),
                  })}
                </span>
                <Badge
                  tone={
                    scene.status === MEASURED
                      ? STATUS_TONE.SUCCESS
                      : STATUS_TONE.NEUTRAL
                  }
                  label={translate(SCENE_TIMING_STATUS_LABEL[scene.status])}
                />
                {scene.measuredSeconds === undefined ? null : (
                  <span dir="ltr">{formatDuration(scene.measuredSeconds)}</span>
                )}
                <ContentText>{scene.detail}</ContentText>
              </li>
            ))}
          </ul>
        </output>
      )}

      {failure === null ? null : (
        <p className="dialogue-timing__refusal" role="alert">
          {composeRouteErrorDescription(failure, translate)}
        </p>
      )}
    </section>
  );
};
