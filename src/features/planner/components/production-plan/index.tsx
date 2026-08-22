import type { FC } from 'react';
import { useQuery } from '@tanstack/react-query';
import { Badge } from '@/lib/components/badge';
import { ContentText } from '@/lib/components/content-text';
import { ErrorState } from '@/lib/components/error-state';
import { Skeleton } from '@/lib/components/skeleton';
import { formatDuration } from '@/lib/format/format-duration';
import { useTranslate } from '@/lib/i18n/use-translate';
import { PRODUCTION_STATE_TONE } from '@/lib/status-tone/production-state.tone';
import { composeRouteErrorDescription } from '@/shell/helpers/compose-route-error-description';
import { resolveRouteErrorView } from '@/shell/helpers/resolve-route-error-view';
import { productionQueryOptions } from '@/features/productions/api/production.query';
import {
  NARRATIVE_MODE_LABEL,
  PRODUCTION_KIND_LABEL,
  PRODUCTION_STATE_LABEL,
} from '@/features/productions/productions.constants';
import { PlanApproval } from '@/features/planner/components/plan-approval';
import { PlannerGaps } from '@/features/planner/components/planner-gaps';
import { PlanningStageList } from '@/features/planner/components/planning-stage-list';
import { RuntimeBudgetPanel } from '@/features/planner/components/runtime-budget-panel';
import { StylePin } from '@/features/planner/components/style-pin';
import type { ProductionPlanProps } from './production-plan.interface';
import './production-plan.css';

export const ProductionPlan: FC<ProductionPlanProps> = ({
  projectId,
  productionId,
}) => {
  const translate = useTranslate();
  const { data, error, isPending } = useQuery(
    productionQueryOptions(projectId, productionId),
  );

  if (error && data === undefined) {
    const view = resolveRouteErrorView(error);

    return (
      <ErrorState
        title={translate('planner.error.title')}
        description={composeRouteErrorDescription(view, translate)}
        detail={view.detail}
        headingLevel={1}
      />
    );
  }

  if (isPending) {
    return (
      <section className="production-plan">
        <output className="production-plan__loading">
          {translate('planner.loading')}
        </output>
        <Skeleton shape="rect" />
      </section>
    );
  }

  return (
    <section className="production-plan">
      <header className="production-plan__header">
        <h1 className="production-plan__title">
          <ContentText>{data.title}</ContentText>
        </h1>
        <Badge
          tone={PRODUCTION_STATE_TONE[data.state]}
          label={translate(PRODUCTION_STATE_LABEL[data.state])}
        />
      </header>

      <dl className="production-plan__summary">
        <div className="production-plan__figure">
          <dt>{translate('planner.summary.kind')}</dt>
          <dd>{translate(PRODUCTION_KIND_LABEL[data.productionKind])}</dd>
        </div>
        <div className="production-plan__figure">
          <dt>{translate('planner.summary.mode')}</dt>
          <dd>{translate(NARRATIVE_MODE_LABEL[data.narrativeMode])}</dd>
        </div>
        <div className="production-plan__figure">
          <dt>{translate('planner.summary.target')}</dt>
          <dd>
            <span className="production-plan__notation" dir="ltr">
              {formatDuration(data.targetRuntimeSeconds)}
            </span>
          </dd>
        </div>
      </dl>

      <StylePin projectId={projectId} styleProfileId={data.styleProfileId} />

      {data.logline === undefined ? null : (
        <p className="production-plan__logline">
          <ContentText>{data.logline}</ContentText>
        </p>
      )}

      <RuntimeBudgetPanel productionId={data.id} />
      <PlanApproval production={data} />
      <PlanningStageList productionId={data.id} />
      <PlannerGaps />
    </section>
  );
};
