const URL_PATTERN = /\bhttps?:\/\/[^\s"'`\\)<>]+/gi;

const NON_FETCHING_URL_PREFIXES = [
  'http://www.w3.org/',
  'https://react.dev/errors/',
  'https://reactrouter.com/en/main/',
  'https://redux.js.org/Errors',
  'https://redux-toolkit.js.org/Errors',
  'https://bit.ly/3cXEKWf',
];

const LOOPBACK_IPV4_PREFIX = '127.';
const LOOPBACK_IPV6_HOSTNAME = '[::1]';
const LOOPBACK_HOSTNAME = 'localhost';
const LOOPBACK_HOSTNAME_SUFFIX = '.localhost';

const isLoopbackHostname = (hostname: string): boolean =>
  hostname === LOOPBACK_HOSTNAME ||
  hostname.endsWith(LOOPBACK_HOSTNAME_SUFFIX) ||
  hostname === LOOPBACK_IPV6_HOSTNAME ||
  hostname.startsWith(LOOPBACK_IPV4_PREFIX);

export const findExternalUrls = (source: string): string[] => {
  const matches = source.match(URL_PATTERN);

  if (!matches) {
    return [];
  }

  const external = new Set<string>();

  for (const url of matches) {
    if (NON_FETCHING_URL_PREFIXES.some((prefix) => url.startsWith(prefix))) {
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
