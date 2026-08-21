import type { DiskGateFigure } from './disk-gate-panel.interface';

export const DISK_GATE_FIGURES: readonly DiskGateFigure[] = [
  { labelKey: 'system.disk.free', read: (gate) => gate.freeBytes },
  {
    labelKey: 'system.disk.missingModels',
    read: (gate) => gate.missingModelBytes,
  },
  {
    labelKey: 'system.disk.workingSpace',
    read: (gate) => gate.workingSpaceBytes,
  },
  {
    labelKey: 'system.disk.safetyHeadroom',
    read: (gate) => gate.safetyHeadroomBytes,
  },
  { labelKey: 'system.disk.required', read: (gate) => gate.requiredBytes },
];
