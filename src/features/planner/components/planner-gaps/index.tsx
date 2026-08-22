import type { FC } from 'react';
import { useTranslate } from '@/lib/i18n/use-translate';
import { PLANNER_GAP_KEYS } from '@/features/planner/planner.constants';
import './planner-gaps.css';

export const PlannerGaps: FC = () => {
  const translate = useTranslate();

  return (
    <section className="planner-gaps">
      <h2 className="planner-gaps__title">
        {translate('planner.gaps.heading')}
      </h2>
      <ul className="planner-gaps__list">
        {PLANNER_GAP_KEYS.map((key) => (
          <li key={key}>{translate(key)}</li>
        ))}
      </ul>
    </section>
  );
};
