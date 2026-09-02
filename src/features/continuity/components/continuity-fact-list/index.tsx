import { useState } from 'react';
import type { FC } from 'react';
import { useQuery } from '@tanstack/react-query';
import { ActionResult } from '@/lib/components/action-result';
import { Button } from '@/lib/components/button';
import { Dialog } from '@/lib/components/dialog';
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
import { CreateContinuityFactForm } from '@/features/continuity/components/create-continuity-fact-form';
import type { ContinuityFactListProps } from './continuity-fact-list.interface';
import './continuity-fact-list.css';

export const ContinuityFactList: FC<ContinuityFactListProps> = ({
  productionId,
}) => {
  const translate = useTranslate();
  const [property, setProperty] = useState('');
  const [entityId, setEntityId] = useState('');
  const [isCreateOpen, setIsCreateOpen] = useState(false);
  const [removed, setRemoved] = useState<string | null>(null);
  const [removals, setRemovals] = useState(0);

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
              productionId={productionId}
              fact={fact}
              scenes={scenes.data}
              onFilterByEntity={setEntityId}
              onRemoved={(property) => {
                setRemoved(property);
                setRemovals((count) => count + 1);
              }}
            />
          ))}
        </ul>
      )}

      {removed === null ? null : (
        <ActionResult
          message={translate('continuity.card.removed', { property: removed })}
          attempt={removals}
        />
      )}

      {facts.data?.nextCursor === undefined ? null : (
        <p className="continuity-fact-list__note">
          {translate('continuity.list.firstPageOnly')}
        </p>
      )}

      <div className="continuity-fact-list__actions">
        <Button
          type="button"
          variant="secondary"
          size="sm"
          onClick={() => setIsCreateOpen(true)}
        >
          {translate('continuity.create.open')}
        </Button>
      </div>

      <Dialog
        open={isCreateOpen}
        title={translate('continuity.create.heading')}
        onClose={() => setIsCreateOpen(false)}
      >
        {isCreateOpen ? (
          <CreateContinuityFactForm
            productionId={productionId}
            scenes={scenes.data}
            onClose={() => setIsCreateOpen(false)}
          />
        ) : null}
      </Dialog>
    </section>
  );
};
