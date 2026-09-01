import type { FC } from 'react';
import { useQuery } from '@tanstack/react-query';
import { ContentText } from '@/lib/components/content-text';
import { useTranslate } from '@/lib/i18n/use-translate';
import { sceneContinuityFactsQueryOptions } from '@/features/storyboard/api/scene-continuity-facts.query';
import type { SceneContinuityProps } from './scene-continuity.interface';
import './scene-continuity.css';

export const SceneContinuity: FC<SceneContinuityProps> = ({
  productionId,
  sceneId,
}) => {
  const translate = useTranslate();
  const { data, error, isPending } = useQuery(
    sceneContinuityFactsQueryOptions(productionId, sceneId),
  );

  if (error && data === undefined) {
    return (
      <p className="scene-continuity__note">
        {translate('storyboard.continuity.error')}
      </p>
    );
  }

  if (isPending) {
    return null;
  }

  return (
    <section className="scene-continuity">
      <h4 className="scene-continuity__title">
        {translate('storyboard.continuity.title')}
      </h4>
      {data.length === 0 ? (
        <p className="scene-continuity__note">
          {translate('storyboard.continuity.empty')}
        </p>
      ) : (
        <dl className="scene-continuity__facts">
          {data.map((fact) => (
            <div key={fact.id} className="scene-continuity__fact">
              <dt className="scene-continuity__property">
                <ContentText>{fact.property}</ContentText>
              </dt>
              <dd className="scene-continuity__value">
                <ContentText>{fact.value}</ContentText>
              </dd>
            </div>
          ))}
        </dl>
      )}
    </section>
  );
};
