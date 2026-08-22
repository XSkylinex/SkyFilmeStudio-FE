import type { ZodError, ZodIssue } from 'zod';
import type { TranslationKey } from '@/lib/i18n/catalogue/en';

const TEXTUAL_ORIGINS = ['string', 'array', 'set', 'file'];

const keyFor = (issue: ZodIssue): TranslationKey => {
  if (issue.code === 'too_small') {
    return TEXTUAL_ORIGINS.includes(issue.origin)
      ? 'form.invalid.required'
      : 'form.invalid.tooSmall';
  }
  if (issue.code === 'too_big') {
    return 'form.invalid.tooBig';
  }
  if (issue.code === 'invalid_type') {
    return 'form.invalid.type';
  }

  return 'form.invalid.value';
};

export const fieldErrorsFromIssues = (
  error: ZodError,
): Record<string, TranslationKey> => {
  const errors: Record<string, TranslationKey> = {};

  for (const issue of error.issues) {
    const field = issue.path[0];

    if (field !== undefined) {
      errors[String(field)] = keyFor(issue);
    }
  }

  return errors;
};
