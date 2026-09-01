import type { FC } from 'react';
import { ContentText } from '@/lib/components/content-text';
import { useTranslate } from '@/lib/i18n/use-translate';
import type { BibleRuleListProps } from './bible-rule-list.interface';
import './bible-rule-list.css';

export const BibleRuleList: FC<BibleRuleListProps> = ({ label, rules }) => {
  const translate = useTranslate();

  return (
    <div className="bible-rule-list">
      <dt className="bible-rule-list__label">{label}</dt>
      <dd className="bible-rule-list__value">
        {rules.length === 0 ? (
          <span className="bible-rule-list__absent">
            {translate('bible.field.noneRecorded')}
          </span>
        ) : (
          <ul className="bible-rule-list__items">
            {rules.map((rule) => (
              <li key={rule}>
                <ContentText>{rule}</ContentText>
              </li>
            ))}
          </ul>
        )}
      </dd>
    </div>
  );
};
