import type { CreateProjectBibleRequest } from 'sky-filme-studio-be/contracts';
import { parseLines } from '@/lib/helpers/parse-lines';
import type { BibleFormValues } from '@/features/bible/interfaces/bible-form-values';

export type BibleWorldInput = CreateProjectBibleRequest['world'];
export type BibleNarrativeInput = NonNullable<
  CreateProjectBibleRequest['narrative']
>;
export type BibleAudioInput = Omit<
  CreateProjectBibleRequest['audio'],
  'languages'
> & {
  languages: string[];
};

const single = (value: string): string => value.trim();

export const worldFromValues = (values: BibleFormValues): BibleWorldInput => ({
  ...(single(values.genre) === '' ? {} : { genre: single(values.genre) }),
  ...(single(values.tone) === '' ? {} : { tone: single(values.tone) }),
  ...(single(values.audienceProfile) === ''
    ? {}
    : { audienceProfile: single(values.audienceProfile) }),
  contentBoundaries: parseLines(values.contentBoundaries),
  recurringThemes: parseLines(values.recurringThemes),
  introOutroRules: parseLines(values.introOutroRules),
  continuityConstraints: parseLines(values.continuityConstraints),
});

export const narrativeFromValues = (
  values: BibleFormValues,
): BibleNarrativeInput | undefined => {
  const worldRules = parseLines(values.narrativeWorldRules);
  const humourDramaLanguage = single(values.humourDramaLanguage);
  const chronology = single(values.chronology);

  if (
    worldRules.length === 0 &&
    humourDramaLanguage === '' &&
    chronology === ''
  ) {
    return undefined;
  }

  return {
    worldRules,
    ...(humourDramaLanguage === '' ? {} : { humourDramaLanguage }),
    ...(chronology === '' ? {} : { chronology }),
  };
};

export const audioFromValues = (values: BibleFormValues): BibleAudioInput => ({
  languages: parseLines(values.languages),
  ...(single(values.narratorPolicy) === ''
    ? {}
    : { narratorPolicy: single(values.narratorPolicy) }),
  ...(single(values.musicIdentity) === ''
    ? {}
    : { musicIdentity: single(values.musicIdentity) }),
  recurringMotifs: parseLines(values.recurringMotifs),
  ambienceRules: parseLines(values.ambienceRules),
  ...(single(values.sfxAesthetic) === ''
    ? {}
    : { sfxAesthetic: single(values.sfxAesthetic) }),
  ...(single(values.dialogueMusicPriority) === ''
    ? {}
    : { dialogueMusicPriority: single(values.dialogueMusicPriority) }),
  ...(single(values.loudnessProfile) === ''
    ? {}
    : { loudnessProfile: single(values.loudnessProfile) }),
});
