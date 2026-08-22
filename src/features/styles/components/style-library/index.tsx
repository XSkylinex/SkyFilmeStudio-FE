import type { FC } from 'react';
import { useQuery } from '@tanstack/react-query';
import { EmptyState } from '@/lib/components/empty-state';
import { ErrorState } from '@/lib/components/error-state';
import { Skeleton } from '@/lib/components/skeleton';
import { useTranslate } from '@/lib/i18n/use-translate';
import { composeRouteErrorDescription } from '@/shell/helpers/compose-route-error-description';
import { resolveRouteErrorView } from '@/shell/helpers/resolve-route-error-view';
import { styleProfilesQueryOptions } from '@/features/styles/api/style-profiles.query';
import { groupIntoLineages } from '@/features/styles/helpers/group-into-lineages';
import { StyleLineageCard } from '@/features/styles/components/style-lineage';
import { STYLE_LINEAGE_SKELETON_COUNT } from '@/features/styles/styles.constants';
import type { StyleLibraryProps } from './style-library.interface';
import './style-library.css';

export const StyleLibrary: FC<StyleLibraryProps> = ({ projectId }) => {
  const translate = useTranslate();
  const { data, error, isPending } = useQuery(
    styleProfilesQueryOptions(projectId),
  );

  if (error && data === undefined) {
    const view = resolveRouteErrorView(error);

    return (
      <ErrorState
        title={translate('styles.error.title')}
        description={composeRouteErrorDescription(view, translate)}
        detail={view.detail}
        headingLevel={2}
      />
    );
  }

  if (isPending) {
    return (
      <div className="style-library">
        <output className="style-library__loading">
          {translate('styles.loading')}
        </output>
        <ul className="style-library__lineages">
          {Array.from({ length: STYLE_LINEAGE_SKELETON_COUNT }, (_, index) => (
            <li key={index} className="style-library__placeholder">
              <Skeleton shape="rect" />
            </li>
          ))}
        </ul>
      </div>
    );
  }

  if (data.items.length === 0) {
    return (
      <EmptyState
        title={translate('styles.empty.title')}
        description={translate('styles.empty.description')}
        headingLevel={2}
      />
    );
  }

  const lineages = groupIntoLineages(data.items);

  return (
    <div className="style-library">
      <h2 className="style-library__title">{translate('styles.heading')}</h2>
      <p className="style-library__pinning">{translate('styles.pinning')}</p>
      <ul className="style-library__lineages">
        {lineages.map((lineage) => (
          <StyleLineageCard
            key={lineage.lineageId}
            projectId={projectId}
            lineage={lineage}
          />
        ))}
      </ul>
      {data.nextCursor === undefined ? null : (
        <p className="style-library__truncated">
          {translate('styles.truncated')}
        </p>
      )}
    </div>
  );
};
