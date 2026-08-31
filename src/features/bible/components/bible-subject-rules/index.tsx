import type { FC } from 'react';
import { ContentText } from '@/lib/components/content-text';
import { useTranslate } from '@/lib/i18n/use-translate';
import { BibleField } from '@/features/bible/components/bible-field';
import { BibleRuleList } from '@/features/bible/components/bible-rule-list';
import type { BibleSubjectRulesProps } from './bible-subject-rules.interface';
import './bible-subject-rules.css';

export const BibleSubjectRulesSection: FC<BibleSubjectRulesProps> = ({
  subjectRules,
}) => {
  const translate = useTranslate();

  return (
    <section className="bible-subject-rules">
      <h2 className="bible-subject-rules__title">
        {translate('bible.subjects.title')}
      </h2>

      {subjectRules.length === 0 ? (
        <p className="bible-subject-rules__absent">
          {translate('bible.subjects.none')}
        </p>
      ) : (
        subjectRules.map((rules) => (
          <article className="bible-subject-rules__entry" key={rules.subjectId}>
            <h3 className="bible-subject-rules__subject">
              <span className="bible-subject-rules__id" dir="ltr">
                {rules.subjectId}
              </span>
            </h3>
            <dl className="bible-subject-rules__fields">
              <BibleRuleList
                label={translate('bible.subjects.immutableVisualTraits')}
                rules={rules.immutableVisualTraits}
              />
              <BibleRuleList
                label={translate('bible.subjects.allowedVariations')}
                rules={rules.allowedVariations}
              />
              <BibleRuleList
                label={translate('bible.subjects.prohibitedChanges')}
                rules={rules.prohibitedChanges}
              />
              <BibleRuleList
                label={translate('bible.subjects.scaleRelationships')}
                rules={rules.scaleRelationships}
              />
              <BibleRuleList
                label={translate('bible.subjects.wardrobeVariants')}
                rules={rules.wardrobeVariants}
              />
              <BibleField
                label={translate('bible.subjects.behaviourAndPersonality')}
                value={rules.behaviourAndPersonality}
              />
              <div className="bible-subject-rules__speaks">
                <dt className="bible-subject-rules__label">
                  {translate('bible.subjects.speaks')}
                </dt>
                <dd className="bible-subject-rules__value">
                  {translate(
                    rules.speaks
                      ? 'bible.subjects.speaks.yes'
                      : 'bible.subjects.speaks.no',
                  )}
                </dd>
              </div>
              {rules.speaks ? (
                <BibleRuleList
                  label={translate('bible.subjects.voiceRules')}
                  rules={rules.voiceRules}
                />
              ) : (
                <div className="bible-subject-rules__speaks">
                  <dt className="bible-subject-rules__label">
                    {translate('bible.subjects.voiceRules')}
                  </dt>
                  <dd className="bible-subject-rules__value">
                    <span className="bible-subject-rules__absent">
                      {translate('bible.subjects.voiceRules.notApplicable')}
                    </span>
                  </dd>
                </div>
              )}
              <div className="bible-subject-rules__speaks">
                <dt className="bible-subject-rules__label">
                  {translate('bible.subjects.relationships')}
                </dt>
                <dd className="bible-subject-rules__value">
                  {rules.relationships.length === 0 ? (
                    <span className="bible-subject-rules__absent">
                      {translate('bible.field.noneRecorded')}
                    </span>
                  ) : (
                    <ul className="bible-subject-rules__relationships">
                      {rules.relationships.map((relation) => (
                        <li key={relation.subjectId}>
                          <span className="bible-subject-rules__id" dir="ltr">
                            {relation.subjectId}
                          </span>{' '}
                          <ContentText>{relation.description}</ContentText>
                        </li>
                      ))}
                    </ul>
                  )}
                </dd>
              </div>
            </dl>
          </article>
        ))
      )}
    </section>
  );
};
