import type { ProjectId, StyleProfileId } from 'sky-filme-studio-be/contracts';

export interface CreateStyleProfileFormNextVersionOf {
  readonly lineageId: StyleProfileId;
  readonly name: string;
  readonly description: string;
  readonly mode: string;
  readonly realismLevel: string | undefined;
  readonly paletteRules: readonly string[];
  readonly lightingRules: readonly string[];
  readonly cameraRules: readonly string[];
  readonly textureRules: readonly string[];
  readonly motionRules: readonly string[];
  readonly prohibitedStyleDrift: readonly string[];
}

export interface CreateStyleProfileFormProps {
  readonly projectId: ProjectId;
  readonly onClose: () => void;
  readonly nextVersionOf?: CreateStyleProfileFormNextVersionOf | undefined;
}
