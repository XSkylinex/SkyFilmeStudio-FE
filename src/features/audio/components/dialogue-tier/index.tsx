import type { FC } from 'react';
import { useState } from 'react';
import { useMutation } from '@tanstack/react-query';
import {
  BENCHMARK_GATED_TIERS,
  dialogueAnimationTierSchema,
} from 'sky-filme-studio-be/contracts';
import { Button } from '@/lib/components/button';
import { ContentText } from '@/lib/components/content-text';
import { Field } from '@/lib/components/field';
import { Select } from '@/lib/components/select';
import { focusWhenShown } from '@/lib/helpers/focus-when-shown';
import { useTranslate } from '@/lib/i18n/use-translate';
import { composeRouteErrorDescription } from '@/shell/helpers/compose-route-error-description';
import { resolveRouteErrorView } from '@/shell/helpers/resolve-route-error-view';
import { chooseDialogueTierMutationOptions } from '@/features/audio/api/choose-dialogue-tier.mutation';
import { DIALOGUE_ANIMATION_TIER_LABEL } from '@/features/audio/audio.constants';
import type { DialogueTierProps } from './dialogue-tier.interface';
import './dialogue-tier.css';

const AUTOMATIC = '';

const REQUESTABLE = dialogueAnimationTierSchema.options.filter(
  (tier) => !BENCHMARK_GATED_TIERS.includes(tier),
);

export const DialogueTier: FC<DialogueTierProps> = ({ line }) => {
  const translate = useTranslate();
  const [requested, setRequested] = useState<string>(AUTOMATIC);
  const [acrossShots, setAcrossShots] = useState('false');

  const choose = useMutation(chooseDialogueTierMutationOptions(line.id));

  const parsed = dialogueAnimationTierSchema.safeParse(requested);

  const failure =
    choose.error === null ? null : resolveRouteErrorView(choose.error);

  return (
    <section className="dialogue-tier">
      <h4 className="dialogue-tier__title">{translate('audio.tier.title')}</h4>

      <p className="dialogue-tier__note">{translate('audio.tier.notStored')}</p>

      <Field label={translate('audio.tier.field')}>
        <Select
          options={[
            { value: AUTOMATIC, label: translate('audio.tier.automatic') },
            ...REQUESTABLE.map((tier) => ({
              value: tier,
              label: translate(DIALOGUE_ANIMATION_TIER_LABEL[tier]),
            })),
          ]}
          value={requested}
          onChange={setRequested}
        />
      </Field>

      {parsed.success ? null : (
        <Field label={translate('audio.tier.editedAcrossShots')}>
          <Select
            options={[
              { value: 'false', label: translate('audio.tier.acrossShots.no') },
              { value: 'true', label: translate('audio.tier.acrossShots.yes') },
            ]}
            value={acrossShots}
            onChange={setAcrossShots}
          />
        </Field>
      )}

      <p className="dialogue-tier__note">{translate('audio.tier.gated')}</p>

      <Button
        type="button"
        variant="secondary"
        size="sm"
        disabled={choose.isPending}
        aria-label={`${translate('audio.tier.action')} ${translate('audio.approve.context', { order: String(line.order) })}`}
        onClick={() =>
          choose.mutate({
            ...(parsed.success ? { requested: parsed.data } : {}),
            editedAcrossShots: acrossShots === 'true',
          })
        }
      >
        {translate(
          choose.isPending ? 'audio.tier.pending' : 'audio.tier.action',
        )}
      </Button>

      {choose.data === undefined ? null : (
        <output
          className="dialogue-tier__chosen"
          ref={focusWhenShown}
          tabIndex={-1}
        >
          <span>
            {translate('audio.tier.chosen', {
              tier: translate(DIALOGUE_ANIMATION_TIER_LABEL[choose.data.tier]),
            })}
          </span>{' '}
          <ContentText>
            {translate('audio.tier.rationale', {
              rationale: choose.data.rationale,
            })}
          </ContentText>
        </output>
      )}

      {failure === null ? null : (
        <p className="dialogue-tier__refusal" role="alert">
          {composeRouteErrorDescription(failure, translate)}
        </p>
      )}
    </section>
  );
};
