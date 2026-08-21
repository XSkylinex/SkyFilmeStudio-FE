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
};
