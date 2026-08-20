import type { ErrorCode } from 'sky-filme-studio-be/contracts';
import type { ErrorCodeGuidance } from '@/lib/api/api.interface';

export const ERROR_CODE_GUIDANCE: Record<ErrorCode, ErrorCodeGuidance> = {
  MODEL_FILE_MISSING: {
    sentence:
      'A model file this render needs is not on disk, so nothing was rendered. It has to be downloaded into the models folder before this can run.',
    presentation: 'PERSISTENT',
  },
  MODEL_HASH_MISMATCH: {
    sentence:
      'A model file on disk does not match the hash the manifest records. A truncated download is the usual cause: delete that file and fetch it again.',
    presentation: 'PERSISTENT',
  },
  RUNTIME_START_FAILED: {
    sentence:
      'The local runtime for this model would not start, so nothing was rendered. This is a setup fault rather than a bad request — the runtime failed before it saw the job.',
    presentation: 'PERSISTENT',
  },
  MPS_OUT_OF_MEMORY: {
    sentence:
      'The GPU ran out of memory on this shot. Choose a lower render profile or a shorter duration — the same request will fail the same way.',
    presentation: 'PERSISTENT',
  },
  MPS_UNSUPPORTED_OP: {
    sentence:
      'This model needs an operation the Metal backend does not implement, so it cannot run on this GPU path. A different model or a CPU run is the way round it.',
    presentation: 'PERSISTENT',
  },
  CUDA_OUT_OF_MEMORY: {
    sentence:
      'The GPU ran out of memory on this shot. Choose a lower render profile or a shorter duration — the same request will fail the same way.',
    presentation: 'PERSISTENT',
  },
  CUDA_DRIVER_ERROR: {
    sentence:
      'The CUDA driver reported a fault. This is the driver or the card rather than the request, so no change to this shot will avoid it.',
    presentation: 'PERSISTENT',
  },
  GPU_OFFLOAD_THRASHING: {
    sentence:
      'The model does not fit in GPU memory and is being swapped in and out. This is not a crash — the render will finish, far slower than usual. A lower render profile avoids it.',
    presentation: 'TRANSIENT',
  },
  OUTPUT_DECODE_FAILED: {
    sentence:
      'The render produced a file that will not decode. The output is unusable and the shot has to be rendered again.',
    presentation: 'TRANSIENT',
  },
  OUTPUT_DURATION_INVALID: {
    sentence:
      'The render produced a clip of the wrong length. It cannot be cut into the timeline as it stands.',
    presentation: 'TRANSIENT',
  },
  CHARACTER_IDENTITY_FAILURE: {
    sentence:
      'The rendered subject drifted from its canonical reference. Compare the shot against the subject reference set before approving anything built on it.',
    presentation: 'TRANSIENT',
  },
  AUDIO_SILENT: {
    sentence:
      'The generated audio is silent. The line produced no sound, so the shot has no dialogue to cut against.',
    presentation: 'TRANSIENT',
  },
  AUDIO_CLIPPING: {
    sentence:
      'The generated audio clips. The peaks are distorted and will stay distorted through the mix.',
    presentation: 'TRANSIENT',
  },
  PROMPT_SCHEMA_INVALID: {
    sentence:
      'The planner returned a structure this pipeline cannot use. The planning step has to run again before any render can be built from it.',
    presentation: 'TRANSIENT',
  },
  OFFLINE_POLICY_VIOLATION: {
    sentence:
      'A provider was pointed off this machine and generation was stopped. Nothing may leave this computer — find the provider that was reconfigured before running anything else.',
    presentation: 'PERSISTENT',
  },
  DISK_SPACE_LOW: {
    sentence:
      'There is not enough free space to start this render, so it was refused before starting. Free space, or move the project root to a larger disk, before submitting again.',
    presentation: 'PERSISTENT',
  },
  NO_ELIGIBLE_PROVIDER: {
    sentence:
      'No provider on this machine can run this job, so nothing was queued. A worker advertising this capability has to be set up first.',
    presentation: 'PERSISTENT',
  },
  CAPABILITY_NOT_BENCHMARKED: {
    sentence:
      'A provider could run this, but nothing has measured its limits on this hardware. Until a benchmark exists, an untested duration or profile is a guess rather than a capability.',
    presentation: 'PERSISTENT',
  },
};
