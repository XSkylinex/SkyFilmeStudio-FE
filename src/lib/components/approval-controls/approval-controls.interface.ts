export interface RegenerationModeOption {
  id: string;
  label: string;
  description: string;
}

export interface ApprovalControlsProps {
  contextLabel: string;
  onApprove: () => void;
  onReject?: (() => void) | undefined;
  regenerationModes: RegenerationModeOption[];
  onRegenerate: (modeId: string) => void;
  pending: boolean;
  decided: boolean;
}
