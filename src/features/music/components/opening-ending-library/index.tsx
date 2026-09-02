import type { FC } from 'react';
import { useState } from 'react';
import { useQuery } from '@tanstack/react-query';
import { ActionResult } from '@/lib/components/action-result';
import { Button } from '@/lib/components/button';
import { EmptyState } from '@/lib/components/empty-state';
import { ErrorState } from '@/lib/components/error-state';
import { Skeleton } from '@/lib/components/skeleton';
import { useTranslate } from '@/lib/i18n/use-translate';
import { composeRouteErrorDescription } from '@/shell/helpers/compose-route-error-description';
import { resolveRouteErrorView } from '@/shell/helpers/resolve-route-error-view';
import { openingEndingAssetsQueryOptions } from '@/features/music/api/opening-ending-assets.query';
import { ImportOpeningEndingForm } from '@/features/music/components/import-opening-ending-form';
import { OpeningEndingLineageCard } from '@/features/music/components/opening-ending-lineage-card';
import { groupOpeningEndingLineages } from '@/features/music/helpers/group-opening-ending-lineages';
import type { OpeningEndingLibraryProps } from './opening-ending-library.interface';
import './opening-ending-library.css';

export const OpeningEndingLibrary: FC<OpeningEndingLibraryProps> = ({
  projectId,
}) => {
  const translate = useTranslate();
  const [removed, setRemoved] = useState<string | null>(null);
  const [removals, setRemovals] = useState(0);
  const { data, error, isPending } = useQuery(
    openingEndingAssetsQueryOptions(projectId),
  );
  const [isImportOpen, setIsImportOpen] = useState(false);

  const lineages = groupOpeningEndingLineages(data?.items ?? []);

  return (
    <section className="opening-ending-library">
      <div className="opening-ending-library__header">
        <h2 className="opening-ending-library__title">
          {translate('openingEnding.heading')}
        </h2>
        <Button
          type="button"
          variant="secondary"
          size="md"
          aria-expanded={isImportOpen}
          onClick={() => setIsImportOpen(true)}
        >
          {translate('openingEnding.import.open')}
        </Button>
      </div>
      <p className="opening-ending-library__explain">
        {translate('openingEnding.explain')}
      </p>

      {isImportOpen ? (
        <ImportOpeningEndingForm
          projectId={projectId}
          lineages={lineages}
          onClose={() => setIsImportOpen(false)}
        />
      ) : null}

      {error && data === undefined ? (
        <ErrorState
          title={translate('openingEnding.error.title')}
          description={composeRouteErrorDescription(
            resolveRouteErrorView(error),
            translate,
          )}
          detail={resolveRouteErrorView(error).detail}
          headingLevel={3}
        />
      ) : null}

      {isPending ? (
        <>
          <output className="opening-ending-library__loading">
            {translate('openingEnding.loading')}
          </output>
          <Skeleton shape="rect" />
        </>
      ) : null}

      {data === undefined ? null : lineages.length === 0 ? (
        <EmptyState
          title={translate('openingEnding.empty.title')}
          description={translate('openingEnding.empty.description')}
          headingLevel={3}
        />
      ) : (
        <ul className="opening-ending-library__list">
          {lineages.map((lineage) => (
            <OpeningEndingLineageCard
              key={lineage.lineageId}
              projectId={projectId}
              lineage={lineage}
              onRemoved={(name) => {
                setRemoved(name);
                setRemovals((count) => count + 1);
              }}
            />
          ))}
        </ul>
      )}

      {removed === null ? null : (
        <ActionResult
          message={translate('openingEnding.card.removed', { name: removed })}
          attempt={removals}
        />
      )}

      {data?.nextCursor === undefined ? null : (
        <p className="opening-ending-library__truncated">
          {translate('openingEnding.truncated')}
        </p>
      )}
    </section>
  );
};
