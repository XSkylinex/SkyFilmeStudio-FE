import type {
  ApprovalState,
  CanonicalReferenceRole,
  NarrativeRole,
  SourceMode,
  SubjectType,
} from 'sky-filme-studio-be/contracts';
import type { TranslationKey } from '@/lib/i18n/catalogue/en';

export const SUBJECT_TYPE_LABEL_KEY = {
  HUMAN: 'subjects.type.HUMAN',
  ANIMAL: 'subjects.type.ANIMAL',
  OBJECT: 'subjects.type.OBJECT',
  FIGURE: 'subjects.type.FIGURE',
  CREATURE: 'subjects.type.CREATURE',
  VEHICLE: 'subjects.type.VEHICLE',
  PRODUCT: 'subjects.type.PRODUCT',
  ROBOT: 'subjects.type.ROBOT',
  ABSTRACT: 'subjects.type.ABSTRACT',
  OTHER: 'subjects.type.OTHER',
} satisfies Record<SubjectType, TranslationKey>;

export const SUBJECT_SOURCE_MODE_LABEL_KEY = {
  CAPTURED: 'subjects.sourceMode.CAPTURED',
  IMPORTED: 'subjects.sourceMode.IMPORTED',
  GENERATED: 'subjects.sourceMode.GENERATED',
  HYBRID: 'subjects.sourceMode.HYBRID',
} satisfies Record<SourceMode, TranslationKey>;

export const SUBJECT_NARRATIVE_ROLE_LABEL_KEY = {
  CHARACTER: 'subjects.narrativeRole.CHARACTER',
  BACKGROUND_ENTITY: 'subjects.narrativeRole.BACKGROUND_ENTITY',
  PRODUCT: 'subjects.narrativeRole.PRODUCT',
  OBJECT: 'subjects.narrativeRole.OBJECT',
  OTHER: 'subjects.narrativeRole.OTHER',
} satisfies Record<NarrativeRole, TranslationKey>;

export const APPROVAL_STATE_LABEL_KEY = {
  PENDING: 'subjects.approval.PENDING',
  APPROVED: 'subjects.approval.APPROVED',
  REJECTED: 'subjects.approval.REJECTED',
} satisfies Record<ApprovalState, TranslationKey>;

export const CANONICAL_ROLE_LABEL_KEY = {
  SOURCE: 'subjects.role.SOURCE',
  PRIMARY: 'subjects.role.PRIMARY',
  FRONT_VIEW: 'subjects.role.FRONT_VIEW',
  REAR_VIEW: 'subjects.role.REAR_VIEW',
  LEFT_VIEW: 'subjects.role.LEFT_VIEW',
  RIGHT_VIEW: 'subjects.role.RIGHT_VIEW',
  THREE_QUARTER: 'subjects.role.THREE_QUARTER',
  DETAIL: 'subjects.role.DETAIL',
  EXPRESSION: 'subjects.role.EXPRESSION',
  POSE: 'subjects.role.POSE',
  TEXTURE: 'subjects.role.TEXTURE',
  MASK: 'subjects.role.MASK',
  SCALE: 'subjects.role.SCALE',
} satisfies Record<CanonicalReferenceRole, TranslationKey>;

export const SUBJECT_LIST_SKELETON_COUNT = 4;
