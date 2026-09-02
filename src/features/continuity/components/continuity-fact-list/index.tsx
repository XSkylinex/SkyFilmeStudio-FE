import { useState } from 'react';
import type { FC } from 'react';
import { useQuery } from '@tanstack/react-query';
import { Button } from '@/lib/components/button';
import { EmptyState } from '@/lib/components/empty-state';
import { ErrorState } from '@/lib/components/error-state';
import { Field } from '@/lib/components/field';
import { Input } from '@/lib/components/input';
import { Skeleton } from '@/lib/components/skeleton';
import { useTranslate } from '@/lib/i18n/use-translate';
import { composeRouteErrorDescription } from '@/shell/helpers/compose-route-error-description';
import { resolveRouteErrorView } from '@/shell/helpers/resolve-route-error-view';
import { productionScenesQueryOptions } from '@/features/storyboard/api/production-scenes.query';
import { continuityFactsQueryOptions } from '@/features/continuity/api/continuity-facts.query';
import { ContinuityFactCard } from '@/features/continuity/components/continuity-fact-card';
import type { ContinuityFactListProps } from './continuity-fact-list.interface';
import './continuity-fact-list.css';

export const ContinuityFactList: FC<ContinuityFactListProps> = ({
  productionId,
}) => {
  const translate = useTranslate();
  const [property, setProperty] = useState('');
  const [entityId, setEntityId] = useState('');

  const filter = {
    ...(property === '' ? {} : { property }),
    ...(entityId === '' ? {} : { entityId }),
  };
  const facts = useQuery(continuityFactsQueryOptions(productionId, filter));
  const scenes = useQuery(productionScenesQueryOptions(productionId));

  if (facts.error) {
    const errorView = resolveRouteErrorView(facts.error);

    return (
      <ErrorState
        title={translate('continuity.list.error.title')}
        description={composeRouteErrorDescription(errorView, translate)}
        detail={errorView.detail}
        headingLevel={2}
      />
    );
  }

  const isFiltered = property !== '' || entityId !== '';

  return (
    <section className="continuity-fact-list">
      <h2 className="continuity-fact-list__title">
        {translate('continuity.list.title')}
      </h2>
      <p className="continuity-fact-list__description">
        {translate('continuity.list.description')}
      </p>

      <div className="continuity-fact-list__filters">
        <Field label={translate('continuity.filter.property')}>
          <Input
            type="search"
            value={property}
            onChange={(event) => setProperty(event.target.value)}
          />
        </Field>
        {entityId === '' ? null : (
          <p className="continuity-fact-list__entity-filter">
            {translate('continuity.filter.entityActive')}{' '}
            <span className="continuity-fact-list__id" dir="ltr">
              {entityId}
            </span>
          </p>
        )}
        {isFiltered ? (
          <Button
            type="button"
            variant="ghost"
            size="sm"
            onClick={() => {
              setProperty('');
              setEntityId('');
            }}
          >
            {translate('continuity.filter.clear')}
          </Button>
        ) : null}
      </div>

      {facts.isPending ? (
        <Skeleton shape="rect" />
      ) : facts.data.items.length === 0 ? (
        <EmptyState
          title={translate(
            isFiltered
              ? 'continuity.list.empty.filtered.title'
              : 'continuity.list.empty.title',
          )}
          description={translate(
            isFiltered
              ? 'continuity.list.empty.filtered.description'
              : 'continuity.list.empty.description',
          )}
          headingLevel={3}
        />
      ) : (
        <ul className="continuity-fact-list__items">
          {facts.data.items.map((fact) => (
            <ContinuityFactCard
              key={fact.id}
              fact={fact}
              scenes={scenes.data ?? []}
              onFilterByEntity={setEntityId}
            />
          ))}
        </ul>
      )}

      {facts.data?.nextCursor === undefined ? null : (
        <p className="continuity-fact-list__note">
          {translate('continuity.list.firstPageOnly')}
        </p>
      )}
    </section>
  );
};
