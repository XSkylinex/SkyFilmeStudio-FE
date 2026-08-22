import type { ProjectId, VoiceProfile } from 'sky-filme-studio-be/contracts';

export interface VoiceCardProps {
  readonly projectId: ProjectId;
  readonly voice: VoiceProfile;
}
