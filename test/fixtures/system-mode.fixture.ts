import { systemModeSchema } from 'sky-filme-studio-be/contracts';
import type { SystemMode } from 'sky-filme-studio-be/contracts';

export const buildSystemMode = (
  overrides: Partial<SystemMode> = {},
): SystemMode =>
  systemModeSchema.parse({
    localOnly: true,
    strictOffline: true,
    allowLanWorkers: false,
    claudeCodeOperatorEnabled: false,
    lmStudioMcpHostEnabled: false,
    operatingMode: 'STRICT_OFFLINE',
    ...overrides,
  });
