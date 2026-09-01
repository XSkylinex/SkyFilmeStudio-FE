import type {
  ProjectId,
  StyleProfile,
  StyleProfileId,
} from 'sky-filme-studio-be/contracts';

export interface EditStyleProfileFormProps {
  readonly projectId: ProjectId;
  readonly lineageId: StyleProfileId;
  readonly styleProfile: StyleProfile;
  readonly onClose: () => void;
}
