import type { FC, FormEvent } from 'react';
import { useState } from 'react';
import { useMutation, useQueryClient } from '@tanstack/react-query';
import { importOpeningEndingAssetRequestSchema } from 'sky-filme-studio-be/contracts';
import { Button } from '@/lib/components/button';
import { ErrorState } from '@/lib/components/error-state';
import { Field } from '@/lib/components/field';
import { Input } from '@/lib/components/input';
import { Select } from '@/lib/components/select';
import { ValidationSummary } from '@/lib/components/validation-summary';
import { fieldErrorsFromIssues } from '@/lib/helpers/field-errors-from-issues';
import { focusWhenShown } from '@/lib/helpers/focus-when-shown';
import { invalidFieldCount } from '@/lib/helpers/invalid-field-count';
import type { TranslationKey } from '@/lib/i18n/catalogue/en';
import { useTranslate } from '@/lib/i18n/use-translate';
import { composeRouteErrorDescription } from '@/shell/helpers/compose-route-error-description';
import { resolveRouteErrorView } from '@/shell/helpers/resolve-route-error-view';
import { importOpeningEndingAssetMutationOptions } from '@/features/music/api/import-opening-ending-asset.mutation';
import type { ImportOpeningEndingFormProps } from './import-opening-ending-form.interface';
import './import-opening-ending-form.css';

const NO_LINEAGE = '';

export const ImportOpeningEndingForm: FC<ImportOpeningEndingFormProps> = ({
  projectId,
  lineages,
  onClose,
}) => {
  const translate = useTranslate();
  const queryClient = useQueryClient();
  const importAsset = useMutation(
    importOpeningEndingAssetMutationOptions(projectId, queryClient),
  );

  const [sourcePath, setSourcePath] = useState('');
  const [name, setName] = useState('');
  const [kind, setKind] = useState('');
  const [seasonLabel, setSeasonLabel] = useState('');
  const [lineageId, setLineageId] = useState(NO_LINEAGE);
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

    const trimmedSeason = seasonLabel.trim();
    const result = importOpeningEndingAssetRequestSchema.safeParse({
      sourcePath: sourcePath.trim(),
      name: name.trim(),
      kind: kind.trim(),
      ...(trimmedSeason === '' ? {} : { seasonLabel: trimmedSeason }),
      ...(lineageId === NO_LINEAGE ? {} : { lineageId }),
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
    <section className="import-opening-ending-form">
      <div className="import-opening-ending-form__header">
        <h3 className="import-opening-ending-form__heading">
          {translate('openingEnding.import.heading')}
        </h3>
        <Button type="button" variant="ghost" size="md" onClick={onClose}>
          {translate('library.cancel')}
        </Button>
      </div>

      {importAsset.isSuccess ? (
        <output
          className="import-opening-ending-form__done"
          ref={focusWhenShown}
          tabIndex={-1}
        >
          {translate('library.created')}
        </output>
      ) : (
        <form
          className="import-opening-ending-form__form"
          onSubmit={handleSubmit}
        >
          {Object.keys(fieldErrors).length === 0 ? null : (
            <ValidationSummary
              count={invalidFieldCount(fieldErrors)}
              attempt={attempt}
            />
          )}

          <Field
            label={translate('openingEnding.import.sourcePath')}
            hint={translate('openingEnding.import.sourcePath.hint')}
            required
            error={errorFor('sourcePath')}
          >
            <Input
              value={sourcePath}
              onChange={(event) => setSourcePath(event.target.value)}
            />
          </Field>

          <Field
            label={translate('openingEnding.import.name')}
            required
            error={errorFor('name')}
          >
            <Input
              value={name}
              onChange={(event) => setName(event.target.value)}
            />
          </Field>

          <Field
            label={translate('openingEnding.import.kind')}
            hint={translate('openingEnding.import.kind.hint')}
            required
            error={errorFor('kind')}
          >
            <Input
              value={kind}
              onChange={(event) => setKind(event.target.value)}
            />
          </Field>

          <Field
            label={translate('openingEnding.import.seasonLabel')}
            hint={translate('openingEnding.import.seasonLabel.hint')}
            error={errorFor('seasonLabel')}
          >
            <Input
              value={seasonLabel}
              onChange={(event) => setSeasonLabel(event.target.value)}
            />
          </Field>

          <Field
            label={translate('openingEnding.import.lineage')}
            hint={translate('openingEnding.import.lineage.hint')}
            error={errorFor('lineageId')}
          >
            <Select
              options={[
                {
                  value: NO_LINEAGE,
                  label: translate('openingEnding.import.lineage.none'),
                },
                ...lineages.map((lineage) => ({
                  value: lineage.lineageId,
                  label: lineage.name,
                })),
              ]}
              value={lineageId}
              onChange={setLineageId}
            />
          </Field>

          {failure === null ? null : (
            <ErrorState
              title={translate('openingEnding.import.failed.title')}
              description={composeRouteErrorDescription(failure, translate)}
              detail={failure.detail}
              headingLevel={4}
            />
          )}

          <div className="import-opening-ending-form__actions">
            <Button
              type="submit"
              variant="primary"
              size="md"
              disabled={importAsset.isPending}
            >
              {translate(
                importAsset.isPending
                  ? 'openingEnding.import.submitting'
                  : 'openingEnding.import.submit',
              )}
            </Button>
          </div>
        </form>
      )}
    </section>
  );
};
