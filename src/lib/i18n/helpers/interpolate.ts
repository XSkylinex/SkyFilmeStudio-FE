const PLACEHOLDER = /\{(\w+)\}/g;

export const interpolate = (
  template: string,
  values: Readonly<Record<string, string | number>> | undefined,
): string => {
  if (values === undefined) {
    return template;
  }

  return template.replace(PLACEHOLDER, (match, name: string) => {
    const value = values[name];

    return value === undefined ? match : String(value);
  });
};
