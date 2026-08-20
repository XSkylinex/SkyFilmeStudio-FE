import type { ErrorCode } from 'sky-filme-studio-be/contracts';

export type StudioErrorKind = 'NETWORK' | 'HTTP' | 'MALFORMED' | 'CONTRACT';

export type ErrorPresentation = 'TRANSIENT' | 'PERSISTENT';

export interface ErrorCodeGuidance {
  readonly sentence: string;
  readonly presentation: ErrorPresentation;
}

export interface StudioErrorInput {
  kind: StudioErrorKind;
  sentence: string;
  code?: ErrorCode | undefined;
  status?: number | undefined;
  detail?: string | undefined;
  cause?: unknown;
}
