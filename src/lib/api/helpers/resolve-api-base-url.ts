import { isLoopbackHost } from '@/lib/api/helpers/is-loopback-host';

const SAME_ORIGIN = '';
const ALLOWED_PROTOCOLS = ['http:', 'https:'];
const ROOT_PATHNAME = '/';

const assertLoopbackUrl = (candidate: string, source: string): string => {
  let parsed: URL;

  try {
    parsed = new URL(candidate);
  } catch {
    throw new Error(`${source} is not a valid URL: ${candidate}`);
  }

  if (!ALLOWED_PROTOCOLS.includes(parsed.protocol)) {
    throw new Error(
      `${source} must be http or https, but is ${parsed.protocol}`,
    );
  }

  if (!isLoopbackHost(parsed.hostname)) {
    throw new Error(
      `${source} must address this machine, but points at ${parsed.hostname}`,
    );
  }

  if (parsed.username !== '' || parsed.password !== '') {
    throw new Error(`${source} must not carry credentials: ${candidate}`);
  }

  if (parsed.pathname !== ROOT_PATHNAME || parsed.search !== '') {
    throw new Error(
      `${source} must be an origin with no path, but is ${candidate}`,
    );
  }

  return parsed.origin;
};

export interface ApiBaseUrlInput {
  configured: string | undefined;
  pageOrigin: string;
}

export const resolveApiBaseUrl = ({
  configured,
  pageOrigin,
}: ApiBaseUrlInput): string => {
  if (configured !== undefined && configured !== '') {
    return assertLoopbackUrl(configured, 'The configured orchestrator URL');
  }

  assertLoopbackUrl(pageOrigin, 'The page origin serving this build');

  return SAME_ORIGIN;
};
