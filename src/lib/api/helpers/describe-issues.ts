import { isRecord } from '@/lib/helpers/is-record';

const ISSUE_SEPARATOR = '; ';
const ROOT_PATH = '(root)';

const describeIssue = (value: unknown): string | undefined => {
  if (!isRecord(value)) {
    return undefined;
  }

  const message = value['message'];
  if (typeof message !== 'string' || message === '') {
    return undefined;
  }

  const path = value['path'];
  const label = Array.isArray(path) ? path.join('.') : '';

  return `${label === '' ? ROOT_PATH : label}: ${message}`;
};

export const describeIssues = (value: unknown): string | undefined => {
  if (!Array.isArray(value)) {
    return undefined;
  }

  const described = value
    .map(describeIssue)
    .filter((entry): entry is string => entry !== undefined);

  return described.length === 0 ? undefined : described.join(ISSUE_SEPARATOR);
};
