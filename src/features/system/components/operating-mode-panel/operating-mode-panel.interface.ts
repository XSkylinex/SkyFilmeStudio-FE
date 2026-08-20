import type { SystemMode } from 'sky-filme-studio-be/contracts';
import type { StatusTone } from '@/lib/interfaces/status-tone';
import type { TranslationKey } from '@/lib/i18n/catalogue/en';

export interface OperatingModeFlag {
  readonly labelKey: TranslationKey;
  readonly read: (systemMode: SystemMode) => boolean;
  readonly onTone: StatusTone;
  readonly offTone: StatusTone;
  readonly noteKey?: TranslationKey | undefined;
}
