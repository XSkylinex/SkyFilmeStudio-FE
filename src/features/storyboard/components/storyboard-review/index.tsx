import type { FC } from 'react';
import { useQuery } from '@tanstack/react-query';
import { EmptyState } from '@/lib/components/empty-state';
import { ErrorState } from '@/lib/components/error-state';
import { Skeleton } from '@/lib/components/skeleton';
import { useTranslate } from '@/lib/i18n/use-translate';
import { composeRouteErrorDescription } from '@/shell/helpers/compose-route-error-description';
import { resolveRouteErrorView } from '@/shell/helpers/resolve-route-error-view';
import { productionScenesQueryOptions } from '@/features/storyboard/api/production-scenes.query';
import { ScenePanel } from '@/features/storyboard/components/scene-panel';
import { StoryboardGaps } from '@/features/storyboard/components/storyboard-gaps';
import type { StoryboardReviewProps } from './storyboard-review.interface';
import './storyboard-review.css';

export const StoryboardReview: FC<StoryboardReviewProps> = ({
  productionId,
}) => {
  const translate = useTranslate();
  const scenes = useQuery(productionScenesQueryOptions(productionId));

  if (scenes.error && scenes.data === undefined) {
    const view = resolveRouteErrorView(scenes.error);

    return (
      <ErrorState
        title={translate('storyboard.error.title')}
        description={composeRouteErrorDescription(view, translate)}
        detail={view.detail}
        headingLevel={1}
      />
    );
  }

  if (scenes.isPending) {
    return (
      <section className="storyboard-review">
        <output>{translate('storyboard.loading')}</output>
        <Skeleton shape="rect" />
      </section>
    );
  }

  const ordered = [...scenes.data].sort((a, b) => a.order - b.order);

  return (
    <section className="storyboard-review">
      <h1 className="storyboard-review__title">
        {translate('storyboard.title')}
      </h1>
      <p className="storyboard-review__intro">
        {translate('storyboard.intro')}
      </p>
      <p className="storyboard-review__intro">
        {translate('storyboard.approval.explained')}
      </p>

      {ordered.length === 0 ? (
        <EmptyState
          title={translate('storyboard.empty.title')}
          description={translate('storyboard.empty.description')}
          headingLevel={2}
        />
      ) : (
        <ul className="storyboard-review__scenes">
          {ordered.map((scene) => (
            <ScenePanel
              key={scene.id}
              productionId={productionId}
              scene={scene}
            />
          ))}
        </ul>
      )}

      <StoryboardGaps />
    </section>
  );
};
