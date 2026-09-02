import type { FC, FormEvent } from 'react';
import { useState } from 'react';
import { useMutation, useQuery, useQueryClient } from '@tanstack/react-query';
import {
  SUGGESTED_PLATE_KINDS,
  createLocationPlateRequestSchema,
  updateLocationPlateRequestSchema,
} from 'sky-filme-studio-be/contracts';
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
import { projectAssetsQueryOptions } from '@/features/assets/api/project-assets.query';
import { createLocationPlateMutationOptions } from '@/features/locations/api/create-location-plate.mutation';
import { updateLocationPlateMutationOptions } from '@/features/locations/api/update-location-plate.mutation';
import {
  ANCHOR_KIND,
  plateEditValuesFrom,
  plateUpdateFrom,
} from '@/features/locations/helpers/plate-anchor';
import type { PlateEditValues } from '@/features/locations/interfaces/plate-anchor';
import type { PlateFormProps } from './plate-form.interface';
import './plate-form.css';

const EMPTY_VALUES: PlateEditValues = {
  kind: '',
  anchorKind: ANCHOR_KIND.SOURCE_ASSET,
  sourceAssetId: '',
  artifactId: '',
};

export const PlateForm: FC<PlateFormProps> = ({
  projectId,
  locationId,
  plate,
  onClose,
}) => {
  const translate = useTranslate();
  const queryClient = useQueryClient();
  const assets = useQuery(projectAssetsQueryOptions(projectId));
  const create = useMutation(
    createLocationPlateMutationOptions(projectId, locationId, queryClient),
  );
  const update = useMutation(
    updateLocationPlateMutationOptions(projectId, locationId, queryClient),
  );

  const [values, setValues] = useState<PlateEditValues>(
    plate === undefined ? EMPTY_VALUES : plateEditValuesFrom(plate),
  );
  const [fieldErrors, setFieldErrors] = useState<
    Record<string, TranslationKey>
  >({});
  const [attempt, setAttempt] = useState(0);

  const mutation = plate === undefined ? create : update;

  const set = <K extends keyof PlateEditValues>(
    field: K,
    value: PlateEditValues[K],
  ): void => {
    setValues((previous) => ({ ...previous, [field]: value }));
  };

  const errorFor = (field: string): string => {
    const key = fieldErrors[field];

    return key === undefined ? '' : translate(key);
  };

  const handleSubmit = (event: FormEvent<HTMLFormElement>): void => {
    event.preventDefault();

    if (plate === undefined) {
      const anchored =
        values.anchorKind === ANCHOR_KIND.SOURCE_ASSET
          ? { sourceAssetId: values.sourceAssetId }
          : { artifactId: values.artifactId };
      const result = createLocationPlateRequestSchema.safeParse({
        kind: values.kind.trim(),
        ...anchored,
      });

      if (!result.success) {
        setFieldErrors(fieldErrorsFromIssues(result.error));
        setAttempt((count) => count + 1);
        return;
      }

      setFieldErrors({});
      create.mutate(result.data);
      return;
    }

    const result = updateLocationPlateRequestSchema.safeParse(
      plateUpdateFrom(plate, { ...values, kind: values.kind.trim() }),
    );

    if (!result.success) {
      setFieldErrors(fieldErrorsFromIssues(result.error));
      setAttempt((count) => count + 1);
      return;
    }

    setFieldErrors({});
    update.mutate({ plateId: plate.id, request: result.data });
  };

  const failure =
    mutation.error === null ? null : resolveRouteErrorView(mutation.error);
  const assetOptions = [
    {
      value: '',
      label: translate('plates.field.sourceAsset.none'),
    },
    ...(assets.data?.items ?? []).map((asset) => ({
      value: asset.id,
      label: asset.path,
    })),
  ];

  return (
    <section className="plate-form">
      <h4 className="plate-form__heading">
        {translate(
          plate === undefined ? 'plates.add.heading' : 'plates.edit.heading',
        )}
      </h4>

      {mutation.isSuccess ? (
        <output className="plate-form__done" ref={focusWhenShown} tabIndex={-1}>
          {translate(plate === undefined ? 'library.created' : 'library.saved')}
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
            label={translate('plates.field.kind')}
            hint={`${translate('plates.field.kind.hint')} ${SUGGESTED_PLATE_KINDS.join(', ')}`}
            required
            error={errorFor('kind')}
          >
            <Input
              value={values.kind}
              onChange={(event) => set('kind', event.target.value)}
            />
          </Field>

          <Field
            label={translate('plates.field.anchor')}
            hint={translate('plates.field.anchor.hint')}
          >
            <Select
              options={[
                {
                  value: ANCHOR_KIND.SOURCE_ASSET,
                  label: translate('plates.anchor.SOURCE_ASSET'),
                },
                {
                  value: ANCHOR_KIND.ARTIFACT,
                  label: translate('plates.anchor.ARTIFACT'),
                },
              ]}
              value={values.anchorKind}
              onChange={(value) =>
                set(
                  'anchorKind',
                  value === ANCHOR_KIND.ARTIFACT
                    ? ANCHOR_KIND.ARTIFACT
                    : ANCHOR_KIND.SOURCE_ASSET,
                )
              }
            />
          </Field>

          {values.anchorKind === ANCHOR_KIND.SOURCE_ASSET ? (
            assets.error && assets.data === undefined ? (
              <p className="plate-form__note">
                {translate('plates.field.sourceAsset.unreadable')}
              </p>
            ) : (
              <Field
                label={translate('plates.field.sourceAsset')}
                required
                error={errorFor('sourceAssetId')}
              >
                <Select
                  options={assetOptions}
                  value={values.sourceAssetId}
                  onChange={(value) => set('sourceAssetId', value)}
                />
              </Field>
            )
          ) : (
            <Field
              label={translate('plates.field.artifactId')}
              hint={translate('plates.field.artifactId.hint')}
              required
              error={errorFor('artifactId')}
            >
              <Input
                value={values.artifactId}
                onChange={(event) => set('artifactId', event.target.value)}
              />
            </Field>
          )}

          {failure === null ? null : (
            <ErrorState
              title={translate(
                plate === undefined
                  ? 'plates.create.failed.title'
                  : 'plates.edit.failed.title',
              )}
              description={composeRouteErrorDescription(failure, translate)}
              detail={failure.detail}
              headingLevel={5}
            />
          )}

          <div className="plate-form__actions">
            <Button type="button" variant="ghost" size="sm" onClick={onClose}>
              {translate('library.cancel')}
            </Button>
            <Button
              type="submit"
              variant="primary"
              size="sm"
              disabled={mutation.isPending}
            >
              {translate(plate === undefined ? 'library.add' : 'library.save')}
            </Button>
          </div>
        </form>
      )}
    </section>
  );
};
