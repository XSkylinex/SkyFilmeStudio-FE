import type { FC } from 'react';
import { useState } from 'react';
import { useMutation, useQuery, useQueryClient } from '@tanstack/react-query';
import { Badge } from '@/lib/components/badge';
import { Button } from '@/lib/components/button';
import { ContentText } from '@/lib/components/content-text';
import { focusWhenShown } from '@/lib/helpers/focus-when-shown';
import { useTranslate } from '@/lib/i18n/use-translate';
import { SHOT_STATE_TONE } from '@/lib/status-tone/shot-state.tone';
import { composeRouteErrorDescription } from '@/shell/helpers/compose-route-error-description';
import { resolveRouteErrorView } from '@/shell/helpers/resolve-route-error-view';
import { requestShotReviewMutationOptions } from '@/features/shots/api/request-shot-review.mutation';
import { shotQcRunsQueryOptions } from '@/features/shots/api/shot-qc-runs.query';
import { QcRunView } from '@/features/shots/components/qc-run';
import { REVIEWABLE_SHOT_STATES } from '@/features/shots/shots.constants';
import {
  SHOT_STATE_LABEL,
  SHOT_TYPE_LABEL,
} from '@/features/storyboard/storyboard.constants';
import type { ShotQcCardProps } from './shot-qc-card.interface';
import './shot-qc-card.css';

const REVIEW_STATE = 'MANUAL_REVIEW';

export const ShotQcCard: FC<ShotQcCardProps> = ({ shot, sceneId }) => {
  const translate = useTranslate();
  const queryClient = useQueryClient();
  const [open, setOpen] = useState(false);

  const runs = useQuery({
    ...shotQcRunsQueryOptions(shot.id),
    enabled: open,
  });
  const handOver = useMutation(
    requestShotReviewMutationOptions(shot.id, sceneId, queryClient),
  );

  const context = translate('shots.review.context', {
    order: String(shot.order),
  });
  const canHandOver = REVIEWABLE_SHOT_STATES.includes(shot.state);
  const failure =
    handOver.error === null ? null : resolveRouteErrorView(handOver.error);

  return (
    <li className="shot-qc-card">
      <div className="shot-qc-card__header">
        <h3 className="shot-qc-card__title">
          {translate('shots.shot.label', { order: String(shot.order) })}
        </h3>
        <Badge
          tone={SHOT_STATE_TONE[shot.state]}
          label={translate(SHOT_STATE_LABEL[shot.state])}
        />
        <span className="shot-qc-card__type">
          {translate(SHOT_TYPE_LABEL[shot.shotType])}
        </span>
        <Button
          type="button"
          variant="secondary"
          size="sm"
          aria-expanded={open}
          aria-label={`${translate('shots.shot.checks')} ${translate('shots.shot.checksContext', { order: String(shot.order) })}`}
          onClick={() => setOpen(!open)}
        >
          {translate('shots.shot.checks')}
        </Button>
      </div>

      <p className="shot-qc-card__intent">
        <ContentText>{shot.actionOrVisualIntent}</ContentText>
      </p>

      <div className="shot-qc-card__actions">
        {canHandOver ? (
          <Button
            type="button"
            variant="primary"
            size="sm"
            disabled={handOver.isPending}
            aria-label={`${translate('shots.review.action')} ${context}`}
            onClick={() => handOver.mutate(undefined)}
          >
            {translate(
              handOver.isPending
                ? 'shots.review.pending'
                : 'shots.review.action',
            )}
          </Button>
        ) : (
          <p className="shot-qc-card__note">
            {translate('shots.review.unavailable')}
          </p>
        )}
      </div>

      {handOver.isSuccess && shot.state === REVIEW_STATE ? (
        <output
          className="shot-qc-card__done"
          ref={focusWhenShown}
          tabIndex={-1}
        >
          {translate('shots.review.done')}
        </output>
      ) : null}

      {failure === null ? null : (
        <p className="shot-qc-card__refusal" role="alert">
          {composeRouteErrorDescription(failure, translate)}
        </p>
      )}

      {open ? (
        <section className="shot-qc-card__qc">
          <h4 className="shot-qc-card__qc-title">
            {translate('shots.qc.title')}
          </h4>
          <p className="shot-qc-card__advisory">
            {translate('shots.qc.advisory')}
          </p>

          {runs.error && runs.data === undefined ? (
            <p className="shot-qc-card__note">{translate('shots.qc.error')}</p>
          ) : null}

          {runs.data === undefined ? null : runs.data.length === 0 ? (
            <p className="shot-qc-card__note">{translate('shots.qc.empty')}</p>
          ) : (
            <ul className="shot-qc-card__runs">
              {runs.data.map((run) => (
                <QcRunView key={run.id} run={run} />
              ))}
            </ul>
          )}
        </section>
      ) : null}
    </li>
  );
};
