import type { RuntimeBudgetReport } from 'sky-filme-studio-be/contracts';
import type { TranslationKey } from '@/lib/i18n/catalogue/en';

export interface BudgetFigure {
  labelKey: TranslationKey;
  read: (report: RuntimeBudgetReport) => number;
}
