import type { FC } from 'react';
import { bibleCarriesNarrative } from 'sky-filme-studio-be/contracts';
import { useTranslate } from '@/lib/i18n/use-translate';
import { BibleField } from '@/features/bible/components/bible-field';
import { BibleRuleList } from '@/features/bible/components/bible-rule-list';
import type { BibleNarrativeSectionProps } from './bible-narrative-section.interface';
import './bible-narrative-section.css';

export const BibleNarrativeSection: FC<BibleNarrativeSectionProps> = ({
  narrative,
  projectKind,
}) => {
  const translate = useTranslate();

  return (
    <section className="bible-narrative-section">
      <h2 className="bible-narrative-section__title">
        {translate('bible.narrative.title')}
      </h2>
      {!bibleCarriesNarrative(projectKind) ? (
        <p className="bible-narrative-section__excluded">
          {translate('bible.narrative.notCarried')}
        </p>
      ) : narrative === undefined ? (
        <p className="bible-narrative-section__excluded">
          {translate('bible.narrative.notRecorded')}
        </p>
      ) : (
        <dl className="bible-narrative-section__fields">
          <BibleRuleList
            label={translate('bible.narrative.worldRules')}
            rules={narrative.worldRules}
          />
          <BibleField
            label={translate('bible.narrative.humourDramaLanguage')}
            value={narrative.humourDramaLanguage}
          />
          <BibleField
            label={translate('bible.narrative.chronology')}
            value={narrative.chronology}
          />
        </dl>
      )}
    </section>
  );
};
