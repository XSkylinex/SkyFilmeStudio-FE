const URL_PATTERN = /\bhttps?:\/\/[^\s"'`\\)<>]+/gi;

/**
 * Prefixes that look like remote URLs but never cause a network request, so
 * flagging them would only teach people to disable the guard.
 *
 * Every entry is verified against a real bundle of this app, not assumed.
 */
const NON_FETCHING_URL_PREFIXES = [
  // XML namespace identifiers. They name a namespace, they are not addresses:
  // React DOM emits them for SVG/MathML elements and every SVG in public/
  // carries one in its xmlns attribute.
  'http://www.w3.org/',
  // React's production error decoder, embedded in the text of a thrown Error.
  'https://react.dev/errors/',
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

/**
 * Every absolute URL in `source` that would reach a host other than this
 * machine. Loopback is allowed — the orchestrator is served from it.
 *
 * A URL that cannot be parsed is reported rather than ignored: the guard's
 * whole job is to be wrong in the direction of failing the build.
 */
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
