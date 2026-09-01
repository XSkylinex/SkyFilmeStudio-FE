import type { ProjectId, VoiceProfile } from 'sky-filme-studio-be/contracts';

export interface EditVoiceProfileFormProps {
  readonly projectId: ProjectId;
  readonly voiceProfile: VoiceProfile;
  readonly onClose: () => void;
}
