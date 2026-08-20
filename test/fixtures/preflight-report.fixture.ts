import { preflightReportSchema } from 'sky-filme-studio-be/contracts';
import type { PreflightReport } from 'sky-filme-studio-be/contracts';

export const buildPreflightReport = (
  overrides: Partial<PreflightReport> = {},
): PreflightReport =>
  preflightReportSchema.parse({
    passed: true,
    checkedAt: '2026-08-15T00:00:00.000Z',
    diskGate: {
      freeBytes: 500_000_000_000,
      missingModelBytes: 0,
      workingSpaceBytes: 10_000_000_000,
      safetyHeadroomBytes: 5_000_000_000,
      requiredBytes: 15_000_000_000,
      shortfallBytes: 0,
      passed: true,
    },
    checks: [
      {
        id: 'DATABASE_HEALTHY',
        status: 'PASS',
        detail: 'The database answered a health check in under a second.',
      },
    ],
    ...overrides,
  });
