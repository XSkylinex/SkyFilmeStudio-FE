import type { UIMatch } from 'react-router-dom';
import type { TranslationKey } from '@/lib/i18n/catalogue/en';
import { resolveBreadcrumbs } from '@/shell/helpers/resolve-breadcrumbs';

const match = (pathname: string, titleKey?: TranslationKey): UIMatch =>
  ({
    id: pathname,
    pathname,
    params: {},
    data: undefined,
    handle: titleKey === undefined ? undefined : { titleKey },
  }) as UIMatch;

describe('resolveBreadcrumbs', () => {
  it('builds the trail from the matches that name themselves', () => {
    const trail = resolveBreadcrumbs([
      match('/'),
      match('/projects/p1', 'route.project'),
      match('/projects/p1/productions/pr1', 'route.production'),
      match('/projects/p1/productions/pr1/plan', 'page.planner.title'),
    ]);

    expect(trail).toStrictEqual([
      { titleKey: 'route.project', pathname: '/projects/p1' },
      {
        titleKey: 'route.production',
        pathname: '/projects/p1/productions/pr1',
      },
      {
        titleKey: 'page.planner.title',
        pathname: '/projects/p1/productions/pr1/plan',
      },
    ]);
  });

  it('drops the root match, which the primary navigation already reaches', () => {
    const trail = resolveBreadcrumbs([
      match('/', 'page.projects.title'),
      match('/system', 'page.system.title'),
    ]);

    expect(trail).toStrictEqual([
      { titleKey: 'page.system.title', pathname: '/system' },
    ]);
  });

  it('keeps one crumb per path, so a layout and its index do not both appear', () => {
    const trail = resolveBreadcrumbs([
      match('/'),
      match('/projects/p1', 'route.project'),
      match('/projects/p1', 'page.dashboard.title'),
    ]);

    expect(trail).toStrictEqual([
      { titleKey: 'page.dashboard.title', pathname: '/projects/p1' },
    ]);
  });

  it('ignores a match whose handle is not a route handle', () => {
    const trail = resolveBreadcrumbs([
      match('/'),
      { ...match('/projects/p1'), handle: { notATitle: 1 } } as UIMatch,
      match('/projects/p1/assets', 'page.assets.title'),
    ]);

    expect(trail).toStrictEqual([
      { titleKey: 'page.assets.title', pathname: '/projects/p1/assets' },
    ]);
  });
});
