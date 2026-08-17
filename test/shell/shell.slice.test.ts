import {
  navCollapsedToggled,
  panelLayoutSet,
  selectNavCollapsed,
  selectPanelLayout,
  selectTheme,
  shellSlice,
  themeSet,
} from '@/shell/shell.slice';
import { THEME } from '@/shell/shell-state.constants';
import type { ShellSliceRootState } from '@/shell/interfaces/shell-state';

const reduce = shellSlice.reducer;
const rootOf = (state: ReturnType<typeof reduce>): ShellSliceRootState => ({
  shell: state,
});

describe('shellSlice', () => {
  it('starts on the system theme, so the stylesheet decides rather than a second source of truth', () => {
    const state = reduce(undefined, { type: '@@init' });

    expect(selectTheme(rootOf(state))).toBe(THEME.SYSTEM);
  });

  it('toggles the nav collapse rather than taking a value, so two callers cannot disagree', () => {
    const collapsed = reduce(undefined, navCollapsedToggled());
    const expanded = reduce(collapsed, navCollapsedToggled());

    expect(selectNavCollapsed(rootOf(collapsed))).toBe(true);
    expect(selectNavCollapsed(rootOf(expanded))).toBe(false);
  });

  it('replaces the panel layout wholesale, so a partial update cannot leave a stale width', () => {
    const state = reduce(
      undefined,
      panelLayoutSet({ secondaryPanelOpen: false, secondaryPanelWidthPx: 480 }),
    );

    expect(selectPanelLayout(rootOf(state))).toStrictEqual({
      secondaryPanelOpen: false,
      secondaryPanelWidthPx: 480,
    });
  });

  it('records the chosen theme', () => {
    const state = reduce(undefined, themeSet(THEME.DARK));

    expect(selectTheme(rootOf(state))).toBe(THEME.DARK);
  });
});
