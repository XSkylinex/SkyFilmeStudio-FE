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
    const key = keyFor(issue);
    const segments = issue.path.map(String);

    for (let depth = 1; depth <= segments.length; depth += 1) {
      errors[segments.slice(0, depth).join('.')] = key;
    }
  }

  return errors;
};
