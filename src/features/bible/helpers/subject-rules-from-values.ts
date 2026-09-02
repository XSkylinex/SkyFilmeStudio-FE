import type { z } from 'zod';
import type { createProjectBibleRequestSchema } from 'sky-filme-studio-be/contracts';
import { parseLines } from '@/lib/helpers/parse-lines';
import type { SubjectRulesValues } from '@/features/bible/interfaces/subject-rules-values';

export type SubjectRulesCandidate = z.input<
  typeof createProjectBibleRequestSchema
>['subjectRules'];

export const subjectRulesFromValues = (
  values: readonly SubjectRulesValues[],
): NonNullable<SubjectRulesCandidate> =>
  values.map((entry) => {
    const behaviour = entry.behaviourAndPersonality.trim();

    return {
      subjectId: entry.subjectId,
      immutableVisualTraits: parseLines(entry.immutableVisualTraits),
      allowedVariations: parseLines(entry.allowedVariations),
      prohibitedChanges: parseLines(entry.prohibitedChanges),
      scaleRelationships: parseLines(entry.scaleRelationships),
      wardrobeVariants: parseLines(entry.wardrobeVariants),
      voiceRules: parseLines(entry.voiceRules),
      ...(behaviour === '' ? {} : { behaviourAndPersonality: behaviour }),
      speaks: entry.speaks,
      relationships: entry.relationships.map((relationship) => ({
        subjectId: relationship.subjectId,
        description: relationship.description.trim(),
      })),
    };
  });
