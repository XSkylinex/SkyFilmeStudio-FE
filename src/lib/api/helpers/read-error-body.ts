import { errorCodeSchema } from 'sky-filme-studio-be/contracts';
import type { ErrorCode } from 'sky-filme-studio-be/contracts';
import { describeIssues } from '@/lib/api/helpers/describe-issues';

export interface ErrorBody {
  code: ErrorCode | undefined;
  detail: string | undefined;
}

const DETAIL_SEPARATOR = '; ';

const readString = (value: unknown): string | undefined => {
  if (typeof value === 'string') {
    return value === '' ? undefined : value;
  }

  if (Array.isArray(value)) {
    const joined = value
      .filter((entry): entry is string => typeof entry === 'string')
      .join(DETAIL_SEPARATOR);

    return joined === '' ? undefined : joined;
  }

  return undefined;
};

export const readErrorBody = (body: unknown): ErrorBody => {
  if (typeof body !== 'object' || body === null) {
    return { code: undefined, detail: readString(body) };
  }

  const record = body as Record<string, unknown>;
  const parsedCode = errorCodeSchema.safeParse(record['code']);

  return {
    code: parsedCode.success ? parsedCode.data : undefined,
    detail: describeIssues(record['errors']) ?? readString(record['message']),
  };
};
