export const diffNullableText = (
  current: string,
  original: string | undefined,
): string | null | undefined => {
  if (current === (original ?? '')) {
    return undefined;
  }

  return current === '' ? null : current;
};
