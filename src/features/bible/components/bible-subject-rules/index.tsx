import type { FC, ReactNode } from 'react';
import { useQuery } from '@tanstack/react-query';
import type { Subject, SubjectId } from 'sky-filme-studio-be/contracts';
import { ContentText } from '@/lib/components/content-text';
import { useTranslate } from '@/lib/i18n/use-translate';
import { BibleField } from '@/features/bible/components/bible-field';
import { BibleRuleList } from '@/features/bible/components/bible-rule-list';
import { projectSubjectsQueryOptions } from '@/features/subjects/api/project-subjects.query';
import type { BibleSubjectRulesProps } from './bible-subject-rules.interface';
import './bible-subject-rules.css';

const subjectName = (subject: Subject | undefined, id: SubjectId): ReactNode =>
  subject === undefined ? (
    <span className="bible-subject-rules__id" dir="ltr">
      {id}
    </span>
  ) : (
    <ContentText>{subject.displayName}</ContentText>
  );

export const BibleSubjectRulesSection: FC<BibleSubjectRulesProps> = ({
  projectId,
  subjectRules,
}) => {
  const translate = useTranslate();
  const subjects = useQuery(projectSubjectsQueryOptions(projectId));
  const listed = subjects.data?.items ?? [];
  const listIsComplete =
    subjects.data !== undefined && subjects.data.nextCursor === undefined;
  const subjectFor = (id: SubjectId): Subject | undefined =>
    listed.find((candidate) => candidate.id === id);

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
        subjectRules.map((rules) => {
          const subject = subjectFor(rules.subjectId);

          return (
            <article
              className="bible-subject-rules__entry"
              key={rules.subjectId}
            >
              <h3 className="bible-subject-rules__subject">
                {subjectName(subject, rules.subjectId)}
              </h3>
              {listIsComplete && subject === undefined ? (
                <p className="bible-subject-rules__absent">
                  {translate('bible.subjects.unknown')}
                </p>
              ) : null}
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
                            {subjectName(
                              subjectFor(relation.subjectId),
                              relation.subjectId,
                            )}{' '}
                            <ContentText>{relation.description}</ContentText>
                          </li>
                        ))}
                      </ul>
                    )}
                  </dd>
                </div>
              </dl>
            </article>
          );
        })
      )}
    </section>
  );
};
