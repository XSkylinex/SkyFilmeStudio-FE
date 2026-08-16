import type { StatusTone } from '@/lib/interfaces/status-tone';

export interface ToastProps {
  tone: StatusTone;
  title: string;
  description?: string;
  onDismiss?: () => void;
}
