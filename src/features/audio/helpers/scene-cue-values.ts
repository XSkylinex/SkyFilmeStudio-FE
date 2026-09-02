import type { z } from 'zod';
import type {
  SceneCue,
  replaceSceneCuesRequestSchema,
} from 'sky-filme-studio-be/contracts';
import type { SceneCueValues } from '@/features/audio/interfaces/scene-cue-values';

export type SceneCuesCandidate = z.input<typeof replaceSceneCuesRequestSchema>;

export const EMPTY_SCENE_CUE_VALUES: SceneCueValues = {
  musicCueId: '',
  startOffsetMs: '',
  gainDb: '',
  loop: false,
  fadeInMs: '',
  fadeOutMs: '',
};

const numberOf = (value: string): number =>
  value.trim() === '' ? Number.NaN : Number(value);

export const sceneCueValuesFrom = (
  cues: readonly SceneCue[],
): SceneCueValues[] =>
  [...cues]
    .sort((first, second) => first.order - second.order)
    .map((cue) => ({
      musicCueId: cue.musicCueId,
      startOffsetMs: String(cue.startOffsetMs),
      gainDb: String(cue.gainDb),
      loop: cue.loop,
      fadeInMs: String(cue.fadeInMs),
      fadeOutMs: String(cue.fadeOutMs),
    }));

export const sceneCuesFrom = (
  values: readonly SceneCueValues[],
): SceneCuesCandidate => ({
  cues: values.map((cue, order) => ({
    musicCueId: cue.musicCueId,
    order,
    startOffsetMs: numberOf(cue.startOffsetMs),
    gainDb: numberOf(cue.gainDb),
    loop: cue.loop,
    fadeInMs: numberOf(cue.fadeInMs),
    fadeOutMs: numberOf(cue.fadeOutMs),
  })),
});
