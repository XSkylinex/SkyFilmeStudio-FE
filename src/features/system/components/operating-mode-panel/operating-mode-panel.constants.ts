import { STATUS_TONE } from '@/lib/status-tone.constants';
import type { OperatingModeFlag } from './operating-mode-panel.interface';

export const OPERATING_MODE_FLAGS: readonly OperatingModeFlag[] = [
  {
    labelKey: 'system.mode.localOnly',
    read: (systemMode) => systemMode.localOnly,
    onTone: STATUS_TONE.READY,
    offTone: STATUS_TONE.DANGER,
  },
  {
    labelKey: 'system.mode.strictOffline',
    read: (systemMode) => systemMode.strictOffline,
    onTone: STATUS_TONE.SUCCESS,
    offTone: STATUS_TONE.NEUTRAL,
  },
  {
    labelKey: 'system.mode.allowLanWorkers',
    read: (systemMode) => systemMode.allowLanWorkers,
    onTone: STATUS_TONE.ATTENTION,
    offTone: STATUS_TONE.NEUTRAL,
  },
  {
    labelKey: 'system.mode.claudeCodeOperator',
    read: (systemMode) => systemMode.claudeCodeOperatorEnabled,
    onTone: STATUS_TONE.WARNING,
    offTone: STATUS_TONE.NEUTRAL,
  },
  {
    labelKey: 'system.mode.lmStudioMcpHost',
    read: (systemMode) => systemMode.lmStudioMcpHostEnabled,
    onTone: STATUS_TONE.NEUTRAL,
    offTone: STATUS_TONE.NEUTRAL,
    noteKey: 'system.mode.lmStudioMcpHost.description',
  },
];
