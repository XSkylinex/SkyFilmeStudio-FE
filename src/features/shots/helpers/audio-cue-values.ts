import type { z } from 'zod';
import type {
  AudioCue,
  replaceAudioCuesRequestSchema,
} from 'sky-filme-studio-be/contracts';
import type { AudioCueValues } from '@/features/shots/interfaces/audio-cue-values';

export type AudioCuesCandidate = z.input<typeof replaceAudioCuesRequestSchema>;

export const EMPTY_AUDIO_CUE_VALUES: AudioCueValues = {
  sfxAssetId: '',
  stemKind: 'FX',
  atMs: '',
  durationMs: '',
  gainDb: '',
  fadeInMs: '',
  fadeOutMs: '',
};

const numberOf = (value: string): number =>
  value.trim() === '' ? Number.NaN : Number(value);

export const audioCueValuesFrom = (
  cues: readonly AudioCue[],
): AudioCueValues[] =>
  [...cues]
    .sort((a, b) => a.order - b.order)
    .map((cue) => ({
      sfxAssetId: cue.sfxAssetId,
      stemKind: cue.stemKind,
      atMs: String(cue.atMs),
      durationMs: String(cue.durationMs),
      gainDb: String(cue.gainDb),
      fadeInMs: String(cue.fadeInMs),
      fadeOutMs: String(cue.fadeOutMs),
    }));

/**
 * The route replaces a shot's cues wholesale, so the request is the whole list in the order the
 * screen shows it; `order` is the position rather than a number a person types.
 */
export const audioCuesFrom = (
  values: readonly AudioCueValues[],
): AudioCuesCandidate => ({
  cues: values.map((cue, order) => ({
    sfxAssetId: cue.sfxAssetId,
    stemKind: cue.stemKind,
    order,
    atMs: numberOf(cue.atMs),
    durationMs: numberOf(cue.durationMs),
    gainDb: numberOf(cue.gainDb),
    fadeInMs: numberOf(cue.fadeInMs),
    fadeOutMs: numberOf(cue.fadeOutMs),
  })),
});
