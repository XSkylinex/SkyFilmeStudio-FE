import {
  productionListPath,
  projectAssetsPath,
  projectListPath,
  projectLocationsPath,
  projectPropsPath,
  projectStylesPath,
  projectSubjectsPath,
  projectVoicesPath,
  systemPath,
} from '@/shell/routes/routes.constants';
import type { AppShellNavLink } from '../app-shell.interface';

export const resolveAppShellNavLinks = (
  projectId: string | null,
): readonly AppShellNavLink[] => {
  const globalLinks: AppShellNavLink[] = [
    { to: projectListPath(), label: 'Projects' },
    { to: systemPath(), label: 'System' },
  ];

  if (!projectId) {
    return globalLinks;
  }

  return [
    ...globalLinks,
    { to: projectAssetsPath(projectId), label: 'Assets' },
    { to: projectSubjectsPath(projectId), label: 'Subjects' },
    { to: projectStylesPath(projectId), label: 'Styles' },
    { to: projectVoicesPath(projectId), label: 'Voices' },
    { to: projectLocationsPath(projectId), label: 'Locations' },
    { to: projectPropsPath(projectId), label: 'Props' },
    { to: productionListPath(projectId), label: 'Productions' },
  ];
};
