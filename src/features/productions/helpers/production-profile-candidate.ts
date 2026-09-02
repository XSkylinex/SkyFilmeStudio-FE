import type { z } from 'zod';
import type { createProductionProfileRequestSchema } from 'sky-filme-studio-be/contracts';
import type {
  ProductionProfileFormValues,
  ProfileSectionValues,
} from '@/features/productions/interfaces/production-profile-form-values';

export type ProductionProfileCandidate = z.input<
  typeof createProductionProfileRequestSchema
>;

const SECONDS_PER_MINUTE = 60;

export const EMPTY_PROFILE_SECTION_VALUES: ProfileSectionValues = {
  label: '',
  startSeconds: '',
  endSeconds: '',
  reusable: false,
};

export const EMPTY_PRODUCTION_PROFILE_VALUES: ProductionProfileFormValues = {
  name: '',
  description: '',
  minutes: '',
  seconds: '',
  tolerance: '',
  fps: '',
  width: '',
  height: '',
  aspectRatio: '',
  sampleRateHz: '',
  audioChannels: '',
  sections: [],
};

const numberOf = (value: string): number =>
  value.trim() === '' ? Number.NaN : Number(value);

export const profileTargetSecondsOf = (
  values: ProductionProfileFormValues,
): number =>
  (values.minutes === '' ? 0 : Number(values.minutes)) * SECONDS_PER_MINUTE +
  (values.seconds === '' ? 0 : Number(values.seconds));

export const productionProfileCandidateFrom = (
  values: ProductionProfileFormValues,
): ProductionProfileCandidate => {
  const description = values.description.trim();

  return {
    name: values.name.trim(),
    ...(description === '' ? {} : { description }),
    targetRuntimeSeconds: profileTargetSecondsOf(values),
    toleranceSeconds: numberOf(values.tolerance),
    fps: numberOf(values.fps),
    width: numberOf(values.width),
    height: numberOf(values.height),
    aspectRatio: values.aspectRatio.trim(),
    sampleRateHz: numberOf(values.sampleRateHz),
    audioChannels: numberOf(values.audioChannels),
    sections: values.sections.map((section, order) => ({
      order,
      label: section.label.trim(),
      startSeconds: numberOf(section.startSeconds),
      endSeconds: numberOf(section.endSeconds),
      reusable: section.reusable,
    })),
  };
};
