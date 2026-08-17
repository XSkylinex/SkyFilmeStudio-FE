import type { RouteObject } from 'react-router-dom';
import { AppShell } from '@/shell/app-shell';
import { ProductionShell } from '@/shell/production-shell';
import { RouteErrorBoundary } from '@/shell/route-error-boundary';
import { DesignSystemPreview } from '@/shell/design-system-preview';
import { ProjectListPage } from '@/features/projects/ProjectListPage';
import { DashboardPage } from '@/features/dashboard/DashboardPage';
import { AssetsPage } from '@/features/assets/AssetsPage';
import { SubjectsPage } from '@/features/subjects/SubjectsPage';
import { SubjectReviewPage } from '@/features/subjects/SubjectReviewPage';
import { StylesPage } from '@/features/styles/StylesPage';
import { VoicesPage } from '@/features/voices/VoicesPage';
import { LocationsPage } from '@/features/locations/LocationsPage';
import { PropsPage } from '@/features/props/PropsPage';
import { ProductionListPage } from '@/features/productions/ProductionListPage';
import { PlannerPage } from '@/features/planner/PlannerPage';
import { RenderQueuePage } from '@/features/render-queue/RenderQueuePage';
import { SystemPage } from '@/features/system/SystemPage';
import { NotFoundPage } from './not-found-page';
import { RouteHydrateFallback } from './route-hydrate-fallback';
import {
  ASSETS_SEGMENT,
  AUDIO_SEGMENT,
  DESIGN_SYSTEM_SEGMENT,
  LOCATIONS_SEGMENT,
  PLAN_SEGMENT,
  PRODUCTIONS_SEGMENT,
  PRODUCTION_ID_PARAM,
  PROJECTS_SEGMENT,
  PROJECT_ID_PARAM,
  PROPS_SEGMENT,
  QUEUE_SEGMENT,
  ROOT_PATH,
  SHOTS_SEGMENT,
  SHOT_ID_PARAM,
  STORYBOARD_SEGMENT,
  STYLES_SEGMENT,
  SUBJECTS_SEGMENT,
  SUBJECT_ID_PARAM,
  SYSTEM_SEGMENT,
  TIMELINE_SEGMENT,
  VOICES_SEGMENT,
} from './routes.constants';

const productionRoutes: RouteObject[] = [
  {
    path: PLAN_SEGMENT,
    Component: PlannerPage,
    ErrorBoundary: RouteErrorBoundary,
  },
  {
    path: STORYBOARD_SEGMENT,
    lazy: () =>
      import('@/features/storyboard/StoryboardPage').then((routeModule) => ({
        Component: routeModule.StoryboardPage,
      })),
    HydrateFallback: RouteHydrateFallback,
    ErrorBoundary: RouteErrorBoundary,
  },
  {
    path: QUEUE_SEGMENT,
    Component: RenderQueuePage,
    ErrorBoundary: RouteErrorBoundary,
  },
  {
    path: SHOTS_SEGMENT,
    lazy: () =>
      import('@/features/shots/ShotsPage').then((routeModule) => ({
        Component: routeModule.ShotsPage,
      })),
    HydrateFallback: RouteHydrateFallback,
    ErrorBoundary: RouteErrorBoundary,
  },
  {
    path: `${SHOTS_SEGMENT}/:${SHOT_ID_PARAM}`,
    lazy: () =>
      import('@/features/shots/ShotReviewPage').then((routeModule) => ({
        Component: routeModule.ShotReviewPage,
      })),
    HydrateFallback: RouteHydrateFallback,
    ErrorBoundary: RouteErrorBoundary,
  },
  {
    path: AUDIO_SEGMENT,
    lazy: () =>
      import('@/features/audio/AudioPage').then((routeModule) => ({
        Component: routeModule.AudioPage,
      })),
    HydrateFallback: RouteHydrateFallback,
    ErrorBoundary: RouteErrorBoundary,
  },
  {
    path: TIMELINE_SEGMENT,
    lazy: () =>
      import('@/features/timeline/TimelinePage').then((routeModule) => ({
        Component: routeModule.TimelinePage,
      })),
    HydrateFallback: RouteHydrateFallback,
    ErrorBoundary: RouteErrorBoundary,
  },
];

const projectRoutes: RouteObject[] = [
  {
    index: true,
    Component: DashboardPage,
    ErrorBoundary: RouteErrorBoundary,
  },
  {
    path: ASSETS_SEGMENT,
    Component: AssetsPage,
    ErrorBoundary: RouteErrorBoundary,
  },
  {
    path: SUBJECTS_SEGMENT,
    Component: SubjectsPage,
    ErrorBoundary: RouteErrorBoundary,
  },
  {
    path: `${SUBJECTS_SEGMENT}/:${SUBJECT_ID_PARAM}`,
    Component: SubjectReviewPage,
    ErrorBoundary: RouteErrorBoundary,
  },
  {
    path: STYLES_SEGMENT,
    Component: StylesPage,
    ErrorBoundary: RouteErrorBoundary,
  },
  {
    path: VOICES_SEGMENT,
    Component: VoicesPage,
    ErrorBoundary: RouteErrorBoundary,
  },
  {
    path: LOCATIONS_SEGMENT,
    Component: LocationsPage,
    ErrorBoundary: RouteErrorBoundary,
  },
  {
    path: PROPS_SEGMENT,
    Component: PropsPage,
    ErrorBoundary: RouteErrorBoundary,
  },
  {
    path: PRODUCTIONS_SEGMENT,
    Component: ProductionListPage,
    ErrorBoundary: RouteErrorBoundary,
  },
  {
    path: `${PRODUCTIONS_SEGMENT}/:${PRODUCTION_ID_PARAM}`,
    Component: ProductionShell,
    ErrorBoundary: RouteErrorBoundary,
    children: productionRoutes,
  },
];

export const routeTree: RouteObject[] = [
  {
    path: ROOT_PATH,
    Component: AppShell,
    ErrorBoundary: RouteErrorBoundary,
    children: [
      {
        index: true,
        Component: ProjectListPage,
        ErrorBoundary: RouteErrorBoundary,
      },
      {
        path: DESIGN_SYSTEM_SEGMENT,
        Component: DesignSystemPreview,
        ErrorBoundary: RouteErrorBoundary,
      },
      {
        path: `${PROJECTS_SEGMENT}/:${PROJECT_ID_PARAM}`,
        ErrorBoundary: RouteErrorBoundary,
        children: projectRoutes,
      },
      {
        path: SYSTEM_SEGMENT,
        Component: SystemPage,
        ErrorBoundary: RouteErrorBoundary,
      },
      {
        path: '*',
        Component: NotFoundPage,
        ErrorBoundary: RouteErrorBoundary,
      },
    ],
  },
];
