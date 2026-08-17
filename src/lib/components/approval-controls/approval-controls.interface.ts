export interface RegenerationModeOption {
  id: string;
  label: string;
  description: string;
}

export interface ApprovalControlsProps {
  onApprove: () => void;
  onReject: () => void;
  regenerationModes: RegenerationModeOption[];
  onRegenerate: (modeId: string) => void;
  pending: boolean;
  decided: boolean;
}
