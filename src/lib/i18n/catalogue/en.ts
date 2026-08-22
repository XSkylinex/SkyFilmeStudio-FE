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

  'error.SOURCE_ASSET_IMMUTABLE':
    'An imported original cannot be edited in place. Originals are kept exactly as they arrived and every change becomes a new derived version, so this has to be redone as a derived asset rather than an edit.',
  'error.IMPORT_PATH_REJECTED':
    "That path was refused because it resolves outside this project's own storage, and nothing was imported. Pick a file inside the project folder, or copy it in first.",
  'error.SUBJECT_NOT_APPROVED':
    "This subject's canonical reference set has not been approved, so nothing may be generated from it yet. That gate is what stops a long render from running against the wrong likeness.",
  'error.CANONICAL_SET_IMMUTABLE':
    'This canonical set has been approved, so it can no longer be changed. Approved sets are frozen deliberately — a production already pinned to this one must not shift underneath it. A change means a new version.',
  'error.CANONICAL_ANCHOR_REQUIRED':
    'This set has no references, so approving it would freeze a version that depicts nothing. Add at least one reference, then approve.',
  'error.CANONICAL_DRAFT_EXISTS':
    'This subject already has an open canonical draft. Only one draft exists at a time, so the open one has to be approved or discarded before another can start.',
  'error.STYLE_PROFILE_IMMUTABLE':
    'This style profile version has been approved, so it can no longer be edited in place. A production already pinned to it must not shift underneath itself — a change becomes a new version instead.',
  'error.STYLE_VERSION_CONFLICT':
    'Another version of this style was added at the same moment, so this one lost the race for its version number. Nothing was lost and nothing needs retyping — send it again and it will take the next number.',
  'error.VOICE_PROFILE_IMMUTABLE':
    'This voice profile has been approved and dialogue is already pinned to it, so it can no longer be changed. A change means a new voice profile, which leaves lines that were already recorded sounding as they were.',
  'error.VOICE_ALREADY_APPROVED_FOR_SUBJECT':
    'This subject already has an approved voice, and a subject gets exactly one — that is what keeps it sounding like itself across a production. Delete the existing voice first: un-approving it is refused, so deleting is the only way to free the place.',
  'error.PRONUNCIATION_DICTIONARY_EXISTS':
    'This project already has a pronunciation dictionary for that language, and there is one per language. Add the entry to the dictionary that exists rather than starting a second.',
  'error.PRONUNCIATION_ENTRY_EXISTS':
    'The dictionary already holds an entry that normalises to the same term as this one. Two spellings can normalise together — a decomposed accent, a stray direction mark, a doubled space — so the entry already there may not look identical to what was typed. Edit that one instead of adding a second.',
  'error.LOCATION_IMMUTABLE':
    'This location has been approved, so it can no longer be edited or approved again. Approved locations are frozen deliberately — shots already planned against this one must not have the place change underneath them. The freeze does not block deleting it, and a change means a new location rather than an edit.',
  'error.PROP_IMMUTABLE':
    'This prop has been approved, so it can no longer be edited or approved again. Its continuity rules are what later scenes get checked against, so they are frozen at approval. The freeze does not block deleting it, and a change means a new prop rather than an edit.',
  'error.LOCATION_PLATE_IMMUTABLE':
    'This plate has been approved, so it can no longer be edited or approved again. An approved plate is the canonical image for its kind, and scenes already framed against it must not shift. The freeze does not block deleting it, and a change means a new plate rather than an edit.',
  'error.LOCATION_PLATE_KIND_ALREADY_APPROVED':
    'This location already has an approved plate of that kind, and it gets exactly one — that is what keeps the place recognisable from cut to cut. Delete the plate that holds the place first: un-approving it is refused, so deleting is the only way to free it. Further drafts of the same kind may sit alongside it in the meantime.',
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

  'approval.approve': 'Approve',
  'approval.reject': 'Reject',
  'approval.approveContext': 'Approve {context}',
  'approval.rejectContext': 'Reject {context}',
  'approval.regenerateContext': '{mode} for {context}',
  'mediaTile.failed': 'Failed to load',
  'mediaTile.empty': 'No image yet',
  'toast.dismiss': 'Dismiss',

  'shortcuts.title': 'Keyboard shortcuts',
  'shortcuts.nextShot': 'Go to the next shot',
  'shortcuts.previousShot': 'Go to the previous shot',
  'shortcuts.approve': 'Approve the item in review',
  'shortcuts.reject': 'Reject the item in review',
  'shortcuts.togglePlayback': 'Play or pause the current video',
  'shortcuts.toggleComparison': 'Toggle the reference comparison view',
  'shortcuts.showHelp': 'Show this list of keyboard shortcuts',
  'shortcuts.key.space': 'Space',
  'shortcuts.singleKey.label': 'Single-key shortcuts',
  'shortcuts.singleKey.description':
    'Approve, reject and playback answer a single letter with no modifier held. Turn this off if a key you meant to type is making decisions.',

  'projects.loading': 'Loading projects',
  'projects.error.title': 'The project list could not be read',
  'projects.empty.title': 'No projects yet',
  'projects.empty.description':
    'Nothing has been created on this machine. Creating a project is not wired up in this build yet — the orchestrator accepts it, but the request shape it validates against is not published through the shared contract.',
  'projects.created': 'Created {date}',
  'projects.kind.SERIES': 'Series',
  'projects.kind.STANDALONE': 'Standalone',
  'projects.kind.MUSIC': 'Music',
  'projects.kind.EXPERIMENTAL': 'Experimental',
  'projects.kind.CUSTOM': 'Custom',
  'projects.language': 'Primary language',
  'projects.open': 'Open {title}',

  'captureGuide.title': 'Capture guide',
  'captureGuide.intro':
    'Advice for photographing a subject, not a checklist to complete. Every view below is optional, and a missing one is not an error — a car has no expression sheet.',
  'captureGuide.views': 'Recommended views',
  'captureGuide.advice': 'Capture advice',
  'captureGuide.hide': 'Hide the capture guide',
  'captureGuide.show': 'Show the capture guide',
  'captureGuide.error.title': 'The capture guide could not be read',

  'project.invalidId.title': 'That is not a project id',
  'project.invalidId.description':
    'The address carries something the orchestrator would refuse. Open the project from the project list rather than editing the URL.',
  'assets.title': 'Source assets',
  'assets.loading': 'Loading source assets',
  'assets.error.title': 'The asset list could not be read',
  'assets.empty.title': 'No source assets yet',
  'assets.empty.description':
    'Nothing has been imported into this project. Importing is not wired up in this build yet — the orchestrator accepts both an upload and a point-at-a-path import, but neither request shape is published through the shared contract.',
  'assets.thumbnailAlt': 'Thumbnail of {path}',
  'assets.immutable': 'Original, never edited in place',
  'assets.captured': 'Captured:',
  'assets.type.IMAGE': 'Image',
  'assets.type.VIDEO': 'Video',
  'assets.type.AUDIO': 'Audio',
  'assets.type.DRAWING': 'Drawing',
  'assets.type.RENDER_3D': '3D render',
  'assets.type.DOCUMENT': 'Document',
  'assets.type.OTHER': 'Other',
  'assets.origin.CAMERA_CAPTURE': 'Camera capture',
  'assets.origin.IMPORTED': 'Imported',
  'assets.origin.LOCALLY_GENERATED': 'Locally generated',
  'assets.origin.DERIVED': 'Derived',
  'assets.privacy.PROJECT_PRIVATE': 'Project private',
  'assets.privacy.EXPORTABLE': 'Exportable',
  'assetDetail.error.title': 'This asset could not be read',
  'assetDetail.loading': 'Loading this asset',
  'assetDetail.invalidAsset.title': 'That is not an asset id',
  'assetDetail.invalidAsset.description':
    'The address carries something the orchestrator would refuse. Open the asset from the library rather than editing the URL.',
  'assetDetail.back': 'Back to the asset library',
  'assetDetail.identity.title': 'What this file is',
  'assetDetail.field.path': 'Path in the project:',
  'assetDetail.field.mimeType': 'Media type:',
  'assetDetail.field.sha256': 'SHA-256:',
  'assetDetail.field.captured': 'Captured:',
  'assetDetail.field.added': 'Added to the project:',
  'assetDetail.exportable':
    'This asset is marked exportable, which means it may leave this machine in a delivery. Everything else stays in the project.',
  'assetDetail.probe.title': 'What the orchestrator recorded',
  'assetDetail.probe.empty':
    'The orchestrator recorded no metadata for this asset.',
  'assetDetail.probe.unpublished':
    'These are read exactly as the orchestrator wrote them. The shared contract types this as a free-form object, so nothing here is interpreted or given a unit.',
  'assetDetail.proxy.title': 'Scrub proxy',
  'assetDetail.proxy.absent.title': 'No proxy yet',
  'assetDetail.proxy.absent.description':
    'The orchestrator has no proxy for this asset yet. A proxy is produced by a queued job, so this means the job has not run. That is not an error, and the original is untouched either way.',
  'assetDetail.proxy.unsupported':
    'The orchestrator generates a scrub proxy for video only. This asset is not video, so there is nothing to play.',
  'assetDetail.proxy.label': 'Scrub proxy of {path}',
  'assetDetail.proxy.retry': 'Ask again',
  'assetDetail.proxy.error.title': 'Could not tell whether a proxy exists',
  'assetDetail.proxy.purpose':
    'This is a generated proxy for scrubbing, not the original file. Judge framing and timing here, not grain.',
  'assetDetail.derived.title': 'Derived assets',
  'assetDetail.derived.unavailable':
    'The orchestrator publishes no way to ask what was derived from an asset, so this cannot be listed yet. That is a missing endpoint, not an empty result.',
  'assetDetail.subjects.title': 'Subjects that reference this',
  'assetDetail.subjects.unavailable':
    'Subjects are not served by the orchestrator yet, so nothing can be listed here. That is a missing endpoint, not an empty result.',

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
    'A render will refuse to start. This disk is short by:',

  'system.mode.title': 'Operating mode',
  'system.mode.localOnly': 'Local-only generation',
  'system.mode.strictOffline': 'Strict offline',
  'system.mode.allowLanWorkers': 'LAN render workers',
  'system.mode.claudeCodeOperator': 'Claude Code operator',
  'system.mode.lmStudioMcpHost': 'LM Studio MCP host',
  'system.mode.lmStudioMcpHost.description':
    'A local model in LM Studio may drive the Studio through its MCP tools. That is a control surface on this machine, not a route off it.',
  'system.mode.error.title': 'The operating mode could not be read',
  'system.value.on': 'On',
  'system.value.off': 'Off',

  'system.hardware.title': 'Hardware profile',
  'system.hardware.unknown.title':
    'This machine matches no known hardware profile',
  'system.hardware.unknown.description':
    'Renders refuse to start without one, because every capability limit is measured per profile. A profile has to be added for this machine before anything will run.',
  'system.hardware.unpublished':
    'The acceleration backend and the measured capabilities of this profile are not published by the orchestrator yet.',

  'system.disk.title': 'Disk',
  'system.disk.free': 'Free space',
  'system.disk.missingModels': 'Missing model files',
  'system.disk.workingSpace': 'Working space reserved',
  'system.disk.safetyHeadroom': 'Safety headroom',
  'system.disk.required': 'Required to start',
  'system.disk.shortfall': 'Short by',
  'system.disk.passed': 'There is enough free space for a render to start.',

  'system.models.title': 'Models',
  'system.models.summary': '{ready} of {total} models have every file on disk',
  'system.models.missingTotal': 'To fetch or replace:',
  'system.models.root': 'Models folder',
  'system.models.license': 'Licence',
  'system.models.size': 'Size',
  'system.models.missing': 'To fetch or replace',
  'system.models.upstream': 'Upstream repository',
  'system.models.filesPresent': 'Files ready',
  'system.models.filesMissing': 'Files not ready',
  'system.models.readyMeaning':
    'Files ready means every file is on disk at the size the manifest declares, which is the whole of what this report checks. It does not mean the file is intact: nothing on this screen opens a file, and neither does the MODEL_HASHES_MATCH preflight check, which reports what an earlier verification recorded. A present file of the declared size is reported here the same way whether or not the manifest declares a hash for it, so nothing on this screen separates proven from unproven — MODEL_HASHES_MATCH is where that shows, and it fails while any present file has not been hashed since it last changed. Starting a verification is a separate request, and this screen has no control for it. It does not mean the model has been benchmarked on this hardware either — the orchestrator does not publish that classification yet, so nothing here should be read as tested.',
  'system.models.noDownload':
    'Local AI Studio never downloads a model. Run this yourself:',
  'system.models.files': 'Files',
  'system.models.empty': 'The manifest declares no models.',
  'system.models.error.title': 'The model setup report could not be read',
  'system.models.fileStatus.VERIFIED': 'Hash verified',
  'system.models.fileStatus.PRESENT_UNVERIFIABLE': 'Present, hash unknown',
  'system.models.fileStatus.PRESENT_UNVERIFIED':
    'Present, not hashed since it changed',
  'system.models.fileStatus.MISSING': 'Missing',
  'system.models.fileStatus.SIZE_MISMATCH': 'Wrong size',
  'system.models.fileStatus.HASH_MISMATCH': 'Hash mismatch',
  'system.models.fileStatus.UNREADABLE': 'Unreadable',
  'system.models.role.VIDEO': 'Video',
  'system.models.role.IMAGE': 'Image',
  'system.models.role.IMAGE_EDIT': 'Image edit',
  'system.models.role.TEXT': 'Text',
  'system.models.role.TTS': 'Speech',
  'system.models.role.MUSIC': 'Music',

  'system.preflight.title': 'Preflight',
  'system.preflight.status.PASS': 'Passed',
  'system.preflight.status.FAIL': 'Failed',
  'system.preflight.status.NOT_APPLICABLE': 'Not applicable',
  'system.preflight.status.NOT_IMPLEMENTED': 'Not implemented',
  'system.preflight.notRunNote':
    'A check that did not run is not a check that passed.',

  'system.pressure.title': 'Memory and pressure',
  'system.pressure.unavailable':
    'The orchestrator publishes no live memory, VRAM or swap reading yet, so there is nothing here. That is an absent measurement, not a measurement of zero.',
  'system.runtimes.title': 'Runtimes',
  'system.runtimes.unavailable':
    'The orchestrator publishes no version for ComfyUI, LM Studio, FFmpeg or the database yet. The preflight checks are the only thing reporting on whether they start.',

  'dashboard.projectData.title': 'Nothing in this project is wired up yet',
  'dashboard.projectData.description':
    'Subjects, locations, productions and reusable assets belong here. The orchestrator serves no project data yet, so this dashboard can only report what the machine itself is able to do.',
  'dashboard.openSystem': 'Open system status',

  'page.notFound.title': 'Page not found',
  'page.notFound.description':
    'Nothing in Local AI Studio matches this address.',
  'page.projects.title': 'Projects',
  'page.projects.description':
    'Every Local AI Studio project on this machine. Not connected to the orchestrator yet.',
  'page.dashboard.title': 'Dashboard',
  'page.dashboard.description':
    'What is waiting for you in this project, and whether this machine can do the next thing.',
  'page.assets.title': 'Assets',
  'page.assets.description':
    'The source footage, images and audio brought into this project. Not connected to the orchestrator yet.',
  'page.assetDetail.title': 'Asset',
  'subjects.title': 'Subjects',
  'subjects.loading': 'Loading subjects',
  'subjects.error.title': 'The subject list could not be read',
  'subjects.empty.title': 'No subjects yet',
  'subjects.empty.description':
    'Nothing has been registered in this project. Registering is not wired up in this build yet — the orchestrator accepts a subject, but the request shape is not published through the shared contract.',
  'subjects.inactive': 'Inactive',
  'subjects.type.HUMAN': 'Human',
  'subjects.type.ANIMAL': 'Animal',
  'subjects.type.OBJECT': 'Object',
  'subjects.type.FIGURE': 'Figure',
  'subjects.type.CREATURE': 'Creature',
  'subjects.type.VEHICLE': 'Vehicle',
  'subjects.type.PRODUCT': 'Product',
  'subjects.type.ROBOT': 'Robot',
  'subjects.type.ABSTRACT': 'Abstract',
  'subjects.type.OTHER': 'Other',
  'subjects.sourceMode.CAPTURED': 'Captured',
  'subjects.sourceMode.IMPORTED': 'Imported',
  'subjects.sourceMode.GENERATED': 'Generated',
  'subjects.sourceMode.HYBRID': 'Hybrid',
  'subjects.narrativeRole.CHARACTER': 'Character',
  'subjects.narrativeRole.BACKGROUND_ENTITY': 'Background entity',
  'subjects.narrativeRole.PRODUCT': 'Product',
  'subjects.narrativeRole.OBJECT': 'Object',
  'subjects.narrativeRole.OTHER': 'Other',
  'subjects.approval.PENDING': 'Awaiting approval',
  'subjects.approval.APPROVED': 'Approved',
  'subjects.approval.REJECTED': 'Rejected',
  'subjects.role.SOURCE': 'Source',
  'subjects.role.PRIMARY': 'Primary',
  'subjects.role.FRONT_VIEW': 'Front',
  'subjects.role.REAR_VIEW': 'Rear',
  'subjects.role.LEFT_VIEW': 'Left',
  'subjects.role.RIGHT_VIEW': 'Right',
  'subjects.role.THREE_QUARTER': 'Three-quarter',
  'subjects.role.DETAIL': 'Detail',
  'subjects.role.EXPRESSION': 'Expression',
  'subjects.role.POSE': 'Pose',
  'subjects.role.TEXTURE': 'Texture',
  'subjects.role.MASK': 'Mask',
  'subjects.role.SCALE': 'Scale reference',

  'subjectReview.error.title': 'This subject could not be read',
  'subjectReview.loading': 'Loading this subject',
  'subjectReview.invalidSubject.title': 'That is not a subject id',
  'subjectReview.invalidSubject.description':
    'The address carries something the orchestrator would refuse. Open the subject from the list rather than editing the URL.',
  'subjectReview.back': 'Back to the subject list',
  'subjectReview.identity.title': 'What must not change',
  'subjectReview.identity.immutable': 'Immutable traits',
  'subjectReview.identity.prohibited': 'Prohibited changes',
  'subjectReview.identity.mutable': 'May vary between shots',
  'subjectReview.identity.wardrobe': 'Wardrobe and surface rules',
  'subjectReview.identity.palette': 'Colour palette',
  'subjectReview.identity.scale': 'Relative scale:',
  'subjectReview.identity.speech': 'Speech style:',
  'subjectReview.identity.none': 'None recorded.',
  'subjectReview.canonical.error.title': 'The canonical set could not be read',
  'subjectReview.references.error.title': 'The references could not be read',
  'subjectReview.canonical.title': 'Canonical reference set',
  'subjectReview.canonical.absent.title': 'No approved set',
  'subjectReview.canonical.absent.description':
    'This subject has no approved canonical set, so nothing may be generated from it. That block is the point: it stops a long render from committing to a likeness nobody has agreed to.',
  'subjectReview.canonical.blocked':
    'Generation is blocked for this subject until a canonical set is approved.',
  'subjectReview.canonical.version': 'Approval version:',
  'subjectReview.canonical.approvedAt': 'Approved:',
  'subjectReview.canonical.frozenDescriptor': 'Frozen descriptor',
  'subjectReview.canonical.frozenHash': 'Descriptor SHA-256:',
  'subjectReview.canonical.frozenExplained':
    'Approval froze this wording and hashed it. A later revision cannot rewrite what an existing production was planned against — it becomes a new version.',
  'subjectReview.canonical.notes': 'Notes',
  'subjectReview.references.title': 'What the set depicts',
  'subjectReview.references.empty':
    'This set has no references yet. A set with no reference cannot anchor a generation.',
  'subjectReview.references.anchor': 'Anchor eligible',
  'subjectReview.references.notAnchor': 'Not an anchor',
  'subjectReview.references.anchorExplained':
    'An anchor is a reference a generation may be tied to. A reference that is not anchor-eligible is still part of the set, but nothing derives identity from it.',
  'subjectReview.references.approved': 'Approved',
  'subjectReview.references.pending': 'Not approved',
  'subjectReview.references.generated':
    'Generated artifact — the orchestrator serves no image for one yet.',
  'subjectReview.references.alt': 'Reference {role} for this subject',
  'subjectReview.draft.title': 'Open draft',
  'subjectReview.draft.error.title': "This subject's drafts could not be read",
  'subjectReview.draft.none.title': 'No open draft',
  'subjectReview.draft.none.description':
    'Approving happens to a draft, never to the approved set. This subject has no draft open.',
  'subjectReview.draft.cannotOpen':
    'Opening one is not offered here: it needs a request body whose shape the orchestrator does not publish through its contract package, and this build will not guess at it.',
  'subjectReview.draft.opened': 'Opened:',
  'subjectReview.draft.notes': 'Notes',
  'subjectReview.draft.context': 'the canonical set for {subject}',
  'subjectReview.draft.explained':
    'Approving freezes this set. Its descriptor is recorded and hashed, it becomes the version every generation is anchored to, and nothing about it can be changed afterwards — including un-approving it.',
  'subjectReview.draft.approveError.title': 'This draft was not approved',
  'subjectReview.draft.approved':
    'Approved. This set is now the version every generation of this subject is anchored to, and it can no longer be changed.',

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
    'Hardware profile, installed models, disk space, preflight and the operating mode of this installation.',
} satisfies Record<string, string> & Record<`error.${ErrorCode}`, string>;

export type TranslationKey = keyof typeof EN_CATALOGUE;
