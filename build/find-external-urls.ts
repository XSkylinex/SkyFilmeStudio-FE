const URL_PATTERN = /\bhttps?:\/\/[^\s"'`\\)<>]+/gi;

const NON_FETCHING_URL_PREFIXES = [
  'http://www.w3.org/',
  'https://react.dev/errors/',
  'https://reactrouter.com/en/main/',
  'https://redux.js.org/Errors',
  'https://redux-toolkit.js.org/Errors',
];

const NON_FETCHING_EXACT_URLS = [
  'https://bit.ly/3cXEKWf',
  'https://json-schema.org/draft/2020-12/schema',
  'http://json-schema.org/draft-07/schema#',
  'http://json-schema.org/draft-04/schema#',
];

const TEMPLATE_SPAN = /\$\{[^}]*\}/g;
const REGISTRABLE_CHARACTER = /[a-z0-9]/i;
const SCHEME_SEPARATOR = '://';
const AUTHORITY_TERMINATORS = ['/', '?', '#'];

const LOOPBACK_IPV4_PREFIX = '127.';
const LOOPBACK_IPV6_HOSTNAME = '[::1]';
const LOOPBACK_HOSTNAME = 'localhost';
const LOOPBACK_HOSTNAME_SUFFIX = '.localhost';

const isLoopbackHostname = (hostname: string): boolean =>
  hostname === LOOPBACK_HOSTNAME ||
  hostname.endsWith(LOOPBACK_HOSTNAME_SUFFIX) ||
  hostname === LOOPBACK_IPV6_HOSTNAME ||
  hostname.startsWith(LOOPBACK_IPV4_PREFIX);

const readAuthority = (url: string): string => {
  const afterScheme = url.slice(
    url.indexOf(SCHEME_SEPARATOR) + SCHEME_SEPARATOR.length,
  );
  const terminators = AUTHORITY_TERMINATORS.map((terminator) =>
    afterScheme.indexOf(terminator),
  ).filter((index) => index !== -1);

  return terminators.length === 0
    ? afterScheme
    : afterScheme.slice(0, Math.min(...terminators));
};

const hasNoLiteralHost = (url: string): boolean =>
  !REGISTRABLE_CHARACTER.test(readAuthority(url).replace(TEMPLATE_SPAN, ''));

export const findExternalUrls = (source: string): string[] => {
  const matches = source.match(URL_PATTERN);

  if (!matches) {
    return [];
  }

  const external = new Set<string>();

  for (const url of matches) {
    if (
      NON_FETCHING_EXACT_URLS.includes(url) ||
      NON_FETCHING_URL_PREFIXES.some((prefix) => url.startsWith(prefix)) ||
      hasNoLiteralHost(url)
    ) {
      continue;
    }

    try {
      if (!isLoopbackHostname(new URL(url).hostname)) {
        external.add(url);
      }
    } catch {
      external.add(url);
    }
  }

  return [...external];
};
