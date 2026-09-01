import type { FC, FormEvent } from 'react';
import { useState } from 'react';
import { useMutation, useQueryClient } from '@tanstack/react-query';
import { createPropRequestSchema } from 'sky-filme-studio-be/contracts';
import { Button } from '@/lib/components/button';
import { Field } from '@/lib/components/field';
import { Input } from '@/lib/components/input';
import { Textarea } from '@/lib/components/textarea';
import { fieldErrorsFromIssues } from '@/lib/helpers/field-errors-from-issues';
import { focusWhenShown } from '@/lib/helpers/focus-when-shown';
import type { TranslationKey } from '@/lib/i18n/catalogue/en';
import { useTranslate } from '@/lib/i18n/use-translate';
import { composeRouteErrorDescription } from '@/shell/helpers/compose-route-error-description';
import { resolveRouteErrorView } from '@/shell/helpers/resolve-route-error-view';
import { createPropMutationOptions } from '@/features/props/api/create-prop.mutation';
import { parseLines } from '@/lib/helpers/parse-lines';
import type { CreatePropFormProps } from './create-prop-form.interface';
import './create-prop-form.css';

export const CreatePropForm: FC<CreatePropFormProps> = ({
  projectId,
  onClose,
}) => {
  const translate = useTranslate();
  const queryClient = useQueryClient();
  const create = useMutation(createPropMutationOptions(projectId, queryClient));

  const [name, setName] = useState('');
  const [canonicalDescription, setCanonicalDescription] = useState('');
  const [continuityRulesText, setContinuityRulesText] = useState('');
  const [fieldErrors, setFieldErrors] = useState<
    Record<string, TranslationKey>
  >({});

  const errorFor = (field: string): string => {
    const key = fieldErrors[field];

    return key === undefined ? '' : translate(key);
  };

  if (create.isSuccess) {
    return (
      <div className="create-prop-form">
        <output
          className="create-prop-form__done"
          ref={focusWhenShown}
          tabIndex={-1}
        >
          {translate('library.created')}
        </output>
        <div className="create-prop-form__actions">
          <Button type="button" variant="ghost" size="md" onClick={onClose}>
            {translate('library.cancel')}
          </Button>
        </div>
      </div>
    );
  }

  const handleSubmit = (event: FormEvent<HTMLFormElement>): void => {
    event.preventDefault();

    const candidate = {
      name,
      canonicalDescription,
      continuityRules: parseLines(continuityRulesText),
    };

    const result = createPropRequestSchema.safeParse(candidate);

    if (!result.success) {
      setFieldErrors(fieldErrorsFromIssues(result.error));
      return;
    }

    setFieldErrors({});
    create.mutate(result.data);
  };

  const failure =
    create.error === null ? null : resolveRouteErrorView(create.error);

  return (
    <form className="create-prop-form" onSubmit={handleSubmit}>
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

      {failure === null ? null : (
        <p className="create-prop-form__refusal" role="alert">
          {composeRouteErrorDescription(failure, translate)}
        </p>
      )}

      <div className="create-prop-form__actions">
        <Button type="button" variant="ghost" size="md" onClick={onClose}>
          {translate('library.cancel')}
        </Button>
        <Button
          type="submit"
          variant="primary"
          size="md"
          disabled={create.isPending}
        >
          {translate(create.isPending ? 'library.creating' : 'library.add')}
        </Button>
      </div>
    </form>
  );
};
