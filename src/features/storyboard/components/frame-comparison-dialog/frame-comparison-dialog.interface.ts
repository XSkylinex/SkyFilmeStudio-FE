import type { StoryboardFrameId } from 'sky-filme-studio-be/contracts';

export interface FrameComparisonDialogProps {
  readonly frameId: StoryboardFrameId | null;
  readonly onClose: () => void;
}

export interface FrameComparisonBodyProps {
  readonly frameId: StoryboardFrameId;
}
