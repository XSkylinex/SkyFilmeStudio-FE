import type { FC } from 'react';
import { ContentText } from '@/lib/components/content-text';
import type { TraitListProps } from './trait-list.interface';
import './trait-list.css';

export const TraitList: FC<TraitListProps> = ({
  label,
  emptyLabel,
  traits,
  emphasis,
}) => (
  <div className="trait-list" data-emphasis={emphasis}>
    <h3 className="trait-list__title">{label}</h3>
    {traits.length === 0 ? (
      <p className="trait-list__empty">{emptyLabel}</p>
    ) : (
      <ul className="trait-list__items">
        {traits.map((trait, index) => (
          <li key={index}>
            <ContentText>{trait}</ContentText>
          </li>
        ))}
      </ul>
    )}
  </div>
);
