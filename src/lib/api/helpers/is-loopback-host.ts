const LOOPBACK_IPV4 =
  /^127\.(?:(?:25[0-5]|2[0-4]\d|1\d\d|[1-9]?\d)\.){2}(?:25[0-5]|2[0-4]\d|1\d\d|[1-9]?\d)$/;
const LOOPBACK_IPV6_HOSTNAME = '[::1]';
const LOOPBACK_HOSTNAME = 'localhost';
const LOOPBACK_HOSTNAME_SUFFIX = '.localhost';

export const isLoopbackHost = (hostname: string): boolean =>
  hostname === LOOPBACK_HOSTNAME ||
  hostname.endsWith(LOOPBACK_HOSTNAME_SUFFIX) ||
  hostname === LOOPBACK_IPV6_HOSTNAME ||
  LOOPBACK_IPV4.test(hostname);
