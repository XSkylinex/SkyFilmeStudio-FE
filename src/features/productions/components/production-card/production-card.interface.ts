import type { Production, ProjectId } from 'sky-filme-studio-be/contracts';

export interface ProductionCardProps {
  projectId: ProjectId;
  production: Production;
}
