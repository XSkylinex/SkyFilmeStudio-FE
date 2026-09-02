import type { FC, FormEvent } from 'react';
import { useState } from 'react';
import { useMutation, useQuery, useQueryClient } from '@tanstack/react-query';
import { scoreProductionRequestSchema } from 'sky-filme-studio-be/contracts';
import { Button } from '@/lib/components/button';
import { ErrorState } from '@/lib/components/error-state';
import { Field } from '@/lib/components/field';
import { Input } from '@/lib/components/input';
import { ValidationSummary } from '@/lib/components/validation-summary';
import { fieldErrorsFromIssues } from '@/lib/helpers/field-errors-from-issues';
import { invalidFieldCount } from '@/lib/helpers/invalid-field-count';
import type { TranslationKey } from '@/lib/i18n/catalogue/en';
import { useTranslate } from '@/lib/i18n/use-translate';
import { composeRouteErrorDescription } from '@/shell/helpers/compose-route-error-description';
import { resolveRouteErrorView } from '@/shell/helpers/resolve-route-error-view';
import { productionScoreQueryOptions } from '@/features/audio/api/production-score.query';
import { scoreProductionMutationOptions } from '@/features/audio/api/score-production.mutation';
import type { ProductionScoreProps } from './production-score.interface';
import './production-score.css';

export const ProductionScore: FC<ProductionScoreProps> = ({ productionId }) => {
  const translate = useTranslate();
  const queryClient = useQueryClient();
  const score = useQuery(productionScoreQueryOptions(productionId));
  const run = useMutation(
    scoreProductionMutationOptions(productionId, queryClient),
  );

  const [brief, setBrief] = useState('');
  const [variety, setVariety] = useState('');
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

    const trimmedBrief = brief.trim();
    const result = scoreProductionRequestSchema.safeParse({
      ...(trimmedBrief === '' ? {} : { brief: trimmedBrief }),
      ...(variety.trim() === ''
        ? {}
        : { musicCueVarietyMaxProportion: Number(variety) }),
    });

    if (!result.success) {
      setFieldErrors(fieldErrorsFromIssues(result.error));
      setAttempt((count) => count + 1);
      return;
    }

    setFieldErrors({});
    run.mutate(result.data);
  };

  const failure = run.error === null ? null : resolveRouteErrorView(run.error);

  return (
    <section className="production-score">
      <div className="production-score__header">
        <h2 className="production-score__title">
          {translate('audio.score.heading')}
        </h2>
      </div>
      <p className="production-score__note">
        {translate('audio.score.explain')}
      </p>

      <form onSubmit={handleSubmit}>
        {Object.keys(fieldErrors).length === 0 ? null : (
          <ValidationSummary
            count={invalidFieldCount(fieldErrors)}
            attempt={attempt}
          />
        )}

        <div className="production-score__fields">
          <Field
            label={translate('audio.score.brief')}
            hint={translate('audio.score.brief.hint')}
            error={errorFor('brief')}
          >
            <Input
              value={brief}
              onChange={(event) => setBrief(event.target.value)}
            />
          </Field>
          <Field
            label={translate('audio.score.variety')}
            hint={translate('audio.score.variety.hint')}
            error={errorFor('musicCueVarietyMaxProportion')}
          >
            <Input
              type="number"
              value={variety}
              onChange={(event) => setVariety(event.target.value)}
            />
          </Field>
          <Button
            type="submit"
            variant="primary"
            size="md"
            disabled={run.isPending}
          >
            {translate(
              run.isPending ? 'audio.score.running' : 'audio.score.run',
            )}
          </Button>
        </div>
      </form>

      {failure === null ? null : (
        <ErrorState
          title={translate('audio.score.failed.title')}
          description={composeRouteErrorDescription(failure, translate)}
          detail={failure.detail}
          headingLevel={3}
        />
      )}

      {score.error && score.data === undefined ? (
        <p className="production-score__note">
          {translate('audio.score.unreadable')}
        </p>
      ) : null}

      {score.data === undefined ? null : score.data.length === 0 ? (
        <p className="production-score__note">
          {translate('audio.score.none')}
        </p>
      ) : (
        <p className="production-score__note">
          {translate('audio.score.assigned', {
            count: String(score.data.length),
          })}
        </p>
      )}
    </section>
  );
};
