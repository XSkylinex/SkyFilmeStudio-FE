import type { FC } from 'react';
import { useQuery } from '@tanstack/react-query';
import { Badge } from '@/lib/components/badge';
import { ErrorState } from '@/lib/components/error-state';
import { Skeleton } from '@/lib/components/skeleton';
import { useTranslate } from '@/lib/i18n/use-translate';
import { STATUS_TONE } from '@/lib/status-tone.constants';
import { composeRouteErrorDescription } from '@/shell/helpers/compose-route-error-description';
import { resolveRouteErrorView } from '@/shell/helpers/resolve-route-error-view';
import { planningStagesQueryOptions } from '@/features/planner/api/planning-stages.query';
import {
  COMPUTED_PLANNING_STAGE,
  PLANNING_STAGE_LABEL,
} from '@/features/planner/planner.constants';
import type { PlanningStageListProps } from './planning-stage-list.interface';
import './planning-stage-list.css';

export const PlanningStageList: FC<PlanningStageListProps> = ({
  productionId,
}) => {
  const translate = useTranslate();
  const { data, error, isPending } = useQuery(
    planningStagesQueryOptions(productionId),
  );

  if (error && data === undefined) {
    const view = resolveRouteErrorView(error);

    return (
      <section className="planning-stage-list">
        <h2 className="planning-stage-list__title">
          {translate('planner.stages.heading')}
        </h2>
        <ErrorState
          title={translate('planner.stages.error.title')}
          description={composeRouteErrorDescription(view, translate)}
          detail={view.detail}
          headingLevel={3}
        />
      </section>
    );
  }

  if (isPending) {
    return (
      <section className="planning-stage-list">
        <h2 className="planning-stage-list__title">
          {translate('planner.stages.heading')}
        </h2>
        <output className="planning-stage-list__loading">
          {translate('planner.stages.loading')}
        </output>
        <Skeleton shape="rect" />
      </section>
    );
  }

  return (
    <section className="planning-stage-list">
      <h2 className="planning-stage-list__title">
        {translate('planner.stages.heading')}
      </h2>
      <p className="planning-stage-list__note">
        {translate('planner.stages.source')}
      </p>
      <ol className="planning-stage-list__stages">
        {data.map((stage) => (
          <li
            key={stage}
            className="planning-stage-list__stage"
            data-computed={stage === COMPUTED_PLANNING_STAGE}
          >
            <span className="planning-stage-list__stage-row">
              <span className="planning-stage-list__stage-name">
                {translate(PLANNING_STAGE_LABEL[stage])}
              </span>
              {stage === COMPUTED_PLANNING_STAGE ? (
                <Badge
                  tone={STATUS_TONE.SUCCESS}
                  label={translate('planner.stages.computed')}
                />
              ) : null}
            </span>
            {stage === COMPUTED_PLANNING_STAGE ? (
              <span className="planning-stage-list__stage-note">
                {translate('planner.stages.computedNote')}
              </span>
            ) : null}
          </li>
        ))}
      </ol>
      <p className="planning-stage-list__note">
        {translate('planner.stages.blocked')}
      </p>
    </section>
  );
};
