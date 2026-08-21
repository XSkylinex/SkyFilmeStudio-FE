const SAFE_ARGUMENT = /^[A-Za-z0-9_@%+=:,./-]+$/;
const SINGLE_QUOTE = "'";
const ESCAPED_SINGLE_QUOTE = "'\\''";

const quoteArgument = (argument: string): string =>
  SAFE_ARGUMENT.test(argument)
    ? argument
    : `${SINGLE_QUOTE}${argument.split(SINGLE_QUOTE).join(ESCAPED_SINGLE_QUOTE)}${SINGLE_QUOTE}`;

export const formatArgv = (argv: readonly string[]): string =>
  argv.map(quoteArgument).join(' ');
