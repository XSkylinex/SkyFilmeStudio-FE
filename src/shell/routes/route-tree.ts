import type { TranslationKey } from '@/lib/i18n/catalogue/en';
import { replace } from 'react-router-dom';
import type { LoaderFunctionArgs, RouteObject } from 'react-router-dom';
import { AppShell } from '@/shell/app-shell';
import { ProductionShell } from '@/shell/production-shell';
import { RouteErrorBoundary } from '@/shell/route-error-boundary';
import { RootErrorBoundary } from '@/shell/root-error-boundary';
import { ProjectListPage } from '@/features/projects/ProjectListPage';
import { DashboardPage } from '@/features/dashboard/DashboardPage';
import { RenderQueuePage } from '@/features/render-queue/RenderQueuePage';
import { NotFoundPage } from './not-found-page';
import { RouteHydrateFallback } from './route-hydrate-fallback';
import type { RouteHandle } from '@/shell/interfaces/route-handle';
import {
  ASSETS_SEGMENT,
  ASSET_ID_PARAM,
  AUDIO_SEGMENT,
  BIBLE_SEGMENT,
  MUSIC_SEGMENT,
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
  SFX_SEGMENT,
  SHOTS_SEGMENT,
  SHOT_ID_PARAM,
  STORYBOARD_SEGMENT,
  STYLES_SEGMENT,
  SUBJECTS_SEGMENT,
  SUBJECT_ID_PARAM,
  SYSTEM_SEGMENT,
  CONTINUITY_SEGMENT,
  TIMELINE_SEGMENT,
  VOICES_SEGMENT,
  productionPlanPath,
} from './routes.constants';

const routeHandle = (titleKey: TranslationKey): RouteHandle => ({ titleKey });

const resolveProductionIndexRedirect = ({
  params,
}: LoaderFunctionArgs): Response => {
  const { projectId, productionId } = params;
  if (!projectId || !productionId) {
    throw new Response('Missing production route parameters', {
      status: 400,
    });
  }

  return replace(productionPlanPath(projectId, productionId));
};

const productionRoutes: RouteObject[] = [
  {
    index: true,
    loader: resolveProductionIndexRedirect,
    ErrorBoundary: RouteErrorBoundary,
  },
  {
    path: PLAN_SEGMENT,
    lazy: () =>
      import('@/features/planner/PlannerPage').then((routeModule) => ({
        Component: routeModule.PlannerPage,
      })),
    HydrateFallback: RouteHydrateFallback,
    ErrorBoundary: RouteErrorBoundary,
    handle: routeHandle('page.planner.title'),
  },
  {
    path: STORYBOARD_SEGMENT,
    lazy: () =>
      import('@/features/storyboard/StoryboardPage').then((routeModule) => ({
        Component: routeModule.StoryboardPage,
      })),
    HydrateFallback: RouteHydrateFallback,
    ErrorBoundary: RouteErrorBoundary,
    handle: routeHandle('page.storyboard.title'),
  },
  {
    path: QUEUE_SEGMENT,
    Component: RenderQueuePage,
    ErrorBoundary: RouteErrorBoundary,
    handle: routeHandle('page.renderQueue.title'),
  },
  {
    path: SHOTS_SEGMENT,
    lazy: () =>
      import('@/features/shots/ShotsPage').then((routeModule) => ({
        Component: routeModule.ShotsPage,
      })),
    HydrateFallback: RouteHydrateFallback,
    ErrorBoundary: RouteErrorBoundary,
    handle: routeHandle('page.shots.title'),
  },
  {
    path: `${SHOTS_SEGMENT}/:${SHOT_ID_PARAM}`,
    lazy: () =>
      import('@/features/shots/ShotReviewPage').then((routeModule) => ({
        Component: routeModule.ShotReviewPage,
      })),
    HydrateFallback: RouteHydrateFallback,
    ErrorBoundary: RouteErrorBoundary,
    handle: routeHandle('page.shotReview.title'),
  },
  {
    path: AUDIO_SEGMENT,
    lazy: () =>
      import('@/features/audio/AudioPage').then((routeModule) => ({
        Component: routeModule.AudioPage,
      })),
    HydrateFallback: RouteHydrateFallback,
    ErrorBoundary: RouteErrorBoundary,
    handle: routeHandle('page.audio.title'),
  },
  {
    path: CONTINUITY_SEGMENT,
    lazy: () =>
      import('@/features/continuity/ContinuityPage').then((routeModule) => ({
        Component: routeModule.ContinuityPage,
      })),
    HydrateFallback: RouteHydrateFallback,
    ErrorBoundary: RouteErrorBoundary,
    handle: routeHandle('page.continuity.title'),
  },
  {
    path: TIMELINE_SEGMENT,
    lazy: () =>
      import('@/features/timeline/TimelinePage').then((routeModule) => ({
        Component: routeModule.TimelinePage,
      })),
    HydrateFallback: RouteHydrateFallback,
    ErrorBoundary: RouteErrorBoundary,
    handle: routeHandle('page.timeline.title'),
  },
];

const projectRoutes: RouteObject[] = [
  {
    index: true,
    Component: DashboardPage,
    ErrorBoundary: RouteErrorBoundary,
    handle: routeHandle('page.dashboard.title'),
  },
  {
    path: ASSETS_SEGMENT,
    lazy: () =>
      import('@/features/assets/AssetsPage').then((routeModule) => ({
        Component: routeModule.AssetsPage,
      })),
    HydrateFallback: RouteHydrateFallback,
    ErrorBoundary: RouteErrorBoundary,
    handle: routeHandle('page.assets.title'),
  },
  {
    path: `${ASSETS_SEGMENT}/:${ASSET_ID_PARAM}`,
    lazy: () =>
      import('@/features/assets/AssetDetailPage').then((routeModule) => ({
        Component: routeModule.AssetDetailPage,
      })),
    HydrateFallback: RouteHydrateFallback,
    ErrorBoundary: RouteErrorBoundary,
    handle: routeHandle('page.assetDetail.title'),
  },
  {
    path: SUBJECTS_SEGMENT,
    lazy: () =>
      import('@/features/subjects/SubjectsPage').then((routeModule) => ({
        Component: routeModule.SubjectsPage,
      })),
    HydrateFallback: RouteHydrateFallback,
    ErrorBoundary: RouteErrorBoundary,
    handle: routeHandle('page.subjects.title'),
  },
  {
    path: `${SUBJECTS_SEGMENT}/:${SUBJECT_ID_PARAM}`,
    lazy: () =>
      import('@/features/subjects/SubjectReviewPage').then((routeModule) => ({
        Component: routeModule.SubjectReviewPage,
      })),
    HydrateFallback: RouteHydrateFallback,
    ErrorBoundary: RouteErrorBoundary,
    handle: routeHandle('page.subjectReview.title'),
  },
  {
    path: STYLES_SEGMENT,
    lazy: () =>
      import('@/features/styles/StylesPage').then((routeModule) => ({
        Component: routeModule.StylesPage,
      })),
    HydrateFallback: RouteHydrateFallback,
    ErrorBoundary: RouteErrorBoundary,
    handle: routeHandle('page.styles.title'),
  },
  {
    path: VOICES_SEGMENT,
    lazy: () =>
      import('@/features/voices/VoicesPage').then((routeModule) => ({
        Component: routeModule.VoicesPage,
      })),
    HydrateFallback: RouteHydrateFallback,
    ErrorBoundary: RouteErrorBoundary,
    handle: routeHandle('page.voices.title'),
  },
  {
    path: LOCATIONS_SEGMENT,
    lazy: () =>
      import('@/features/locations/LocationsPage').then((routeModule) => ({
        Component: routeModule.LocationsPage,
      })),
    HydrateFallback: RouteHydrateFallback,
    ErrorBoundary: RouteErrorBoundary,
    handle: routeHandle('page.locations.title'),
  },
  {
    path: PROPS_SEGMENT,
    lazy: () =>
      import('@/features/props/PropsPage').then((routeModule) => ({
        Component: routeModule.PropsPage,
      })),
    HydrateFallback: RouteHydrateFallback,
    ErrorBoundary: RouteErrorBoundary,
    handle: routeHandle('page.props.title'),
  },
  {
    path: BIBLE_SEGMENT,
    lazy: () =>
      import('@/features/bible/BiblePage').then((routeModule) => ({
        Component: routeModule.BiblePage,
      })),
    HydrateFallback: RouteHydrateFallback,
    ErrorBoundary: RouteErrorBoundary,
    handle: routeHandle('page.bible.title'),
  },
  {
    path: MUSIC_SEGMENT,
    lazy: () =>
      import('@/features/music/MusicPage').then((routeModule) => ({
        Component: routeModule.MusicPage,
      })),
    HydrateFallback: RouteHydrateFallback,
    ErrorBoundary: RouteErrorBoundary,
    handle: routeHandle('page.music.title'),
  },
  {
    path: PRODUCTIONS_SEGMENT,
    lazy: () =>
      import('@/features/productions/ProductionListPage').then(
        (routeModule) => ({
          Component: routeModule.ProductionListPage,
        }),
      ),
    HydrateFallback: RouteHydrateFallback,
    ErrorBoundary: RouteErrorBoundary,
    handle: routeHandle('page.productions.title'),
  },
  {
    path: `${PRODUCTIONS_SEGMENT}/:${PRODUCTION_ID_PARAM}`,
    Component: ProductionShell,
    ErrorBoundary: RouteErrorBoundary,
    handle: routeHandle('route.production'),
    children: productionRoutes,
  },
];

export const routeTree: RouteObject[] = [
  {
    path: ROOT_PATH,
    Component: AppShell,
    ErrorBoundary: RootErrorBoundary,
    children: [
      {
        index: true,
        Component: ProjectListPage,
        ErrorBoundary: RouteErrorBoundary,
        handle: routeHandle('page.projects.title'),
      },
      {
        path: DESIGN_SYSTEM_SEGMENT,
        lazy: () =>
          import('@/shell/design-system-preview').then((routeModule) => ({
            Component: routeModule.DesignSystemPreview,
          })),
        HydrateFallback: RouteHydrateFallback,
        ErrorBoundary: RouteErrorBoundary,
        handle: routeHandle('page.designSystem.title'),
      },
      {
        path: `${PROJECTS_SEGMENT}/:${PROJECT_ID_PARAM}`,
        ErrorBoundary: RouteErrorBoundary,
        handle: routeHandle('route.project'),
        children: projectRoutes,
      },
      {
        path: SFX_SEGMENT,
        lazy: () =>
          import('@/features/sfx/SfxPage').then((routeModule) => ({
            Component: routeModule.SfxPage,
          })),
        HydrateFallback: RouteHydrateFallback,
        ErrorBoundary: RouteErrorBoundary,
        handle: routeHandle('page.sfx.title'),
      },
      {
        path: SYSTEM_SEGMENT,
        lazy: () =>
          import('@/features/system/SystemPage').then((routeModule) => ({
            Component: routeModule.SystemPage,
          })),
        HydrateFallback: RouteHydrateFallback,
        ErrorBoundary: RouteErrorBoundary,
        handle: routeHandle('page.system.title'),
      },
      {
        path: '*',
        Component: NotFoundPage,
        ErrorBoundary: RouteErrorBoundary,
        handle: routeHandle('page.notFound.title'),
      },
    ],
  },
];
