import type { DiskGate } from 'sky-filme-studio-be/contracts';
import type { TranslationKey } from '@/lib/i18n/catalogue/en';

export interface DiskGateFigure {
  readonly labelKey: TranslationKey;
  readonly read: (diskGate: DiskGate) => number;
}
