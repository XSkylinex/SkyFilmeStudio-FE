import type {
  ProjectBible,
  UpdateProjectBibleRequest,
} from 'sky-filme-studio-be/contracts';
import { parseLines } from '@/lib/helpers/parse-lines';
import type {
  BibleFormField,
  BibleFormValues,
} from '@/features/bible/interfaces/bible-form-values';
import { bibleFormValuesFrom } from '@/features/bible/helpers/bible-form-values';
import {
  audioFromValues,
  narrativeFromValues,
  worldFromValues,
} from '@/features/bible/helpers/bible-sections-from-values';
import type { BibleAudioInput } from '@/features/bible/helpers/bible-sections-from-values';
import { subjectRulesFromValues } from '@/features/bible/helpers/subject-rules-from-values';
import type { SubjectRulesCandidate } from '@/features/bible/helpers/subject-rules-from-values';
import { subjectRulesValuesFrom } from '@/features/bible/helpers/subject-rules-values';
import type { SubjectRulesValues } from '@/features/bible/interfaces/subject-rules-values';

export type BibleEditPatch = Omit<
  UpdateProjectBibleRequest,
  'audio' | 'styleProfileId' | 'subjectRules'
> & {
  audio?: BibleAudioInput;
  styleProfileId?: string | null;
  subjectRules?: SubjectRulesCandidate;
};

const WORLD_FIELDS: readonly BibleFormField[] = [
  'genre',
  'tone',
  'audienceProfile',
  'contentBoundaries',
  'recurringThemes',
  'introOutroRules',
  'continuityConstraints',
];

const NARRATIVE_FIELDS: readonly BibleFormField[] = [
  'narrativeWorldRules',
  'humourDramaLanguage',
  'chronology',
];

const AUDIO_FIELDS: readonly BibleFormField[] = [
  'languages',
  'narratorPolicy',
  'musicIdentity',
  'recurringMotifs',
  'ambienceRules',
  'sfxAesthetic',
  'dialogueMusicPriority',
  'loudnessProfile',
];

const normalise = (value: string): string => parseLines(value).join('\n');

const sectionChanged = (
  fields: readonly BibleFormField[],
  baseline: BibleFormValues,
  edited: BibleFormValues,
): boolean =>
  fields.some(
    (field) => normalise(baseline[field]) !== normalise(edited[field]),
  );

export const bibleEditDiff = (
  original: ProjectBible,
  edited: BibleFormValues,
  carriesNarrative: boolean,
  editedSubjectRules?: readonly SubjectRulesValues[],
): BibleEditPatch => {
  const baseline = bibleFormValuesFrom(original);
  const patch: BibleEditPatch = {};

  if (sectionChanged(WORLD_FIELDS, baseline, edited)) {
    patch.world = worldFromValues(edited);
  }
  if (carriesNarrative && sectionChanged(NARRATIVE_FIELDS, baseline, edited)) {
    patch.narrative = narrativeFromValues(edited) ?? null;
  }
  if (sectionChanged(AUDIO_FIELDS, baseline, edited)) {
    patch.audio = audioFromValues(edited);
  }
  if (baseline.styleProfileId !== edited.styleProfileId) {
    patch.styleProfileId =
      edited.styleProfileId === '' ? null : edited.styleProfileId;
  }
  if (editedSubjectRules !== undefined) {
    const before = subjectRulesFromValues(
      subjectRulesValuesFrom(original.subjectRules),
    );
    const after = subjectRulesFromValues(editedSubjectRules);
    if (JSON.stringify(before) !== JSON.stringify(after)) {
      patch.subjectRules = after;
    }
  }

  return patch;
};
