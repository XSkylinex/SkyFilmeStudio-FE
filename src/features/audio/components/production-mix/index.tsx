import type { FC } from 'react';
import { useMutation, useQuery, useQueryClient } from '@tanstack/react-query';
import { Button } from '@/lib/components/button';
import { ErrorState } from '@/lib/components/error-state';
import { formatDateTime } from '@/lib/format/format-date-time';
import { formatMilliseconds } from '@/lib/format/format-milliseconds';
import { useTranslate } from '@/lib/i18n/use-translate';
import { useAppSelector } from '@/shell/store/hooks';
import { selectInterfaceLanguage } from '@/shell/shell.slice';
import { composeRouteErrorDescription } from '@/shell/helpers/compose-route-error-description';
import { resolveRouteErrorView } from '@/shell/helpers/resolve-route-error-view';
import { productionMixesQueryOptions } from '@/features/audio/api/production-mixes.query';
import { submitProductionMixMutationOptions } from '@/features/audio/api/submit-production-mix.mutation';
import type { ProductionMixProps } from './production-mix.interface';
import './production-mix.css';

export const ProductionMix: FC<ProductionMixProps> = ({ productionId }) => {
  const translate = useTranslate();
  const interfaceLanguage = useAppSelector(selectInterfaceLanguage);
  const queryClient = useQueryClient();
  const mixes = useQuery(productionMixesQueryOptions(productionId));
  const submit = useMutation(
    submitProductionMixMutationOptions(productionId, queryClient),
  );

  const newest = mixes.data?.at(-1);
  const failure =
    submit.error === null ? null : resolveRouteErrorView(submit.error);

  return (
    <section className="production-mix">
      <div className="production-mix__header">
        <h3 className="production-mix__title">
          {translate('audio.mix.production.heading')}
        </h3>
        <Button
          type="button"
          variant="primary"
          size="md"
          disabled={submit.isPending}
          onClick={() => submit.mutate()}
        >
          {translate(
            submit.isPending
              ? 'audio.mix.production.submitting'
              : 'audio.mix.production.submit',
          )}
        </Button>
      </div>

      {mixes.error && mixes.data === undefined ? (
        <p className="production-mix__note">
          {translate('audio.mix.production.unreadable')}
        </p>
      ) : null}

      {failure === null ? null : (
        <ErrorState
          title={translate('audio.mix.production.failed.title')}
          description={composeRouteErrorDescription(failure, translate)}
          detail={failure.detail}
          headingLevel={4}
        />
      )}

      {newest === undefined ? (
        <p className="production-mix__note">
          {translate('audio.mix.production.none')}
        </p>
      ) : (
        <>
          <dl className="production-mix__facts">
            <dt>{translate('audio.mix.field.duration')}</dt>
            <dd>
              <span className="production-mix__notation" dir="ltr">
                {formatMilliseconds(newest.durationMs)}
              </span>
            </dd>
            <dt>{translate('audio.mix.field.audio')}</dt>
            <dd>
              <span className="production-mix__notation" dir="ltr">
                {translate('audio.mix.field.audio.value', {
                  sampleRate: String(newest.sampleRate),
                  channels: String(newest.channels),
                })}
              </span>
            </dd>
            <dt>{translate('audio.mix.field.made')}</dt>
            <dd>{formatDateTime(newest.createdAt, interfaceLanguage)}</dd>
            <dt>{translate('audio.mix.field.path')}</dt>
            <dd>
              <span className="production-mix__notation" dir="ltr">
                {newest.path}
              </span>
            </dd>
            <dt>{translate('audio.mix.field.hash')}</dt>
            <dd>
              <span className="production-mix__notation" dir="ltr">
                {newest.sha256}
              </span>
            </dd>
          </dl>

          <h4 className="production-mix__loudness-title">
            {translate('audio.mix.loudness.heading')}
          </h4>
          <dl className="production-mix__loudness-table">
            <dt>{translate('audio.mix.loudness.before')}</dt>
            <dd>
              <span className="production-mix__notation" dir="ltr">
                {newest.inputIntegratedLufs} LUFS, {newest.inputTruePeakDbtp}{' '}
                dBTP
              </span>
            </dd>
            <dt>{translate('audio.mix.loudness.after')}</dt>
            <dd>
              <span className="production-mix__notation" dir="ltr">
                {newest.outputIntegratedLufs} LUFS, {newest.outputTruePeakDbtp}{' '}
                dBTP
              </span>
            </dd>
            <dt>{translate('audio.mix.loudness.target')}</dt>
            <dd>
              <span className="production-mix__notation" dir="ltr">
                {newest.targetLufs} LUFS, {newest.targetTruePeakDbtp} dBTP
              </span>
            </dd>
            <dt>{translate('audio.mix.loudness.range')}</dt>
            <dd>
              <span className="production-mix__notation" dir="ltr">
                {newest.targetLoudnessRange} LU
              </span>
            </dd>
          </dl>
          <p className="production-mix__explain">
            {translate('audio.mix.loudness.explain')}
          </p>
        </>
      )}
    </section>
  );
};
