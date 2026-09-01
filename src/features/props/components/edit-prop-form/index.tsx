import type { FC, FormEvent } from 'react';
import { useState } from 'react';
import { useMutation, useQueryClient } from '@tanstack/react-query';
import { updatePropRequestSchema } from 'sky-filme-studio-be/contracts';
import { Button } from '@/lib/components/button';
import { Field } from '@/lib/components/field';
import { Input } from '@/lib/components/input';
import { Textarea } from '@/lib/components/textarea';
import { ValidationSummary } from '@/lib/components/validation-summary';
import { fieldErrorsFromIssues } from '@/lib/helpers/field-errors-from-issues';
import { focusWhenShown } from '@/lib/helpers/focus-when-shown';
import type { TranslationKey } from '@/lib/i18n/catalogue/en';
import { useTranslate } from '@/lib/i18n/use-translate';
import { composeRouteErrorDescription } from '@/shell/helpers/compose-route-error-description';
import { resolveRouteErrorView } from '@/shell/helpers/resolve-route-error-view';
import { updatePropMutationOptions } from '@/features/props/api/update-prop.mutation';
import { propEditDiff } from '@/features/props/helpers/prop-edit-diff';
import { parseLines } from '@/lib/helpers/parse-lines';
import type { EditPropFormProps } from './edit-prop-form.interface';
import './edit-prop-form.css';

export const EditPropForm: FC<EditPropFormProps> = ({
  projectId,
  prop,
  onClose,
}) => {
  const translate = useTranslate();
  const queryClient = useQueryClient();
  const update = useMutation(
    updatePropMutationOptions(projectId, prop.id, queryClient),
  );

  const [name, setName] = useState(prop.name);
  const [canonicalDescription, setCanonicalDescription] = useState(
    prop.canonicalDescription,
  );
  const [continuityRulesText, setContinuityRulesText] = useState(
    prop.continuityRules.join('\n'),
  );
  const [fieldErrors, setFieldErrors] = useState<
    Record<string, TranslationKey>
  >({});
  const [attempt, setAttempt] = useState(0);

  const errorFor = (field: string): string => {
    const key = fieldErrors[field];

    return key === undefined ? '' : translate(key);
  };

  const baseline = update.data ?? prop;
  const patch = propEditDiff(baseline, {
    name,
    canonicalDescription,
    continuityRules: parseLines(continuityRulesText),
  });
  const hasChanges = Object.keys(patch).length > 0;
  const justSaved = update.isSuccess && !hasChanges;

  const handleSubmit = (event: FormEvent<HTMLFormElement>): void => {
    event.preventDefault();

    if (!hasChanges) {
      return;
    }

    const result = updatePropRequestSchema.safeParse(patch);

    if (!result.success) {
      setFieldErrors(fieldErrorsFromIssues(result.error));
      setAttempt((count) => count + 1);
      return;
    }

    setFieldErrors({});
    update.mutate(result.data);
  };

  const failure =
    update.error === null ? null : resolveRouteErrorView(update.error);

  return (
    <form className="edit-prop-form" onSubmit={handleSubmit}>
      {Object.keys(fieldErrors).length === 0 ? null : (
        <ValidationSummary
          count={Object.keys(fieldErrors).length}
          attempt={attempt}
        />
      )}

      <Field label={translate('library.field.name')} error={errorFor('name')}>
        <Input value={name} onChange={(event) => setName(event.target.value)} />
      </Field>

      <Field
        label={translate('library.field.description')}
        error={errorFor('canonicalDescription')}
      >
        <Textarea
          value={canonicalDescription}
          onChange={(event) => setCanonicalDescription(event.target.value)}
        />
      </Field>

      <Field
        label={translate('library.field.continuityRules')}
        hint={translate('library.field.linesHint')}
        error={errorFor('continuityRules')}
      >
        <Textarea
          value={continuityRulesText}
          onChange={(event) => setContinuityRulesText(event.target.value)}
        />
      </Field>

      {justSaved ? (
        <output
          className="edit-prop-form__done"
          ref={focusWhenShown}
          tabIndex={-1}
        >
          {translate('library.saved')}
        </output>
      ) : null}

      {failure === null ? null : (
        <p className="edit-prop-form__refusal" role="alert">
          {composeRouteErrorDescription(failure, translate)}
        </p>
      )}

      <div className="edit-prop-form__actions">
        <Button type="button" variant="ghost" size="md" onClick={onClose}>
          {translate('library.cancel')}
        </Button>
        <Button
          type="submit"
          variant="primary"
          size="md"
          disabled={update.isPending || !hasChanges}
        >
          {translate(update.isPending ? 'library.saving' : 'library.save')}
        </Button>
      </div>
    </form>
  );
};
