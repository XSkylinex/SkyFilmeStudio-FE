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
  'error.SHOT_TRANSITION_INVALID':
    'That shot is not in the state this move assumed, so nothing changed. Either the step was never legal from where the shot is, or something else moved it first. Re-read the shot before deciding what to do next.',
  'error.SHOT_STRATEGY_INVALID':
    'A shot that names a subject asked for a generation strategy reserved for shots with no subject in them. The plan has to change: a subject-centric shot renders from an approved keyframe or from another subject-aware strategy.',
  'error.SHOT_DURATION_UNMEASURED':
    'This shot has dialogue whose speech has not been generated yet, so how long it runs is not known. A dialogue shot is timed from the audio that was actually produced — generate the draft speech first. Sending this again changes nothing.',
  'error.SUBJECT_DESCRIPTOR_UNAVAILABLE':
    'A subject in this shot has no frozen descriptor, and that only exists once its canonical set has been approved. Approve the subject first: a prompt cannot describe someone the system has not agreed the look of.',
  'error.PROMPT_SPEC_IMMUTABLE':
    'One of this scene’s shots already carries a compiled prompt, which is the record of how something was rendered and is never overwritten. Withdraw or supersede that shot deliberately rather than replacing the whole scene.',
  'error.LIMITED_ANIMATION_OVERUSED':
    'More of this scene is limited animation than the plan allows, which is how a production becomes a slideshow without anyone choosing that. If it is deliberate, raise the ceiling on the request explicitly.',
  'error.VOICE_PROFILE_NOT_APPROVED':
    'This line would be spoken by a voice that is not the approved one for its speaker — either the profile is still a draft, or it belongs to a different subject. A recurring subject gets one approved voice, or the production ends up with a different voice per line. Approve that subject’s voice profile, or point the line at it.',
  'error.VOICE_LANGUAGE_UNSUPPORTED':
    'The voice profile for this line does not declare the language the line is written in. Add that language to the profile that already exists — a second voice for the same subject would make them sound like two different people.',
  'error.DIALOGUE_AUDIO_IMMUTABLE':
    'This dialogue line is approved, and its audio was generated from the text as it stands. Editing the words or the timing now would leave approved audio saying something else — withdraw the approval first.',
  'error.ASR_UNAVAILABLE':
    'The advisory check that listens back to generated speech could not run, because no local speech-recognition model is available. The audio itself is unaffected — it simply was not transcribed and compared.',
  'error.TIER_REQUIRES_BENCHMARK':
    'The dialogue animation tier that was asked for is held behind a hardware benchmark and a subject-consistency test, and neither has run on this machine. Nothing waits for it — choose another tier.',
  'error.STORYBOARD_NOT_APPROVED':
    'This shot needs an approved keyframe before any video is rendered from it, and it has neither one nor a recorded waiver. A wrong keyframe multiplied by a video render is an hour of work thrown away — approve a keyframe, or record why this shot may skip one.',
  'error.STORYBOARD_FRAME_IMMUTABLE':
    'This storyboard frame has been approved, so it is frozen. Whatever was rendered from it keeps the frame it was rendered against — generate the next one rather than editing this one.',
  'error.KEYFRAME_ANCHOR_REQUIRED':
    'A keyframe for this shot has to be anchored to the approved look of what it contains — the subject, the location, the props — and no anchor was available. That anchoring is what stops the same character drifting from shot to shot.',
  'error.REGENERATION_MODE_REQUIRED':
    'Regenerating this frame needs the mode stated: the same prompt with a new seed, a controlled revision of the prompt, or a fresh keyframe. Those are different operations, and an unlabelled retry makes the attempt history impossible to read afterwards.',
  'error.QC_RUN_SCOPE_REQUIRED':
    'A quality-control run has to be attached to something — either one shot or a whole production. This one named neither, so nothing could say what it had checked. Sending it again unchanged will fail the same way.',
  'error.PRODUCTION_QC_REPORT_VERSION_EXISTS':
    'This production already has a quality-control report at that version. Reports are numbered and never overwritten, so the next one has to be a new version rather than a reuse of this one.',
  'error.KEYFRAME_REQUIREMENT_DERIVED':
    'Whether a keyframe is required by the subjects in a shot is worked out when the scene is planned, so it cannot be chosen by hand — say instead that a person is asking for the keyframe. And once a shot carries a canonical subject the requirement cannot be changed at all: record a waiver with a reason if this shot may skip the gate.',
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
    'The dictionary already holds an entry that normalises to the same term as this one. Two spellings can normalise together — a decomposed accent, a stray direction mark, a doubled space — so the entry already there may not look identical to what was typed. There is no route to edit an entry, so changing what a term sounds like means deleting the one that is there and adding its replacement.',
  'error.LOCATION_IMMUTABLE':
    'This location has been approved, so it can no longer be edited or approved again. Approved locations are frozen deliberately — shots already planned against this one must not have the place change underneath them. The freeze does not block deleting it, and a change means a new location rather than an edit.',
  'error.PROP_IMMUTABLE':
    'This prop has been approved, so it can no longer be edited or approved again. Its continuity rules are what later scenes get checked against, so they are frozen at approval. The freeze does not block deleting it, and a change means a new prop rather than an edit.',
  'error.LOCATION_PLATE_IMMUTABLE':
    'This plate has been approved, so it can no longer be edited or approved again. An approved plate is the canonical image for its kind, and scenes already framed against it must not shift. The freeze does not block deleting it, and a change means a new plate rather than an edit.',
  'error.LOCATION_PLATE_KIND_ALREADY_APPROVED':
    'This location already has an approved plate of that kind, and it gets exactly one — that is what keeps the place recognisable from cut to cut. Delete the plate that holds the place first: un-approving it is refused, so deleting is the only way to free it. Further drafts of the same kind may sit alongside it in the meantime.',
  'error.PROJECT_BIBLE_IMMUTABLE':
    'This bible version has been published, so it and its subject rules are frozen. A production that planned against it keeps what it planned against — a change means publishing the next version rather than editing this one.',
  'error.PROJECT_BIBLE_VERSION_EXISTS':
    'Another version of this bible was created at the same moment, so this one lost the race for its version number. Nothing was lost and nothing needs retyping — send it again and it will take the next number.',
  'error.PROJECT_BIBLE_NARRATIVE_NOT_APPLICABLE':
    'This kind of project carries no narrative section, so world rules, humour and drama language, chronology and subject behaviour have to stay empty. Clear those fields — for this kind of project the bible is the remaining sections only.',
  'error.VOICE_RULES_REQUIRE_SPEECH':
    'This subject is not recorded as one that speaks, so it cannot carry voice rules. Either clear the voice rules, or record the subject as speaking first.',
  'error.CONTINUITY_SCOPE_INVALID':
    "Either a fact's scope is not a valid one — its start or end scene is not part of this production, or the end scene comes before the start — or this production cannot be re-planned while facts are still scoped to the scenes being replaced. Pick both scenes from this production with the end no earlier than the start, or withdraw the facts that point at those scenes first.",
  'error.SCENE_IN_USE':
    'This production cannot be re-planned: its scenes already carry shots, dialogue lines or render jobs, and applying an outline replaces the whole scene set. The orchestrator refuses rather than orphaning that work — revise the scenes individually, or withdraw what depends on them first.',
  'error.CONTINUITY_CONTEXT_REQUIRED':
    'The orchestrator asked a model to reason about a single scene without supplying that scene, so nothing was generated. The model remembers nothing between turns, which is why that context is not optional — this is a fault in the orchestrator rather than something to correct here.',
  'error.PRODUCTION_TRANSITION_INVALID':
    'This production cannot move to that state from the one it is in. Either the workflow does not allow the move — the message names where it can go from here — or another transition reached it first, which means the state on screen is already stale. Re-read it before deciding again.',
  'error.PRODUCTION_PROFILE_SECTIONS_OVERLAP':
    'Two sections of this structure profile cover the same stretch of time. Sections may share a boundary but not a span, so shorten one or move where it starts.',
  'error.PRODUCTION_PROFILE_IN_USE':
    'This structure profile is still pinned by productions that were planned against its runtime budget, so removing it would change what they were planned against. Point those productions at another profile first.',
  'error.PRODUCTION_RENDER_NOT_PERMITTED':
    'This production is not in a state that permits the render that was queued. Rendering waits on approvals its current state has not passed, which is what stops hours of work running against a plan nobody signed off.',
  'error.PLANNING_STAGE_MISSING':
    'A planning stage this production needs has not been run. The message names which one, and lists everything this kind of production requires — a kind that needs no screenplay will not ask for one.',
  'error.RUNTIME_BUDGET_OUT_OF_TOLERANCE':
    'This production cannot leave planning because its scenes do not reach the target runtime within the tolerance that was set. The message says by how much. Add, cut or re-time scenes, or change the target.',
  'error.RUNTIME_TOLERANCE_UNDECLARED':
    'Neither this production nor the structure profile it is bound to declares a runtime tolerance, and there is deliberately no default — a tolerance that suits a twenty-minute film does not suit a thirty-second one. Set one on either.',
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
  'subjects.truncated':
    'More subjects exist than are shown. This screen reads the first page only, and paging is not built yet.',
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
  'subjectReview.comparison.title': 'Approved against the draft',
  'subjectReview.comparison.explained':
    'The approved set on one side, the open draft on the other, matched by role and shown large. Identity drift is judged here — the grids above are for finding a reference, not for comparing two.',
  'subjectReview.comparison.noApproved':
    'There is a draft but no approved set yet, so there is nothing to compare it against. Approving this draft makes it the head every later one is judged from.',
  'subjectReview.comparison.noDraft':
    'There is an approved set and no open draft, so there is nothing to compare. A comparison appears when a draft is opened.',
  'subjectReview.comparison.approvedSide': 'Approved',
  'subjectReview.comparison.draftSide': 'Draft',
  'subjectReview.comparison.missingSide':
    'No {role} reference on the {side} side',
  'subjectReview.comparison.alt': '{side} {role} reference',
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
  'styles.heading': 'Style profiles',
  'styles.loading': 'Loading style profiles…',
  'styles.error.title': 'The style profiles could not be read',
  'styles.empty.title': 'No style profiles yet',
  'styles.empty.description':
    'A style profile records the palette, lighting, camera, texture and motion rules a production is generated against. This project has none yet — add the first.',
  'styles.pinning':
    'A profile is a lineage and each row below is one version of it. Which version a production is pinned to is not shown: a production records the version it used, but no published route returns a production, so nothing here can read that record.',
  'styles.truncated':
    'More style profiles exist than are shown, so a lineage may be missing from this list. Each lineage shown reads its own full version history, so the counts above are not affected.',
  'styles.lineage.unreadable':
    'The versions of this lineage could not be read, so how many there are and which is approved is unknown rather than none.',
  'styles.lineage.versionCount': 'Versions: {count}',
  'styles.lineage.noApproved': 'No approved version',
  'styles.lineage.approvedIs': 'Approved: v{version}',
  'styles.version.label': 'v{version}',
  'styles.version.approved': 'Approved',
  'styles.version.context': 'version {version} of {name}',
  'styles.approveError.title': 'That version was not approved',
  'page.styles.title': 'Styles',
  'page.styles.description':
    'The visual styles this project generates against, grouped into lineages with their versions.',
  'voices.loading': 'Loading voices…',
  'voices.error.title': 'The voices could not be read',
  'voices.empty.title': 'No voices yet',
  'voices.empty.description':
    'A voice profile is what keeps a subject sounding like itself across a production. This project has none yet — add the first.',
  'voices.truncated':
    'More voices exist than are shown. This screen reads the first page only, and paging is not built yet.',
  'voices.onePerSubject':
    'A subject gets exactly one approved voice. Several drafts may exist, and the limit is enforced when one is approved rather than when it is created — so a second draft is allowed and approving it will be refused until the first is deleted.',
  'voices.noPreview':
    'Nothing here can be listened to. The orchestrator publishes no synthesis preview route, so a voice is judged from its engine, model and reference transcript rather than from sound.',
  'voices.group.subjects': 'Attached to a subject',
  'voices.group.standalone': 'Narrator and standalone',
  'voices.group.noneForSubjects': 'No subject in this project has a voice yet.',
  'voices.group.noneStandalone':
    'No narrator or standalone voice yet. A voice does not need a subject.',
  'voices.card.approved': 'Approved',
  'voices.card.draft': 'Draft',
  'voices.card.engine': 'Engine',
  'voices.card.model': 'Model',
  'voices.card.language': 'Language',
  'voices.card.context': 'the voice {name}',
  'voices.approveError.title': 'That voice was not approved',
  'voices.dictionaries.title': 'Pronunciation dictionaries',
  'voices.dictionaries.error.title':
    'The pronunciation dictionaries could not be read',
  'voices.dictionaries.empty.title': 'No pronunciation dictionaries yet',
  'voices.dictionaries.empty.description':
    'A dictionary holds one project language and the terms whose pronunciation is overridden in it.',
  'voices.dictionaries.editNote':
    'An entry cannot be edited: the orchestrator publishes no route for it, so changing one means deleting it and adding the replacement.',
  'voices.entries.none': 'This dictionary has no entries.',
  'voices.entries.unreadable':
    'The entries for this dictionary could not be read, so this is unknown rather than empty.',
  'voices.entries.truncated':
    'This dictionary holds more entries than one page, and the rest are not shown.',
  'voices.entries.normalisedAs': 'normalises to',
  'page.voices.title': 'Voices',
  'page.voices.description':
    'The persistent voices this project speaks with, and the pronunciation dictionaries it holds. Which voice uses which dictionary is not shown yet.',
  'locations.loading': 'Loading locations…',
  'locations.error.title': 'The locations could not be read',
  'locations.empty.title': 'No locations yet',
  'locations.empty.description':
    'A location holds the immutable features and canonical plates a scene is framed against. This project has none yet — add the first.',
  'locations.truncated':
    'More locations exist than are shown. This screen reads the first page only, and paging is not built yet.',
  'locations.coverageNote':
    'Plate kinds are open text, not a fixed list, so coverage below is what each location actually has. The four suggested kinds are a starting point, never a requirement, and a lighting variant such as a night plate is not a kind the orchestrator publishes at all.',
  'locations.card.approved': 'Approved',
  'locations.card.draft': 'Draft',
  'locations.card.immutableFeatures': 'Immutable features:',
  'locations.card.context': 'the location {name}',
  'locations.approveError.title': 'That location was not approved',
  'locations.plates.title': 'Plate coverage',
  'locations.plates.none':
    'No plates at all, so any scene here resolves from text rather than from a canonical image.',
  'locations.plates.approved': 'Approved',
  'locations.plates.draftsOnly': 'None approved — drafts: {count}',
  'locations.plates.suggestedMissing':
    'Suggested kinds with no plate yet — suggestions, not requirements:',
  'locations.plates.truncated':
    'This location has more plates than one page holds, so the coverage above is computed from part of them.',
  'locations.plates.unreadable':
    'The plates for this location could not be read, so coverage is unknown rather than empty.',
  'page.locations.title': 'Locations',
  'page.locations.description':
    'The locations this project shoots against, with the canonical plate coverage each one has.',
  'props.loading': 'Loading props…',
  'props.error.title': 'The props could not be read',
  'props.empty.title': 'No props yet',
  'props.empty.description':
    'A prop carries the continuity rules a later scene is checked against. This project has none yet — add the first.',
  'props.truncated':
    'More props exist than are shown. This screen reads the first page only, and paging is not built yet.',
  'props.card.approved': 'Approved',
  'props.card.draft': 'Draft',
  'props.card.owned': 'Belongs to a subject',
  'props.card.ownedBy': 'Belongs to {name}',
  'props.card.continuityRules': 'Continuity rules',
  'props.card.noContinuityRules':
    'No continuity rules recorded, so nothing about this prop will be checked between scenes.',
  'props.card.appearancesUnavailable':
    'Where this prop appears is not shown: continuity facts are scoped to a production and carry an untyped entity id, so nothing published joins a prop to its scenes.',
  'props.card.context': 'the prop {name}',
  'props.approveError.title': 'That prop was not approved',
  'page.props.title': 'Props',
  'page.props.description':
    'The props this project tracks, with the continuity rules each one carries.',
  'page.productions.title': 'Productions',
  'page.productions.description':
    'Every production in this project, from screenplay to final cut. Not connected to the orchestrator yet.',
  'page.planner.title': 'Plan',
  'page.planner.description':
    'The screenplay or production plan driving this production. Not connected to the orchestrator yet.',
  'page.storyboard.title': 'Storyboard',
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
  'form.invalid.required': 'This needs a value.',
  'form.invalid.tooSmall': 'This number is too small.',
  'form.invalid.tooBig': 'This number is too large.',
  'form.invalid.type': 'This is not the kind of value this field takes.',
  'form.invalid.value': 'The contract will not accept this value.',
  'library.add': 'Add',
  'library.edit': 'Edit',
  'library.save': 'Save changes',
  'library.cancel': 'Cancel',
  'library.saving': 'Saving…',
  'library.creating': 'Creating…',
  'library.saved': 'Saved.',
  'library.created': 'Created.',
  'library.approved': 'Approved.',
  'library.frozen':
    'This record is approved, so it is frozen and cannot be edited. That is what makes it safe for anything already pointing at it — the freeze is enforced by the database, not by this screen.',
  'library.frozen.styleVersion':
    'This version is approved, so it is frozen. Edit it by creating the next version instead: productions stay pinned to the version they used, which is the whole reason a change cannot be made in place.',
  'library.newVersion': 'Create the next version',
  'library.newVersion.title': 'Create the next version of this style',
  'library.newVersion.explain':
    'This starts a new version in the same lineage, copied from this one. Nothing already pinned to an existing version moves, and the new version arrives unapproved.',
  'library.field.name': 'Name',
  'library.field.description': 'Canonical description',
  'library.field.mode': 'Style mode',
  'library.field.mode.hint':
    'A free-text mode this project defines. The orchestrator suggests some; none is a default.',
  'library.field.layoutNotes': 'Layout notes',
  'library.field.immutableFeatures': 'Immutable features',
  'library.field.continuityRules': 'Continuity rules',
  'library.field.displayName': 'Display name',
  'library.field.engine': 'Engine',
  'library.field.modelId': 'Model id',
  'library.field.language': 'Language tag',
  'library.field.linesHint': 'One per line.',
  'library.field.realismLevel': 'Realism level',
  'library.field.paletteRules': 'Palette rules',
  'library.field.lightingRules': 'Lighting rules',
  'library.field.cameraRules': 'Camera rules',
  'library.field.textureRules': 'Texture rules',
  'library.field.motionRules': 'Motion rules',
  'library.field.prohibitedStyleDrift': 'Prohibited style drift',
  'library.field.referenceAudioPath':
    'Reference audio, as a project-relative path',
  'library.field.referenceTranscript': 'Exact transcript of that audio',
  'library.field.referenceTranscript.hint':
    'It must match the recording word for word. A transcript that drifts from the audio is the most common cause of a voice that does not sound like itself.',
  'styles.create.open': 'Add a style',
  'styles.create.title': 'Add a style profile',
  'styles.edit.title': 'Edit this style version',
  'voices.create.open': 'Add a voice',
  'voices.create.title': 'Add a voice profile',
  'voices.edit.title': 'Edit this voice profile',
  'locations.create.open': 'Add a location',
  'locations.create.title': 'Add a location',
  'locations.edit.title': 'Edit this location',
  'props.create.open': 'Add a prop',
  'props.create.title': 'Add a prop',
  'props.edit.title': 'Edit this prop',
  'productions.heading': 'Productions in this project',
  'productions.loading': 'Reading this project’s productions…',
  'productions.error.title': 'The production list could not be read',
  'productions.empty.title': 'No productions yet',
  'productions.empty.description':
    'A production is one finished piece — an episode, a music video, a trailer. Create one to start planning it.',
  'productions.truncated':
    'The orchestrator has more productions than this. Only the first page is read here.',
  'productions.card.open': 'Open the plan for {title}',
  'productions.card.sequence': 'Number in sequence:',
  'productions.card.target': 'Target runtime:',
  'productions.card.tolerance': 'Tolerance:',
  'productions.card.toleranceFromProfile': 'Declared by its structure profile',
  'productions.card.toleranceUndeclared': 'None declared',
  'productions.card.toleranceUndeclared.detail':
    'Neither this production nor a structure profile declares a runtime tolerance, so the orchestrator refuses to judge whether the plan adds up. There is no default, because a tolerance that suits a twenty-minute episode is wrong for a thirty-second trailer.',
  'productions.card.planVersion': 'Plan version:',
  'productions.card.screenplayVersion': 'Screenplay version:',
  'productions.card.noScreenplayVersion': 'No screenplay version yet',
  'productions.kind.label': 'Kind',
  'productions.kind.EPISODE': 'Episode',
  'productions.kind.SHORT_FILM': 'Short film',
  'productions.kind.FILM': 'Film',
  'productions.kind.MUSIC_VIDEO': 'Music video',
  'productions.kind.TRAILER': 'Trailer',
  'productions.kind.MONTAGE': 'Montage',
  'productions.kind.NARRATED_STORY': 'Narrated story',
  'productions.kind.CUSTOM': 'Custom kind',
  'productions.mode.label': 'Narrative mode',
  'productions.mode.SCREENPLAY': 'Screenplay',
  'productions.mode.TREATMENT': 'Treatment',
  'productions.mode.MUSIC_DRIVEN': 'Music-driven',
  'productions.mode.VISUAL_ONLY': 'Visual only',
  'productions.mode.IMPORTED_TIMELINE': 'Imported timeline',
  'productions.mode.CUSTOM': 'Custom mode',
  'productions.state.IDEA': 'Idea',
  'productions.state.OUTLINE_DRAFT': 'Outline draft',
  'productions.state.OUTLINE_APPROVED': 'Outline approved',
  'productions.state.SCREENPLAY_DRAFT': 'Screenplay draft',
  'productions.state.SCREENPLAY_APPROVED': 'Screenplay approved',
  'productions.state.PLANNING': 'Planning',
  'productions.state.STORYBOARDING': 'Storyboarding',
  'productions.state.STORYBOARD_REVIEW': 'Storyboard review',
  'productions.state.AUDIO_RENDER': 'Audio render',
  'productions.state.VIDEO_RENDER': 'Video render',
  'productions.state.SHOT_REVIEW': 'Shot review',
  'productions.state.ASSEMBLY': 'Assembly',
  'productions.state.FINAL_QC': 'Final QC',
  'productions.state.COMPLETE': 'Complete',
  'productions.state.ARCHIVED': 'Archived',
  'productions.create.open': 'New production',
  'productions.create.cancel': 'Cancel',
  'productions.create.heading': 'New production',
  'productions.create.submit': 'Create production',
  'productions.create.submitting': 'Creating…',
  'productions.create.title': 'Title',
  'productions.create.title.hint':
    'What this piece is called. It is content, so it may be in any language.',
  'productions.create.logline': 'Logline',
  'productions.create.logline.hint':
    'One sentence. Optional here — a planning stage can produce it later.',
  'productions.create.brief': 'Brief',
  'productions.create.brief.hint':
    'A paragraph, a treatment, a lesson, a musical brief. Whatever the planner should start from.',
  'productions.create.sequenceNumber': 'Number in sequence',
  'productions.create.sequenceNumber.hint':
    'For a production that belongs in an order, such as an episode.',
  'productions.create.targetRuntime': 'Target runtime',
  'productions.create.targetRuntime.minutes': 'Minutes',
  'productions.create.targetRuntime.seconds': 'Seconds',
  'productions.create.targetRuntime.hint':
    'Nothing here assumes twenty minutes. Thirty seconds and forty-five minutes are equally ordinary.',
  'productions.create.targetRuntime.preview': 'That is:',
  'productions.create.tolerance': 'Runtime tolerance in seconds',
  'productions.create.tolerance.hint':
    'How far the planned total may sit from the target before approval is refused. Leave it empty only if the structure profile below declares one — otherwise the runtime budget cannot judge the plan at all.',
  'productions.create.styleProfile': 'Style profile',
  'productions.create.styleProfile.hint':
    'Required. A production is pinned to one style version for its whole life.',
  'productions.create.styleProfile.version': 'version {version}',
  'productions.create.productionProfile': 'Structure profile',
  'productions.create.productionProfile.none': 'No structure profile',
  'productions.create.productionProfile.hint':
    'Optional. Its reusable sections count toward the runtime budget, and its tolerance stands in for one this production does not declare.',
  'productions.create.blocked.title':
    'A production needs a style profile first',
  'productions.create.blocked.description':
    'Every production is pinned to a style version, and this project has none yet. Create the first one in the style library, then come back here.',
  'productions.create.failed.title': 'The production was not created',
  'planner.error.title': 'This production could not be read',
  'planner.loading': 'Reading this production…',
  'planner.summary.kind': 'Kind:',
  'planner.summary.styleProfile': 'Style profile:',
  'planner.summary.styleVersion': 'Style version:',
  'planner.summary.styleUnresolved':
    'This production names a style version the orchestrator did not return.',
  'planner.summary.stylePinned':
    'A production keeps the style version it was created with. Approving a later version of that profile does not move this one.',
  'planner.summary.mode': 'Narrative mode:',
  'planner.summary.target': 'Target runtime:',
  'planner.budget.heading': 'Does this plan add up?',
  'planner.budget.loading': 'Totalling the plan…',
  'planner.budget.error.title': 'The runtime budget could not be read',
  'planner.budget.undeclared.title': 'Nothing here declares a tolerance',
  'planner.budget.undeclared.description':
    'The orchestrator will not judge this plan, because neither the production nor a structure profile says how far from the target is close enough. There is no default: what is generous for a twenty-minute episode is the whole runtime of a thirty-second trailer.',
  'planner.budget.verdict.WITHIN_TOLERANCE': 'The plan adds up',
  'planner.budget.verdict.SHORT': 'The plan is short',
  'planner.budget.verdict.LONG': 'The plan runs long',
  'planner.budget.target': 'Target:',
  'planner.budget.planned': 'Planned scenes:',
  'planner.budget.reused': 'Reused material:',
  'planner.budget.total': 'Total:',
  'planner.budget.variance.SHORT': 'Missing:',
  'planner.budget.variance.LONG': 'Over:',
  'planner.budget.toleranceLabel': 'Allowed either way:',
  'planner.budget.progress': 'Planned total against the target',
  'planner.budget.segments.heading': 'Where the time goes',
  'planner.budget.segments.empty':
    'This production has no scenes and no reusable material, so there is nothing to total. What it needs planned is listed below.',
  'planner.budget.segments.duration': 'Duration',
  'planner.budget.segments.share': 'Share of target',
  'planner.budget.segments.label': 'Segment',
  'planner.budget.segments.reused': 'Reused',
  'planner.budget.offMean.heading.SHORT': 'Which scenes are underweight',
  'planner.budget.offMean.heading.LONG': 'Which scenes are overweight',
  'planner.budget.offMean.mean': 'This plan’s own average scene:',
  'planner.budget.offMean.spread': 'Spread evenly, each scene would move by:',
  'planner.budget.offMean.none.SHORT':
    'No scene is shorter than this plan’s own average, so the shortfall is spread across all of them rather than sitting in one place.',
  'planner.budget.offMean.none.LONG':
    'No scene is longer than this plan’s own average, so the overrun is spread across all of them rather than sitting in one place.',
  'planner.budget.offMean.explain':
    'Underweight is measured against this plan’s own average scene, not against a target per scene — the orchestrator publishes no such target, and inventing one would be a number this screen made up.',
  'planner.budget.reusedNote':
    'Reused material comes from the structure profile’s reusable sections. It counts toward the total and is not newly written time.',
  'planner.stages.heading': 'What this production needs planned',
  'planner.stages.loading': 'Asking which stages this production needs…',
  'planner.stages.error.title': 'The stage list could not be read',
  'planner.stages.source':
    'This list comes from the orchestrator, which derives it from the production’s narrative mode. It is not assembled here, so a mode that needs no screenplay simply has no screenplay stage in it.',
  'planner.stages.blocked':
    'None of these stages can be run from this screen. The orchestrator has the planning service but publishes no route that runs a stage, so a plan is written through the orchestrator rather than here.',
  'planner.stages.computed': 'Answered by the budget above',
  'planner.stages.computedNote':
    'This one is arithmetic over the scene durations rather than something a model writes, and the orchestrator refuses to generate it.',
  'planner.stage.LOGLINE': 'Logline',
  'planner.stage.BEAT_SHEET': 'Beat sheet',
  'planner.stage.MUSIC_SECTIONS': 'Music sections',
  'planner.stage.VISUAL_BEATS': 'Visual beats',
  'planner.stage.SCENE_OUTLINE': 'Timed scene outline',
  'planner.stage.SCREENPLAY': 'Screenplay and dialogue',
  'planner.stage.CONTINUITY_REVIEW': 'Continuity review',
  'planner.stage.TONE_REVIEW': 'Audience and tone review',
  'planner.stage.RUNTIME_ESTIMATE': 'Runtime estimate',
  'planner.approval.heading': 'Approve the plan',
  'planner.approval.context': 'the plan for {title}',
  'planner.approval.ready':
    'The plan adds up. Approving it moves this production on to storyboarding, and that is a one-way door for this gate.',
  'planner.approval.blocked.title':
    'Approval is refused while the plan does not add up',
  'planner.approval.blocked.description':
    'The orchestrator checks the budget itself, so this is not a control being hidden — the same request made any other way is refused the same way.',
  'planner.approval.wrongState.title':
    'This production is not at the planning gate',
  'planner.approval.wrongState.description':
    'Plan approval is the move out of planning, and this production is somewhere else in its life. The orchestrator names where a production may go next when it refuses a move; this screen does not carry that map, because the orchestrator does not publish it.',
  'planner.approval.approved':
    'The plan is approved. This production has moved on to storyboarding.',
  'planner.approval.failed.title': 'The plan was not approved',
  'planner.gaps.heading': 'What this screen cannot do yet',
  'planner.gaps.stages':
    'Run or re-run a planning stage. The orchestrator has the service and refuses a stage the mode does not need, but no route reaches it.',
  'planner.gaps.scenes':
    'Read, add or edit a scene. The only route that touches them replaces the whole set at once and hands back an untyped list, so this screen sees a scene only as a row in the budget above.',
  'planner.gaps.dialogue':
    'Write a dialogue line, pick a voice for it, or see how long it will take to speak. Every one of those routes exists. All of them are keyed on a scene, and nothing published hands this screen a scene id — the same missing route the scenes gap above names.',
  'planner.gaps.continuity':
    'Show continuity or tone findings beside the scenes they concern. Both have a schema and neither has a route.',
  'page.bible.title': 'Project bible',
  'bible.title': 'Project bible',
  'bible.loading': 'Loading the project bible',
  'bible.error.title': 'The project bible could not be read',
  'bible.empty.title': 'This project has no bible yet',
  'bible.empty.description':
    'A bible records what a production plans against — the world, its subjects and its sound. Nothing has been recorded for this project yet.',
  'bible.versions.title': 'Versions',
  'bible.versions.select': 'Show version {version}',
  'bible.versions.published': 'Published',
  'bible.versions.draft': 'Draft',
  'bible.versions.active': 'Current',
  'bible.versions.firstPageOnly':
    'This reads the first page of versions only. The orchestrator holds more than are shown here.',
  'bible.field.notRecorded': 'Not recorded',
  'bible.field.noneRecorded': 'None recorded',
  'bible.world.title': 'World rules',
  'bible.world.genre': 'Genre',
  'bible.world.tone': 'Tone',
  'bible.world.audience': 'Audience',
  'bible.world.contentBoundaries': 'Content boundaries',
  'bible.world.recurringThemes': 'Recurring themes',
  'bible.world.introOutroRules': 'Intro and outro rules',
  'bible.world.continuityConstraints': 'Continuity constraints',
  'bible.narrative.title': 'Narrative rules',
  'bible.narrative.notCarried':
    'This kind of project carries no narrative section, so these rules cannot be recorded on it at all.',
  'bible.narrative.notRecorded':
    'This kind of project can carry narrative rules, and none were recorded on this version.',
  'bible.narrative.worldRules': 'World, physics and magic rules',
  'bible.narrative.humourDramaLanguage': 'Humour and drama language',
  'bible.narrative.chronology': 'Chronology',
  'bible.audio.title': 'Audio rules',
  'bible.audio.languages': 'Languages',
  'bible.audio.narratorPolicy': 'Narrator policy',
  'bible.audio.musicIdentity': 'Music identity',
  'bible.audio.recurringMotifs': 'Recurring motifs',
  'bible.audio.ambienceRules': 'Ambience rules',
  'bible.audio.sfxAesthetic': 'Sound-effect aesthetic',
  'bible.audio.dialogueMusicPriority': 'Dialogue and music priority',
  'bible.audio.loudnessProfile': 'Loudness profile',
  'bible.subjects.title': 'Subject rules',
  'bible.subjects.none': 'No subject carries rules on this version.',
  'bible.subjects.immutableVisualTraits': 'Immutable visual traits',
  'bible.subjects.allowedVariations': 'Allowed variations',
  'bible.subjects.prohibitedChanges': 'Prohibited changes',
  'bible.subjects.scaleRelationships': 'Scale relationships',
  'bible.subjects.wardrobeVariants': 'Wardrobe and surface variants',
  'bible.subjects.behaviourAndPersonality': 'Behaviour and personality',
  'bible.subjects.speaks': 'Speaks',
  'bible.subjects.speaks.yes': 'Yes',
  'bible.subjects.speaks.no': 'No',
  'bible.subjects.voiceRules': 'Voice rules',
  'bible.subjects.voiceRules.notApplicable':
    'This subject does not speak, so voice rules cannot apply to it.',
  'bible.subjects.editor.explained':
    "One block per subject the bible has rules for. Which subjects exist comes from the project's subject list, so a rule is attached to a subject by name here and by its id on the wire.",
  'bible.subjects.editor.unreadable':
    "The project's subjects could not be read, so no subject can be chosen; the rules already here are kept as they are.",
  'bible.subjects.editor.firstPageOnly':
    'This is the first page of subjects only. The orchestrator has more than are listed here.',
  'bible.subjects.editor.entry': 'Subject rules {position}',
  'bible.subjects.editor.subject': 'Subject',
  'bible.subjects.editor.choose': 'Choose a subject',
  'bible.subjects.editor.add': 'Add rules for a subject',
  'bible.subjects.editor.remove': 'Remove these rules',
  'bible.subjects.editor.removeContext': 'Remove subject rules {position}',
  'bible.subjects.editor.relationship.with': 'With',
  'bible.subjects.editor.relationship.description': 'Relationship',
  'bible.subjects.editor.relationship.add': 'Add a relationship',
  'bible.subjects.editor.relationship.addContext':
    'Add a relationship to subject rules {entry}',
  'bible.subjects.editor.relationship.remove': 'Remove',
  'bible.subjects.editor.relationship.removeContext':
    'Remove relationship {position} from subject rules {entry}',
  'bible.subjects.unknown': 'No subject in this project carries this id.',
  'bible.subjects.relationships': 'Relationships',
  'bible.create.action': 'Start a draft',
  'bible.create.next': 'Start the next version',
  'bible.create.title': 'New draft of the project bible',
  'bible.create.explain':
    'A draft can be created empty and filled in as the project settles. Nothing is frozen until it is published, and the orchestrator assigns the version number.',
  'bible.create.prefilled':
    'These fields start from version {version}. Saving creates a new draft; version {version} is not touched.',
  'bible.edit.action': 'Edit this draft',
  'bible.edit.context': 'of the project bible, version {version}',
  'bible.edit.title': 'Edit this draft',
  'bible.frozen':
    'This version is published, so it can no longer be edited. Start the next version instead.',
  'bible.form.styleProfile': 'Style profile',
  'bible.form.styleProfile.none': 'None',
  'bible.form.styleProfile.unreadable':
    'The style library could not be read, so no style profile can be chosen here. Everything else on this form still saves.',
  'bible.form.styleProfile.firstPageOnly':
    'This lists the first page of style profiles only. The orchestrator holds more than are shown here.',
  'bible.form.languages.hint': 'One language tag per line.',
  'bible.form.kindUnreadable':
    'This project could not be read, so whether its kind carries narrative rules is unknown. That section is left out rather than offered where the orchestrator would refuse it.',
  'bible.publish.action': 'Publish this version',
  'bible.publish.context':
    'Publish this version of the project bible, version {version}',
  'bible.publish.explained':
    'Publishing freezes this version. A production that planned against it keeps what it planned against, so a later change means publishing the next version rather than editing this one, and there is no way to undo it.',
  'bible.publish.done':
    'Published. This is now the version a new production plans against.',
  'bible.publish.error.title': 'That version was not published',
  'bible.markdown.title': 'Generated view',
  'bible.markdown.source':
    'The orchestrator generates this from the structured record above. It is a view rather than the source, and it arrives in the orchestrator’s own wording rather than the interface language.',
  'bible.markdown.error.title': 'The generated view could not be read',
  'bible.gaps.heading': 'What this screen cannot do yet',
  'bible.gaps.pin':
    'A production records which bible version it planned against. That pin can be read, but not set from here: the route that sets it takes a request shape the orchestrator does not publish.',
  'bible.gaps.markdownSource':
    'The generated view is shown as text rather than as a rendered document. Rendering it would mean adding a Markdown parser, and nothing external reaches this bundle.',
  'storyboard.title': 'Storyboard review',
  'storyboard.intro':
    'The gate between an approved plan and hundreds of expensive renders. A shot that needs a keyframe gets one approved here, scene by scene, before anything is sent to video.',
  'storyboard.loading': 'Reading this production’s scenes…',
  'storyboard.error.title': 'This production’s scenes could not be read',
  'storyboard.empty.title': 'No scenes are planned yet',
  'storyboard.empty.description':
    'A production\u2019s scenes come from its scene outline, which is written while the production is planned. Nothing on this screen creates them, and until they exist there is nothing here to review.',
  'storyboard.scene.label': 'Scene {order}',
  'storyboard.scene.purpose': 'Purpose',
  'storyboard.scene.emotionalBeat': 'Emotional beat',
  'storyboard.scene.timeOfDay': 'Time',
  'storyboard.scene.duration': 'Target duration',
  'storyboard.scene.continuityIn': 'Continuity in',
  'storyboard.scene.continuityOut': 'Continuity out',
  'storyboard.scene.show': 'Show shots',
  'storyboard.scene.hide': 'Hide shots',
  'storyboard.scene.toggleContext': 'for scene {order}',
  'storyboard.continuity.title': 'Facts in force here',
  'storyboard.continuity.empty':
    'No continuity facts are in force for this scene.',
  'storyboard.continuity.error':
    'The continuity facts for this scene could not be read, so this list is not a statement that there are none.',
  'storyboard.shots.loading': 'Reading this scene’s shots…',
  'storyboard.shots.error': 'This scene’s shots could not be read.',
  'storyboard.shots.empty': 'This scene has no shots yet.',
  'storyboard.shot.label': 'Shot {order}',
  'storyboard.shot.type': 'Shot type',
  'storyboard.shot.duration': 'Target duration',
  'storyboard.shot.framing': 'Framing',
  'storyboard.shot.camera': 'Camera',
  'storyboard.shot.intent': 'Action or visual intent',
  'storyboard.shot.strategy': 'Generation strategy',
  'storyboard.shot.state': 'State',
  'storyboard.shot.continuity': 'Continuity requirements',
  'storyboard.gate.title': 'Video gate',
  'storyboard.gate.permitted': 'Video rendering is permitted for this shot.',
  'storyboard.gate.blocked': 'Video rendering is blocked for this shot.',
  'storyboard.gate.requirement': 'Keyframe requirement',
  'storyboard.gate.waiver': 'A waiver is on record for this shot.',
  'storyboard.gate.error': 'The video gate for this shot could not be read.',
  'storyboard.frames.title': 'Frames',
  'storyboard.frames.empty':
    'No storyboard frames have been generated for this shot.',
  'storyboard.frames.error': 'This shot’s frames could not be read.',
  'storyboard.frame.label': 'Attempt {attempt}',
  'storyboard.frame.level': 'Level',
  'storyboard.frame.mode': 'Generated as',
  'storyboard.frame.created': 'Created',
  'storyboard.frame.approved': 'This frame is the approved keyframe.',
  'storyboard.frame.draftNotApprovable':
    'A draft cannot be approved. Only a keyframe becomes the anchor for image-to-video, and the orchestrator refuses an approval on anything else — so this frame offers no Approve rather than one that would be turned away.',
  'storyboard.frame.noImage':
    'The picture itself is not shown. The orchestrator publishes no route that serves an artifact’s bytes, and this app reaches nothing else, so what appears here is the record of the frame rather than the frame.',
  'storyboard.frame.context':
    'the keyframe from attempt {attempt} of shot {order}',
  'storyboard.approve.done':
    'Approved. This frame is now the anchor every video render of this shot is built from.',
  'storyboard.reject.done':
    'Rejected. Nothing was destroyed — this shot can still carry another attempt.',
  'storyboard.approval.error.title': 'That decision was not recorded',
  'storyboard.approval.explained':
    'Approving a keyframe makes it the anchor every video render of this shot is built from, which is the highest-leverage decision on this screen. Nothing here changes until the orchestrator has answered.',
  'storyboard.compare.action': 'Compare with references',
  'storyboard.compare.title': 'This frame against its references',
  'storyboard.compare.context':
    'Compare attempt {attempt} of shot {order} with its references',
  'storyboard.compare.candidate': 'Candidate artifact',
  'storyboard.compare.anchors': 'Anchored to',
  'storyboard.compare.noAnchors': 'This frame records no anchors.',
  'storyboard.compare.error': 'This comparison could not be read.',
  'storyboard.compare.noImages':
    'This is the comparison the orchestrator records, not the two pictures side by side. It names what each anchor points at; judging drift by eye needs a route that serves those images, and there is none.',
  'storyboard.compare.anchor.SUBJECT': 'Subject',
  'storyboard.compare.anchor.LOCATION_PLATE': 'Location plate',
  'storyboard.compare.anchor.PROP': 'Prop',
  'storyboard.level.DRAFT': 'Draft',
  'storyboard.level.KEYFRAME': 'Keyframe',
  'storyboard.level.DRAFT.explained':
    'A cheap draft, for composition and framing. Approving one is not the same as approving a keyframe.',
  'storyboard.level.KEYFRAME.explained':
    'The frame that becomes the anchor for image-to-video. This is the one the render is built on.',
  'storyboard.requirement.NOT_REQUIRED': 'Not required',
  'storyboard.requirement.REQUIRED_BY_SUBJECT':
    'Required by a canonical subject',
  'storyboard.requirement.REQUIRED_BY_USER': 'Required by a person',
  'storyboard.regeneration.SAME_PROMPT_NEW_SEED': 'Same prompt, new seed',
  'storyboard.regeneration.CONTROLLED_PROMPT_REVISION':
    'Controlled prompt revision',
  'storyboard.regeneration.NEW_KEYFRAME': 'New keyframe',
  'storyboard.regeneration.EXACT_REPLAY': 'Exact replay',
  'storyboard.regeneration.RETAKE_REGION': 'Retake of a region',
  'storyboard.shotType.ESTABLISHING': 'Establishing',
  'storyboard.shotType.WIDE': 'Wide',
  'storyboard.shotType.MEDIUM': 'Medium',
  'storyboard.shotType.CLOSE_UP': 'Close-up',
  'storyboard.shotType.EXTREME_CLOSE_UP': 'Extreme close-up',
  'storyboard.shotType.OVER_SHOULDER': 'Over the shoulder',
  'storyboard.shotType.TWO_SHOT': 'Two-shot',
  'storyboard.shotType.POV': 'Point of view',
  'storyboard.shotType.REACTION': 'Reaction',
  'storyboard.shotType.INSERT': 'Insert',
  'storyboard.shotType.ACTION': 'Action',
  'storyboard.shotType.TRACKING': 'Tracking',
  'storyboard.shotType.MONTAGE': 'Montage',
  'storyboard.shotType.TRANSITION': 'Transition',
  'storyboard.shotType.HOLD': 'Hold',
  'storyboard.shotType.LIMITED_ANIMATION': 'Limited animation',
  'storyboard.strategy.TEXT_TO_VIDEO_ENVIRONMENT': 'Text to video',
  'storyboard.strategy.IMAGE_TO_VIDEO': 'Image to video',
  'storyboard.strategy.KEYFRAME_INTERPOLATION': 'Keyframe interpolation',
  'storyboard.strategy.LIMITED_ANIMATION_PAN': 'Pan over a still',
  'storyboard.strategy.LIMITED_ANIMATION_HOLD': 'Hold on a still',
  'storyboard.strategy.REUSE_APPROVED_CLIP': 'Reuse of an approved clip',
  'storyboard.strategy.DFR_ACTION': 'Direct frame reference',
  'storyboard.strategy.AUDIO_TO_VIDEO': 'Audio to video',
  'storyboard.strategy.VIDEO_RETAKE': 'Retake of a video',
  'storyboard.state.PLANNED': 'Planned',
  'storyboard.state.STORYBOARD_PENDING': 'Storyboard pending',
  'storyboard.state.STORYBOARD_READY': 'Storyboard ready',
  'storyboard.state.STORYBOARD_APPROVED': 'Storyboard approved',
  'storyboard.state.AUDIO_PENDING': 'Audio pending',
  'storyboard.state.AUDIO_READY': 'Audio ready',
  'storyboard.state.VIDEO_PENDING': 'Video pending',
  'storyboard.state.VIDEO_RENDERING': 'Video rendering',
  'storyboard.state.VIDEO_READY': 'Video ready',
  'storyboard.state.AUTO_QC': 'Automated check',
  'storyboard.state.MANUAL_REVIEW': 'Awaiting review',
  'storyboard.state.APPROVED': 'Approved',
  'storyboard.state.REJECTED': 'Rejected',
  'storyboard.state.RENDER_FAILED': 'Render failed',
  'storyboard.state.ASSEMBLED': 'Assembled',
  'storyboard.gaps.heading': 'What this screen cannot do yet',
  'storyboard.gaps.images':
    'No frame is shown as a picture. An artifact carries a path inside the project, and the orchestrator publishes no route that serves its bytes — reaching the file any other way would mean this app talking to something that is not the orchestrator.',
  'storyboard.gaps.generate':
    'Frames cannot be generated from here. The route exists, but its request shape is not published through the orchestrator’s contract, so there is nothing to validate a request against.',
  'storyboard.gaps.operations':
    'Regenerating, revising a prompt, changing framing and changing expression are all published routes whose request shapes are not, so none of the four is offered rather than offered and refused.',
  'storyboard.gaps.keyframeRequirement':
    'A shot’s keyframe requirement cannot be set here, and no waiver can be recorded, for the same reason: both routes take a body the contract does not publish.',
  'storyboard.gaps.progress':
    'Frames that are still rendering do not update on their own. Progress arrives over a websocket the orchestrator does not yet serve, so this screen shows what was true when it was last read.',
  'audio.line.label': 'Line {order}',
  'audio.line.emotion': 'Emotion',
  'audio.line.pace': 'Pace',
  'audio.line.pauseBefore': 'Pause before',
  'audio.line.pauseAfter': 'Pause after',
  'audio.line.language': 'Language',
  'audio.line.approved': 'Audio approved',
  'audio.line.notApproved': 'No audio approved',
  'audio.line.measured': 'Measured duration',
  'audio.line.noAudioYet':
    'This line has never been voiced, so there is nothing to approve yet.',
  'audio.line.spokenDiffers':
    'What is spoken differs from the written line, because a pronunciation dictionary was applied.',
  'audio.line.spoken': 'Spoken',
  'audio.line.add': 'Add a line',
  'audio.line.edit': 'Edit',
  'audio.line.delete': 'Delete',
  'audio.line.deleting': 'Deleting…',
  'audio.line.created':
    'The line was added. It can be voiced once a voice profile it uses is approved.',
  'audio.line.saved':
    'The line was saved. Any audio it already had says the old words until it is re-voiced.',
  'audio.line.frozen.approved':
    'This line’s audio is approved, so its words and timing are frozen with it. Remove the approval to edit it.',
  'audio.line.frozen.voiced':
    'This line has been voiced, so it cannot be deleted from here — its takes would be orphaned. It can still be edited and re-voiced.',
  'audio.line.form.text': 'Text',
  'audio.line.form.language.hint':
    'A BCP-47 tag such as en, he or en-GB. It cannot be changed after the line is created.',
  'audio.line.form.voice': 'Voice',
  'audio.line.form.voice.choose': 'Choose a voice',
  'audio.line.form.voice.unreadable':
    'The voice profiles could not be read, and a line cannot be created without one.',
  'audio.line.form.voice.firstPageOnly':
    'This is the first page of voice profiles only. The orchestrator has more than are listed here.',
  'audio.line.form.speaker': 'Speaker',
  'audio.line.form.speaker.none': 'No speaker',
  'audio.line.form.order': 'Position',
  'audio.line.form.order.hint':
    'Where the line sits in the scene, counting from zero.',
  'audio.line.form.pauseBeforeMs': 'Pause before (ms)',
  'audio.line.form.pauseAfterMs': 'Pause after (ms)',
  'audio.line.form.frozen':
    'Language and voice cannot be changed here. Existing audio would start disagreeing with the line; add a new line instead.',
  'audio.takes.title': 'Takes',
  'audio.takes.error': 'The takes for this line could not be read.',
  'audio.takes.empty': 'No take has been generated for this line yet.',
  'audio.take.label': '{pass}, attempt {attempt}',
  'audio.take.current': 'Current audio',
  'audio.take.approvedTake': 'Approved',
  'audio.take.model': 'Model',
  'audio.take.seed': 'Seed',
  'audio.take.voiceHash': 'Voice profile hash',
  'audio.take.audioHash': 'Audio hash',
  'audio.take.path': 'File',
  'audio.take.duration': 'Duration',
  'audio.take.sampleRate': 'Sample rate',
  'audio.take.resampled': 'Resampled from',
  'audio.take.peak': 'Peak level',
  'audio.take.created': 'Generated',
  'audio.take.pronunciation': 'Pronunciation overrides',
  'audio.take.noPlayback':
    'The file cannot be played here. The orchestrator serves no route for an artifact’s bytes, so this is the record of the audio rather than the audio.',
  'audio.pass.draft': 'Draft',
  'audio.pass.final': 'Final',
  'audio.pass.draft.explained':
    'A draft exists to measure how long the line takes to say, before shot timing is fixed.',
  'audio.pass.final.explained':
    'A final is regenerated once the plan holds, and is what the production uses.',
  'audio.synthesise.draft': 'Generate draft',
  'audio.synthesise.final': 'Generate final',
  'audio.synthesise.pending': 'Submitting…',
  'audio.synthesise.context': 'for line {order}',
  'audio.synthesise.submitted':
    'Submitted. A take appears here once the render finishes, which is not immediate.',
  'audio.synthesise.blocked':
    'This line’s audio is approved, so it cannot be re-voiced. Remove the approval first.',
  'audio.approve.action': 'Approve this audio',
  'audio.approve.context': 'for line {order}',
  'audio.approve.done': 'The audio for this line is approved.',
  'audio.unapprove.action': 'Remove approval',
  'audio.unapprove.done':
    'The approval was removed. This line can be re-voiced.',
  'audio.tier.title': 'Animation tier',
  'audio.tier.action': 'Ask which tier',
  'audio.tier.pending': 'Choosing…',
  'audio.tier.editedAcrossShots': 'This line plays across more than one shot',
  'audio.tier.acrossShots.no': 'No',
  'audio.tier.acrossShots.yes': 'Yes',
  'audio.tier.chosen': 'Would be: {tier}',
  'audio.tier.rationale': 'Why: {rationale}',
  'audio.tier.audioConditioned': 'Audio-conditioned',
  'audio.tier.rhythmAnimation': 'Rhythm animation',
  'audio.tier.reactionEditing': 'Reaction editing',
  'audio.tier.dubit': 'DubIt',
  'audio.tier.gated':
    'DubIt cannot be requested from here. The contract marks it as gated behind a hardware benchmark and a subject-consistency test, and whether this workstation has passed them is not on the wire — so a request could only be sent hopefully, and refused.',
  'audio.title': 'Dialogue audio',
  'audio.description':
    'Every spoken line in this production, the takes generated for it, and the one a person approved.',
  'audio.scenes.error': 'The scenes for this production could not be read.',
  'audio.scenes.loading': 'Reading the scenes…',
  'audio.scenes.empty':
    'This production has no scenes yet. Plan it first, and its dialogue will appear here.',
  'audio.scene.label': 'Scene {order}',
  'audio.scene.show': 'Show dialogue',
  'audio.scene.hide': 'Hide dialogue',
  'audio.scene.toggleContext': 'for scene {order}',
  'audio.lines.error': 'The dialogue for this scene could not be read.',
  'audio.lines.loading': 'Reading the dialogue…',
  'audio.lines.empty': 'This scene carries no dialogue.',
  'audio.lines.firstPageOnly':
    'This is the first page of dialogue only. The orchestrator has more lines for this scene than are shown here.',
  'audio.timing.title': 'Runtime, measured from the dialogue',
  'audio.timing.explain':
    'The planner’s budget is built from durations a person typed. This reads the generated audio instead and retimes every shot it can, which changes those durations.',
  'audio.timing.run': 'Retime from dialogue',
  'audio.timing.running': 'Retiming…',
  'audio.timing.noReport': 'Not run yet.',
  'audio.timing.measured': 'Scenes measured: {count}',
  'audio.timing.estimated': 'Scenes still estimated: {count}',
  'audio.timing.estimatedWarning':
    'An estimated scene’s total is the Director’s clamped request rather than a measurement, and is not reported as one.',
  'audio.timing.scene': 'Scene {order}',
  'audio.timing.status.retimed': 'Retimed',
  'audio.timing.status.estimated': 'Estimated',
  'audio.timing.status.unmeasured': 'Unmeasured',
  'audio.timing.status.noShots': 'No shots',
  'audio.timing.total': 'Total after retiming',
  'audio.timing.target': 'Target',
  'audio.tier.field': 'Tier',
  'audio.tier.automatic': 'Let the orchestrator choose',
  'audio.tier.notStored':
    'This is a calculation, not a saved decision. The orchestrator works the tier out from the speaker and the shot count each time it is asked, and stores nothing — so nothing downstream reads it, and it will not be here when you come back.',
  'audio.gaps.tierNotStored':
    'An animation tier cannot be recorded against a line. The route computes one and returns it, and the orchestrator has no column, no table and no read route for the answer.',
  'audio.takes.forLine': 'Takes for line {order}',
  'audio.gaps.heading': 'What this screen cannot do yet',
  'audio.gaps.playback':
    'No audio can be played. Nothing in the orchestrator serves an artifact’s bytes, so a take is shown as its record — duration, peak level, hashes — rather than as sound.',
  'audio.gaps.music':
    'The project soundtrack, cue assignment and scene scoring are not here. The orchestrator publishes no route for any of them.',
  'audio.gaps.sfx':
    'The SFX and ambience library has no routes at all, so nothing can be indexed, assigned, or shown with the licence metadata that makes it safe to use.',
  'audio.gaps.stems':
    'Stems and the mix — dialogue, music, effects and ambience, with levels, solo and mute — have no routes, so no level can be set here.',
  'audio.gaps.loudness':
    'The loudness numbers that decide whether an export is acceptable are not served, so this screen cannot show a measured value against its target.',
  'audio.gaps.asr':
    'The advisory ASR round-trip is a published contract with no route, so a line cannot be checked against what a recogniser heard.',
  'form.invalid': 'Fields needing attention: {count}',
  'field.required': 'required',
  'shots.title': 'Shot review',
  'shots.description':
    'Every shot in this production with where it is in its lifecycle, the automated checks recorded against it, and the hand-over to a person.',
  'shots.scenes.error': 'The scenes for this production could not be read.',
  'shots.scenes.loading': 'Reading the scenes…',
  'shots.scenes.empty':
    'This production has no scenes yet. Plan it first, and its shots will appear here.',
  'shots.scene.label': 'Scene {order}',
  'shots.scene.show': 'Show shots',
  'shots.scene.hide': 'Hide shots',
  'shots.scene.toggleContext': 'for scene {order}',
  'shots.list.error': 'The shots for this scene could not be read.',
  'shots.list.loading': 'Reading the shots…',
  'shots.list.empty': 'This scene has no shots yet.',
  'shots.list.noneAwaiting': 'No shot in this scene is awaiting review.',
  'shots.filter.awaiting': 'Only shots awaiting review',
  'shots.filter.all': 'Every shot',
  'shots.shot.label': 'Shot {order}',
  'shots.shot.checks': 'Automated checks',
  'shots.shot.checksContext': 'for shot {order}',
  'shots.qc.title': 'Automated checks',
  'shots.qc.advisory':
    'Automated. These are advisory and none of them is an approval — a person decides on the shot, and that decision shows in the shot’s state above.',
  'shots.qc.error': 'The automated checks for this shot could not be read.',
  'shots.qc.empty': 'No automated check has run on this shot yet.',
  'shots.qc.run.findings': 'Recorded findings: {count}',
  'shots.qc.run.findingsUnstructured':
    'The wire gives these findings no shape, so they are shown exactly as the checker recorded them.',
  'shots.qc.check.observed': 'observed',
  'shots.qc.check.expected': 'expected',
  'shots.qc.run.provider': 'Provider',
  'shots.qc.run.model': 'Model manifest',
  'shots.qc.run.worker': 'Worker',
  'shots.qc.run.hardware': 'Hardware profile',
  'shots.qc.run.styleVersion': 'Style profile version',
  'shots.qc.run.promptSpecVersion': 'Prompt spec version',
  'shots.qc.run.created': 'Ran',
  'shots.review.action': 'Send to review',
  'shots.review.context': 'for shot {order}',
  'shots.review.pending': 'Sending…',
  'shots.review.done': 'This shot is with a reviewer now.',
  'shots.review.unavailable':
    'Review is offered once the shot’s video is ready and its automated checks have run. Where this shot is now is shown by its state.',
  'shots.qc.kind.technical': 'Technical',
  'shots.qc.kind.subjectConsistency': 'Subject consistency',
  'shots.qc.kind.style': 'Style',
  'shots.qc.kind.audio': 'Audio',
  'shots.qc.kind.production': 'Production',
  'shots.qc.outcome.pass': 'Pass',
  'shots.qc.outcome.warn': 'Warn',
  'shots.qc.outcome.fail': 'Fail',
  'shots.qc.outcome.skipped': 'Skipped',
  'shots.qc.check.fileExists': 'File exists',
  'shots.qc.check.containerDecodes': 'Container decodes',
  'shots.qc.check.videoStream': 'Expected video stream exists',
  'shots.qc.check.dimensions': 'Dimensions match the profile',
  'shots.qc.check.fpsValid': 'Frame rate is valid',
  'shots.qc.check.duration': 'Duration within tolerance',
  'shots.qc.check.noZeroByteStream': 'No zero-byte stream',
  'shots.qc.check.audioWhenRequired': 'Audio stream present when required',
  'shots.qc.check.finalRuntime': 'Final runtime within tolerance',
  'shots.qc.check.resolution1080': 'Resolution is 1920×1080',
  'shots.qc.check.fps24': 'Frame rate is 24',
  'shots.qc.check.audioPresent': 'Audio present',
  'shots.qc.check.audio48kStereo': 'Audio is 48 kHz stereo',
  'shots.qc.check.subtitles': 'Subtitles present if enabled',
  'shots.qc.check.noMissingAsset': 'No missing timeline asset',
  'shots.qc.check.noBlackSegment': 'No black or missing segment',
  'shots.gaps.heading': 'What this screen cannot do yet',
  'shots.gaps.picture':
    'No frame and no video can be shown. Nothing in the orchestrator serves an artifact’s bytes, so the canonical-first-middle-last comparison this screen exists for cannot be drawn.',
  'shots.gaps.decision':
    'A shot cannot be approved or rejected here. The route exists, but its request shape is not published through the contract, so the decision is read from the shot’s state rather than made on this screen.',
  'shots.gaps.operations':
    'None of the five regeneration modes can be started here, for the same reason: one published route, one unpublished request shape.',
  'shots.gaps.identity':
    'The eight identity rules are a published contract, but no route returns a verdict per rule for a shot. What a checker recorded arrives as unshaped findings and is shown as such.',
  'shots.gaps.hero':
    'A hero shot cannot be marked. Its render profile carries the intent, and no route serves a render profile.',
  'shots.gaps.attempts':
    'Attempt history cannot be browsed. No route lists a shot’s render attempts, so a rejected shot’s earlier attempts are kept by the orchestrator but not reachable from here.',
  'shots.gaps.queue':
    'This is a queue one scene at a time. No route lists a production’s shots across scenes, so each scene is read when opened.',
  'error.MUSIC_CUE_NOT_APPROVED':
    'That step needs an approved music cue, and this one is not approved. Approve the cue first, or choose one that already is.',
  'error.MUSIC_CUE_IMMUTABLE':
    'This music cue is approved, so it is frozen — a production may already be built on it. Add the next cue rather than editing this one.',
  'error.MUSIC_CUE_EXISTS':
    'This project already has that cue. A cue is identified by its audio rather than its name, and one render becomes one library entry — so revise the cue that is already there, or generate another take.',
  'error.SFX_ASSET_EXISTS':
    'The SFX library already holds this exact audio. An asset is matched by its content rather than its name, so reuse the entry that is already there instead of importing the same bytes twice.',
  'error.SFX_ASSET_IMMUTABLE':
    'This SFX asset is approved, so it is frozen — a production may already be built on it. Import a new one rather than editing this one.',
  'error.OPENING_ENDING_ASSET_IMMUTABLE':
    'This opening or ending asset is approved and cannot be edited. Import a new version instead; productions stay pinned to the version they used.',
  'error.OPENING_ENDING_VERSION_CONFLICT':
    'Another writer took that version number first. Nothing was changed — try again and the next version will be allocated.',
  'error.SFX_ASSET_NOT_APPROVED':
    'That step needs an approved SFX asset, and this one is not approved. Approve the asset first, or choose one that already is.',
  'error.MUSIC_CUE_VARIETY_OVERUSED':
    'This music cue has already been placed as often as the production’s variety rule allows, so it was not placed again. Choose a different cue for this placement.',
  'error.malformedText':
    'The orchestrator answered that request with something other than the document that was asked for. Nothing here can be trusted to be the bible’s own text.',
} satisfies Record<string, string> & Record<`error.${ErrorCode}`, string>;

export type TranslationKey = keyof typeof EN_CATALOGUE;
