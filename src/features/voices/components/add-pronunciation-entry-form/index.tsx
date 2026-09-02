import type { FC, FormEvent } from 'react';
import { useState } from 'react';
import { useMutation, useQueryClient } from '@tanstack/react-query';
import { addPronunciationDictionaryEntryRequestSchema } from 'sky-filme-studio-be/contracts';
import { Button } from '@/lib/components/button';
import { ErrorState } from '@/lib/components/error-state';
import { Field } from '@/lib/components/field';
import { Input } from '@/lib/components/input';
import { ValidationSummary } from '@/lib/components/validation-summary';
import { fieldErrorsFromIssues } from '@/lib/helpers/field-errors-from-issues';
import { focusWhenShown } from '@/lib/helpers/focus-when-shown';
import { invalidFieldCount } from '@/lib/helpers/invalid-field-count';
import { resolveTextDirection } from '@/lib/i18n/helpers/resolve-text-direction';
import type { TranslationKey } from '@/lib/i18n/catalogue/en';
import { useTranslate } from '@/lib/i18n/use-translate';
import { composeRouteErrorDescription } from '@/shell/helpers/compose-route-error-description';
import { resolveRouteErrorView } from '@/shell/helpers/resolve-route-error-view';
import { addPronunciationEntryMutationOptions } from '@/features/voices/api/add-pronunciation-entry.mutation';
import type { AddPronunciationEntryFormProps } from './add-pronunciation-entry-form.interface';
import './add-pronunciation-entry-form.css';

const NOTATION_DIRECTION = 'ltr';

export const AddPronunciationEntryForm: FC<AddPronunciationEntryFormProps> = ({
  projectId,
  dictionaryId,
  language,
}) => {
  const translate = useTranslate();
  const queryClient = useQueryClient();
  const add = useMutation(
    addPronunciationEntryMutationOptions(projectId, dictionaryId, queryClient),
  );
  const [term, setTerm] = useState('');
  const [phonemeOverride, setPhonemeOverride] = useState('');
  const [fieldErrors, setFieldErrors] = useState<
    Record<string, TranslationKey>
  >({});
  const [attempt, setAttempt] = useState(0);

  const errorFor = (field: string): string => {
    const key = fieldErrors[field];

    return key === undefined ? '' : translate(key);
  };

  const handleSubmit = (event: FormEvent<HTMLFormElement>): void => {
    event.preventDefault();

    const trimmed = phonemeOverride.trim();
    const result = addPronunciationDictionaryEntryRequestSchema.safeParse({
      term,
      ...(trimmed === '' ? {} : { phonemeOverride: trimmed }),
    });

    if (!result.success) {
      setFieldErrors(fieldErrorsFromIssues(result.error));
      setAttempt((count) => count + 1);
      return;
    }

    setFieldErrors({});
    add.mutate(result.data, {
      onSuccess: () => {
        setTerm('');
        setPhonemeOverride('');
      },
    });
  };

  const failure = add.error === null ? null : resolveRouteErrorView(add.error);

  return (
    <form className="add-pronunciation-entry-form" onSubmit={handleSubmit}>
      <h5 className="add-pronunciation-entry-form__heading">
        {translate('voices.entries.add.heading')}
      </h5>

      {Object.keys(fieldErrors).length === 0 ? null : (
        <ValidationSummary
          count={invalidFieldCount(fieldErrors)}
          attempt={attempt}
        />
      )}

      <div className="add-pronunciation-entry-form__fields">
        <div
          className="add-pronunciation-entry-form__term"
          dir={resolveTextDirection(language)}
        >
          <Field
            label={translate('voices.entries.add.term')}
            hint={translate('voices.entries.add.term.hint')}
            required
            error={errorFor('term')}
          >
            <Input
              value={term}
              onChange={(event) => setTerm(event.target.value)}
            />
          </Field>
        </div>
        <div
          className="add-pronunciation-entry-form__notation"
          dir={NOTATION_DIRECTION}
        >
          <Field
            label={translate('voices.entries.add.phonemes')}
            hint={translate('voices.entries.add.phonemes.hint')}
            error={errorFor('phonemeOverride')}
          >
            <Input
              value={phonemeOverride}
              onChange={(event) => setPhonemeOverride(event.target.value)}
            />
          </Field>
        </div>
      </div>

      {add.isSuccess && term === '' ? (
        <output
          className="add-pronunciation-entry-form__done"
          ref={focusWhenShown}
          tabIndex={-1}
        >
          {translate('library.created')}
        </output>
      ) : null}

      {failure === null ? null : (
        <ErrorState
          title={translate('voices.entries.add.failed.title')}
          description={composeRouteErrorDescription(failure, translate)}
          detail={failure.detail}
          headingLevel={6}
        />
      )}

      <div className="add-pronunciation-entry-form__actions">
        <Button
          type="submit"
          variant="secondary"
          size="sm"
          disabled={add.isPending}
        >
          {translate(add.isPending ? 'library.creating' : 'voices.entries.add')}
        </Button>
      </div>
    </form>
  );
};
