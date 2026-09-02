import type { FC } from 'react';
import { useQuery } from '@tanstack/react-query';
import { Button } from '@/lib/components/button';
import { Field } from '@/lib/components/field';
import { Input } from '@/lib/components/input';
import { Select } from '@/lib/components/select';
import { Textarea } from '@/lib/components/textarea';
import type { TranslationKey } from '@/lib/i18n/catalogue/en';
import { useTranslate } from '@/lib/i18n/use-translate';
import { EMPTY_SUBJECT_RULES_VALUES } from '@/features/bible/helpers/subject-rules-values';
import type {
  SubjectRulesListField,
  SubjectRulesValues,
} from '@/features/bible/interfaces/subject-rules-values';
import { projectSubjectsQueryOptions } from '@/features/subjects/api/project-subjects.query';
import type { BibleSubjectRulesEditorProps } from './bible-subject-rules-editor.interface';
import './bible-subject-rules-editor.css';

const NO_SUBJECT = '';

const LIST_FIELDS: ReadonlyArray<[SubjectRulesListField, TranslationKey]> = [
  ['immutableVisualTraits', 'bible.subjects.immutableVisualTraits'],
  ['allowedVariations', 'bible.subjects.allowedVariations'],
  ['prohibitedChanges', 'bible.subjects.prohibitedChanges'],
  ['scaleRelationships', 'bible.subjects.scaleRelationships'],
  ['wardrobeVariants', 'bible.subjects.wardrobeVariants'],
  ['voiceRules', 'bible.subjects.voiceRules'],
];

export const BibleSubjectRulesEditor: FC<BibleSubjectRulesEditorProps> = ({
  projectId,
  value,
  onChange,
  errorFor,
}) => {
  const translate = useTranslate();
  const subjects = useQuery(projectSubjectsQueryOptions(projectId));

  const subjectOptions = [
    { value: NO_SUBJECT, label: translate('bible.subjects.editor.choose') },
    ...(subjects.data?.items ?? []).map((subject) => ({
      value: subject.id,
      label: subject.displayName,
    })),
  ];

  const replaceAt = (
    index: number,
    next: Partial<SubjectRulesValues>,
  ): void => {
    onChange(
      value.map((entry, at) => (at === index ? { ...entry, ...next } : entry)),
    );
  };

  return (
    <fieldset className="bible-subject-rules-editor">
      <legend className="bible-subject-rules-editor__legend">
        {translate('bible.subjects.title')}
      </legend>
      <p className="bible-subject-rules-editor__note">
        {translate('bible.subjects.editor.explained')}
      </p>

      {subjects.error && subjects.data === undefined ? (
        <p className="bible-subject-rules-editor__note">
          {translate('bible.subjects.editor.unreadable')}
        </p>
      ) : null}
      {subjects.data?.nextCursor === undefined ? null : (
        <p className="bible-subject-rules-editor__note">
          {translate('bible.subjects.editor.firstPageOnly')}
        </p>
      )}

      {value.map((entry, index) => {
        const prefix = `subjectRules.${String(index)}`;
        const position = String(index + 1);

        return (
          <fieldset key={index} className="bible-subject-rules-editor__entry">
            <legend className="bible-subject-rules-editor__entry-legend">
              {translate('bible.subjects.editor.entry', { position })}
            </legend>
            <Field
              label={translate('bible.subjects.editor.subject')}
              required
              error={errorFor(`${prefix}.subjectId`)}
            >
              <Select
                options={subjectOptions}
                value={entry.subjectId}
                onChange={(subjectId) => replaceAt(index, { subjectId })}
              />
            </Field>

            <Field label={translate('bible.subjects.speaks')}>
              <Select
                options={[
                  {
                    value: 'false',
                    label: translate('bible.subjects.speaks.no'),
                  },
                  {
                    value: 'true',
                    label: translate('bible.subjects.speaks.yes'),
                  },
                ]}
                value={entry.speaks ? 'true' : 'false'}
                onChange={(speaks) =>
                  replaceAt(index, { speaks: speaks === 'true' })
                }
              />
            </Field>

            <Field
              label={translate('bible.subjects.behaviourAndPersonality')}
              error={errorFor(`${prefix}.behaviourAndPersonality`)}
            >
              <Input
                value={entry.behaviourAndPersonality}
                onChange={(event) =>
                  replaceAt(index, {
                    behaviourAndPersonality: event.target.value,
                  })
                }
              />
            </Field>

            {LIST_FIELDS.map(([field, label]) => (
              <Field
                key={field}
                label={translate(label)}
                hint={
                  field === 'voiceRules' && !entry.speaks
                    ? translate('bible.subjects.voiceRules.notApplicable')
                    : translate('library.field.linesHint')
                }
                error={errorFor(`${prefix}.${field}`)}
              >
                <Textarea
                  value={entry[field]}
                  onChange={(event) =>
                    replaceAt(index, { [field]: event.target.value })
                  }
                />
              </Field>
            ))}

            <div className="bible-subject-rules-editor__relationships">
              <p className="bible-subject-rules-editor__subheading">
                {translate('bible.subjects.relationships')}
              </p>
              {entry.relationships.map((relationship, at) => (
                <div
                  key={at}
                  className="bible-subject-rules-editor__relationship"
                >
                  <Field
                    label={translate('bible.subjects.editor.relationship.with')}
                    error={errorFor(
                      `${prefix}.relationships.${String(at)}.subjectId`,
                    )}
                  >
                    <Select
                      options={subjectOptions}
                      value={relationship.subjectId}
                      onChange={(subjectId) =>
                        replaceAt(index, {
                          relationships: entry.relationships.map((item, i) =>
                            i === at ? { ...item, subjectId } : item,
                          ),
                        })
                      }
                    />
                  </Field>
                  <Field
                    label={translate(
                      'bible.subjects.editor.relationship.description',
                    )}
                    error={errorFor(
                      `${prefix}.relationships.${String(at)}.description`,
                    )}
                  >
                    <Input
                      value={relationship.description}
                      onChange={(event) =>
                        replaceAt(index, {
                          relationships: entry.relationships.map((item, i) =>
                            i === at
                              ? { ...item, description: event.target.value }
                              : item,
                          ),
                        })
                      }
                    />
                  </Field>
                  <Button
                    type="button"
                    variant="ghost"
                    size="sm"
                    aria-label={translate(
                      'bible.subjects.editor.relationship.removeContext',
                      { position: String(at + 1), entry: position },
                    )}
                    onClick={() =>
                      replaceAt(index, {
                        relationships: entry.relationships.filter(
                          (_item, i) => i !== at,
                        ),
                      })
                    }
                  >
                    {translate('bible.subjects.editor.relationship.remove')}
                  </Button>
                </div>
              ))}
              <Button
                type="button"
                variant="secondary"
                size="sm"
                aria-label={translate(
                  'bible.subjects.editor.relationship.addContext',
                  { entry: position },
                )}
                onClick={() =>
                  replaceAt(index, {
                    relationships: [
                      ...entry.relationships,
                      { subjectId: NO_SUBJECT, description: '' },
                    ],
                  })
                }
              >
                {translate('bible.subjects.editor.relationship.add')}
              </Button>
            </div>

            <Button
              type="button"
              variant="danger"
              size="sm"
              aria-label={translate('bible.subjects.editor.removeContext', {
                position,
              })}
              onClick={() =>
                onChange(value.filter((_entry, at) => at !== index))
              }
            >
              {translate('bible.subjects.editor.remove')}
            </Button>
          </fieldset>
        );
      })}

      <Button
        type="button"
        variant="secondary"
        size="sm"
        onClick={() => onChange([...value, EMPTY_SUBJECT_RULES_VALUES])}
      >
        {translate('bible.subjects.editor.add')}
      </Button>
    </fieldset>
  );
};
