import type {
  DialogueAnimationTier,
  TtsPass,
} from 'sky-filme-studio-be/contracts';
import type { TranslationKey } from '@/lib/i18n/catalogue/en';

export const TTS_PASS_LABEL: Record<TtsPass, TranslationKey> = {
  DRAFT: 'audio.pass.draft',
  FINAL: 'audio.pass.final',
};

export const TTS_PASS_EXPLAINED: Record<TtsPass, TranslationKey> = {
  DRAFT: 'audio.pass.draft.explained',
  FINAL: 'audio.pass.final.explained',
};

export const DIALOGUE_ANIMATION_TIER_LABEL: Record<
  DialogueAnimationTier,
  TranslationKey
> = {
  AUDIO_CONDITIONED: 'audio.tier.audioConditioned',
  RHYTHM_ANIMATION: 'audio.tier.rhythmAnimation',
  REACTION_EDITING: 'audio.tier.reactionEditing',
  DUBIT: 'audio.tier.dubit',
};
