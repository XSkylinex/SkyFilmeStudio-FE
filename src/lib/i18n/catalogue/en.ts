import type { ErrorCode } from 'sky-filme-studio-be/contracts';

export const EN_CATALOGUE = {
  'error.MODEL_FILE_MISSING':
    'A model file this render needs is not on disk, so nothing was rendered. It has to be downloaded into the models folder before this can run.',
  'error.MODEL_HASH_MISMATCH':
    'A model file on disk does not match the hash the manifest records. A truncated download is the usual cause: delete that file and fetch it again.',
  'error.RUNTIME_START_FAILED':
    'The local runtime for this model would not start, so nothing was rendered. This is a setup fault rather than a bad request — the runtime failed before it saw the job.',
  'error.MPS_OUT_OF_MEMORY':
    'The GPU ran out of memory on this shot. Choose a lower render profile or a shorter duration — the same request will fail the same way.',
  'error.MPS_UNSUPPORTED_OP':
    'This model needs an operation the Metal backend does not implement, so it cannot run on this GPU path. A different model or a CPU run is the way round it.',
  'error.CUDA_OUT_OF_MEMORY':
    'The GPU ran out of memory on this shot. Choose a lower render profile or a shorter duration — the same request will fail the same way.',
  'error.CUDA_DRIVER_ERROR':
    'The CUDA driver reported a fault. This is the driver or the card rather than the request, so no change to this shot will avoid it.',
  'error.GPU_OFFLOAD_THRASHING':
    'The model does not fit in GPU memory and is being swapped in and out. This is not a crash — the render will finish, far slower than usual. A lower render profile avoids it.',
  'error.OUTPUT_DECODE_FAILED':
    'The render produced a file that will not decode. The output is unusable and the shot has to be rendered again.',
  'error.OUTPUT_DURATION_INVALID':
    'The render produced a clip of the wrong length. It cannot be cut into the timeline as it stands.',
  'error.CHARACTER_IDENTITY_FAILURE':
    'The rendered subject drifted from its canonical reference. Compare the shot against the subject reference set before approving anything built on it.',
  'error.AUDIO_SILENT':
    'The generated audio is silent. The line produced no sound, so the shot has no dialogue to cut against.',
  'error.AUDIO_CLIPPING':
    'The generated audio clips. The peaks are distorted and will stay distorted through the mix.',
  'error.PROMPT_SCHEMA_INVALID':
    'The planner returned a structure this pipeline cannot use. The planning step has to run again before any render can be built from it.',
  'error.OFFLINE_POLICY_VIOLATION':
    'A provider was pointed off this machine and generation was stopped. Nothing may leave this computer — find the provider that was reconfigured before running anything else.',
  'error.DISK_SPACE_LOW':
    'There is not enough free space to start this render, so it was refused before starting. Free space, or move the project root to a larger disk, before submitting again.',
  'error.NO_ELIGIBLE_PROVIDER':
    'No provider on this machine can run this job, so nothing was queued. A worker advertising this capability has to be set up first.',
  'error.CAPABILITY_NOT_BENCHMARKED':
    'A provider could run this, but nothing has measured its limits on this hardware. Until a benchmark exists, an untested duration or profile is a guess rather than a capability.',
  'error.MEDIA_TOOL_UNAVAILABLE':
    'The FFmpeg build on this machine cannot do what this step needs \u2014 either it is not on the path, or the build that was found has no encoder, filter or muxer for it. This is a setup fault: the same request will fail the same way until FFmpeg is replaced.',

  'error.network':
    'The orchestrator is not answering. It is the process that runs every render, so nothing can start until it is back.',
  'error.malformed':
    'Something other than the orchestrator answered this request: the reply was not JSON. Check that this path reaches the orchestrator rather than the page server.',
  'error.contract':
    'The orchestrator answered with a shape this build does not recognise. The two halves are on different contract versions.',
  'error.status': 'The orchestrator refused this request with status {status}.',
  'error.unrecognisedCode':
    'The orchestrator reported an error this UI does not yet have a message for. The raw code below is exactly what it returned.',
  'error.routeGeneric':
    'Something failed while rendering this page. The rest of Local AI Studio is unaffected.',

  'language.label': 'Interface language',
  'language.en': 'English',
  'language.he': 'עברית',

  'error.pageTitle': "This page couldn't load",
  'error.fatalTitle': 'Local AI Studio hit an unrecoverable error',
  'error.fatalDescription':
    'Reload the app. If this keeps happening, check that the orchestrator is still running.',
  'error.reload': 'Reload',

  'offline.unknown.label': 'Not yet verified',
  'offline.unknown.description':
    'Whether this project is running local-only has not been confirmed yet. Do not treat this as a safety guarantee.',
  'offline.remote.label': 'Not local',
  'offline.remote.description':
    'This build is not running local-only. Project data may leave this machine — check the orchestrator configuration.',
  'offline.operatorEnabled.label': 'Operator enabled',
  'offline.operatorEnabled.description':
    "The Claude Code operator is enabled. Project context can leave this machine through Claude's own service while it is on.",
  'offline.lanWorkers.label': 'LAN workers allowed',
  'offline.lanWorkers.description':
    'Render workers on the local network are allowed to take jobs for this project. Project data can cross to those machines.',
  'offline.strictOffline.label': 'Strict offline',
  'offline.strictOffline.description':
    'Strict offline mode is on for this project: Claude Code must not be treated as an available operator while it is set.',
  'offline.local.label': 'Local only',
  'offline.local.description':
    'This project runs local-only. No render or context leaves this machine.',

  'connection.unknown.label': 'Not yet verified',
  'connection.unknown.description':
    'No connection to the orchestrator has been attempted yet. Do not treat this as a working connection.',
  'connection.connecting.label': 'Connecting',
  'connection.connecting.description': 'Connecting to the orchestrator.',
  'connection.open.label': 'Connected',
  'connection.open.description':
    'Connected to the orchestrator. Render progress updates live.',
  'connection.closed.label': 'Disconnected',
  'connection.closed.description':
    'The live connection to the orchestrator is down. On this machine that usually means the orchestrator process stopped, and any render in progress stopped with it.',
  'connection.reconnecting.label': 'Reconnecting',
  'connection.reconnecting.description':
    'Reconnecting to the orchestrator. Render progress may be behind until this recovers.',

  'shell.skipToMain': 'Skip to main content',
  'route.project': 'Project',
  'route.production': 'Production',
  'page.designSystem.title': 'Design system',
  'productionStage.screenplay': 'Screenplay',
  'productionStage.musicPlan': 'Music plan',
  'shell.showNavigation': 'Show navigation',
  'shell.hideNavigation': 'Hide navigation',
  'shell.primaryNavigation': 'Primary',
  'shell.breadcrumb': 'Breadcrumb',
  'shell.productionStages': 'Production stages',
  'shell.loadingPage': 'Loading page',

  'stage.unknown': 'Not yet verified',
  'stage.pending': 'Pending',
  'stage.in_review': 'In review',
  'stage.approved': 'Approved',
  'stage.blocked': 'Blocked',

  'readiness.title': 'Readiness',
  'readiness.unknown.label': 'Not yet verified',
  'readiness.unknown.description':
    'The orchestrator has not reported preflight results yet. Nothing here says this machine can or cannot render.',
  'readiness.ready.label': 'Ready to render',
  'readiness.ready.description':
    'Every preflight check passed and there is room on disk for a render to start.',
  'readiness.blocked.label': '{failed} of {total} checks did not pass',
  'readiness.blocked.description':
    'A production render will refuse to start until these are resolved. A check that did not run is not a check that passed.',
  'readiness.checkedAt': 'Checked {time}',
  'readiness.rerun': 'Re-run checks',
  'readiness.rerunning': 'Re-running',
  'readiness.error.title': 'Preflight could not be read',
  'readiness.diskShortfall':
    'A render will refuse to start: this disk is short by {shortfall}.',

  'page.notFound.title': 'Page not found',
  'page.notFound.description':
    'Nothing in Local AI Studio matches this address.',
  'page.projects.title': 'Projects',
  'page.projects.description':
    'Every Local AI Studio project on this machine. Not connected to the orchestrator yet.',
  'page.dashboard.title': 'Dashboard',
  'page.dashboard.description':
    "This project's status at a glance: assets, subjects, creative library and productions. Not connected to the orchestrator yet.",
  'page.assets.title': 'Assets',
  'page.assets.description':
    'The source footage, images and audio brought into this project. Not connected to the orchestrator yet.',
  'page.subjects.title': 'Subjects',
  'page.subjects.description':
    'The recurring people, characters and objects this project has identified for review. Not connected to the orchestrator yet.',
  'page.subjectReview.title': 'Subject review',
  'page.subjectReview.description':
    "Compare a subject's candidate reference images and approve the ones that define it. Not connected to the orchestrator yet.",
  'page.styles.title': 'Styles',
  'page.styles.description':
    'The visual styles available to this project. Not connected to the orchestrator yet.',
  'page.voices.title': 'Voices',
  'page.voices.description':
    'The voices available for narration and dialogue in this project. Not connected to the orchestrator yet.',
  'page.locations.title': 'Locations',
  'page.locations.description':
    'The locations available to this project. Not connected to the orchestrator yet.',
  'page.props.title': 'Props',
  'page.props.description':
    'The props available to this project. Not connected to the orchestrator yet.',
  'page.productions.title': 'Productions',
  'page.productions.description':
    'Every production in this project, from screenplay to final cut. Not connected to the orchestrator yet.',
  'page.planner.title': 'Plan',
  'page.planner.description':
    'The screenplay or production plan driving this production. Not connected to the orchestrator yet.',
  'page.storyboard.title': 'Storyboard',
  'page.storyboard.description':
    "Review this production's keyframes scene by scene before they render. Not connected to the orchestrator yet.",
  'page.renderQueue.title': 'Render queue',
  'page.renderQueue.description':
    'Every render job for this production and how far each one has progressed. Not connected to the orchestrator yet.',
  'page.shots.title': 'Shots',
  'page.shots.description':
    'Every shot in this production and its current review state. Not connected to the orchestrator yet.',
  'page.shotReview.title': 'Shot review',
  'page.shotReview.description':
    'Compare a rendered shot against its reference and decide whether it stands. Not connected to the orchestrator yet.',
  'page.audio.title': 'Audio',
  'page.audio.description':
    'Music, dialogue and the mix for this production. Not connected to the orchestrator yet.',
  'page.timeline.title': 'Timeline',
  'page.timeline.description':
    "This production's assembled cut and final export. Not connected to the orchestrator yet.",
  'page.system.title': 'System',
  'page.system.description':
    'Hardware, installed models, disk space and offline mode for this installation. Not connected to the orchestrator yet.',
} satisfies Record<string, string> & Record<`error.${ErrorCode}`, string>;

export type TranslationKey = keyof typeof EN_CATALOGUE;
