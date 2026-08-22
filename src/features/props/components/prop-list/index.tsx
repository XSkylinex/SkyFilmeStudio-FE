import type { FC } from 'react';
import { useQuery } from '@tanstack/react-query';
import { EmptyState } from '@/lib/components/empty-state';
import { ErrorState } from '@/lib/components/error-state';
import { Skeleton } from '@/lib/components/skeleton';
import { useTranslate } from '@/lib/i18n/use-translate';
import { composeRouteErrorDescription } from '@/shell/helpers/compose-route-error-description';
import { resolveRouteErrorView } from '@/shell/helpers/resolve-route-error-view';
import { projectPropsQueryOptions } from '@/features/props/api/project-props.query';
import { PropCard } from '@/features/props/components/prop-card';
import { PROP_LIST_SKELETON_COUNT } from '@/features/props/props.constants';
import type { PropListProps } from './prop-list.interface';
import './prop-list.css';

export const PropList: FC<PropListProps> = ({ projectId }) => {
  const translate = useTranslate();
  const { data, error, isPending } = useQuery(
    projectPropsQueryOptions(projectId),
  );

  if (error && data === undefined) {
    const view = resolveRouteErrorView(error);

    return (
      <ErrorState
        title={translate('props.error.title')}
        description={composeRouteErrorDescription(view, translate)}
        detail={view.detail}
        headingLevel={2}
      />
    );
  }

  if (isPending) {
    return (
      <div className="prop-list">
        <output className="prop-list__loading">
          {translate('props.loading')}
        </output>
        <ul className="prop-list__items">
          {Array.from({ length: PROP_LIST_SKELETON_COUNT }, (_, index) => (
            <li key={index} className="prop-list__placeholder">
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
        title={translate('props.empty.title')}
        description={translate('props.empty.description')}
        headingLevel={2}
      />
    );
  }

  return (
    <div className="prop-list">
      <ul className="prop-list__items">
        {data.items.map((prop) => (
          <PropCard key={prop.id} projectId={projectId} prop={prop} />
        ))}
      </ul>
      {data.nextCursor === undefined ? null : (
        <p className="prop-list__truncated">{translate('props.truncated')}</p>
      )}
    </div>
  );
};
