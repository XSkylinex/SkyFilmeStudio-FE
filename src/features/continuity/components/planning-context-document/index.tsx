import type { FC } from 'react';
import { useQuery } from '@tanstack/react-query';
import { ErrorState } from '@/lib/components/error-state';
import { MarkdownView } from '@/lib/components/markdown-view';
import { Skeleton } from '@/lib/components/skeleton';
import { useTranslate } from '@/lib/i18n/use-translate';
import { composeRouteErrorDescription } from '@/shell/helpers/compose-route-error-description';
import { resolveRouteErrorView } from '@/shell/helpers/resolve-route-error-view';
import { planningContextQueryOptions } from '@/features/continuity/api/planning-context.query';
import type { PlanningContextDocumentProps } from './planning-context-document.interface';

export const PlanningContextDocument: FC<PlanningContextDocumentProps> = ({
  productionId,
  sceneId,
}) => {
  const translate = useTranslate();
  const context = useQuery(planningContextQueryOptions(productionId, sceneId));

  if (context.error) {
    const errorView = resolveRouteErrorView(context.error);

    return (
      <ErrorState
        title={translate('continuity.context.error.title')}
        description={composeRouteErrorDescription(errorView, translate)}
        detail={errorView.detail}
        headingLevel={3}
      />
    );
  }

  if (context.isPending) {
    return <Skeleton shape="rect" />;
  }

  return (
    <MarkdownView
      markdown={context.data}
      label={translate('continuity.context.title')}
    />
  );
};
