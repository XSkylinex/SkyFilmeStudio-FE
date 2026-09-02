import type { FC, FormEvent } from 'react';
import { useState } from 'react';
import { useMutation, useQueryClient } from '@tanstack/react-query';
import {
  ORIGIN,
  importSfxAssetRequestSchema,
  originSchema,
} from 'sky-filme-studio-be/contracts';
import type { Origin } from 'sky-filme-studio-be/contracts';
import { Button } from '@/lib/components/button';
import { ErrorState } from '@/lib/components/error-state';
import { Field } from '@/lib/components/field';
import { Input } from '@/lib/components/input';
import { Select } from '@/lib/components/select';
import { Textarea } from '@/lib/components/textarea';
import { ValidationSummary } from '@/lib/components/validation-summary';
import { fieldErrorsFromIssues } from '@/lib/helpers/field-errors-from-issues';
import { focusWhenShown } from '@/lib/helpers/focus-when-shown';
import { invalidFieldCount } from '@/lib/helpers/invalid-field-count';
import { parseLines } from '@/lib/helpers/parse-lines';
import type { TranslationKey } from '@/lib/i18n/catalogue/en';
import { ORIGIN_LABEL_KEY } from '@/lib/i18n/origin-label.constants';
import { useTranslate } from '@/lib/i18n/use-translate';
import { composeRouteErrorDescription } from '@/shell/helpers/compose-route-error-description';
import { resolveRouteErrorView } from '@/shell/helpers/resolve-route-error-view';
import { importSfxAssetMutationOptions } from '@/features/sfx/api/import-sfx-asset.mutation';
import type { ImportSfxAssetFormProps } from './import-sfx-asset-form.interface';
import './import-sfx-asset-form.css';

export const ImportSfxAssetForm: FC<ImportSfxAssetFormProps> = ({
  onClose,
}) => {
  const translate = useTranslate();
  const queryClient = useQueryClient();
  const importAsset = useMutation(importSfxAssetMutationOptions(queryClient));

  const [sourcePath, setSourcePath] = useState('');
  const [name, setName] = useState('');
  const [category, setCategory] = useState('');
  const [tags, setTags] = useState('');
  const [origin, setOrigin] = useState<Origin>(ORIGIN.IMPORTED);
  const [licence, setLicence] = useState('');
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

    const parsedTags = parseLines(tags);
    const trimmedLicence = licence.trim();
    const result = importSfxAssetRequestSchema.safeParse({
      sourcePath: sourcePath.trim(),
      name: name.trim(),
      category: category.trim(),
      origin,
      ...(parsedTags.length === 0 ? {} : { tags: parsedTags }),
      ...(trimmedLicence === '' ? {} : { licence: trimmedLicence }),
    });

    if (!result.success) {
      setFieldErrors(fieldErrorsFromIssues(result.error));
      setAttempt((count) => count + 1);
      return;
    }

    setFieldErrors({});
    importAsset.mutate(result.data);
  };

  const failure =
    importAsset.error === null
      ? null
      : resolveRouteErrorView(importAsset.error);

  return (
    <section className="import-sfx-asset-form">
      <div className="import-sfx-asset-form__header">
        <h3 className="import-sfx-asset-form__heading">
          {translate('sfx.import.heading')}
        </h3>
        <Button type="button" variant="ghost" size="md" onClick={onClose}>
          {translate('library.cancel')}
        </Button>
      </div>

      {importAsset.isSuccess ? (
        <output
          className="import-sfx-asset-form__done"
          ref={focusWhenShown}
          tabIndex={-1}
        >
          {translate('library.created')}
        </output>
      ) : (
        <form className="import-sfx-asset-form__form" onSubmit={handleSubmit}>
          {Object.keys(fieldErrors).length === 0 ? null : (
            <ValidationSummary
              count={invalidFieldCount(fieldErrors)}
              attempt={attempt}
            />
          )}

          <Field
            label={translate('sfx.import.sourcePath')}
            hint={translate('sfx.import.sourcePath.hint')}
            required
            error={errorFor('sourcePath')}
          >
            <Input
              value={sourcePath}
              onChange={(event) => setSourcePath(event.target.value)}
            />
          </Field>

          <Field
            label={translate('sfx.import.name')}
            required
            error={errorFor('name')}
          >
            <Input
              value={name}
              onChange={(event) => setName(event.target.value)}
            />
          </Field>

          <Field
            label={translate('sfx.import.category')}
            hint={translate('sfx.import.category.hint')}
            required
            error={errorFor('category')}
          >
            <Input
              value={category}
              onChange={(event) => setCategory(event.target.value)}
            />
          </Field>

          <Field
            label={translate('sfx.import.tags')}
            hint={translate('sfx.import.tags.hint')}
            error={errorFor('tags')}
          >
            <Textarea
              value={tags}
              onChange={(event) => setTags(event.target.value)}
            />
          </Field>

          <Field
            label={translate('sfx.import.origin')}
            error={errorFor('origin')}
          >
            <Select
              options={originSchema.options.map((value) => ({
                value,
                label: translate(ORIGIN_LABEL_KEY[value]),
              }))}
              value={origin}
              onChange={(value) => setOrigin(originSchema.parse(value))}
            />
          </Field>

          <Field
            label={translate('sfx.import.licence')}
            hint={translate('sfx.import.licence.hint')}
            required={origin === ORIGIN.IMPORTED}
            error={errorFor('licence')}
          >
            <Input
              value={licence}
              onChange={(event) => setLicence(event.target.value)}
            />
          </Field>

          {failure === null ? null : (
            <ErrorState
              title={translate('sfx.import.failed.title')}
              description={composeRouteErrorDescription(failure, translate)}
              detail={failure.detail}
              headingLevel={4}
            />
          )}

          <div className="import-sfx-asset-form__actions">
            <Button
              type="submit"
              variant="primary"
              size="md"
              disabled={importAsset.isPending}
            >
              {translate(
                importAsset.isPending
                  ? 'sfx.import.submitting'
                  : 'sfx.import.submit',
              )}
            </Button>
          </div>
        </form>
      )}
    </section>
  );
};
