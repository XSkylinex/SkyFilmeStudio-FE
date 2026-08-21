const JSON_INDENT = 0;

export const describeMetadataValue = (value: unknown): string | undefined => {
  if (value === undefined) {
    return undefined;
  }

  if (typeof value === 'string') {
    return value === '' ? undefined : value;
  }

  if (typeof value === 'number' || typeof value === 'boolean') {
    return String(value);
  }

  try {
    return JSON.stringify(value, null, JSON_INDENT);
  } catch {
    return undefined;
  }
};
