import type { FC } from 'react';
import { useTranslate } from '@/lib/i18n/use-translate';
import { BibleField } from '@/features/bible/components/bible-field';
import { BibleRuleList } from '@/features/bible/components/bible-rule-list';
import type { BibleWorldSectionProps } from './bible-world-section.interface';
import './bible-world-section.css';

export const BibleWorldSection: FC<BibleWorldSectionProps> = ({ world }) => {
  const translate = useTranslate();

  return (
    <section className="bible-world-section">
      <h2 className="bible-world-section__title">
        {translate('bible.world.title')}
      </h2>
      <dl className="bible-world-section__fields">
        <BibleField
          label={translate('bible.world.genre')}
          value={world.genre}
        />
        <BibleField label={translate('bible.world.tone')} value={world.tone} />
        <BibleField
          label={translate('bible.world.audience')}
          value={world.audienceProfile}
        />
        <BibleRuleList
          label={translate('bible.world.contentBoundaries')}
          rules={world.contentBoundaries}
        />
        <BibleRuleList
          label={translate('bible.world.recurringThemes')}
          rules={world.recurringThemes}
        />
        <BibleRuleList
          label={translate('bible.world.introOutroRules')}
          rules={world.introOutroRules}
        />
        <BibleRuleList
          label={translate('bible.world.continuityConstraints')}
          rules={world.continuityConstraints}
        />
      </dl>
    </section>
  );
};
