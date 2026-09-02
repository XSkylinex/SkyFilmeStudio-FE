import type { FC, FormEvent } from 'react';
import { useState } from 'react';
import { useMutation, useQueryClient } from '@tanstack/react-query';
import { createPronunciationDictionaryRequestSchema } from 'sky-filme-studio-be/contracts';
import { Button } from '@/lib/components/button';
import { ErrorState } from '@/lib/components/error-state';
import { Field } from '@/lib/components/field';
import { Input } from '@/lib/components/input';
import { ValidationSummary } from '@/lib/components/validation-summary';
import { fieldErrorsFromIssues } from '@/lib/helpers/field-errors-from-issues';
import { focusWhenShown } from '@/lib/helpers/focus-when-shown';
import { invalidFieldCount } from '@/lib/helpers/invalid-field-count';
import type { TranslationKey } from '@/lib/i18n/catalogue/en';
import { useTranslate } from '@/lib/i18n/use-translate';
import { composeRouteErrorDescription } from '@/shell/helpers/compose-route-error-description';
import { resolveRouteErrorView } from '@/shell/helpers/resolve-route-error-view';
import { createPronunciationDictionaryMutationOptions } from '@/features/voices/api/create-pronunciation-dictionary.mutation';
import type { CreatePronunciationDictionaryFormProps } from './create-pronunciation-dictionary-form.interface';
import './create-pronunciation-dictionary-form.css';

export const CreatePronunciationDictionaryForm: FC<
  CreatePronunciationDictionaryFormProps
> = ({ projectId, onClose }) => {
  const translate = useTranslate();
  const queryClient = useQueryClient();
  const create = useMutation(
    createPronunciationDictionaryMutationOptions(projectId, queryClient),
  );
  const [language, setLanguage] = useState('');
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

    const result = createPronunciationDictionaryRequestSchema.safeParse({
      language,
    });

    if (!result.success) {
      setFieldErrors(fieldErrorsFromIssues(result.error));
      setAttempt((count) => count + 1);
      return;
    }

    setFieldErrors({});
    create.mutate(result.data);
  };

  const failure =
    create.error === null ? null : resolveRouteErrorView(create.error);

  return (
    <section className="create-pronunciation-dictionary-form">
      <h4 className="create-pronunciation-dictionary-form__heading">
        {translate('voices.dictionaries.add.heading')}
      </h4>

      {create.isSuccess ? (
        <output
          className="create-pronunciation-dictionary-form__done"
          ref={focusWhenShown}
          tabIndex={-1}
        >
          {translate('library.created')}
        </output>
      ) : (
        <form onSubmit={handleSubmit}>
          {Object.keys(fieldErrors).length === 0 ? null : (
            <ValidationSummary
              count={invalidFieldCount(fieldErrors)}
              attempt={attempt}
            />
          )}

          <Field
            label={translate('library.field.language')}
            hint={translate('voices.dictionaries.add.language.hint')}
            required
            error={errorFor('language')}
          >
            <Input
              value={language}
              onChange={(event) => setLanguage(event.target.value)}
            />
          </Field>

          {failure === null ? null : (
            <ErrorState
              title={translate('voices.dictionaries.add.failed.title')}
              description={composeRouteErrorDescription(failure, translate)}
              detail={failure.detail}
              headingLevel={5}
            />
          )}

          <div className="create-pronunciation-dictionary-form__actions">
            <Button type="button" variant="ghost" size="sm" onClick={onClose}>
              {translate('library.cancel')}
            </Button>
            <Button
              type="submit"
              variant="primary"
              size="sm"
              disabled={create.isPending}
            >
              {translate(create.isPending ? 'library.creating' : 'library.add')}
            </Button>
          </div>
        </form>
      )}
    </section>
  );
};
