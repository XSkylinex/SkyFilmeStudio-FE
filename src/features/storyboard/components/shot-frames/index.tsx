import type { FC } from 'react';
import { useState } from 'react';
import { useMutation, useQuery, useQueryClient } from '@tanstack/react-query';
import type { StoryboardFrameId } from 'sky-filme-studio-be/contracts';
import { Badge } from '@/lib/components/badge';
import { Button } from '@/lib/components/button';
import { useTranslate } from '@/lib/i18n/use-translate';
import { formatDateTime } from '@/lib/format/format-date-time';
import { focusWhenShown } from '@/lib/helpers/focus-when-shown';
import { STATUS_TONE } from '@/lib/status-tone.constants';
import { composeRouteErrorDescription } from '@/shell/helpers/compose-route-error-description';
import { selectInterfaceLanguage } from '@/shell/shell.slice';
import { useAppSelector } from '@/shell/store/hooks';
import { resolveRouteErrorView } from '@/shell/helpers/resolve-route-error-view';
import { approveStoryboardFrameMutationOptions } from '@/features/storyboard/api/approve-storyboard-frame.mutation';
import { rejectStoryboardFrameMutationOptions } from '@/features/storyboard/api/reject-storyboard-frame.mutation';
import { shotKeyframeStatusQueryOptions } from '@/features/storyboard/api/shot-keyframe-status.query';
import { shotStoryboardFramesQueryOptions } from '@/features/storyboard/api/shot-storyboard-frames.query';
import { FrameComparisonDialog } from '@/features/storyboard/components/frame-comparison-dialog';
import {
  REGENERATION_MODE_LABEL,
  STORYBOARD_LEVEL_EXPLAINED,
  STORYBOARD_LEVEL_LABEL,
} from '@/features/storyboard/storyboard.constants';
import type { ShotFramesProps } from './shot-frames.interface';
import './shot-frames.css';

const KEYFRAME_LEVEL = 'KEYFRAME';

export const ShotFrames: FC<ShotFramesProps> = ({
  shotId,
  sceneId,
  shotOrder,
}) => {
  const translate = useTranslate();
  const queryClient = useQueryClient();
  const interfaceLanguage = useAppSelector(selectInterfaceLanguage);
  const [comparing, setComparing] = useState<StoryboardFrameId | null>(null);

  const frames = useQuery(shotStoryboardFramesQueryOptions(shotId));
  const status = useQuery(shotKeyframeStatusQueryOptions(shotId));
  const approve = useMutation(
    approveStoryboardFrameMutationOptions(shotId, sceneId, queryClient),
  );
  const reject = useMutation(
    rejectStoryboardFrameMutationOptions(shotId, sceneId, queryClient),
  );

  if (frames.error && frames.data === undefined) {
    return (
      <p className="shot-frames__note">
        {translate('storyboard.frames.error')}
      </p>
    );
  }

  if (frames.isPending) {
    return null;
  }

  if (frames.data.length === 0) {
    return (
      <p className="shot-frames__note">
        {translate('storyboard.frames.empty')}
      </p>
    );
  }

  const failure =
    approve.error !== null
      ? resolveRouteErrorView(approve.error)
      : reject.error !== null
        ? resolveRouteErrorView(reject.error)
        : null;

  const pending = approve.isPending || reject.isPending;

  return (
    <section className="shot-frames">
      <h4 className="shot-frames__title">
        {translate('storyboard.frames.title')}
      </h4>

      <p className="shot-frames__note">
        {translate('storyboard.frame.noImage')}
      </p>

      <ul className="shot-frames__list">
        {frames.data.map((frame) => {
          const context = translate('storyboard.frame.context', {
            attempt: String(frame.attempt),
            order: String(shotOrder),
          });
          const isApproved =
            status.data?.approvedKeyframeId === frame.artifactId;
          const isKeyframe = frame.level === KEYFRAME_LEVEL;
          const justApproved =
            approve.isSuccess && approve.variables === frame.id;
          const justRejected =
            reject.isSuccess && reject.variables === frame.id;

          return (
            <li key={frame.id} className="shot-frames__frame">
              <div className="shot-frames__header">
                <Badge
                  tone={isKeyframe ? STATUS_TONE.ACTIVE : STATUS_TONE.NEUTRAL}
                  label={translate(STORYBOARD_LEVEL_LABEL[frame.level])}
                />
                <span className="shot-frames__attempt">
                  {translate('storyboard.frame.label', {
                    attempt: String(frame.attempt),
                  })}
                </span>
                {isApproved ? (
                  <Badge
                    tone={STATUS_TONE.SUCCESS}
                    label={translate('storyboard.frame.approved')}
                  />
                ) : null}
              </div>

              <p className="shot-frames__level-explained">
                {translate(STORYBOARD_LEVEL_EXPLAINED[frame.level])}
              </p>

              <dl className="shot-frames__facts">
                <div className="shot-frames__fact">
                  <dt>{translate('storyboard.frame.created')}</dt>
                  <dd>{formatDateTime(frame.createdAt, interfaceLanguage)}</dd>
                </div>
                {frame.regenerationMode === undefined ? null : (
                  <div className="shot-frames__fact">
                    <dt>{translate('storyboard.frame.mode')}</dt>
                    <dd>
                      {translate(
                        REGENERATION_MODE_LABEL[frame.regenerationMode],
                      )}
                    </dd>
                  </div>
                )}
              </dl>

              {isKeyframe ? null : (
                <p className="shot-frames__note">
                  {translate('storyboard.frame.draftNotApprovable')}
                </p>
              )}

              <div className="shot-frames__actions">
                {isKeyframe && !isApproved ? (
                  <Button
                    type="button"
                    variant="primary"
                    size="sm"
                    disabled={pending}
                    aria-label={translate('approval.approveContext', {
                      context,
                    })}
                    onClick={() => approve.mutate(frame.id)}
                  >
                    {translate('approval.approve')}
                  </Button>
                ) : null}

                <Button
                  type="button"
                  variant="danger"
                  size="sm"
                  disabled={pending}
                  aria-label={translate('approval.rejectContext', { context })}
                  onClick={() => reject.mutate(frame.id)}
                >
                  {translate('approval.reject')}
                </Button>

                <Button
                  type="button"
                  variant="secondary"
                  size="sm"
                  aria-label={translate('storyboard.compare.context', {
                    attempt: String(frame.attempt),
                    order: String(shotOrder),
                  })}
                  onClick={() => setComparing(frame.id)}
                >
                  {translate('storyboard.compare.action')}
                </Button>
              </div>

              {justApproved ? (
                <output
                  className="shot-frames__done"
                  ref={focusWhenShown}
                  tabIndex={-1}
                >
                  {translate('storyboard.approve.done')}
                </output>
              ) : null}

              {justRejected ? (
                <output
                  className="shot-frames__done"
                  ref={focusWhenShown}
                  tabIndex={-1}
                >
                  {translate('storyboard.reject.done')}
                </output>
              ) : null}
            </li>
          );
        })}
      </ul>

      {failure === null ? null : (
        <p className="shot-frames__refusal" role="alert">
          {composeRouteErrorDescription(failure, translate)}
        </p>
      )}

      <FrameComparisonDialog
        frameId={comparing}
        onClose={() => setComparing(null)}
      />
    </section>
  );
};
