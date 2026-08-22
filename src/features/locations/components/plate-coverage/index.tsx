import type { FC } from 'react';
import { useQuery } from '@tanstack/react-query';
import { SUGGESTED_PLATE_KINDS } from 'sky-filme-studio-be/contracts';
import { Badge } from '@/lib/components/badge';
import { Skeleton } from '@/lib/components/skeleton';
import { STATUS_TONE } from '@/lib/status-tone.constants';
import { useTranslate } from '@/lib/i18n/use-translate';
import { locationPlatesQueryOptions } from '@/features/locations/api/location-plates.query';
import { summarisePlateCoverage } from '@/features/locations/helpers/summarise-plate-coverage';
import { suggestedKindsWithoutAPlate } from '@/features/locations/helpers/suggested-kinds-without-a-plate';
import type { PlateCoverageProps } from './plate-coverage.interface';
import './plate-coverage.css';

export const PlateCoverage: FC<PlateCoverageProps> = ({
  projectId,
  locationId,
}) => {
  const translate = useTranslate();
  const { data, error, isPending } = useQuery(
    locationPlatesQueryOptions(projectId, locationId),
  );

  if (error) {
    return (
      <p className="plate-coverage__unread">
        {translate('locations.plates.unreadable')}
      </p>
    );
  }

  if (isPending) {
    return <Skeleton shape="text" />;
  }

  const coverage = summarisePlateCoverage(data.items);
  const uncovered = suggestedKindsWithoutAPlate(
    data.items,
    SUGGESTED_PLATE_KINDS,
  );

  return (
    <div className="plate-coverage">
      <h4 className="plate-coverage__title">
        {translate('locations.plates.title')}
      </h4>

      {coverage.length === 0 ? (
        <p className="plate-coverage__none">
          {translate('locations.plates.none')}
        </p>
      ) : (
        <ul className="plate-coverage__kinds">
          {coverage.map((entry) => (
            <li className="plate-coverage__kind" key={entry.kind}>
              <span className="plate-coverage__kind-name" dir="ltr">
                {entry.kind}
              </span>
              <Badge
                tone={
                  entry.hasApproved ? STATUS_TONE.SUCCESS : STATUS_TONE.WARNING
                }
                label={translate(
                  entry.hasApproved
                    ? 'locations.plates.approved'
                    : 'locations.plates.draftsOnly',
                  { count: String(entry.draftCount) },
                )}
              />
            </li>
          ))}
        </ul>
      )}

      {data.nextCursor === undefined ? null : (
        <p className="plate-coverage__truncated">
          {translate('locations.plates.truncated')}
        </p>
      )}

      {uncovered.length === 0 ? null : (
        <p className="plate-coverage__suggested">
          {translate('locations.plates.suggestedMissing')}{' '}
          <span dir="ltr">{uncovered.join(', ')}</span>
        </p>
      )}
    </div>
  );
};
