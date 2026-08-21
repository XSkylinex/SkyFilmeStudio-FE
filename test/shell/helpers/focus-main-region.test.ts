import { focusMainRegion } from '@/shell/helpers/focus-main-region';
import { APP_SHELL_MAIN_ID } from '@/shell/app-shell/app-shell.constants';

describe('focusMainRegion', () => {
  afterEach(() => {
    document.body.replaceChildren();
  });

  it('focuses the main region the skip link already targets', () => {
    const main = document.createElement('main');
    main.id = APP_SHELL_MAIN_ID;
    main.tabIndex = -1;
    document.body.append(main);

    focusMainRegion();

    expect(document.activeElement).toBe(main);
  });

  it('does nothing when there is no main region to focus', () => {
    expect(() => focusMainRegion()).not.toThrow();
    expect(document.activeElement).toBe(document.body);
  });
});
