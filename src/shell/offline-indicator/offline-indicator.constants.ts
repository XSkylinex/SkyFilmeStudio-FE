import type { StatusTone } from '@/lib/interfaces/status-tone';
import { STATUS_TONE } from '@/lib/status-tone.constants';
import type {
  OfflineIndicatorMode,
  OfflineMode,
} from './offline-indicator.interface';

export const OFFLINE_MODE_FIXTURE: OfflineMode = {
  localOnly: true,
  strictOffline: false,
  allowLanWorkers: false,
  claudeCodeOperatorEnabled: false,
};

export const OFFLINE_INDICATOR_MODE_TONE = {
  remote: STATUS_TONE.DANGER,
  'operator-enabled': STATUS_TONE.WARNING,
  'lan-workers': STATUS_TONE.ATTENTION,
  'strict-offline': STATUS_TONE.SUCCESS,
  local: STATUS_TONE.READY,
} satisfies Record<OfflineIndicatorMode, StatusTone>;

export const OFFLINE_INDICATOR_MODE_LABEL = {
  remote: 'Not local',
  'operator-enabled': 'Operator enabled',
  'lan-workers': 'LAN workers allowed',
  'strict-offline': 'Strict offline',
  local: 'Local only',
} satisfies Record<OfflineIndicatorMode, string>;

export const OFFLINE_INDICATOR_MODE_DESCRIPTION = {
  remote:
    'This build is not running local-only. Project data may leave this machine — check the orchestrator configuration.',
  'operator-enabled':
    "The Claude Code operator is enabled. Project context can leave this machine through Claude's own service while it is on.",
  'lan-workers':
    'Render workers on the local network are allowed to take jobs for this project. Project data can cross to those machines.',
  'strict-offline':
    'Strict offline mode is on. Nothing about this project can leave this machine.',
  local:
    'This project runs local-only. No render or context leaves this machine.',
} satisfies Record<OfflineIndicatorMode, string>;
