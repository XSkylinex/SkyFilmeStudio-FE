import type { FC } from 'react';
import { useTranslate } from '@/lib/i18n/use-translate';
import { BibleField } from '@/features/bible/components/bible-field';
import { BibleRuleList } from '@/features/bible/components/bible-rule-list';
import type { BibleAudioSectionProps } from './bible-audio-section.interface';
import './bible-audio-section.css';

export const BibleAudioSection: FC<BibleAudioSectionProps> = ({ audio }) => {
  const translate = useTranslate();

  return (
    <section className="bible-audio-section">
      <h2 className="bible-audio-section__title">
        {translate('bible.audio.title')}
      </h2>
      <dl className="bible-audio-section__fields">
        <div className="bible-audio-section__languages">
          <dt className="bible-audio-section__label">
            {translate('bible.audio.languages')}
          </dt>
          <dd className="bible-audio-section__value">
            {audio.languages.length === 0 ? (
              <span className="bible-audio-section__absent">
                {translate('bible.field.noneRecorded')}
              </span>
            ) : (
              <ul className="bible-audio-section__tags">
                {audio.languages.map((tag) => (
                  <li key={tag}>
                    <span className="bible-audio-section__tag" dir="ltr">
                      {tag}
                    </span>
                  </li>
                ))}
              </ul>
            )}
          </dd>
        </div>
        <BibleField
          label={translate('bible.audio.narratorPolicy')}
          value={audio.narratorPolicy}
        />
        <BibleField
          label={translate('bible.audio.musicIdentity')}
          value={audio.musicIdentity}
        />
        <BibleRuleList
          label={translate('bible.audio.recurringMotifs')}
          rules={audio.recurringMotifs}
        />
        <BibleRuleList
          label={translate('bible.audio.ambienceRules')}
          rules={audio.ambienceRules}
        />
        <BibleField
          label={translate('bible.audio.sfxAesthetic')}
          value={audio.sfxAesthetic}
        />
        <BibleField
          label={translate('bible.audio.dialogueMusicPriority')}
          value={audio.dialogueMusicPriority}
        />
        <BibleField
          label={translate('bible.audio.loudnessProfile')}
          value={audio.loudnessProfile}
        />
      </dl>
    </section>
  );
};
