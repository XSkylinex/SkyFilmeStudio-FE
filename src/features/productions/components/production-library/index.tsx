import type { FC } from 'react';
import { useState } from 'react';
import { useQuery } from '@tanstack/react-query';
import { Button } from '@/lib/components/button';
import { EmptyState } from '@/lib/components/empty-state';
import { ErrorState } from '@/lib/components/error-state';
import { Skeleton } from '@/lib/components/skeleton';
import { useTranslate } from '@/lib/i18n/use-translate';
import { composeRouteErrorDescription } from '@/shell/helpers/compose-route-error-description';
import { resolveRouteErrorView } from '@/shell/helpers/resolve-route-error-view';
import { productionsQueryOptions } from '@/features/productions/api/productions.query';
import { PRODUCTION_CARD_SKELETON_COUNT } from '@/features/productions/productions.constants';
import { CreateProductionForm } from '@/features/productions/components/create-production-form';
import { ProductionCard } from '@/features/productions/components/production-card';
import type { ProductionLibraryProps } from './production-library.interface';
import './production-library.css';

export const ProductionLibrary: FC<ProductionLibraryProps> = ({
  projectId,
}) => {
  const translate = useTranslate();
  const { data, error, isPending } = useQuery(
    productionsQueryOptions(projectId),
  );
  const [isCreateFormOpen, setIsCreateFormOpen] = useState(false);

  if (error && data === undefined) {
    const view = resolveRouteErrorView(error);

    return (
      <ErrorState
        title={translate('productions.error.title')}
        description={composeRouteErrorDescription(view, translate)}
        detail={view.detail}
        headingLevel={2}
      />
    );
  }

  if (isPending) {
    return (
      <div className="production-library">
        <output className="production-library__loading">
          {translate('productions.loading')}
        </output>
        <ul className="production-library__list">
          {Array.from(
            { length: PRODUCTION_CARD_SKELETON_COUNT },
            (_, index) => (
              <li key={index} className="production-library__placeholder">
                <Skeleton shape="rect" />
              </li>
            ),
          )}
        </ul>
      </div>
    );
  }

  return (
    <div className="production-library">
      <div className="production-library__header">
        <h2 className="production-library__title">
          {translate('productions.heading')}
        </h2>
        {isCreateFormOpen ? null : (
          <Button
            variant="primary"
            size="md"
            onClick={() => setIsCreateFormOpen(true)}
          >
            {translate('productions.create.open')}
          </Button>
        )}
      </div>

      {isCreateFormOpen ? (
        <CreateProductionForm
          projectId={projectId}
          onClose={() => setIsCreateFormOpen(false)}
        />
      ) : null}

      {data.items.length === 0 ? (
        <EmptyState
          title={translate('productions.empty.title')}
          description={translate('productions.empty.description')}
          headingLevel={3}
        />
      ) : (
        <ul className="production-library__list">
          {data.items.map((production) => (
            <ProductionCard
              key={production.id}
              projectId={projectId}
              production={production}
            />
          ))}
        </ul>
      )}

      {data.nextCursor === undefined ? null : (
        <p className="production-library__truncated">
          {translate('productions.truncated')}
        </p>
      )}
    </div>
  );
};
