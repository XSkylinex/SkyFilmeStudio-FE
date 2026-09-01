import type { FC } from 'react';
import { useState } from 'react';
import { useQuery } from '@tanstack/react-query';
import { Button } from '@/lib/components/button';
import { Dialog } from '@/lib/components/dialog';
import { EmptyState } from '@/lib/components/empty-state';
import { ErrorState } from '@/lib/components/error-state';
import { Skeleton } from '@/lib/components/skeleton';
import { useTranslate } from '@/lib/i18n/use-translate';
import { composeRouteErrorDescription } from '@/shell/helpers/compose-route-error-description';
import { resolveRouteErrorView } from '@/shell/helpers/resolve-route-error-view';
import { projectLocationsQueryOptions } from '@/features/locations/api/project-locations.query';
import { CreateLocationForm } from '@/features/locations/components/create-location-form';
import { LocationCard } from '@/features/locations/components/location-card';
import { LOCATION_LIST_SKELETON_COUNT } from '@/features/locations/locations.constants';
import type { LocationListProps } from './location-list.interface';
import './location-list.css';

export const LocationList: FC<LocationListProps> = ({ projectId }) => {
  const translate = useTranslate();
  const { data, error, isPending } = useQuery(
    projectLocationsQueryOptions(projectId),
  );
  const [isCreateOpen, setIsCreateOpen] = useState(false);

  if (error && data === undefined) {
    const view = resolveRouteErrorView(error);

    return (
      <ErrorState
        title={translate('locations.error.title')}
        description={composeRouteErrorDescription(view, translate)}
        detail={view.detail}
        headingLevel={2}
      />
    );
  }

  if (isPending) {
    return (
      <div className="location-list">
        <output className="location-list__loading">
          {translate('locations.loading')}
        </output>
        <ul className="location-list__items">
          {Array.from({ length: LOCATION_LIST_SKELETON_COUNT }, (_, index) => (
            <li key={index} className="location-list__placeholder">
              <Skeleton shape="rect" />
            </li>
          ))}
        </ul>
      </div>
    );
  }

  const body =
    data.items.length === 0 ? (
      <EmptyState
        title={translate('locations.empty.title')}
        description={translate('locations.empty.description')}
        headingLevel={2}
      />
    ) : (
      <>
        <p className="location-list__coverage-note">
          {translate('locations.coverageNote')}
        </p>
        <ul className="location-list__items">
          {data.items.map((location) => (
            <LocationCard
              key={location.id}
              projectId={projectId}
              location={location}
            />
          ))}
        </ul>
        {data.nextCursor === undefined ? null : (
          <p className="location-list__truncated">
            {translate('locations.truncated')}
          </p>
        )}
      </>
    );

  return (
    <div className="location-list">
      <div className="location-list__header">
        <Button
          variant="primary"
          size="md"
          onClick={() => setIsCreateOpen(true)}
        >
          {translate('locations.create.open')}
        </Button>
      </div>

      {body}

      <Dialog
        open={isCreateOpen}
        title={translate('locations.create.title')}
        onClose={() => setIsCreateOpen(false)}
      >
        {isCreateOpen ? (
          <CreateLocationForm
            projectId={projectId}
            onClose={() => setIsCreateOpen(false)}
          />
        ) : null}
      </Dialog>
    </div>
  );
};
