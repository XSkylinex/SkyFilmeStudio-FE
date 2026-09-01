import type { ProjectId, Prop } from 'sky-filme-studio-be/contracts';

export interface EditPropFormProps {
  readonly projectId: ProjectId;
  readonly prop: Prop;
  readonly onClose: () => void;
}
