export const ROUTE_ERROR_DEFAULT_MESSAGE =
  'The orchestrator reported an error this UI does not yet have a message for. The raw code below is exactly what it returned.';

export const ROUTE_ERROR_CODE_MESSAGE: Record<string, string> = {
  MODEL_FILE_MISSING:
    'A model file this render needs is not installed on this machine. Check the model manifest in System and download it.',
  MODEL_HASH_MISMATCH:
    "The model file on disk does not match the version this production was built with. Re-download the model, or pin the production to the version that's installed.",
  RUNTIME_START_FAILED:
    'The local runtime for this model failed to start. Check the runtime logs in System before retrying.',
  MPS_OUT_OF_MEMORY:
    "The Mac GPU ran out of memory during this render. Close other GPU-heavy apps, or lower this shot's resolution or duration, and retry.",
  MPS_UNSUPPORTED_OP:
    "This step is not supported on Apple's MPS backend. Switch this shot to a different runtime, or choose a different model.",
  CUDA_OUT_OF_MEMORY:
    "The GPU ran out of memory during this render. Close other GPU-heavy apps, or lower this shot's resolution or duration, and retry.",
  CUDA_DRIVER_ERROR:
    'The GPU driver reported an error. Restart the GPU driver, or reboot the workstation, before retrying.',
  GPU_OFFLOAD_THRASHING:
    'The GPU is thrashing between memory offload and compute and will not finish in a reasonable time. Stop the job and free GPU memory before retrying.',
  OUTPUT_DECODE_FAILED:
    'The rendered output could not be decoded, which usually means the file is corrupt. Retry the shot.',
  OUTPUT_DURATION_INVALID:
    "The rendered clip's duration does not match what was requested. Retry the shot, and report it if this keeps happening.",
  CHARACTER_IDENTITY_FAILURE:
    "The rendered shot does not match the subject's canonical reference closely enough. Retake with a stricter identity setting or a different keyframe.",
  AUDIO_SILENT:
    'The generated audio track is silent. Retry the audio generation step for this shot.',
  AUDIO_CLIPPING:
    'The generated audio is clipping. Lower the target loudness and retry the audio generation step.',
  PROMPT_SCHEMA_INVALID:
    'The prompt sent to the model did not match its expected schema. This is a configuration problem, not a transient failure — report it rather than retrying.',
  OFFLINE_POLICY_VIOLATION:
    'This action would have sent data off this machine, which strict offline mode blocks. Turn off strict offline mode if that was intended, or change the request so it stays local.',
  DISK_SPACE_LOW:
    'This machine is low on disk space, so the render was stopped before it could finish. Free up space and retry.',
};
