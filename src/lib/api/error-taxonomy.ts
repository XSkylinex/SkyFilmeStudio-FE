import type { ErrorCode } from 'sky-filme-studio-be/contracts';
import type { ErrorCodeGuidance } from '@/lib/api/api.interface';

export const ERROR_CODE_GUIDANCE: Record<ErrorCode, ErrorCodeGuidance> = {
  MODEL_FILE_MISSING: {
    presentation: 'PERSISTENT',
    messageKey: 'error.MODEL_FILE_MISSING',
  },
  MODEL_HASH_MISMATCH: {
    presentation: 'PERSISTENT',
    messageKey: 'error.MODEL_HASH_MISMATCH',
  },
  RUNTIME_START_FAILED: {
    presentation: 'PERSISTENT',
    messageKey: 'error.RUNTIME_START_FAILED',
  },
  MPS_OUT_OF_MEMORY: {
    presentation: 'PERSISTENT',
    messageKey: 'error.MPS_OUT_OF_MEMORY',
  },
  MPS_UNSUPPORTED_OP: {
    presentation: 'PERSISTENT',
    messageKey: 'error.MPS_UNSUPPORTED_OP',
  },
  CUDA_OUT_OF_MEMORY: {
    presentation: 'PERSISTENT',
    messageKey: 'error.CUDA_OUT_OF_MEMORY',
  },
  CUDA_DRIVER_ERROR: {
    presentation: 'PERSISTENT',
    messageKey: 'error.CUDA_DRIVER_ERROR',
  },
  GPU_OFFLOAD_THRASHING: {
    presentation: 'TRANSIENT',
    messageKey: 'error.GPU_OFFLOAD_THRASHING',
  },
  OUTPUT_DECODE_FAILED: {
    presentation: 'TRANSIENT',
    messageKey: 'error.OUTPUT_DECODE_FAILED',
  },
  OUTPUT_DURATION_INVALID: {
    presentation: 'TRANSIENT',
    messageKey: 'error.OUTPUT_DURATION_INVALID',
  },
  CHARACTER_IDENTITY_FAILURE: {
    presentation: 'TRANSIENT',
    messageKey: 'error.CHARACTER_IDENTITY_FAILURE',
  },
  AUDIO_SILENT: {
    presentation: 'TRANSIENT',
    messageKey: 'error.AUDIO_SILENT',
  },
  AUDIO_CLIPPING: {
    presentation: 'TRANSIENT',
    messageKey: 'error.AUDIO_CLIPPING',
  },
  PROMPT_SCHEMA_INVALID: {
    presentation: 'TRANSIENT',
    messageKey: 'error.PROMPT_SCHEMA_INVALID',
  },
  OFFLINE_POLICY_VIOLATION: {
    presentation: 'PERSISTENT',
    messageKey: 'error.OFFLINE_POLICY_VIOLATION',
  },
  DISK_SPACE_LOW: {
    presentation: 'PERSISTENT',
    messageKey: 'error.DISK_SPACE_LOW',
  },
  NO_ELIGIBLE_PROVIDER: {
    presentation: 'PERSISTENT',
    messageKey: 'error.NO_ELIGIBLE_PROVIDER',
  },
  CAPABILITY_NOT_BENCHMARKED: {
    presentation: 'PERSISTENT',
    messageKey: 'error.CAPABILITY_NOT_BENCHMARKED',
  },
  MEDIA_TOOL_UNAVAILABLE: {
    presentation: 'PERSISTENT',
    messageKey: 'error.MEDIA_TOOL_UNAVAILABLE',
  },
  SOURCE_ASSET_IMMUTABLE: {
    presentation: 'PERSISTENT',
    messageKey: 'error.SOURCE_ASSET_IMMUTABLE',
  },
  IMPORT_PATH_REJECTED: {
    presentation: 'PERSISTENT',
    messageKey: 'error.IMPORT_PATH_REJECTED',
  },
  SUBJECT_NOT_APPROVED: {
    presentation: 'PERSISTENT',
    messageKey: 'error.SUBJECT_NOT_APPROVED',
  },
  CANONICAL_SET_IMMUTABLE: {
    presentation: 'PERSISTENT',
    messageKey: 'error.CANONICAL_SET_IMMUTABLE',
  },
  CANONICAL_ANCHOR_REQUIRED: {
    presentation: 'PERSISTENT',
    messageKey: 'error.CANONICAL_ANCHOR_REQUIRED',
  },
  CANONICAL_DRAFT_EXISTS: {
    presentation: 'PERSISTENT',
    messageKey: 'error.CANONICAL_DRAFT_EXISTS',
  },
  STYLE_PROFILE_IMMUTABLE: {
    presentation: 'PERSISTENT',
    messageKey: 'error.STYLE_PROFILE_IMMUTABLE',
  },
  STYLE_VERSION_CONFLICT: {
    presentation: 'TRANSIENT',
    messageKey: 'error.STYLE_VERSION_CONFLICT',
  },
  VOICE_PROFILE_IMMUTABLE: {
    presentation: 'PERSISTENT',
    messageKey: 'error.VOICE_PROFILE_IMMUTABLE',
  },
  VOICE_ALREADY_APPROVED_FOR_SUBJECT: {
    presentation: 'PERSISTENT',
    messageKey: 'error.VOICE_ALREADY_APPROVED_FOR_SUBJECT',
  },
  PRONUNCIATION_DICTIONARY_EXISTS: {
    presentation: 'PERSISTENT',
    messageKey: 'error.PRONUNCIATION_DICTIONARY_EXISTS',
  },
  PRONUNCIATION_ENTRY_EXISTS: {
    presentation: 'PERSISTENT',
    messageKey: 'error.PRONUNCIATION_ENTRY_EXISTS',
  },
  LOCATION_IMMUTABLE: {
    presentation: 'PERSISTENT',
    messageKey: 'error.LOCATION_IMMUTABLE',
  },
  PROP_IMMUTABLE: {
    presentation: 'PERSISTENT',
    messageKey: 'error.PROP_IMMUTABLE',
  },
  LOCATION_PLATE_IMMUTABLE: {
    presentation: 'PERSISTENT',
    messageKey: 'error.LOCATION_PLATE_IMMUTABLE',
  },
  LOCATION_PLATE_KIND_ALREADY_APPROVED: {
    presentation: 'PERSISTENT',
    messageKey: 'error.LOCATION_PLATE_KIND_ALREADY_APPROVED',
  },
  PROJECT_BIBLE_IMMUTABLE: {
    presentation: 'PERSISTENT',
    messageKey: 'error.PROJECT_BIBLE_IMMUTABLE',
  },
  PROJECT_BIBLE_VERSION_EXISTS: {
    presentation: 'TRANSIENT',
    messageKey: 'error.PROJECT_BIBLE_VERSION_EXISTS',
  },
  PROJECT_BIBLE_NARRATIVE_NOT_APPLICABLE: {
    presentation: 'PERSISTENT',
    messageKey: 'error.PROJECT_BIBLE_NARRATIVE_NOT_APPLICABLE',
  },
  VOICE_RULES_REQUIRE_SPEECH: {
    presentation: 'PERSISTENT',
    messageKey: 'error.VOICE_RULES_REQUIRE_SPEECH',
  },
  CONTINUITY_SCOPE_INVALID: {
    presentation: 'PERSISTENT',
    messageKey: 'error.CONTINUITY_SCOPE_INVALID',
  },
  SCENE_IN_USE: {
    presentation: 'PERSISTENT',
    messageKey: 'error.SCENE_IN_USE',
  },
  CONTINUITY_CONTEXT_REQUIRED: {
    presentation: 'PERSISTENT',
    messageKey: 'error.CONTINUITY_CONTEXT_REQUIRED',
  },
  PRODUCTION_TRANSITION_INVALID: {
    presentation: 'PERSISTENT',
    messageKey: 'error.PRODUCTION_TRANSITION_INVALID',
  },
  PRODUCTION_PROFILE_SECTIONS_OVERLAP: {
    presentation: 'PERSISTENT',
    messageKey: 'error.PRODUCTION_PROFILE_SECTIONS_OVERLAP',
  },
  PRODUCTION_PROFILE_IN_USE: {
    presentation: 'PERSISTENT',
    messageKey: 'error.PRODUCTION_PROFILE_IN_USE',
  },
  PRODUCTION_RENDER_NOT_PERMITTED: {
    presentation: 'PERSISTENT',
    messageKey: 'error.PRODUCTION_RENDER_NOT_PERMITTED',
  },
  PLANNING_STAGE_MISSING: {
    presentation: 'PERSISTENT',
    messageKey: 'error.PLANNING_STAGE_MISSING',
  },
  RUNTIME_BUDGET_OUT_OF_TOLERANCE: {
    presentation: 'PERSISTENT',
    messageKey: 'error.RUNTIME_BUDGET_OUT_OF_TOLERANCE',
  },
  RUNTIME_TOLERANCE_UNDECLARED: {
    presentation: 'PERSISTENT',
    messageKey: 'error.RUNTIME_TOLERANCE_UNDECLARED',
  },
  SHOT_TRANSITION_INVALID: {
    presentation: 'PERSISTENT',
    messageKey: 'error.SHOT_TRANSITION_INVALID',
  },
  SHOT_STRATEGY_INVALID: {
    presentation: 'PERSISTENT',
    messageKey: 'error.SHOT_STRATEGY_INVALID',
  },
  SHOT_DURATION_UNMEASURED: {
    presentation: 'PERSISTENT',
    messageKey: 'error.SHOT_DURATION_UNMEASURED',
  },
  SUBJECT_DESCRIPTOR_UNAVAILABLE: {
    presentation: 'PERSISTENT',
    messageKey: 'error.SUBJECT_DESCRIPTOR_UNAVAILABLE',
  },
  PROMPT_SPEC_IMMUTABLE: {
    presentation: 'PERSISTENT',
    messageKey: 'error.PROMPT_SPEC_IMMUTABLE',
  },
  LIMITED_ANIMATION_OVERUSED: {
    presentation: 'PERSISTENT',
    messageKey: 'error.LIMITED_ANIMATION_OVERUSED',
  },
  VOICE_PROFILE_NOT_APPROVED: {
    presentation: 'PERSISTENT',
    messageKey: 'error.VOICE_PROFILE_NOT_APPROVED',
  },
  VOICE_LANGUAGE_UNSUPPORTED: {
    presentation: 'PERSISTENT',
    messageKey: 'error.VOICE_LANGUAGE_UNSUPPORTED',
  },
  DIALOGUE_AUDIO_IMMUTABLE: {
    presentation: 'PERSISTENT',
    messageKey: 'error.DIALOGUE_AUDIO_IMMUTABLE',
  },
  ASR_UNAVAILABLE: {
    presentation: 'PERSISTENT',
    messageKey: 'error.ASR_UNAVAILABLE',
  },
  TIER_REQUIRES_BENCHMARK: {
    presentation: 'PERSISTENT',
    messageKey: 'error.TIER_REQUIRES_BENCHMARK',
  },
  STORYBOARD_NOT_APPROVED: {
    presentation: 'PERSISTENT',
    messageKey: 'error.STORYBOARD_NOT_APPROVED',
  },
  STORYBOARD_FRAME_IMMUTABLE: {
    presentation: 'PERSISTENT',
    messageKey: 'error.STORYBOARD_FRAME_IMMUTABLE',
  },
  KEYFRAME_ANCHOR_REQUIRED: {
    presentation: 'PERSISTENT',
    messageKey: 'error.KEYFRAME_ANCHOR_REQUIRED',
  },
  REGENERATION_MODE_REQUIRED: {
    presentation: 'PERSISTENT',
    messageKey: 'error.REGENERATION_MODE_REQUIRED',
  },
  KEYFRAME_REQUIREMENT_DERIVED: {
    presentation: 'PERSISTENT',
    messageKey: 'error.KEYFRAME_REQUIREMENT_DERIVED',
  },
  QC_RUN_SCOPE_REQUIRED: {
    presentation: 'PERSISTENT',
    messageKey: 'error.QC_RUN_SCOPE_REQUIRED',
  },
  PRODUCTION_QC_REPORT_VERSION_EXISTS: {
    presentation: 'PERSISTENT',
    messageKey: 'error.PRODUCTION_QC_REPORT_VERSION_EXISTS',
  },
  MUSIC_CUE_NOT_APPROVED: {
    presentation: 'PERSISTENT',
    messageKey: 'error.MUSIC_CUE_NOT_APPROVED',
  },
  MUSIC_CUE_IMMUTABLE: {
    presentation: 'PERSISTENT',
    messageKey: 'error.MUSIC_CUE_IMMUTABLE',
  },
  MUSIC_CUE_EXISTS: {
    presentation: 'PERSISTENT',
    messageKey: 'error.MUSIC_CUE_EXISTS',
  },
  SFX_ASSET_EXISTS: {
    presentation: 'PERSISTENT',
    messageKey: 'error.SFX_ASSET_EXISTS',
  },
  SFX_ASSET_IMMUTABLE: {
    presentation: 'PERSISTENT',
    messageKey: 'error.SFX_ASSET_IMMUTABLE',
  },
  OPENING_ENDING_ASSET_IMMUTABLE: {
    presentation: 'PERSISTENT',
    messageKey: 'error.OPENING_ENDING_ASSET_IMMUTABLE',
  },
  OPENING_ENDING_VERSION_CONFLICT: {
    presentation: 'TRANSIENT',
    messageKey: 'error.OPENING_ENDING_VERSION_CONFLICT',
  },
  SFX_ASSET_NOT_APPROVED: {
    presentation: 'PERSISTENT',
    messageKey: 'error.SFX_ASSET_NOT_APPROVED',
  },
  MUSIC_CUE_VARIETY_OVERUSED: {
    presentation: 'PERSISTENT',
    messageKey: 'error.MUSIC_CUE_VARIETY_OVERUSED',
  },
};
