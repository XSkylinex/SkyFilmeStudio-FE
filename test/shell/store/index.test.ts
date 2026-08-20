import { createStore } from '@/shell/store';
import { navCollapsedToggled, themeSet } from '@/shell/shell.slice';
import { SHELL_STATE_NAV_COLLAPSED_STORAGE_KEY } from '@/shell/shell-state.constants';
import { THEME } from '@/shell/shell-state.constants';

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

describe('the shell store', () => {
  afterEach(() => {
    vi.unstubAllGlobals();
  });

  it('persists the nav collapse through its listener, which is the only thing that writes storage', () => {
    const entries = stubStorage();
    const store = createStore();

    store.dispatch(navCollapsedToggled());

    expect(entries.get(SHELL_STATE_NAV_COLLAPSED_STORAGE_KEY)).toBe('true');
  });

  it('persists the collapse going back the other way too', () => {
    const entries = stubStorage();
    const store = createStore();

    store.dispatch(navCollapsedToggled());
    store.dispatch(navCollapsedToggled());

    expect(entries.get(SHELL_STATE_NAV_COLLAPSED_STORAGE_KEY)).toBe('false');
  });

  it('writes nothing for a state change that is not a UI preference', () => {
    const entries = stubStorage();
    const store = createStore();

    store.dispatch(themeSet(THEME.DARK));

    expect(entries.size).toBe(0);
  });

  it('gives each store its own listener, so an isolated store cannot write for the singleton', () => {
    const entries = stubStorage();
    const first = createStore();
    const second = createStore();

    first.dispatch(navCollapsedToggled());

    expect(entries.get(SHELL_STATE_NAV_COLLAPSED_STORAGE_KEY)).toBe('true');
    expect(second.getState().shell.navCollapsed).toBe(false);
  });

  it('keeps the default middleware, so a non-serialisable payload is still caught', () => {
    const store = createStore();

    expect(store.getState().shell.theme).toBe(THEME.SYSTEM);
  });
});
