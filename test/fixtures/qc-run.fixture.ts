import { qcRunSchema } from 'sky-filme-studio-be/contracts';
import type { QcRun } from 'sky-filme-studio-be/contracts';

export const buildQcRun = (overrides: Partial<QcRun> = {}): QcRun =>
  qcRunSchema.parse({
    id: 'aaaaaaaa-1111-4aaa-8aaa-aaaaaaaaaaaa',
    kind: 'TECHNICAL',
    outcome: 'PASS',
    shotId: '55555555-5555-4555-8555-555555555555',
    checks: [
      { check: 'FILE_EXISTS', outcome: 'PASS' },
      {
        check: 'DURATION_WITHIN_TOLERANCE',
        outcome: 'PASS',
        observed: '6.02 s',
        expected: '6 s ± 0.25 s',
      },
    ],
    findings: [],
    createdAt: '2026-09-01T10:00:00.000Z',
    ...overrides,
  });
