import { useState } from 'react';
import type { FC } from 'react';
import { useQuery } from '@tanstack/react-query';
import { sceneIdSchema } from 'sky-filme-studio-be/contracts';
import { ContentText } from '@/lib/components/content-text';
import { EmptyState } from '@/lib/components/empty-state';
import { Field } from '@/lib/components/field';
import { Select } from '@/lib/components/select';
import { Skeleton } from '@/lib/components/skeleton';
import { useTranslate } from '@/lib/i18n/use-translate';
import { productionScenesQueryOptions } from '@/features/storyboard/api/production-scenes.query';
import { PlanningContextDocument } from '@/features/continuity/components/planning-context-document';
import { orderedScenes } from '@/features/continuity/helpers/ordered-scenes';
import type { PlanningContextPanelProps } from './planning-context-panel.interface';
import './planning-context-panel.css';

export const PlanningContextPanel: FC<PlanningContextPanelProps> = ({
  productionId,
}) => {
  const translate = useTranslate();
  const [selected, setSelected] = useState('');
  const scenes = useQuery(productionScenesQueryOptions(productionId));

  const available = orderedScenes(scenes.data ?? []);
  const chosen = available.find((scene) => scene.id === selected);
  const sceneId = sceneIdSchema.safeParse(selected);

  return (
    <section className="planning-context-panel">
      <h2 className="planning-context-panel__title">
        {translate('continuity.context.title')}
      </h2>
      <p className="planning-context-panel__description">
        {translate('continuity.context.description')}
      </p>

      {scenes.isPending ? (
        <Skeleton shape="text" />
      ) : available.length === 0 ? (
        <EmptyState
          title={translate('continuity.context.noScenes.title')}
          description={translate('continuity.context.noScenes.description')}
          headingLevel={3}
        />
      ) : (
        <>
          <Field label={translate('continuity.context.scene')}>
            <Select
              options={[
                { value: '', label: translate('continuity.context.choose') },
                ...available.map((scene) => ({
                  value: scene.id,
                  label: translate('continuity.context.sceneOption', {
                    order: String(scene.order),
                  }),
                })),
              ]}
              value={selected}
              onChange={setSelected}
            />
          </Field>

          {chosen?.slugline === undefined ? null : (
            <p className="planning-context-panel__slugline">
              <ContentText>{chosen.slugline}</ContentText>
            </p>
          )}
        </>
      )}

      {sceneId.success ? (
        <PlanningContextDocument
          productionId={productionId}
          sceneId={sceneId.data}
        />
      ) : null}
    </section>
  );
};
