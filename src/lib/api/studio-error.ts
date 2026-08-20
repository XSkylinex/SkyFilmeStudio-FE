import type { ErrorCode } from 'sky-filme-studio-be/contracts';
import type {
  StudioErrorInput,
  StudioErrorKind,
} from '@/lib/api/api.interface';

export class StudioError extends Error {
  readonly kind: StudioErrorKind;
  readonly code: ErrorCode | undefined;
  readonly status: number | undefined;
  readonly detail: string | undefined;

  constructor(input: StudioErrorInput) {
    super(input.sentence, { cause: input.cause });
    this.name = 'StudioError';
    this.kind = input.kind;
    this.code = input.code;
    this.status = input.status;
    this.detail = input.detail;
  }
}
