const fieldOf = (key: string): string => key.replace(/(\.\d+)+$/, '');

export const invalidFieldCount = (errors: Record<string, unknown>): number => {
  const keys = Object.keys(errors);
  const leaves = keys.filter(
    (key) => !keys.some((other) => other.startsWith(`${key}.`)),
  );

  return new Set(leaves.map(fieldOf)).size;
};
