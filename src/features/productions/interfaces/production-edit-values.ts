import type {
  NarrativeMode,
  ProductionKind,
} from 'sky-filme-studio-be/contracts';

export interface ProductionEditValues {
  readonly title: string;
  readonly productionKind: ProductionKind;
  readonly narrativeMode: NarrativeMode;
  readonly minutes: string;
  readonly seconds: string;
  readonly tolerance: string;
  readonly styleProfileId: string;
  readonly productionProfileId: string;
  readonly sequenceNumber: string;
  readonly logline: string;
  readonly brief: string;
}

export type ProductionClearableField =
  'logline' | 'brief' | 'tolerance' | 'productionProfileId' | 'sequenceNumber';
