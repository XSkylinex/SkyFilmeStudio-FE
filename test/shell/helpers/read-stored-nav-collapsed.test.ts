import { readStoredNavCollapsed } from '@/shell/helpers/read-stored-nav-collapsed';
import { writeStoredNavCollapsed } from '@/shell/helpers/write-stored-nav-collapsed';
import { SHELL_STATE_NAV_COLLAPSED_STORAGE_KEY } from '@/shell/shell-state.constants';

const stubStorage = (): Map<string, string> => {
  const entries = new Map<string, string>();
  vi.stubGlobal('localStorage', {
    getItem: (key: string) => entries.get(key) ?? null,
    setItem: (key: string, value: string) => {
      entries.set(key, value);
    },
  });

  return entries;
};

describe('nav-collapse persistence', () => {
  afterEach(() => {
    vi.unstubAllGlobals();
  });

  it('round-trips through storage', () => {
    stubStorage();
    writeStoredNavCollapsed(true);

    expect(readStoredNavCollapsed()).toBe(true);
  });

  it('namespaces its key, so it cannot collide with another app on this origin', () => {
    const entries = stubStorage();
    writeStoredNavCollapsed(true);

    expect(SHELL_STATE_NAV_COLLAPSED_STORAGE_KEY).toBe(
      'studio.shell.nav-collapsed',
    );
    expect(entries.get(SHELL_STATE_NAV_COLLAPSED_STORAGE_KEY)).toBe('true');
  });

  it('falls back to expanded when storage is missing, rather than taking the shell down', () => {
    vi.stubGlobal('localStorage', undefined);

    expect(readStoredNavCollapsed()).toBe(false);
  });

  it('falls back when storage throws, which is what a blocked-cookies browser does', () => {
    vi.stubGlobal('localStorage', {
      getItem: () => {
        throw new Error('access denied');
      },
      setItem: () => {
        throw new Error('access denied');
      },
    });

    expect(readStoredNavCollapsed()).toBe(false);
    expect(() => {
      writeStoredNavCollapsed(true);
    }).not.toThrow();
  });
});
