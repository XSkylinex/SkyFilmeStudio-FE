import type { FC } from 'react';
import { useQuery } from '@tanstack/react-query';
import { ERROR_CODE, RUNTIME_VERDICT } from 'sky-filme-studio-be/contracts';
import type { RuntimeSegmentShare } from 'sky-filme-studio-be/contracts';
import { Badge } from '@/lib/components/badge';
import { ContentText } from '@/lib/components/content-text';
import { EmptyState } from '@/lib/components/empty-state';
import { ErrorState } from '@/lib/components/error-state';
import { ProgressBar } from '@/lib/components/progress-bar';
import { Skeleton } from '@/lib/components/skeleton';
import { StudioError } from '@/lib/api/studio-error';
import { formatDuration } from '@/lib/format/format-duration';
import { useTranslate } from '@/lib/i18n/use-translate';
import { RUNTIME_VERDICT_TONE } from '@/lib/status-tone/runtime-verdict.tone';
import { STATUS_TONE } from '@/lib/status-tone.constants';
import { composeRouteErrorDescription } from '@/shell/helpers/compose-route-error-description';
import { resolveRouteErrorView } from '@/shell/helpers/resolve-route-error-view';
import { planningBudgetQueryOptions } from '@/features/planner/api/planning-budget.query';
import { summariseRuntimeBudget } from '@/features/planner/helpers/summarise-runtime-budget';
import {
  BUDGET_FIGURES,
  PERCENT_SCALE,
  PROGRESS_BAR_CEILING,
  RUNTIME_VERDICT_LABEL,
} from '@/features/planner/planner.constants';
import type { RuntimeBudgetPanelProps } from './runtime-budget-panel.interface';
import './runtime-budget-panel.css';

const shareOfTarget = (segment: RuntimeSegmentShare): string =>
  `${String(Math.round(segment.shareOfTarget * PERCENT_SCALE))}%`;

export const RuntimeBudgetPanel: FC<RuntimeBudgetPanelProps> = ({
  productionId,
}) => {
  const translate = useTranslate();
  const { data, error, isPending } = useQuery(
    planningBudgetQueryOptions(productionId),
  );

  if (error && data === undefined) {
    const undeclared =
      error instanceof StudioError &&
      error.code === ERROR_CODE.RUNTIME_TOLERANCE_UNDECLARED;
    const view = resolveRouteErrorView(error);

    return (
      <section className="runtime-budget-panel">
        <h2 className="runtime-budget-panel__title">
          {translate('planner.budget.heading')}
        </h2>
        {undeclared ? (
          <>
            <EmptyState
              title={translate('planner.budget.undeclared.title')}
              description={translate('planner.budget.undeclared.description')}
              headingLevel={3}
            />
            {view.descriptionDetail === undefined ? null : (
              <p className="runtime-budget-panel__server">
                <ContentText>{view.descriptionDetail}</ContentText>
              </p>
            )}
          </>
        ) : (
          <ErrorState
            title={translate('planner.budget.error.title')}
            description={composeRouteErrorDescription(view, translate)}
            detail={view.detail}
            headingLevel={3}
          />
        )}
      </section>
    );
  }

  if (isPending) {
    return (
      <section className="runtime-budget-panel">
        <h2 className="runtime-budget-panel__title">
          {translate('planner.budget.heading')}
        </h2>
        <output className="runtime-budget-panel__loading">
          {translate('planner.budget.loading')}
        </output>
        <Skeleton shape="rect" />
      </section>
    );
  }

  const summary = summariseRuntimeBudget(data);
  const short = data.varianceSeconds < 0;
  const filled = Math.min(
    PROGRESS_BAR_CEILING,
    data.targetRuntimeSeconds === 0
      ? 0
      : (data.totalSeconds / data.targetRuntimeSeconds) * PERCENT_SCALE,
  );

  return (
    <section className="runtime-budget-panel">
      <div className="runtime-budget-panel__header">
        <h2 className="runtime-budget-panel__title">
          {translate('planner.budget.heading')}
        </h2>
        <Badge
          tone={RUNTIME_VERDICT_TONE[data.verdict]}
          label={translate(RUNTIME_VERDICT_LABEL[data.verdict])}
        />
      </div>

      <ProgressBar
        label={translate('planner.budget.progress')}
        tone={RUNTIME_VERDICT_TONE[data.verdict]}
        indeterminate={false}
        value={filled}
      />

      <dl className="runtime-budget-panel__figures">
        {BUDGET_FIGURES.map((figure) => (
          <div className="runtime-budget-panel__figure" key={figure.labelKey}>
            <dt>{translate(figure.labelKey)}</dt>
            <dd>
              <span className="runtime-budget-panel__notation" dir="ltr">
                {formatDuration(figure.read(data))}
              </span>
            </dd>
          </div>
        ))}
        {data.varianceSeconds === 0 ? null : (
          <div
            className="runtime-budget-panel__figure"
            data-variance={data.withinTolerance ? 'slack' : 'breach'}
          >
            <dt>
              {translate(
                short
                  ? 'planner.budget.variance.SHORT'
                  : 'planner.budget.variance.LONG',
              )}
            </dt>
            <dd>
              <span className="runtime-budget-panel__notation" dir="ltr">
                {formatDuration(Math.abs(data.varianceSeconds))}
              </span>
            </dd>
          </div>
        )}
      </dl>

      <p className="runtime-budget-panel__server">
        <ContentText>{data.detail}</ContentText>
      </p>

      <h3 className="runtime-budget-panel__subtitle">
        {translate('planner.budget.segments.heading')}
      </h3>

      {data.segments.length === 0 ? (
        <p className="runtime-budget-panel__note">
          {translate('planner.budget.segments.empty')}
        </p>
      ) : (
        <div className="runtime-budget-panel__scroller">
          <table className="runtime-budget-panel__segments">
            <thead>
              <tr>
                <th scope="col">
                  {translate('planner.budget.segments.label')}
                </th>
                <th scope="col">
                  {translate('planner.budget.segments.duration')}
                </th>
                <th scope="col">
                  {translate('planner.budget.segments.share')}
                </th>
              </tr>
            </thead>
            <tbody>
              {data.segments.map((segment) => (
                <tr
                  key={segment.order}
                  data-reused={segment.reused}
                  data-off-mean={summary.offMeanSegments.includes(segment)}
                >
                  <th scope="row">
                    <ContentText>{segment.label}</ContentText>
                    {segment.reused ? (
                      <Badge
                        tone={STATUS_TONE.NEUTRAL}
                        label={translate('planner.budget.segments.reused')}
                      />
                    ) : null}
                  </th>
                  <td>
                    <span className="runtime-budget-panel__notation" dir="ltr">
                      {formatDuration(segment.targetDurationSeconds)}
                    </span>
                  </td>
                  <td>
                    <span className="runtime-budget-panel__notation" dir="ltr">
                      {shareOfTarget(segment)}
                    </span>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      )}

      {summary.reusedSegments.length === 0 ? null : (
        <p className="runtime-budget-panel__note">
          {translate('planner.budget.reusedNote')}
        </p>
      )}

      {data.verdict === RUNTIME_VERDICT.WITHIN_TOLERANCE ||
      summary.plannedSegments.length === 0 ? null : (
        <section className="runtime-budget-panel__off-mean">
          <h3 className="runtime-budget-panel__subtitle">
            {translate(
              short
                ? 'planner.budget.offMean.heading.SHORT'
                : 'planner.budget.offMean.heading.LONG',
            )}
          </h3>

          <dl className="runtime-budget-panel__figures">
            <div className="runtime-budget-panel__figure">
              <dt>{translate('planner.budget.offMean.mean')}</dt>
              <dd>
                <span className="runtime-budget-panel__notation" dir="ltr">
                  {formatDuration(summary.meanPlannedSeconds)}
                </span>
              </dd>
            </div>
            <div className="runtime-budget-panel__figure">
              <dt>{translate('planner.budget.offMean.spread')}</dt>
              <dd>
                <span className="runtime-budget-panel__notation" dir="ltr">
                  {formatDuration(summary.perSegmentVarianceSeconds)}
                </span>
              </dd>
            </div>
          </dl>

          {summary.offMeanSegments.length === 0 ? (
            <p className="runtime-budget-panel__note">
              {translate(
                short
                  ? 'planner.budget.offMean.none.SHORT'
                  : 'planner.budget.offMean.none.LONG',
              )}
            </p>
          ) : (
            <ul className="runtime-budget-panel__off-mean-list">
              {summary.offMeanSegments.map((segment) => (
                <li key={segment.order}>
                  <ContentText>{segment.label}</ContentText>
                  <span className="runtime-budget-panel__notation" dir="ltr">
                    {formatDuration(segment.targetDurationSeconds)}
                  </span>
                </li>
              ))}
            </ul>
          )}

          <p className="runtime-budget-panel__note">
            {translate('planner.budget.offMean.explain')}
          </p>
        </section>
      )}
    </section>
  );
};
